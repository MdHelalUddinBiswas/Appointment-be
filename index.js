const express = require("express");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 8000;

app.use(cors());
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

app.post("/api/auth/signup", async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, timezone } = req.body;

    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const result = await pool.query(
      "INSERT INTO users (name, email, password, timezone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, timezone",
      [name, email, hashedPassword, timezone || "UTC"]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        timezone: user.timezone,
      },
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

    // Compare password using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        timezone: user.timezone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.listen(port, async () => {
  console.log(`MeetNing Appointment AI API running on port ${port}`);
  await initDatabase();
});
