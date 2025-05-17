const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
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

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the MeetNing Appointment AI API" });
});

// Home route
app.get("/", (req, res) => {
  res.send("MeetNing Appointment AI API is running");
});

app.listen(port, () => {
  console.log(`MeetNing Appointment AI API running on port ${port}`);
});
