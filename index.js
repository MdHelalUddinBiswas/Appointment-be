const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 8000;

// Configure CORS to allow requests from frontend (development and production)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://meet-ning-appointment-fe.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
  })
);
app.use(express.json());

// PostgreSQL connection setup
let poolConfig;

if (process.env.DATABASE_URL) {
  // For production (Neon, Supabase, etc)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
  console.log("Using production database connection");
}
const pool = new Pool(poolConfig);

// Test PostgreSQL connection - wrap in try/catch to prevent crashing
try {
  pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error("Database connection error:", err.stack);
    } else {
      console.log("Database connected at:", res.rows[0].now);
    }
  });
} catch (error) {
  console.error("Database connection test failed:", error.message);
}

// Initialize database tables
async function initDatabase() {
  try {
    // Create users table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        timezone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if the verification columns exist, and add them if they don't
    try {
      // Check if is_verified column exists
      const verifiedColumnCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'is_verified'
      `);

      // If is_verified column doesn't exist, add it
      if (verifiedColumnCheck.rows.length === 0) {
        console.log("Adding is_verified column to users table...");
        await pool.query(
          `ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE`
        );
      }

      // Check if verification_otp column exists
      const otpColumnCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'verification_otp'
      `);

      // If verification_otp column doesn't exist, add it
      if (otpColumnCheck.rows.length === 0) {
        console.log("Adding verification_otp column to users table...");
        await pool.query(
          `ALTER TABLE users ADD COLUMN verification_otp VARCHAR(6)`
        );
      }

      // Check if otp_expiry column exists
      const expiryColumnCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'otp_expiry'
      `);

      // If otp_expiry column doesn't exist, add it
      if (expiryColumnCheck.rows.length === 0) {
        console.log("Adding otp_expiry column to users table...");
        await pool.query(`ALTER TABLE users ADD COLUMN otp_expiry TIMESTAMP`);
      }
    } catch (columnError) {
      console.error(
        "Error checking or adding verification columns:",
        columnError
      );
    }

    // Create appointments table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(200) NOT NULL,
        description TEXT,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        location TEXT,
        participants JSONB,
        status VARCHAR(20) DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create calendars table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS calendars (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        provider VARCHAR(50) NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        token_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

// Auth Middleware
const authenticateToken = (req, res, next) => {
  // Get token from header - support multiple formats
  let token = req.header("x-auth-token");

  // Also check for Authorization header with Bearer token
  const authHeader = req.header("Authorization");
  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log("Using bearer token:", token.substring(0, 10) + "...");
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Test route for checking deployment status
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "MeetNing Appointment AI API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the MeetNing Appointment AI API" });
});

// Home route
app.get("/", (req, res) => {
  res.send("MeetNing Appointment AI API is running");
});

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email using Nodemailer
async function sendOTPEmail(email, otp, name) {
  try {
    // Log the OTP for debugging purposes
    console.log("\n\n==================================================");
    console.log(`🔐 OTP CODE FOR ${email}: ${otp}`);
    console.log("==================================================\n\n");

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn(
        "EMAIL_USER or EMAIL_PASSWORD not configured. OTP email not sent."
      );
      return true; // Continue the flow even if email is not sent
    }

    console.log("Email credentials found, setting up Nodemailer...");

    try {
      // Import Nodemailer
      const nodemailer = require("nodemailer");

      // Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          // Do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });

      console.log(
        `Setting up transporter with email: ${process.env.EMAIL_USER}`
      );

      // Verify connection configuration
      try {
        await transporter.verify();
        console.log("✅ SMTP connection verified successfully");
      } catch (verifyError) {
        console.error("❌ SMTP connection verification failed:", verifyError);
        // Continue anyway to see the specific sending error
      }

      // Create email HTML template
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Verify Your Email</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
              }
              .container {
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #e0e0e0;
              }
              .content {
                padding: 20px 0;
              }
              .otp-code {
                font-size: 32px;
                font-weight: bold;
                text-align: center;
                letter-spacing: 5px;
                margin: 30px 0;
                color: #4a6cf7;
              }
              .footer {
                font-size: 12px;
                color: #888;
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Verify Your Email Address</h2>
              </div>
              <div class="content">
                <p>Hello ${name || "there"},</p>
                <p>Thank you for signing up for MeetNing. To complete your registration, please enter the following verification code in the app:</p>
                <div class="otp-code">${otp}</div>
                <p>This code will expire in 15 minutes.</p>
                <p>If you didn't request this code, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} MeetNing. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Add plain text version for better deliverability
      const textContent = `
        Verify Your Email Address
        
        Hello ${name || "there"},
        
        Thank you for signing up for MeetNing. To complete your registration, please enter the following verification code:
        
        ${otp}
        
        This code will expire in 15 minutes.
        
        If you didn't request this code, you can safely ignore this email.
        
        © ${new Date().getFullYear()} MeetNing. All rights reserved.
      `;

      console.log("Preparing to send email to:", email);

      // Always send to the user's actual email address
      const recipientEmail = email; // Send directly to the sign-up email

      console.log(`Sending OTP email to: ${recipientEmail}`);

      // Send email using Nodemailer
      console.log("Sending email via Nodemailer...");
      const mailOptions = {
        from: `"MeetNing" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: "Verify Your Email - MeetNing",
        html: htmlContent,
        text: textContent,
      };

      // We're always sending to the actual email now, so no redirection note needed

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully:", info.messageId);

      if (info.accepted.length === 0) {
        throw new Error("Email was not accepted by any recipients");
      }
    } catch (emailError) {
      console.error("Error in Nodemailer email sending:", emailError);
      // Log detailed error information
      if (emailError.code) console.error(`Error code: ${emailError.code}`);
      if (emailError.command)
        console.error(`Failed command: ${emailError.command}`);
      if (emailError.response)
        console.error(`Server response: ${emailError.response}`);
      // Continue the flow even if email sending fails
    }

    return true; // Continue the flow even if email fails
  } catch (error) {
    console.error("Error sending OTP email:", error);
    // Return true anyway to not block the signup flow
    return true;
  }
}

