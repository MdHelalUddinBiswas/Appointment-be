const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ChatOpenAI } = require("@langchain/openai");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { PGVectorStore } = require("@langchain/community/vectorstores/pgvector");
const { PromptTemplate } = require("@langchain/core/prompts");
const {
  RunnableSequence,
  RunnablePassthrough,
} = require("@langchain/core/runnables");

const { StringOutputParser } = require("@langchain/core/output_parsers");
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

/**
 * Helper function to safely get environment variables
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not found
 * @returns {string} Environment variable value or default
 */
function getEnvVariable(key, defaultValue = "") {
  const value = process.env[key];
  if (!value && defaultValue === "") {
    console.warn(`Warning: Environment variable ${key} is not set`);
  }
  return value || defaultValue;
}

// Comment out the OpenAI integration code until we have all required dependencies

const OPENAI_API_KEY = getEnvVariable("OPENAI_API_KEY");

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: OPENAI_API_KEY,
  modelName: "text-embedding-ada-002",
  batchSize: 512,
  stripNewLines: true,
});

// Helper function to create vector store
async function getVectorStore(config, embeddings) {
  return await PGVectorStore.initialize(embeddings, {
    postgresConnectionOptions: {
      connectionString: config.connectionString,
    },
    tableName: config.tableName || "embeddings",
    columns: {
      idColumnName: "id",
      vectorColumnName: "embedding",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
  });
}

// Initialize vector store - using async IIFE to allow await
let pgvectorStore;
(async () => {
  try {
    pgvectorStore = await getVectorStore(
      {
        connectionString:
          process.env.DATABASE_URL ||
          "postgresql://postgres:postgres@localhost:5432/meetning",
        tableName: "embeddings",
      },
      embeddings
    );
    console.log("Vector store initialized successfully");
  } catch (error) {
    console.error("Error initializing vector store:", error);
    // Create a mock vector store for fallback
    pgvectorStore = {
      similaritySearch: async () => [],
      addDocuments: async () =>
        console.log("Mock vector store: addDocuments called"),
    };
  }
})();

const template = `You are a helpful assistant for the MeetNing Appointment AI system. Using ONLY the following context, answer the question about appointments, schedules, and meetings. Format your response in a clear and organized way. Include all relevant details about appointments that match the query.

Context:
{context}

Question: {question}

Answer: `;

const prompt = PromptTemplate.fromTemplate(template);
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  openAIApiKey: OPENAI_API_KEY,
  temperature: 0.7,
});
const outputParser = new StringOutputParser();

