const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

// Set up PostgreSQL connection - same as in index.js
let poolConfig;

if (process.env.DATABASE_URL) {
  // For production (Neon, Supabase, etc)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
  console.log("Using production database connection in conflict-checker");
}

const pool = new Pool(poolConfig);

// Define authentication middleware inline since it's not in a separate file
const authenticateToken = (req, res, next) => {
  // Get token from header - support multiple formats
  let token = req.header("x-auth-token");

  // Also check for Authorization header with Bearer token
  const authHeader = req.header("Authorization");
  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
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

// Helper function to handle conflict checking logic
const checkConflicts = async (req, res) => {
  try {
    console.log("Received conflict check request");
    console.log("Method:", req.method);
    console.log("Body:", req.body);
    console.log("Query:", req.query);
    
    // Get the current user's email from the token
    const currentUserEmail = req.user ? req.user.email : null;
    console.log("Current user email:", currentUserEmail);

    // Get participant emails from either query or body
    let participantEmails = [];
    if (req.method === "POST" && req.body && req.body.participantEmails) {
      // Handle array or string in POST body
      if (Array.isArray(req.body.participantEmails)) {
        participantEmails = req.body.participantEmails;
      } else {
        participantEmails = req.body.participantEmails
          .split(",")
          .map((email) => email.trim());
      }
    } else if (req.query && req.query.participantEmails) {
      // Handle string in query parameters
      participantEmails = req.query.participantEmails
        .split(",")
        .map((email) => email.trim());
    }

    // Get time parameters
    const startTime =
      req.method === "POST" ? req.body.startTime : req.query.startTime;
    const endTime =
      req.method === "POST" ? req.body.endTime : req.query.endTime;
    const appointmentId =
      req.method === "POST" ? req.body.appointmentId : req.query.appointmentId;

    console.log("Participants:", participantEmails);
    console.log("Start time:", startTime);
    console.log("End time:", endTime);

    if (!participantEmails.length || !startTime || !endTime) {
      return res.status(400).json({
        message: "Missing required parameters",
        received: { participantEmails, startTime, endTime },
      });
    }

    // Use a simpler query approach that correctly accesses the metadata JSON fields
    const result = await pool.query(
      `SELECT 
         a.id, 
         a.metadata->>'title' as title, 
         a.metadata->>'start_time' as start_time, 
         a.metadata->>'end_time' as end_time, 
         a.metadata->>'participants' as participants,
         COALESCE(u.email, a.metadata->>'user_id') as owner_email 
       FROM embeddings a 
       LEFT JOIN users u ON CAST(a.metadata->>'user_id' AS INTEGER) = u.id 
       WHERE 
         a.metadata->>'start_time' < $1 AND 
         a.metadata->>'end_time' > $2`,
      [endTime, startTime]
    );

    console.log(
      `Found ${result.rows.length} potential appointments in the time range`
    );

    // Filter appointments to find those that involve our participants
    const conflicts = [];

    // Create a map to track participant availability
    const participantAvailability = {};
    participantEmails.forEach((email) => {
      participantAvailability[email] = true; // Initially mark all as available
    });

    // Check each appointment for conflicts
    for (const appointment of result.rows) {
      const conflictingParticipants = [];

      // Check if owner is in our participant list, but exclude the current user
      // since they should be able to schedule their own appointments
      if (participantEmails.includes(appointment.owner_email) && appointment.owner_email !== currentUserEmail) {
        conflictingParticipants.push(appointment.owner_email);
      }

      // Check participants array
      if (appointment.participants) {
        let participants;
        try {
          // Since we're fetching from metadata->>'participants', it's always a string
          // We need to parse it as JSON to get the array of participants
          participants = JSON.parse(appointment.participants);
          
          // Handle case where participants might not be an array
          if (!Array.isArray(participants)) {
            console.log("Participants is not an array:", participants);
            participants = [];
          }

          if (Array.isArray(participants)) {
            // Handle participants as array of objects with email property
            participants.forEach((p) => {
              const email = typeof p === "string" ? p : p.email || "";
              // Only add as conflicting if it's not the current user creating the appointment
              if (email && participantEmails.includes(email) && email !== currentUserEmail) {
                conflictingParticipants.push(email);
              }
            });
          }
        } catch (error) {
          console.error("Error parsing participants:", error);
        }
      }

      // If we found conflicts with this appointment
      if (conflictingParticipants.length > 0) {
        // Mark these participants as unavailable
        conflictingParticipants.forEach((email) => {
          participantAvailability[email] = false;
        });

        // Add to conflicts list
        conflicts.push({
          id: appointment.id,
          title: appointment.title || "Untitled Appointment",
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          owner_email: appointment.owner_email,
          conflicting_participants: [...new Set(conflictingParticipants)],
        });
      }
    }

    // Send the response
    res.json({
      hasConflicts: conflicts.length > 0,
      conflicts,
      participantAvailability,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Register both GET and POST routes
router.get("/check", authenticateToken, checkConflicts);
router.post("/check", authenticateToken, checkConflicts);

module.exports = router;