// Store pending users in memory temporarily
const pendingUsers = new Map();

app.post("/api/auth/signup", async (req, res) => {
  console.log("Signup request:", req.body);
  try {
    const { name, email, password, timezone } = req.body;

    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP for email verification
    const otp = generateOTP();
    console.log("\n\nGenerated OTP:", otp, "for email:", email, "\n\n");

    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP valid for 15 minutes

    // Store user data temporarily until OTP verification
    pendingUsers.set(email, {
      name,
      email,
      password: hashedPassword,
      timezone,
      otp,
      otpExpiry,
      createdAt: new Date(),
    });

    console.log(`Stored pending user ${email} with OTP ${otp}`);

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      message:
        "Verification code sent to your email. Please verify to complete signup.",
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login user
app.post("/api/auth/login", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    // Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // We're no longer checking verification status for login
    console.log(`User ${email} logged in successfully`);

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        timezone: user.timezone,
        isVerified: user.is_verified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Verify OTP endpoint
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Check if this is a pending user from memory
    const pendingUser = pendingUsers.get(email);

    if (pendingUser) {
      console.log(`Found pending user for email: ${email}`);

      // Check if OTP is expired
      const now = new Date();
      if (pendingUser.otpExpiry < now) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      // Check if OTP matches
      if (pendingUser.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // OTP is valid, create the user in the database
      console.log(`OTP verified for ${email}, creating user in database`);

      try {
        // Insert the user into the database with verified status
        const result = await pool.query(
          `INSERT INTO users (name, email, password, timezone, is_verified) 
           VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, timezone`,
          [
            pendingUser.name,
            pendingUser.email,
            pendingUser.password,
            pendingUser.timezone,
            true,
          ]
        );

        // Remove from pending users
        pendingUsers.delete(email);

        console.log(
          `User ${email} successfully created in database with verified status`
        );

        res.status(200).json({
          message: "Email verified successfully. You can now log in.",
          user: {
            email: pendingUser.email,
            name: pendingUser.name,
          },
        });
      } catch (dbError) {
        console.error("Database error creating verified user:", dbError);
        return res.status(500).json({ message: "Error creating user account" });
      }
    } else {
      // Check if user exists in database (for users who were created before this change)
      const userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = userResult.rows[0];

      // Check if OTP is expired
      const now = new Date();
      if (user.otp_expiry && new Date(user.otp_expiry) < now) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      // Check if OTP matches
      if (user.verification_otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Update user verification status
      await pool.query(
        "UPDATE users SET is_verified = true, verification_otp = NULL, otp_expiry = NULL WHERE id = $1",
        [user.id]
      );

      res.status(200).json({ message: "Email verified successfully" });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
});

// Resend OTP endpoint
app.post("/api/auth/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if this is a pending user from memory
    const pendingUser = pendingUsers.get(email);

    if (pendingUser) {
      console.log(`Resending OTP for pending user: ${email}`);

      // Generate new OTP
      const otp = generateOTP();
      console.log(`New OTP for ${email}: ${otp}`);

      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP valid for 15 minutes

      // Update pending user with new OTP
      pendingUser.otp = otp;
      pendingUser.otpExpiry = otpExpiry;

      // Send OTP email
      await sendOTPEmail(email, otp, pendingUser.name);

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      // Get user by email from database
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result.rows[0];

      // Generate new OTP
      const otp = generateOTP();
      console.log(`New OTP for ${email}: ${otp}`);

      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP valid for 15 minutes

      // Update user with new OTP
      await pool.query(
        "UPDATE users SET verification_otp = $1, otp_expiry = $2 WHERE id = $3",
        [otp, otpExpiry, user.id]
      );

      // Send OTP email
      await sendOTPEmail(email, otp, user.name);

      res.status(200).json({ message: "OTP sent successfully" });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error during OTP resend" });
  }
});

// Get user profile
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, timezone FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all appointments for a user
app.get("/api/appointments", authenticateToken, async (req, res) => {
  try {
    const status = req.query.status; // Filter by status if provided

    let query = "SELECT * FROM appointments WHERE user_id = $1";
    const queryParams = [req.user.id];

    if (status) {
      query += " AND status = $2";
      queryParams.push(status);
    }

    query += " ORDER BY start_time ASC";

    const result = await pool.query(query, queryParams);

    res.json(result.rows);
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get appointment by ID
app.get("/api/appointments/:id", authenticateToken, async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const result = await pool.query(
      "SELECT * FROM appointments WHERE id = $1 AND user_id = $2",
      [appointmentId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new appointment
app.post("/api/appointments", authenticateToken, async (req, res) => {
  try {
    // Get user ID from the authenticated token instead of request body
    const user_id = req.user.id;
    const email = req.user.email || "user@example.com";
    const name = req.user.name || "User";

    const {
      title,
      description,
      start_time,
      end_time,
      location,
      participants,
      status,
    } = req.body;

    // Validate request
    if (!title || !start_time || !end_time) {
      return res
        .status(400)
        .json({ message: "Please provide title, start_time, and end_time" });
    }

    // Process participants data
    let participantsJson = null;

    if (participants) {
      // Always ensure participants is an array of objects with email property
      let participantsArray;

      // Check if it's already an array
      if (Array.isArray(participants)) {
        // Convert any string elements to objects with email property
        participantsArray = participants.map((item) => {
          if (typeof item === "string") {
            return { email: item };
          } else if (typeof item === "object" && item.email) {
            // If it's already an object with email, only keep the email field
            return { email: item.email };
          } else {
            // Fallback for unexpected formats
            return { email: String(item) };
          }
        });
      }
      // If it's a string (comma-separated emails)
      else if (typeof participants === "string") {
        // Convert comma-separated string to array of objects with email property
        participantsArray = participants
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email.length > 0)
          .map((email) => ({ email }));
      } else {
        // Handle case where it might be a single object or something else
        participantsArray = [
          {
            email: participants.toString(),
          },
        ];
      }

      participantsJson = JSON.stringify(participantsArray);
    }

    console.log("Processed participants:", participantsJson);

    // Check if user exists in the database
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [
      user_id,
    ]);

    // If user doesn't exist, create a default user record
    if (userCheck.rows.length === 0) {
      console.log(
        `User ${user_id} doesn't exist in database. Creating default user record.`
      );

      // Generate a secure hashed password for the default user
      const defaultPassword = await bcrypt.hash("defaultPassword123", 10);

      // Insert a basic user record to satisfy the foreign key constraint with all required fields
      await pool.query(
        "INSERT INTO users (id, email, name, password, created_at) VALUES ($1, $2, $3, $4, NOW())",
        [user_id, email, name, defaultPassword]
      );
    }

    const result = await pool.query(
      `INSERT INTO appointments
        (user_id, title, description, start_time, end_time, location, participants, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        user_id, // Using authenticated user_id instead of request body id
        title,
        description,
        start_time,
        end_time,
        location,
        participantsJson,
        status || "upcoming",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create appointment error:", error);
    // Provide more helpful error message based on error type
    if (error.code === "23503") {
      // Foreign key violation
      return res.status(400).json({
        message:
          "User doesn't exist in the database. Please try again or contact support.",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
});
// Update an existing appointment
app.put("/api/appointments/:id", authenticateToken, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const {
      title,
      description,
      start_time,
      end_time,
      location,
      participants,
      status,
    } = req.body;

    // Check if appointment exists and belongs to user
    const checkResult = await pool.query(
      "SELECT * FROM appointments WHERE id = $1 AND user_id = $2",
      [appointmentId, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Appointment not found or unauthorized" });
    }

    // Process participants data to ensure it's an array of objects
    let participantsJson = null;

    if (participants) {
      // Always ensure participants is an array of objects with email property
      let participantsArray;

      // Check if it's already an array
      if (Array.isArray(participants)) {
        // Convert any string elements to objects with email property
        participantsArray = participants.map((item) => {
          if (typeof item === "string") {
            return { email: item };
          } else if (typeof item === "object" && item.email) {
            // If it's already an object with email, only keep the email field
            return { email: item.email };
          } else {
            // Fallback for unexpected formats
            return { email: String(item) };
          }
        });
      }
      // If it's a string (comma-separated emails)
      else if (typeof participants === "string") {
        // Convert comma-separated string to array of objects with email property
        participantsArray = participants
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email.length > 0)
          .map((email) => ({ email }));
      } else {
        // Handle case where it might be a single object or something else
        participantsArray = [
          {
            email: participants.toString(),
          },
        ];
      }

      participantsJson = JSON.stringify(participantsArray);
      console.log("Processed participants for update:", participantsJson);
    }

    // Build update query dynamically based on provided fields
    let updateFields = [];
    let queryParams = [appointmentId, req.user.id];
    let paramCounter = 3; // Starting from 3 since $1 and $2 are already used

    if (title) {
      updateFields.push(`title = $${paramCounter++}`);
      queryParams.push(title);
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramCounter++}`);
      queryParams.push(description);
    }

    if (start_time) {
      updateFields.push(`start_time = $${paramCounter++}`);
      queryParams.push(start_time);
    }

    if (end_time) {
      updateFields.push(`end_time = $${paramCounter++}`);
      queryParams.push(end_time);
    }

    if (location !== undefined) {
      updateFields.push(`location = $${paramCounter++}`);
      queryParams.push(location);
    }

    if (participants !== undefined) {
      updateFields.push(`participants = $${paramCounter++}`);
      queryParams.push(participantsJson);
    }

    if (status) {
      updateFields.push(`status = $${paramCounter++}`);
      queryParams.push(status);
    }

    // If no fields to update, return the original appointment
    if (updateFields.length === 0) {
      return res.json(checkResult.rows[0]);
    }

    // Perform update
    const query = `
      UPDATE appointments
      SET ${updateFields.join(", ")}
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, queryParams);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an appointment
app.delete("/api/appointments/:id", authenticateToken, async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Check if appointment exists and belongs to user
    const checkResult = await pool.query(
      "SELECT * FROM appointments WHERE id = $1 AND user_id = $2",
      [appointmentId, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Appointment not found or unauthorized" });
    }

    // Delete appointment
    await pool.query(
      "DELETE FROM appointments WHERE id = $1 AND user_id = $2",
      [appointmentId, req.user.id]
    );

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
app.put("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const { name, timezone } = req.body;

    // Build update query based on provided fields
    let updateFields = [];
    let queryParams = [req.user.id];
    let paramCounter = 2; // Starting from 2 since $1 is already used

    if (name) {
      updateFields.push(`name = $${paramCounter++}`);
      queryParams.push(name);
    }

    if (timezone) {
      updateFields.push(`timezone = $${paramCounter++}`);
      queryParams.push(timezone);
    }

    // If no fields to update, return error
    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Perform update
    const query = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE id = $1
      RETURNING id, name, email, timezone
    `;

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Test endpoint to resend OTP email
app.get("/api/test/send-otp", async (req, res) => {
  try {
    const email = req.query.email || "mdhelal6775@gmail.com";
    const name = req.query.name || "Helal";
    const otp = generateOTP();

    console.log(`Test endpoint: Sending OTP ${otp} to ${email}`);

    // Store the OTP in memory for testing
    if (pendingUsers.has(email)) {
      const user = pendingUsers.get(email);
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    } else {
      pendingUsers.set(email, {
        email,
        name,
        otp,
        otpExpiry: new Date(Date.now() + 15 * 60 * 1000),
        createdAt: new Date(),
      });
    }

    // Send the OTP email
    await sendOTPEmail(email, otp, name);

    res.json({
      success: true,
      message: `OTP sent to ${email}. Check console for OTP code.`,
      otp: otp, // Showing OTP in response for testing purposes
    });
  } catch (error) {
    console.error("Test OTP sending error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send test OTP email" });
  }
});

// Get user's calendars
app.get("/api/calendars", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, provider, description FROM calendars WHERE user_id = $1",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get calendars error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a Google Meet link
// Import routes
const integrationRoutes = require("./routes/integration.routes");
const meetingRoutes = require("./routes/meeting.routes");
const conflictCheckerRoutes = require("./routes/conflict-checker");

// The appointments API routes are defined directly in this file (not in a separate module)
app.use("/api/integration", integrationRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/conflicts", conflictCheckerRoutes); // Register conflict checker routes

// TODO: Implement these services before uncommenting:
// - services/integration.service.js
// - services/meeting.service.js
// - config/oauth.config.js
// - models/integration.models.js

app.listen(port, async () => {
  console.log(`MeetNing Appointment AI API running on port ${port}`);
  await initDatabase();
});
