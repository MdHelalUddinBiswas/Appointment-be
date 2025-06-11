const { pool } = require("../config/database");
const { getVectorStoreInstance } = require("../services/vectorStore.service");

// Add appointment data to vector store
const addAppointments = async (req, res) => {
  try {
    // Check if vector store is initialized
    const pgvectorStore = getVectorStoreInstance();
    if (!pgvectorStore) {
      return res.status(503).json({
        error:
          "AI service is still initializing. Please try again in a moment.",
      });
    }

    const appointments = req.body;

    if (!Array.isArray(appointments) && !appointments.userId) {
      return res.status(400).json({
        error:
          "Invalid request format. Expected an array of appointments or an object with userId.",
      });
    }

    // If a single appointment is sent (not in an array)
    const appointmentsArray = Array.isArray(appointments)
      ? appointments
      : [appointments];

    // Process and embed appointment data
    const documents = appointmentsArray.map((appointment) => {
      // Format participants to objects with email property and calculate count
      let formattedParticipants = [];
      let participantsCount = 0;

      if (appointment.participants) {
        // Handle different possible formats of participants data
        if (Array.isArray(appointment.participants)) {
          formattedParticipants = appointment.participants.map(
            (participant) => {
              // If participant is already an object with email property, use it as is
              if (typeof participant === "object" && participant.email) {
                return participant;
              }
              // If participant is a string (email), convert to object format
              if (typeof participant === "string") {
                return { email: participant };
              }
              // Default case
              return { email: String(participant) };
            }
          );
        } else if (typeof appointment.participants === "string") {
          // If participants is a string (possibly a comma-separated list)
          formattedParticipants = appointment.participants
            .split(",")
            .map((email) => ({ email: email.trim() }))
            .filter((p) => p.email.length > 0);
        }
        participantsCount = formattedParticipants.length;
      }

      // Store original ISO format dates
      const isoStartTime = appointment.start_time;
      const isoEndTime = appointment.end_time;

      // Format dates for human-readable content
      const formattedStartTime = new Date(
        appointment.start_time
      ).toLocaleString();
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
          start_time: isoStartTime, // Use ISO format for database storage
          end_time: isoEndTime, // Use ISO format for database storage
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
};

// Get all embeddings for a user
const getAppointments = async (req, res) => {
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
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
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
        message:
          "Appointment not found or you don't have permission to view it",
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
        formattedParticipants = metadata.participants.map((participant) => {
          // If participant is already an object with email property, use it as is
          if (typeof participant === "object" && participant.email) {
            return participant;
          }
          // If participant is a string (email), convert to object format
          if (typeof participant === "string") {
            return { email: participant };
          }
          // Default case
          return { email: String(participant) };
        });
      } else if (typeof metadata.participants === "string") {
        // If participants is a string (possibly a comma-separated list)
        formattedParticipants = metadata.participants
          .split(",")
          .map((email) => ({ email: email.trim() }))
          .filter((p) => p.email.length > 0);
      }
    }

    let role = "viewer";

    // Check if user is owner
    if (metadata.user_id && metadata.user_id == userId) {
      role = "owner";
    }
    // Check if user is a participant
    else if (formattedParticipants.some((p) => p.email === req.user.email)) {
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
};

// Delete all embeddings for a user
const deleteAllAppointments = async (req, res) => {
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
};

// Delete a specific appointment by ID
const deleteAppointmentById = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointmentId = req.params.id;

    console.log(
      `Attempting to delete appointment ${appointmentId} for user ${userId}`
    );

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
      return res.status(403).json({
        error: "You do not have permission to delete this appointment",
      });
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
};

// Update an appointment
const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    const updates = req.body;

    console.log(`Attempting to update appointment ${appointmentId}`);
    console.log("Update data:", updates);

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
      return res.status(403).json({
        error: "You do not have permission to update this appointment",
      });
    }

    // Update the metadata with the new values
    const updatedMetadata = { ...metadata };

    // Update fields if they exist in the request
    if (updates.title) updatedMetadata.title = updates.title;
    if (updates.description !== undefined)
      updatedMetadata.description = updates.description;
    if (updates.start_time) updatedMetadata.start_time = updates.start_time;
    if (updates.end_time) updatedMetadata.end_time = updates.end_time;
    if (updates.location !== undefined)
      updatedMetadata.location = updates.location;
    if (updates.status) updatedMetadata.status = updates.status;

    // Handle participants update if provided
    if (updates.participants) {
      // Format participants to objects with email property
      let formattedParticipants = [];

      if (Array.isArray(updates.participants)) {
        formattedParticipants = updates.participants.map((participant) => {
          if (typeof participant === "object" && participant.email) {
            return participant;
          }
          if (typeof participant === "string") {
            return { email: participant };
          }
          return { email: String(participant) };
        });
      } else if (typeof updates.participants === "string") {
        formattedParticipants = updates.participants
          .split(",")
          .map((email) => ({ email: email.trim() }))
          .filter((p) => p.email.length > 0);
      }

      updatedMetadata.participants = formattedParticipants;
      updatedMetadata.participants_count = formattedParticipants.length;
    }

    // Create new content for the document
    const formattedStartTime = new Date(
      updatedMetadata.start_time
    ).toLocaleString();
    const formattedEndTime = new Date(
      updatedMetadata.end_time
    ).toLocaleString();
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
};

// Mark appointment as completed
const markAppointmentAsCompleted = async (req, res) => {
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
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
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
};

// Add participant to an appointment
const addParticipant = async (req, res) => {
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
      return res.status(403).json({
        error:
          "You do not have permission to add participants to this appointment",
      });
    }

    // Get existing participants or initialize empty array
    const participants = metadata.participants || [];

    // Check if participant already exists
    const participantExists = participants.some((p) => {
      if (typeof p === "object" && p.email) {
        return p.email.toLowerCase() === email.toLowerCase();
      }
      if (typeof p === "string") {
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
      participants_count: updatedParticipants.length,
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
      const fetch = require("node-fetch");
      const emailResponse = await fetch(
        `${process.env.FRONTEND_URL}/api/send-email`,
        {
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
        }
      );

      if (!emailResponse.ok) {
        console.log(
          "Warning: Email notification failed, but participant was added"
        );
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
};

module.exports = {
  addAppointments,
  getAppointments,
  getAppointmentById,
  deleteAllAppointments,
  deleteAppointmentById,
  updateAppointment,
  markAppointmentAsCompleted,
  cancelAppointment,
  addParticipant,
};
