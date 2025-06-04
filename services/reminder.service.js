const { sendAppointmentReminderEmail } = require("./email.service");
const { pool } = require("../config/database");
const cron = require("node-cron");

// Track processed appointments to avoid duplicates
const processedAppointments = new Set();

// Helper function to format date to YYYY-MM-DD hh:mm AM/PM
const formatTo12Hour = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = hours.toString().padStart(2, "0");
  return `${year}-${month}-${day} ${strHours}:${minutes} ${ampm}`;
};

// Constants for reminder timing
const REMINDER_INTERVAL = 15;

/**
 * Initialize the appointment reminder scheduler
 * @returns {Promise<void>}
 */
const scheduleAppointmentReminders = async () => {
  try {
    console.log("Setting up appointment reminder scheduler...");

    // Clear any previously tracked appointments when server restarts
    processedAppointments.clear();

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

    // Use ISO time for logging to avoid timezone issues
    const currentTimeIso = now.toISOString();

    const targetTime = new Date(now.getTime() + REMINDER_INTERVAL * 60 * 1000);
    const targetTimeIso = targetTime.toISOString();

    // Log clear headers for debugging
    console.log("\n==================================================");
    console.log(`🔔 APPOINTMENT REMINDER CHECK`);
    console.log("==================================================");
    console.log(`Current time (ISO): ${currentTimeIso}`);
    console.log(
      `Looking for appointments exactly ${REMINDER_INTERVAL} minutes before start time`
    );
    console.log(`Target reminder timestamp: ${targetTimeIso}`);
    console.log("--------------------------------------------------");

    // Also run a direct query to find the specific appointment we're looking for (for debugging)
    console.log(
      "Running additional debug query to check all upcoming appointments..."
    );

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
        try {
          const apptTime = new Date(appt.start_time);
          // Use ISO format for consistency across timezones
          const apptTimeIso = apptTime.toISOString();

          // Format time in a universal format (UTC) using 12-hour AM/PM
          const formattedTime = formatTo12Hour(apptTime);

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
            if (userTimezone !== "UTC") {
              const formatter = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: userTimezone,
              });
              const parts = formatter
                .formatToParts(apptTime)
                .reduce((acc, part) => {
                  acc[part.type] = part.value;
                  return acc;
                }, {});

              formattedTimeInUserTz = `${parts.year}-${parts.month}-${
                parts.day
              } ${parts.hour}:${parts.minute} ${parts.dayPeriod.toUpperCase()}`;

              console.log(
                `Time in user timezone (${userTimezone}): ${formattedTimeInUserTz}`
              );
            }
          } catch (tzFormatError) {
            console.error(
              `Error formatting time in user timezone: ${tzFormatError.message}`
            );
          }

          const minutesToStart = Math.round(
            (apptTime.getTime() - now.getTime()) / (60 * 1000)
          );

          console.log(`Appointment time (ISO): ${apptTime.toISOString()}`);
          console.log(`Current time (ISO): ${now.toISOString()}`);
          console.log(`Minutes until start: ${minutesToStart}`);

          const needsReminder =
            minutesToStart === REMINDER_INTERVAL &&
            (appt.reminder_sent === null || appt.reminder_sent === "false");

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

                const emailResult = await sendAppointmentReminderEmail(
                  recipientEmail,
                  appt.title,
                  timeToDisplay,
                  appt.location || "No location specified",
                  appt.owner_name || "MeetNing",
                  [] // No BCC recipients for debug
                );

                if (emailResult && emailResult.messageId) { // Check if email was sent successfully by Nodemailer's typical response
                  console.log(`Reminder email sent successfully for appointment ID ${appt.id}: ${emailResult.messageId}`);
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
                  } catch (dbError) {
                    console.error(`Error updating reminder_sent flag for appointment ID ${appt.id}:`, dbError);
                  }
                } else {
                  console.log(`Failed to send reminder email for appointment ID ${appt.id}. Email service response:`, emailResult);
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
    } else {
      console.log("No upcoming appointments found in the system");
    }
  } catch (error) {
    console.error("Error checking for upcoming appointments:", error);
  }
};

module.exports = {
  scheduleAppointmentReminders,
  checkUpcomingAppointments,
};
