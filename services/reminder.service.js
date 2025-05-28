const { sendAppointmentReminderEmail } = require("./email.service");
const { pool } = require("../config/database");
const cron = require("node-cron");

// Track processed appointments to avoid duplicates
const processedAppointments = new Set();
const sentReminderIds = new Set();
const lastReminderTimestamps = {};

// Constants for reminder timing
const REMINDER_INTERVAL = 15; // minutes before appointment to send reminder
const REMINDER_COOLDOWN = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Initialize the appointment reminder scheduler
 * @returns {Promise<void>}
 */
const scheduleAppointmentReminders = async () => {
  try {
    console.log("Setting up appointment reminder scheduler...");

    // Clear any previously tracked appointments when server restarts
    processedAppointments.clear();

    // Schedule to run every minute to check for upcoming appointments
    // Use '*/5 * * * *' to check every 5 minutes if you prefer less frequent checks
    cron.schedule("* * * * *", async () => {
      try {
        await checkUpcomingAppointments();
      } catch (cronError) {
        console.error("Error in reminder scheduler:", cronError);
      }
    });

    console.log("Reminder scheduler initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing reminder scheduler:", error);
    return false;
  }
};

/**
 * Check for appointments that need reminders and send emails
 * @returns {Promise<void>}
 */
const checkUpcomingAppointments = async () => {
  try {
    const now = new Date();

    // Format time for logging
    const currentTimeFormatted = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const targetTime = new Date(now.getTime() + REMINDER_INTERVAL * 60 * 1000);

    // Convert to date only strings for debugging
    const targetTimeFormatted = targetTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Log clear headers for debugging
    console.log("\n==================================================");
    console.log(`🔔 APPOINTMENT REMINDER CHECK - ${currentTimeFormatted}`);
    console.log("==================================================");
    console.log(`Current time: ${currentTimeFormatted}`);
    console.log(
      `Looking for appointments at: ${targetTimeFormatted} (${REMINDER_INTERVAL} min from now)`
    );
    console.log(`Current server timestamp: ${now.toISOString()}`);
    console.log(`Target reminder timestamp: ${targetTime.toISOString()}`);
    console.log("--------------------------------------------------");

    // Query to find all upcoming appointments that need reminders
    // We use a simplified, precise query focused just on finding appointments
    const query = {
      text: `
        SELECT 
          e.id, 
          e.metadata->>'title' as title, 
          e.metadata->>'start_time' as start_time,
          e.metadata->>'participants' as participants_json,
          e.metadata->>'reminder_sent' as reminder_sent
        FROM 
          embeddings e
        WHERE 
          e.content LIKE '%appointment%'
          AND e.metadata IS NOT NULL 
          AND e.metadata ? 'start_time'
          AND e.metadata->>'reminder_sent' = 'false'
      `,
    };

    console.log("Fetching appointments that need reminders...");

    // Execute the query
    const result = await pool.query(query);

    // Also run a direct query to find the specific appointment we're looking for (for debugging)
    console.log(
      "Running additional debug query to check all upcoming appointments..."
    );
    // Query to find all upcoming appointments with full details for debugging

    // Define startIso as the current time in ISO format for filtering upcoming appointments
    const startIso = now.toISOString();

    const debugQuery = {
      text: `
        SELECT 
          e.id, 
          e.metadata->>'title' as title, 
          e.metadata->>'start_time' as start_time, 
          e.metadata->>'end_time' as end_time, 
          e.metadata->>'reminder_sent' as reminder_sent,
          e.metadata->>'location' as location,
          e.metadata->>'description' as description,
          e.metadata->>'owner_email' as owner_email,
          e.metadata->>'owner_name' as owner_name,
          e.metadata->>'participants' as participants,
          e.content as content_type,
          e.metadata as full_metadata
        FROM embeddings e
        WHERE 
          e.content LIKE '%appointment%'
          AND e.metadata IS NOT NULL 
          AND e.metadata->>'start_time' > $1
        ORDER BY e.metadata->>'start_time' ASC
        LIMIT 20
      `,
      values: [startIso],
    };

    const debugResult = await pool.query(debugQuery);
    if (debugResult.rows.length > 0) {
      console.log("\n------ UPCOMING APPOINTMENTS IN DATABASE ------");
      for (const appt of debugResult.rows) {
        console.log("\nAppointment details:");
        console.log(`Title: "${appt.title}"`);
        console.log(`Raw start_time from DB: ${appt.start_time}`);

        // Parse and display time in multiple formats for debugging
        try {
          const apptTime = new Date(appt.start_time);
          const formattedTime = apptTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          // Calculate minutes until start in different ways
          const minutesToStart = Math.round(
            (apptTime.getTime() - now.getTime()) / (60 * 1000)
          );

          console.log(`Parsed appointment time: ${apptTime.toString()}`);
          console.log(`Formatted time: ${formattedTime}`);
          console.log(`ISO string: ${apptTime.toISOString()}`);
          console.log(`Minutes until start: ${minutesToStart}`);
          console.log(`Current server time: ${now.toString()}`);
          console.log(`Server time ISO: ${now.toISOString()}`);

          const needsReminder =
            minutesToStart > 0 &&
            minutesToStart <= 30 &&
            (appt.reminder_sent === null || appt.reminder_sent === "false");

          console.log(
            `Should get reminder: ${
              needsReminder ? "YES" : "NO"
            } (${minutesToStart} min until start, reminder_sent: ${
              appt.reminder_sent
            })`
          );

          if (needsReminder && minutesToStart == 15) {
            try {
              // Parse participants if available
              let participantEmails = [];
              let recipientEmail = "";

              // First try to use owner_email if available
              if (appt.owner_email) {
                recipientEmail = appt.owner_email;
                console.log(`Using owner email: ${recipientEmail}`);
              }

              // If no owner email, try to extract from participants
              if (!recipientEmail && appt.participants) {
                try {
                  let parsedParticipants;
                  if (typeof appt.participants === "string") {
                    parsedParticipants = JSON.parse(appt.participants);
                  } else {
                    parsedParticipants = appt.participants;
                  }

                  if (
                    Array.isArray(parsedParticipants) &&
                    parsedParticipants.length > 0
                  ) {
                    // Try to find first valid email in participants
                    for (const p of parsedParticipants) {
                      if (typeof p === "string" && p.includes("@")) {
                        recipientEmail = p;
                        break;
                      } else if (
                        p &&
                        typeof p === "object" &&
                        p.email &&
                        p.email.includes("@")
                      ) {
                        recipientEmail = p.email;
                        break;
                      }
                    }
                  }
                } catch (parseError) {
                  console.error("Error parsing participants:", parseError);
                }
              }

              // If we found a valid recipient email
              if (recipientEmail && recipientEmail.includes("@")) {
                console.log(`Sending debug reminder to: ${recipientEmail}`);
                const result = await sendAppointmentReminderEmail(
                  recipientEmail,
                  appt.title,
                  formattedTime,
                  appt.location || "No location specified",
                  appt.description || "No description provided",
                  appt.owner_name || "MeetNing",
                  [] // No BCC recipients for debug
                );
                console.log("Email send result:", result);
              } else {
                console.log(
                  "⚠️ No valid recipient email found for debug reminder"
                );
              }
            } catch (emailError) {
              console.error("Error sending debug reminder email:", emailError);
            }
          }
        } catch (timeError) {
          console.error(`Error parsing time: ${timeError.message}`);
        }
      }
      console.log("\n-------------------------------------------");
    } else {
      console.log("No upcoming appointments found in the system");
    }
  } catch (error) {
    console.error("Error checking for upcoming appointments:", error);
  }
};

/**
 * Send reminder for a specific appointment
 * @param {Object} appointment - Appointment data
 */

module.exports = {
  scheduleAppointmentReminders,
  checkUpcomingAppointments,
};