const chain = RunnableSequence.from([
  {
    context: async (input) => {
      const docs = await pgvectorStore.similaritySearch(input, 4);
      console.log("Search input:", input);
      console.log("Found documents:", docs.length);

      return docs
        .map(
          (doc) =>
            `[Appointment: ${doc.metadata.title || "Untitled"}] ${
              doc.pageContent
            } - Start: ${doc.metadata.start_time || "Unknown"} - End: ${
              doc.metadata.end_time || "Unknown"
            } - Status: ${doc.metadata.status || "Unknown"} - Participants: ${
              doc.metadata.participants_count || "0"
            }`
        )
        .join("\n");
    },
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  outputParser,
]);

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

// Endpoint to add appointment data to vector store

app.post("/api/embeddings/add-appointments", authenticateToken, async (req, res) => {
  try {
    // Check if vector store is initialized
    if (!pgvectorStore) {
      return res.status(503).json({
        error:
          "AI service is still initializing. Please try again in a moment.",
      });
    }

    const appointments = req.body;
    
    if (!Array.isArray(appointments) && !appointments.userId) {
      return res.status(400).json({ error: "Invalid request format. Expected an array of appointments or an object with userId." });
    }

    // If a single appointment is sent (not in an array)
    const appointmentsArray = Array.isArray(appointments) ? appointments : [appointments];
    
    // Process and embed appointment data
    const documents = appointmentsArray.map(appointment => {
      // Format participants to objects with email property and calculate count
      let formattedParticipants = [];
      let participantsCount = 0;
      
      if (appointment.participants) {
        // Handle different possible formats of participants data
        if (Array.isArray(appointment.participants)) {
          formattedParticipants = appointment.participants.map(participant => {
            // If participant is already an object with email property, use it as is
            if (typeof participant === 'object' && participant.email) {
              return participant;
            }
            // If participant is a string (email), convert to object format
            if (typeof participant === 'string') {
              return { email: participant };
            }
            // Default case
            return { email: String(participant) };
          });
        } else if (typeof appointment.participants === 'string') {
          // If participants is a string (possibly a comma-separated list)
          formattedParticipants = appointment.participants
            .split(',')
            .map(email => ({ email: email.trim() }))
            .filter(p => p.email.length > 0);
        }
        participantsCount = formattedParticipants.length;
      }
      
      // Format dates for content
      const formattedStartTime = new Date(appointment.start_time).toLocaleString();
      const formattedEndTime = new Date(appointment.end_time).toLocaleString();
      
      // Create document content
      const content =
        `Appointment: ${appointment.title}. ` +
        `Description: ${appointment.description || "No description"}. ` +
        `This appointment is scheduled for ${formattedStartTime} to ${formattedEndTime}. ` +
        `Location: ${appointment.location || "No location specified"}. ` +
        `Status: ${appointment.status || "scheduled"}. ` +
        `This appointment has ${participantsCount} participants.`;
      
      // Handle fields with different naming conventions (camelCase vs snake_case)
      const userId = appointment.user_id || appointment.userId;
      const location = appointment.location || "";
      
      console.log("Processing appointment with userId:", userId);
      console.log("Appointment location:", location);
      
      // Return document object
      return {
        pageContent: content,
        metadata: {
          id: appointment.id,
          title: appointment.title,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          status: appointment.status || "scheduled",
          participants_count: participantsCount,
          participants: formattedParticipants,
          user_id: userId, // Use extracted userId that handles both naming conventions
          location: location, // Ensure location is properly stored
        },
      };
    });

    // Add documents to vector store
    console.log(`Adding ${documents.length} appointments to vector store`);
    await pgvectorStore.addDocuments(documents);

    res.json({
      message: `Successfully embedded ${documents.length} appointments`,
      count: documents.length,
    });
  } catch (error) {
    console.error("Error embedding appointments:", error);
    res.status(500).json({ error: error.message });
  }
});

// get embeddings data
app.get("/api/embeddings/appointments", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // First query: Get embeddings created by the user
    const createdQuery = {
      text: "SELECT * FROM embeddings WHERE metadata->>'user_id' = $1",
      values: [userId],
    };
    const createdResult = await pool.query(createdQuery);

    // Second query: Get embeddings where user is a participant
    const participantQuery = {
      text: "SELECT * FROM embeddings WHERE metadata->>'participants' ILIKE $1",
      values: [`%${userEmail}%`],
    };
    const participantResult = await pool.query(participantQuery);

    // Combine results, avoiding duplicates
    const allEmbeddings = [...createdResult.rows];

    // Mark embeddings with role (owner or participant)
    createdResult.rows.forEach((embedding) => {
      embedding.role = "owner";
    });

    // Add participant embeddings, avoiding duplicates
    participantResult.rows.forEach((embedding) => {
      // Add role field
      embedding.role = "participant";

      // Only add if not already in the array (in case user is both owner and participant)
      if (!allEmbeddings.some((emb) => emb.id === embedding.id)) {
        allEmbeddings.push(embedding);
      }
    });

    // Process the embeddings data for frontend use
    const formattedEmbeddings = allEmbeddings.map((row) => {
      // Extract metadata for easier access
      const metadata = row.metadata || {};

      return {
        id: row.id,
        title: metadata.title || "Untitled",
        description: metadata.description || "",
        content: row.content,
        role: row.role, // Include the role (owner or participant)

        // Time information
        start_time: metadata.start_time,
        end_time: metadata.end_time,
        duration_minutes: metadata.duration_minutes,
        day_of_week: metadata.day_of_week,
        time_of_day: metadata.time_of_day,
        is_past: metadata.is_past || false,

        // Location and status
        location: metadata.location || "",
        status: metadata.status || "unknown",

        // Participants
        participants_count: metadata.participants_count || 0,

        // Additional metadata
        has_description: metadata.has_description || false,
        has_location: metadata.has_location || false,
        is_recurring: metadata.is_recurring || false,

        // Include raw metadata for reference
        raw_metadata: metadata,
      };
    });

    console.log("Fetched embeddings:", {
      created: createdResult.rows.length,
      participant: participantResult.rows.length,
      total: formattedEmbeddings.length,
    });

    res.json({
      success: true,
      count: formattedEmbeddings.length,
      data: formattedEmbeddings,
    });
  } catch (error) {
    console.error("Error fetching embeddings:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get appointment by ID from embeddings
app.get("/api/appointments/:id", authenticateToken, async (req, res) => {
    console.log("User requesting appointment:", req.user);
    try {
      const userId = req.user.id;
      const appointmentId = req.params.id;

      // Input validation
      if (!appointmentId) {
        return res.status(400).json({
          success: false,
          error: "Appointment ID is required",
        });
      }
      
      console.log("Looking for appointment with ID:", appointmentId);
      
      // Simpler query: Just get the appointment by its ID in the embeddings table
      // This is the most direct approach
      const query = {
        text: `SELECT * FROM embeddings WHERE id = $1 LIMIT 1`,
        values: [appointmentId],
      };
      
      console.log("Executing query:", query.text);
      const result = await pool.query(query);
      console.log("Query result count:", result.rows.length);
      
      if (result.rows.length === 0) {        
        return res.status(404).json({
          success: false,
          message: "Appointment not found or you don't have permission to view it",
        });
      }

      // Format the response data
      const embedding = result.rows[0];
      const metadata = embedding.metadata || {};
      
      console.log("Found embedding:", embedding.id);
      console.log("Metadata:", metadata);
      
      // Map the embedding data to the expected appointment format
      // Ensure participants are properly formatted as objects with email property
      let formattedParticipants = [];
      if (metadata.participants) {
        // Handle different possible formats of participants data
        if (Array.isArray(metadata.participants)) {
          formattedParticipants = metadata.participants.map(participant => {
            // If participant is already an object with email property, use it as is
            if (typeof participant === 'object' && participant.email) {
              return participant;
            }
            // If participant is a string (email), convert to object format
            if (typeof participant === 'string') {
              return { email: participant };
            }
            // Default case
            return { email: String(participant) };
          });
        } else if (typeof metadata.participants === 'string') {
          // If participants is a string (possibly a comma-separated list)
          formattedParticipants = metadata.participants
            .split(',')
            .map(email => ({ email: email.trim() }))
            .filter(p => p.email.length > 0);
        }
      }
      
      console.log("Original participants:", metadata.participants);
      console.log("Formatted participants:", formattedParticipants);
      
      // Determine if the current user is the owner or a participant
      let role = "viewer";
      
      // Check if user is owner
      if (metadata.user_id && metadata.user_id == userId) {
        role = "owner";
      } 
      // Check if user is a participant
      else if (formattedParticipants.some(p => p.email === req.user.email)) {
        role = "participant";
      }
      
      console.log(`User role for appointment ${appointmentId}: ${role}`);
      
      // Map the embedding data to the expected appointment format
      const response = {
        success: true,
        data: {
          id: embedding.id,
          title: metadata.title || "Untitled",
          description: metadata.description || "",
          start_time: metadata.start_time,
          end_time: metadata.end_time,
          location: metadata.location || "",
          status: metadata.status || "scheduled",
          participants: formattedParticipants,
          participants_count: formattedParticipants.length,
          user_id: metadata.user_id,
          content: embedding.content,
          role: role, // Include the user's role for this appointment
          raw_metadata: metadata, // Include the full metadata for client-side access
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch appointment details",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

// delete all embeddings data for a user
app.delete("/api/embeddings/appointments", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const query = {
        text: "DELETE FROM embeddings WHERE metadata->>'user_id' = $1",
        values: [userId],
      };
      await pool.query(query);
      res.json({ message: "All embeddings deleted successfully" });
    } catch (error) {
      console.error("Error deleting embeddings:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// delete a specific appointment by ID
app.delete("/api/embeddings/appointments/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const appointmentId = req.params.id;
    
    console.log(`Attempting to delete appointment ${appointmentId} for user ${userId}`);
    
    // First check if the appointment exists and belongs to the user
    const checkQuery = {
      text: "SELECT * FROM embeddings WHERE id = $1",
      values: [appointmentId],
    };
    
    const checkResult = await pool.query(checkQuery);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    // Get the appointment metadata
    const appointment = checkResult.rows[0];
    const metadata = appointment.metadata || {};
    
    // Check if the user is the owner of the appointment
    if (metadata.user_id && metadata.user_id != userId) {
      return res.status(403).json({ error: "You do not have permission to delete this appointment" });
    }
    
    // Delete the appointment
    const deleteQuery = {
      text: "DELETE FROM embeddings WHERE id = $1",
      values: [appointmentId],
    };
    
    await pool.query(deleteQuery);
    
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: error.message });
  }
});

// edit embeddings data
app.put("/api/embeddings/appointments", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      id,
      title,
      description,
      start_time,
      end_time,
      location,
      participants,
      status,
    } = req.body;
    const query = {
      text: "UPDATE embeddings SET title = $2, description = $3, start_time = $4, end_time = $5, location = $6, participants = $7, status = $8 WHERE metadata->>'user_id' = $1",
      values: [
        userId,
        title,
        description,
        start_time,
        end_time,
        location,
        participants,
        status,
      ],
    };
    await pool.query(query);
    res.json({ message: "Embeddings updated successfully" });
  } catch (error) {
    console.error("Error updating embeddings:", error);
    res.status(500).json({ error: error.message });
  }
});

// Chat endpoint
app.post("/api/chat", authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check if vector store is initialized
    if (!pgvectorStore) {
      return res.status(503).json({
        error:
          "AI service is still initializing. Please try again in a moment.",
      });
    }

    // First check if we have any documents
    const docs = await pgvectorStore.similaritySearch(message, 5);
    if (!docs || docs.length === 0) {
      return res.json({
        response:
          "I don't have any information about your appointments yet. Please add your appointment data first using the /api/embeddings/add-appointments endpoint.",
        hasDocuments: false,
      });
    }

    const result = await chain.invoke(message);
    // Format response for better readability
    const formattedResult = result.trim();

    res.json({
      response: formattedResult,
      hasDocuments: true,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message });
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


// Update an existing appointment (embeddings version)
app.put("/api/embeddings/appointments/:id", authenticateToken, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    const updates = req.body;
    
    console.log(`Attempting to update appointment ${appointmentId}`);
    console.log('Update data:', updates);
    
    // First check if the appointment exists and belongs to the user
    const checkQuery = {
      text: "SELECT * FROM embeddings WHERE id = $1",
      values: [appointmentId],
    };
    
    const checkResult = await pool.query(checkQuery);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    // Get the appointment data
    const appointment = checkResult.rows[0];
    const metadata = appointment.metadata || {};
    
    // Check if the user is the owner of the appointment
    if (metadata.user_id && metadata.user_id != userId) {
      return res.status(403).json({ error: "You do not have permission to update this appointment" });
    }
    
    // Update the metadata with the new values
    const updatedMetadata = { ...metadata };
    
    // Update fields if they exist in the request
    if (updates.title) updatedMetadata.title = updates.title;
    if (updates.description !== undefined) updatedMetadata.description = updates.description;
    if (updates.start_time) updatedMetadata.start_time = updates.start_time;
    if (updates.end_time) updatedMetadata.end_time = updates.end_time;
    if (updates.location !== undefined) updatedMetadata.location = updates.location;
    if (updates.status) updatedMetadata.status = updates.status;
    
    // Handle participants update if provided
    if (updates.participants) {
      // Format participants to objects with email property
      let formattedParticipants = [];
      
      if (Array.isArray(updates.participants)) {
        formattedParticipants = updates.participants.map(participant => {
          if (typeof participant === 'object' && participant.email) {
            return participant;
          }
          if (typeof participant === 'string') {
            return { email: participant };
          }
          return { email: String(participant) };
        });
      } else if (typeof updates.participants === 'string') {
        formattedParticipants = updates.participants
          .split(',')
          .map(email => ({ email: email.trim() }))
          .filter(p => p.email.length > 0);
      }
      
      updatedMetadata.participants = formattedParticipants;
      updatedMetadata.participants_count = formattedParticipants.length;
    }
    
    // Create new content for the document
    const formattedStartTime = new Date(updatedMetadata.start_time).toLocaleString();
    const formattedEndTime = new Date(updatedMetadata.end_time).toLocaleString();
    const participantsCount = updatedMetadata.participants_count || 0;
    
    const content =
      `Appointment: ${updatedMetadata.title}. ` +
      `Description: ${updatedMetadata.description || "No description"}. ` +
      `This appointment is scheduled for ${formattedStartTime} to ${formattedEndTime}. ` +
      `Location: ${updatedMetadata.location || "No location specified"}. ` +
      `Status: ${updatedMetadata.status || "scheduled"}. ` +
      `This appointment has ${participantsCount} participants.`;
    
    // Update the appointment in the database
    const updateQuery = {
      text: "UPDATE embeddings SET content = $1, metadata = $2 WHERE id = $3 RETURNING *",
      values: [content, updatedMetadata, appointmentId],
    };
    
    const result = await pool.query(updateQuery);
    
    res.json({
      success: true,
      message: "Appointment updated successfully",
      data: {
        id: result.rows[0].id,
        metadata: result.rows[0].metadata,
      },
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mark appointment as completed
app.put("/api/embeddings/appointments/:id/complete", authenticateToken, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    
    // First check if the appointment exists
    const checkQuery = {
      text: "SELECT * FROM embeddings WHERE id = $1",
      values: [appointmentId],
    };
    
    const checkResult = await pool.query(checkQuery);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    // Get the appointment data
    const appointment = checkResult.rows[0];
    const metadata = appointment.metadata || {};
    
    // Update the status to completed
    const updatedMetadata = { ...metadata, status: "completed" };
    
    // Create new content for the document with updated status
    const formattedStartTime = new Date(metadata.start_time).toLocaleString();
    const formattedEndTime = new Date(metadata.end_time).toLocaleString();
    const participantsCount = metadata.participants_count || 0;
    
    const content =
      `Appointment: ${metadata.title}. ` +
      `Description: ${metadata.description || "No description"}. ` +
      `This appointment is scheduled for ${formattedStartTime} to ${formattedEndTime}. ` +
      `Location: ${metadata.location || "No location specified"}. ` +
      `Status: completed. ` +
      `This appointment has ${participantsCount} participants.`;
    
    // Update the appointment in the database
    const updateQuery = {
      text: "UPDATE embeddings SET content = $1, metadata = $2 WHERE id = $3 RETURNING *",
      values: [content, updatedMetadata, appointmentId],
    };
    
    const result = await pool.query(updateQuery);
    
    res.json({
      success: true,
      message: "Appointment marked as completed",
      data: {
        id: result.rows[0].id,
        metadata: result.rows[0].metadata,
      },
    });
  } catch (error) {
    console.error("Error marking appointment as completed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel appointment
app.put("/api/embeddings/appointments/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    
    // First check if the appointment exists
    const checkQuery = {
      text: "SELECT * FROM embeddings WHERE id = $1",
      values: [appointmentId],
    };
    
    const checkResult = await pool.query(checkQuery);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    // Get the appointment data
    const appointment = checkResult.rows[0];
    const metadata = appointment.metadata || {};
    
    // Update the status to cancelled
    const updatedMetadata = { ...metadata, status: "cancelled" };
    
    // Create new content for the document with updated status
    const formattedStartTime = new Date(metadata.start_time).toLocaleString();
    const formattedEndTime = new Date(metadata.end_time).toLocaleString();
    const participantsCount = metadata.participants_count || 0;
    
    const content =
      `Appointment: ${metadata.title}. ` +
      `Description: ${metadata.description || "No description"}. ` +
      `This appointment is scheduled for ${formattedStartTime} to ${formattedEndTime}. ` +
      `Location: ${metadata.location || "No location specified"}. ` +
      `Status: cancelled. ` +
      `This appointment has ${participantsCount} participants.`;
    
    // Update the appointment in the database
    const updateQuery = {
      text: "UPDATE embeddings SET content = $1, metadata = $2 WHERE id = $3 RETURNING *",
      values: [content, updatedMetadata, appointmentId],
    };
    
    const result = await pool.query(updateQuery);
    
    res.json({
      success: true,
      message: "Appointment cancelled",
      data: {
        id: result.rows[0].id,
        metadata: result.rows[0].metadata,
      },
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add participant to an appointment
app.post("/api/embeddings/appointments/:id/participants", authenticateToken, async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    
    // First check if the appointment exists
    const checkQuery = {
      text: "SELECT * FROM embeddings WHERE id = $1",
      values: [appointmentId],
    };
    
    const checkResult = await pool.query(checkQuery);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    // Get the appointment data
    const appointment = checkResult.rows[0];
    const metadata = appointment.metadata || {};
    
    // Check if the user is the owner of the appointment
    if (metadata.user_id && metadata.user_id != userId) {
      return res.status(403).json({ error: "You do not have permission to add participants to this appointment" });
    }
    
    // Get existing participants or initialize empty array
    const participants = metadata.participants || [];
    
    // Check if participant already exists
    const participantExists = participants.some(p => {
      if (typeof p === 'object' && p.email) {
        return p.email.toLowerCase() === email.toLowerCase();
      }
      if (typeof p === 'string') {
        return p.toLowerCase() === email.toLowerCase();
      }
      return false;
    });
    
    if (participantExists) {
      return res.status(400).json({ error: "Participant already exists" });
    }
    
    // Create new participant object
    const newParticipant = { email };
    if (name) newParticipant.name = name;
    
    // Add new participant
    const updatedParticipants = [...participants, newParticipant];
    
    // Update metadata
    const updatedMetadata = { 
      ...metadata, 
      participants: updatedParticipants,
      participants_count: updatedParticipants.length
    };
    
    // Create new content for the document
    const formattedStartTime = new Date(metadata.start_time).toLocaleString();
    const formattedEndTime = new Date(metadata.end_time).toLocaleString();
    
    const content =
      `Appointment: ${metadata.title}. ` +
      `Description: ${metadata.description || "No description"}. ` +
      `This appointment is scheduled for ${formattedStartTime} to ${formattedEndTime}. ` +
      `Location: ${metadata.location || "No location specified"}. ` +
      `Status: ${metadata.status || "scheduled"}. ` +
      `This appointment has ${updatedParticipants.length} participants.`;
    
    // Update the appointment in the database
    const updateQuery = {
      text: "UPDATE embeddings SET content = $1, metadata = $2 WHERE id = $3 RETURNING *",
      values: [content, updatedMetadata, appointmentId],
    };
    
    const result = await pool.query(updateQuery);
    
    // Try to send email notification to the new participant
    try {
      console.log("Sending email notification to:", email);
      
      // Create proper date and time objects for the email
      const appointmentDate = new Date(metadata.start_time);
      const endDate = new Date(metadata.end_time);
      
      // Send email notification via your existing route
      const emailResponse = await fetch(`${process.env.FRONTEND_URL}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: [email],
          subject: `You've been added to "${metadata.title}" appointment`,
          appointmentTitle: metadata.title,
          startTime: appointmentDate.toISOString(),
          endTime: endDate.toISOString(),
          location: metadata.location || "Not specified",
          description: metadata.description || "",
          addedAt: new Date().toISOString(),
          useNodemailer: true,
        }),
      });
      
      if (!emailResponse.ok) {
        console.log("Warning: Email notification failed, but participant was added");
      }
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Don't throw here to avoid breaking the participant addition flow
    }
    
    res.json({
      success: true,
      message: "Participant added successfully",
      data: {
        id: result.rows[0].id,
        participant: newParticipant,
        participants: updatedParticipants,
      },
    });
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).json({ error: error.message });
  }
});

// Legacy endpoint - Update an existing appointment
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
app.put("/api/auth/update-profile", authenticateToken, async (req, res) => {
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

// Delete user
app.delete("/api/auth/delete", async (req, res) => {
  console.log("Delete request body:", req.body);
  try {
    const { userId } = req.body;

    console.log("Deleting appointments for user:", userId);
    await pool.query("DELETE FROM appointments WHERE user_id = $1", [userId]);

    console.log("Deleting user:", userId);
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
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
