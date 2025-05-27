const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();

// Configure CORS
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

// Parse JSON request body
app.use(express.json());

module.exports = app;
