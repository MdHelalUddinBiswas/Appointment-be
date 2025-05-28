const { sendAppointmentReminderEmail } = require('./email.service');
const { pool } = require('../config/database');
const cron = require('node-cron');

/**
 * MeetNing Appointment Reminder Service
 * 
 * This service handles sending reminder emails for upcoming appointments.
 * Features:
 * - Runs every minute to check for appointments needing reminders
 * - Sends a single consolidated email with BCC for multiple recipients
 * - Prevents duplicate emails with multi-level protection
 * - Handles time zone differences properly
 * - Provides detailed logging for troubleshooting
 */

// Track processed reminders to prevent duplicates
const processedAppointments = new Set();
const REMINDER_INTERVAL = 15; // Send reminders 15 minutes before appointment

/**
 * Initialize the appointment reminder scheduler
 * @returns {Promise<void>}
 */
const scheduleAppointmentReminders = async () => {
  try {
    console.log('Setting up appointment reminder scheduler...');
    
    // Clear any previously tracked appointments when server restarts
    processedAppointments.clear();
    
    // Schedule to run every minute to check for upcoming appointments
    // Use '*/5 * * * *' to check every 5 minutes if you prefer less frequent checks
    cron.schedule('* * * * *', async () => {
      try {
        await checkUpcomingAppointments();
      } catch (cronError) {
        console.error('Error in reminder scheduler:', cronError);
      }
    });
    
    console.log('Reminder scheduler initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing reminder scheduler:', error);
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
    const currentTimeFormatted = now.toLocaleTimeString('en-US', {
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
    
    // Calculate target time window (REMINDER_INTERVAL minutes from now)
    const targetTime = new Date(now.getTime() + REMINDER_INTERVAL * 60 * 1000);
    
    // Convert to date only strings for debugging
    const targetTimeFormatted = targetTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Log clear headers for debugging
    console.log('\n==================================================');
    console.log(`🔔 APPOINTMENT REMINDER CHECK - ${currentTimeFormatted}`);
    console.log('==================================================');
    console.log(`Current time: ${currentTimeFormatted}`);
    console.log(`Looking for appointments at: ${targetTimeFormatted} (${REMINDER_INTERVAL} min from now)`);
    console.log(`Current server timestamp: ${now.toISOString()}`);
    console.log(`Target reminder timestamp: ${targetTime.toISOString()}`);
    console.log('--------------------------------------------------');
    
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
      `
    };
    
    console.log('Fetching appointments that need reminders...');
    
    // Execute the query
    const result = await pool.query(query);
    
    // Also run a direct query to find the specific appointment we're looking for (for debugging)
    console.log('Running additional debug query to check all upcoming appointments...');
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
          e.content as content_type,
          e.metadata as full_metadata
        FROM embeddings e
        WHERE 
          e.content LIKE '%appointment%'
          AND e.metadata IS NOT NULL 
          AND e.metadata->>'start_time' > $1
        ORDER BY e.metadata->>'start_time' ASC
        LIMIT 5
      `,
      values: [startIso]
    };
    
    const debugResult = await pool.query(debugQuery);
    if (debugResult.rows.length > 0) {
      console.log('\n------ UPCOMING APPOINTMENTS IN DATABASE ------');
      for (const appt of debugResult.rows) {
        console.log('\nAppointment details:');
        console.log(`Title: "${appt.title}"`);
        console.log(`Raw start_time from DB: ${appt.start_time}`);
        
        // Parse and display time in multiple formats for debugging
        try {
          const apptTime = new Date(appt.start_time);
          const formattedTime = apptTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          
          // Calculate minutes until start in different ways
          const minutesToStart = Math.round((apptTime.getTime() - now.getTime()) / (60 * 1000));
          
          console.log(`Parsed appointment time: ${apptTime.toString()}`);
          console.log(`Formatted time: ${formattedTime}`);
          console.log(`ISO string: ${apptTime.toISOString()}`);
          console.log(`Minutes until start: ${minutesToStart}`);
          console.log(`Current server time: ${now.toString()}`);
          console.log(`Server time ISO: ${now.toISOString()}`);
          
          // Check if this appointment should receive a reminder
          const needsReminder = minutesToStart > 0 && minutesToStart <= 30 && 
                              (appt.reminder_sent === null || appt.reminder_sent === 'false');
          
          console.log(`Should get reminder: ${needsReminder ? 'YES' : 'NO'} (${minutesToStart} min until start, reminder_sent: ${appt.reminder_sent})`);
        } catch (timeError) {
          console.error(`Error parsing time: ${timeError.message}`);
        }
      }
      console.log('\n-------------------------------------------');
    } else {
      console.log('No upcoming appointments found in the system');
    }
    
    // Process and filter appointments for reminders
    if (result.rows.length > 0) {
      console.log(`\nFound ${result.rows.length} total appointments, filtering for correct reminder time...`);
      
      // Filter appointments that are within our reminder window
      const filteredAppointments = result.rows.filter(appointment => {
        try {
          const apptStartTime = new Date(appointment.start_time);
          const minutesUntilStart = Math.round((apptStartTime.getTime() - now.getTime()) / (60 * 1000));
          
          // We want appointments that start within 0-30 minutes from now
          return minutesUntilStart >= 0 && minutesUntilStart <= 30;
        } catch (e) {
          console.error('Error parsing appointment time:', e);
          return false;
        }
      });
      
      console.log(`After filtering: ${filteredAppointments.length} appointments need reminders now`);
      
      // Process each appointment that needs a reminder
      for (const appointment of filteredAppointments) {
        // Calculate exact minutes until appointment starts
        const startTime = new Date(appointment.start_time);
        const minutesUntilStart = Math.round((startTime.getTime() - now.getTime()) / (60 * 1000));
        
        // Format time for better readability
        const formattedStartTime = startTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        console.log(`\nSending reminder for: "${appointment.title}"`);
        console.log(`Appointment starts at: ${formattedStartTime} (in ${minutesUntilStart} minutes)`);
        console.log(`Appointment ID: ${appointment.id}`);
        
        // Send the reminder email
        await sendReminderForAppointment(appointment);
        
        // Mark reminder as sent in the embeddings table
        console.log(`Marking reminder as sent for appointment ID: ${appointment.id}`);
        try {
          const updateResult = await pool.query(
            `UPDATE embeddings 
             SET metadata = jsonb_set(metadata, '{reminder_sent}', '"true"') 
             WHERE id = $1 
             RETURNING id, metadata->>'title' as title`,
            [appointment.id]
          );
          
          if (updateResult.rowCount > 0) {
            console.log(`✅ Successfully updated reminder_sent flag for appointment "${updateResult.rows[0].title}"`);
          } else {
            console.log(`⚠️ Warning: No rows were updated when marking reminder as sent for ID ${appointment.id}`);
          }
        } catch (updateError) {
          console.error(`Error updating reminder_sent flag:`, updateError);
        }
        
        console.log(`✓ Reminder marked as sent for appointment ID: ${appointment.id}`);
      }
    } else {
      console.log('\nNo appointments found needing 15-minute reminders at this time');
    }
  } catch (error) {
    console.error('Error checking for upcoming appointments:', error);
  }
};

/**
 * Send reminder for a specific appointment
 * @param {Object} appointment - Appointment data
 */
const sendReminderForAppointment = async (appointment) => {
  try {
    // Format appointment time for display
    const startTime = new Date(appointment.start_time);
    const formattedTime = startTime.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    
    console.log('\n---- PROCESSING APPOINTMENT PARTICIPANTS ----');
    console.log('Raw participants data:', appointment.participants);
    
    // Parse participants
    let participantEmails = [];
    if (appointment.participants) {
      try {
        let parsedParticipants;
        
        // First attempt to parse as JSON if it's a string
        if (typeof appointment.participants === 'string') {
          try {
            parsedParticipants = JSON.parse(appointment.participants);
            console.log('Successfully parsed participants string as JSON');
          } catch (parseError) {
            console.log('Could not parse participants as JSON, using as-is');
            // If it can't be parsed as JSON, it might be a single email
            parsedParticipants = [appointment.participants];
          }
        } else {
          // If it's already an object/array, use it directly
          parsedParticipants = appointment.participants;
          console.log('Participants data is already an object/array');
        }
        
        // Handle different formats of participant data
        if (Array.isArray(parsedParticipants)) {
          participantEmails = parsedParticipants.map(p => {
            if (typeof p === 'string') return p;
            if (p && typeof p === 'object' && p.email) return p.email;
            return null;
          }).filter(email => email); // Remove null/undefined values
        } else if (parsedParticipants && typeof parsedParticipants === 'object') {
          // Handle case where it might be a single object
          if (parsedParticipants.email) {
            participantEmails = [parsedParticipants.email];
          }
        }
        
        console.log('Extracted participant emails:', participantEmails);
      } catch (e) {
        console.error('Error processing participants:', e);
      }
    }
    
    // Create a list of all recipients (owner + participants)
    let recipients = [];
    
    // Generate a unique ID for this appointment reminder
    const reminderKey = `${appointment.id}_${formattedTime}`;
    
    // If we've already sent a reminder for this appointment in this session, skip it
    if (sentReminderIds.has(reminderKey)) {
      console.log(`⏭️ Already sent reminder for appointment ID ${appointment.id} during this session. Skipping.`);
      return;
    }
    
    // Add owner email if it exists
    if (appointment.owner_email) {
      recipients.push(appointment.owner_email);
      console.log(`Added owner email: ${appointment.owner_email}`);
    } else {
      console.log('No owner email found in appointment data');
    }
    
    // Add participant emails
    if (participantEmails && participantEmails.length > 0) {
      recipients = [...recipients, ...participantEmails];
      console.log(`Added ${participantEmails.length} participant emails`);
    } else {
      console.log('No participant emails found or extracted');
    }
    
    // Remove duplicates and filter out invalid emails
    recipients = [...new Set(recipients)].filter(email => {
      if (!email) return false;
      const isValid = typeof email === 'string' && email.includes('@');
      if (!isValid) console.log(`Skipping invalid email: ${email}`);
      return isValid;
    });
    
    console.log(`Final recipient list (${recipients.length} emails):`, recipients);
    
    // If no valid recipients, log warning and exit
    if (recipients.length === 0) {
      console.log(`WARNING: No valid recipients found for appointment "${appointment.title}". Reminder email cannot be sent.`);
      return;
    }
    
    // Check for email throttling and only send to recipients who haven't received emails recently
    const now = Date.now();
    const eligibleRecipients = recipients.filter(email => {
      const lastSent = lastReminderTimestamps[email.toLowerCase()];
      if (lastSent && now - lastSent < REMINDER_COOLDOWN) {
        console.log(`⏰ Skipping email to ${email} - sent another reminder ${Math.round((now - lastSent)/60000)} minutes ago`);
        return false;
      }
      return true;
    });
    
    // If all recipients are throttled, skip this reminder
    if (eligibleRecipients.length === 0) {
      console.log(`All recipients have received emails recently. Skipping reminder for "${appointment.title}".`);
      return;
    }
    
    // Send ONE consolidated email with all recipients in BCC
    try {
      console.log(`Sending consolidated reminder email to ${eligibleRecipients.length} recipients...`);
      
      // Record that we've sent this reminder
      sentReminderIds.add(reminderKey);
      
      // Update timestamp for each recipient
      eligibleRecipients.forEach(email => {
        lastReminderTimestamps[email.toLowerCase()] = now;
      });
      
      const result = await sendAppointmentReminderEmail(
        eligibleRecipients[0], // Send to first recipient
        appointment.title,
        formattedTime,
        appointment.location || 'No location specified',
        appointment.description || 'No description provided',
        appointment.owner_name,
        eligibleRecipients.slice(1) // Rest as BCC
      );
      
      if (result) {
        console.log(`✅ Consolidated reminder email successfully sent for appointment "${appointment.title}"`);
      } else {
        console.log(`❌ Failed to send consolidated reminder email`);
      }
    } catch (emailError) {
      console.error(`Error sending reminder:`, emailError);
    }
  } catch (error) {
    console.error(`Error sending reminder for appointment ${appointment.id}:`, error);
  }
};

module.exports = {
  scheduleAppointmentReminders,
  checkUpcomingAppointments
};
