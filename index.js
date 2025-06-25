const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import configuration
const { initDatabase, testConnection } = require("./config/database");
const { initializeVectorStore } = require("./services/vectorStore.service");
const { scheduleAppointmentReminders } = require("./services/reminder.service");

// Create Express app
const app = express();
const port = process.env.PORT || 8000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later" }
});

// Apply rate limiting to all API routes
app.use("/api/", limiter);

// Configure CORS with additional security headers
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://meet-ning-appointment-fe.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
    exposedHeaders: ["x-auth-token"]
  })
);

// Set a 30-second timeout for all requests
app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    res.status(504).json({ error: 'Request timeout' });
  });
  next();
});

// Parse JSON request body with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Import routes
const authRoutes = require("./routes/auth.routes");
const embeddingsRoutes = require("./routes/embeddings.routes");
const chatRoutes = require("./routes/chat.routes");
const integrationRoutes = require("./routes/integration.routes");
const meetingRoutes = require("./routes/meeting.routes");
const conflictCheckerRoutes = require("./routes/conflict-checker");
const availabilityRoutes = require("./routes/availability.routes");

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize and start the server
const startServer = async () => {
  try {
    console.log('Starting server initialization...');
    
    // Test database connection
    console.log('Testing database connection...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("❌ Database connection failed. Starting server anyway...");
    } else {
      console.log("✅ Database connection successful");
    }

    // Initialize database tables
    console.log('Initializing database tables...');
    await initDatabase();
    console.log("✅ Database tables initialized");

    // Initialize vector store
    console.log('Initializing vector store...');
    await initializeVectorStore();
    console.log("✅ Vector store initialized");

    // Initialize appointment reminder service
    console.log('Scheduling appointment reminders...');
    await scheduleAppointmentReminders();
    console.log("✅ Appointment reminders scheduled");

    // Start server
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 MeetNing Appointment AI API running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.syscall !== 'listen') throw error;
      
      // Handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${port} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`Port ${port} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
