const { sendAppointmentReminderEmail } = require("./email.service");
const { pool } = require("../config/database");

// Constants for reminder timing
const REMINDER_INTERVAL = 15; 

/**
 * Initialize the appointment reminder system
 * For Vercel deployments, this does minimal setup since we'll use Vercel Cron
 * @returns {Promise<boolean>} Success status
 */
const scheduleAppointmentReminders = async () => {
  try {
    // For Vercel, logs for monitoring purposes
    console.log("Setting up reminder system for Vercel environment...");
    
    // No actual scheduling here - we'll rely on Vercel Cron to call our endpoint
    // See vercel.json for the cron configuration
    
    console.log("Reminder system initialized for serverless environment");
    return true;
  } catch (error) {
    console.error("Error initializing reminder cron job:", error);
    return false;
  }
};

/**
 * Check for appointments that need reminders and send emails
 * This function is designed to work in a serverless environment
 * @returns {Promise<{success: boolean, processed: number}>} Status and count of processed appointments
 */
const checkUpcomingAppointments = async () => {
  try {
    const now = new Date();

    // Use ISO time for logging to avoid timezone issues
    const currentTimeIso = now.toISOString();

    // Calculate target time (15 minutes from now)
    const targetTime = new Date(now.getTime() + REMINDER_INTERVAL * 60 * 1000);
    const targetTimeIso = targetTime.toISOString();

    // Log execution info (helpful for Vercel logs)
    console.log("\n==================================================");
    console.log(`🔔 APPOINTMENT REMINDER CHECK - ${new Date().toISOString()}`);
    console.log("==================================================");
    console.log(`Current time (ISO): ${currentTimeIso}`);
    console.log(`Looking for appointments ${REMINDER_INTERVAL} minutes from now`);
    console.log(`Target window: ${targetTimeIso}`);
    console.log("--------------------------------------------------");
    
    // Record execution in logs for monitoring
    console.log(`Vercel cron execution timestamp: ${new Date().toISOString()}`);

    const startIso = now.toISOString();

    // Calculate the time window for appointments needing reminders
    // We'll look for appointments that:
    // 1. Start between 14-16 minutes from now (to account for function execution time)
    // 2. Have not had their reminder sent already
    const reminderWindowStart = new Date(now.getTime() + (REMINDER_INTERVAL - 1) * 60 * 1000).toISOString();
    const reminderWindowEnd = new Date(now.getTime() + (REMINDER_INTERVAL + 1) * 60 * 1000).toISOString();
    
    console.log(`Reminder window: ${reminderWindowStart} to ${reminderWindowEnd}`);
    
    const reminderQuery = {
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
          AND e.metadata->>'start_time' >= $1
          AND e.metadata->>'start_time' <= $2
          AND (e.metadata->>'reminder_sent' IS NULL OR e.metadata->>'reminder_sent' = 'false')
        ORDER BY e.metadata->>'start_time' ASC
      `,
      values: [reminderWindowStart, reminderWindowEnd],
    };

    const reminderResult = await pool.query(reminderQuery);
    
    if (reminderResult.rows.length > 0) {
      console.log(`\n------ FOUND ${reminderResult.rows.length} APPOINTMENTS NEEDING REMINDERS ------`);
      let processedCount = 0;
      for (const appt of reminderResult.rows) {
        try {
          const apptTime = new Date(appt.start_time);
          // Use ISO format for consistency across timezones
          const apptTimeIso = apptTime.toISOString();

          // Format time in a universal format without locale or timezone
          const day = apptTime.getDate().toString().padStart(2, "0");
          const month = (apptTime.getMonth() + 1).toString().padStart(2, "0");
          const year = apptTime.getFullYear();
          const hours = apptTime.getHours().toString().padStart(2, "0");
          const minutes = apptTime.getMinutes().toString().padStart(2, "0");
          const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

          // Get user's timezone if available, otherwise default to UTC
          let userTimezone = "UTC";
          let participantEmail = "";

          // Check if owner_email exists to get timezone
          if (appt.owner_email) {
            participantEmail = appt.owner_email;
            // Query the database to get the user's timezone
            try {
              const userQuery = {
                text: `SELECT timezone FROM users WHERE email = $1`,
                values: [participantEmail],
              };
              const userResult = await pool.query(userQuery);
              if (userResult.rows.length > 0 && userResult.rows[0].timezone) {
                userTimezone = userResult.rows[0].timezone;
                console.log(
                  `Found user timezone: ${userTimezone} for ${participantEmail}`
                );
              }
            } catch (tzError) {
              console.error(`Error getting user timezone: ${tzError.message}`);
            }
          }

          // Format the appointment time in the user's timezone
          let formattedTimeInUserTz = formattedTime;
          try {
            // Only adjust if we found a valid timezone
            if (userTimezone !== "UTC") {
              const tzTime = new Date(
                apptTime.toLocaleString("en-US", { timeZone: userTimezone })
              );
              const tzDay = tzTime.getDate().toString().padStart(2, "0");
              const tzMonth = (tzTime.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const tzYear = tzTime.getFullYear();
              const tzHours = tzTime.getHours().toString().padStart(2, "0");
              const tzMinutes = tzTime.getMinutes().toString().padStart(2, "0");
              formattedTimeInUserTz = `${tzYear}-${tzMonth}-${tzDay} ${tzHours}:${tzMinutes}`;
              console.log(
                `Time in user timezone (${userTimezone}): ${formattedTimeInUserTz}`
              );
            }
          } catch (tzFormatError) {
            console.error(
              `Error formatting time in user timezone: ${tzFormatError.message}`
            );
          }

          // Calculate minutes until start for logging purposes
          const minutesToStart = Math.round(
            (apptTime.getTime() - now.getTime()) / (60 * 1000)
          );

          console.log(`Appointment ID ${appt.id} time (ISO): ${apptTime.toISOString()}`);
          console.log(`Current time (ISO): ${now.toISOString()}`);
          console.log(`Minutes until start: ${minutesToStart}`);
          
          // This appointment is already in our target window based on query
          // and hasn't had a reminder sent yet
          const needsReminder = true;

          console.log(
            `Should get reminder: ${
              needsReminder ? "YES" : "NO"
            } (${minutesToStart} min until start, reminder_sent: ${
              appt.reminder_sent
            })`
          );

          if (needsReminder) {
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
                console.log(`Sending reminder to: ${recipientEmail}`);
                // Use the timezone-specific time format if available
                const timeToDisplay = formattedTimeInUserTz || formattedTime;
                console.log(
                  `Using time format in email: ${timeToDisplay} (timezone: ${userTimezone})`
                );

                const result = await sendAppointmentReminderEmail(
                  recipientEmail,
                  appt.title,
                  timeToDisplay,
                  appt.location || "No location specified",
                  appt.description || "No description provided",
                  appt.owner_name || "MeetNing",
                  [] // No BCC recipients for debug
                );

                if (result && result.messageId) { // Check if email was sent successfully by Nodemailer's typical response
                  console.log(`Reminder email sent successfully for appointment ID ${appt.id}: ${result.messageId}`);
                  // Update reminder_sent flag in the database
                  try {
                    const updateQuery = {
                      text: `
                        UPDATE embeddings
                        SET metadata = jsonb_set(metadata, '{reminder_sent}', 'true', true)
                        WHERE id = $1
                      `,
                      values: [appt.id],
                    };
                    await pool.query(updateQuery);
                    console.log(`Successfully updated reminder_sent flag for appointment ID ${appt.id}`);
                    processedCount++; // Count successful reminders
                  } catch (dbError) {
                    console.error(`Error updating reminder_sent flag for appointment ID ${appt.id}:`, dbError);
                  }
                } else {
                  console.log(`Failed to send reminder email for appointment ID ${appt.id}. Email service response:`, result);
                }
              } else {
                console.log("⚠️ No valid recipient email found for reminder");
              }
            } catch (emailError) {
              console.error("Error sending reminder email:", emailError);
            }
          }
        } catch (timeError) {
          console.error(`Error parsing time: ${timeError.message}`);
        }
      }
      console.log("\n-------------------------------------------");
      console.log(`Successfully processed ${processedCount} appointment reminders`);
      return {
        success: true,
        processed: processedCount,
        timestamp: new Date().toISOString(),
        message: `Processed ${processedCount} appointment reminders`
      };
    } else {
      console.log("No appointments requiring reminders found in the system");
      return {
        success: true,
        processed: 0,
        timestamp: new Date().toISOString(),
        message: "No appointments requiring reminders"
      };
    }
  } catch (error) {
    console.error("Error checking for upcoming appointments:", error);
    return {
      success: false,
      processed: 0,
      timestamp: new Date().toISOString(),
      error: error.message || 'Unknown error'
    };
  }
};

module.exports = {
  scheduleAppointmentReminders,
  checkUpcomingAppointments,
};
