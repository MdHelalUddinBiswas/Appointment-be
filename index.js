const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import configuration
const { initDatabase, testConnection } = require('./config/database');
const { initializeVectorStore } = require('./services/vectorStore.service');
const { scheduleAppointmentReminders } = require('./services/reminder.service');

// Create Express app
const app = express();
const port = process.env.PORT || 8000;

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

// Import routes
const authRoutes = require('./routes/auth.routes');
const embeddingsRoutes = require('./routes/embeddings.routes');
const chatRoutes = require('./routes/chat.routes');
const integrationRoutes = require('./routes/integration.routes');
const meetingRoutes = require('./routes/meeting.routes');
const conflictCheckerRoutes = require('./routes/conflict-checker');
const availabilityRoutes = require('./routes/availability.routes');
const cronRoutes = require('./routes/cron.routes'); // Add the new cron routes

// Basic routes
app.get("/", (req, res) => {
  res.send("MeetNing Appointment AI API is running");
});

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the MeetNing Appointment AI API" });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "MeetNing Appointment AI API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Apply routes
app.use("/api/auth", authRoutes);
app.use("/api", embeddingsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/integration", integrationRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/conflicts", conflictCheckerRoutes);
app.use("/api/cron", cronRoutes); // Register the cron routes

// Initialize and start the server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("Database connection failed. Starting server anyway...");
    }

    // Initialize database tables
    await initDatabase();
    
    // Initialize vector store
    await initializeVectorStore();
    
    // Initialize appointment reminder service
    await scheduleAppointmentReminders();
    
    // Start server
    app.listen(port, () => {
      console.log(`MeetNing Appointment AI API running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
};

// Start the server
startServer();
