const { Pool } = require("pg");
require("dotenv").config();

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

// Test PostgreSQL connection
const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected at:", result.rows[0].now);
    return true;
  } catch (error) {
    console.error("Database connection error:", error.stack);
    return false;
  }
};

// Initialize database tables
const initDatabase = async () => {
  try {
    // Create users table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        timezone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_otp VARCHAR(6),
        otp_expiry TIMESTAMP,
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP
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
        reminder_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add reminder_sent column if it doesn't exist (for existing tables)
    try {
      // Check if the column exists
      const columnCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'appointments' AND column_name = 'reminder_sent'
      `);
      
      // If column doesn't exist, add it
      if (columnCheck.rows.length === 0) {
        await pool.query(`ALTER TABLE appointments ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE`);
        console.log('Added reminder_sent column to appointments table');
      }
    } catch (err) {
      console.error('Error checking/adding reminder_sent column:', err);
    }

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
    return true;
  } catch (error) {
    console.error("Error initializing database tables:", error);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  initDatabase
};
