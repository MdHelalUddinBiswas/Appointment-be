const cron = require("node-cron");
const { Pool } = require("pg");
const emailService = require("./emailService");

/**
 * Scheduler service to handle timed tasks like appointment reminders
 */
class Scheduler {
  constructor() {
    this.pool = new Pool(this.getDatabaseConfig());
    this.jobs = [];
    this.initialized = false;
  }

  /**
   * Get database configuration based on environment
   * @returns {object} Database configuration
   */
  getDatabaseConfig() {
    if (process.env.DATABASE_URL) {
      return {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      };
    }
    
    // Local development config would be here if needed
    return {};
  }

  /**
   * Initialize the scheduler service
   */
  initialize() {
    if (this.initialized) {
      console.log("Scheduler already initialized");
      return;
    }

    console.log("🕒 Initializing scheduler service");
    this.startAppointmentReminderJob();
    this.initialized = true;
  }

  /**
   * Start the cron job for checking and sending appointment reminders
   */
  startAppointmentReminderJob() {
    // Run every minute to check for appointments that are 15 minutes away
    console.log("🕒 Starting appointment reminder scheduler");
    
    // Check every 30 seconds for better precision
    const job = cron.schedule("*/60 * * * * *", async () => {
      try {
        await this.checkUpcomingAppointments();
      } catch (error) {
        console.error("Error in appointment reminder job:", error);
      }
    });

    this.jobs.push(job);
    console.log("✅ Appointment reminder scheduler started - checking every 30 seconds");
  }

  /**
   * Check for appointments that are about to start in 15 minutes
   */
  /**
   * Get current time in UTC
   * @returns {Date} Current time in UTC
   */
  getCurrentUTCTime() {
    const now = new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  }

  /**
   * Format date to UTC string for display
   * @param {Date} date - Date to format
   * @returns {string} Formatted UTC date string
   */
  formatUTCDate(date) {
    return date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  }

  async checkUpcomingAppointments() {
    try {
      // Get current time in UTC
      const nowUTC = this.getCurrentUTCTime();
      console.log(`\n=== Checking for upcoming appointments at ${this.formatUTCDate(nowUTC)} ===`);
      
      // We want to find appointments that are exactly 15 minutes away
      // For better accuracy, we'll use a window of 14-16 minutes in UTC
      const fourteenMinutesFromNow = new Date(nowUTC.getTime() + 14 * 60 * 1000);
      const sixteenMinutesFromNow = new Date(nowUTC.getTime() + 16 * 60 * 1000);

      console.log('UTC Time range for appointment search:', {
        from: this.formatUTCDate(fourteenMinutesFromNow),
        to: this.formatUTCDate(sixteenMinutesFromNow)
      });

      // Query upcoming appointments that we haven't sent reminders for yet
      // Using UTC for all time comparisons in the database
      const query = `
        SELECT a.*, u.email as creator_email, u.name as creator_name
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        WHERE a.start_time >= $1 AT TIME ZONE 'UTC'
        AND a.start_time <= $2 AT TIME ZONE 'UTC'
        AND a.status = 'upcoming'
        AND a.reminder_sent = false
      `;

      console.log('Executing query with UTC params:', [
        this.formatUTCDate(fourteenMinutesFromNow),
        this.formatUTCDate(sixteenMinutesFromNow)
      ]);

      const result = await this.pool.query(query, [
        this.formatUTCDate(fourteenMinutesFromNow),
        this.formatUTCDate(sixteenMinutesFromNow),
      ]);

      console.log(`Found ${result.rows.length} appointments in the UTC time range`);

      if (result.rows.length > 0) {
        console.log(`\n=== Found ${result.rows.length} upcoming appointments for reminders ===`);
        for (const appointment of result.rows) {
          const startTime = new Date(appointment.start_time);
          const utcStartTime = new Date(startTime.getTime() + startTime.getTimezoneOffset() * 60000);
          const minutesUntilStart = Math.floor((utcStartTime - nowUTC) / (1000 * 60));
          
          console.log(`\nAppointment: "${appointment.title}"`);
          console.log(`Local Start Time: ${startTime}`);
          console.log(`UTC Start Time:   ${this.formatUTCDate(utcStartTime)}`);
          console.log(`Starts in: ${minutesUntilStart} minutes`);
          console.log(`Participants:`, appointment.participants || []);
        }
        console.log('\nSending reminders...');
        await this.sendAppointmentReminders(result.rows);
        console.log('=== Finished processing reminders ===\n');
      } else {
        console.log('No appointments found for reminders at this time.\n');
      }
    } catch (error) {
      console.error("Error checking upcoming appointments:", error);
    }
  }

  /**
   * Send reminders for upcoming appointments
   * @param {Array} appointments - List of appointments to send reminders for
   */
  async sendAppointmentReminders(appointments) {
    for (const appointment of appointments) {
      try {
        console.log(`Processing reminder for appointment ID ${appointment.id}: "${appointment.title}"`);
        
        // Get all participant emails including the creator
        const participants = appointment.participants || [];
        
        // Get emails from participants (handle multiple formats)
        const participantEmails = [];
        
        // Detailed logging of participant data
        console.log(`Raw participants data:`, JSON.stringify(participants, null, 2));
        
        // Process participants in different possible formats
        participants.forEach((p, index) => {
          console.log(`Processing participant ${index}:`, p);
          
          // Case 1: Direct email string
          if (typeof p === "string" && p.includes("@")) {
            participantEmails.push(p);
            console.log(`- Found direct email: ${p}`);
          } 
          // Case 2: Object with email property
          else if (typeof p === "object" && p !== null) {
            console.log(`- Processing object:`, p);
            
            // Direct email property
            if (p.email && typeof p.email === "string" && p.email.includes("@")) {
              participantEmails.push(p.email);
              console.log(`  - Found email property: ${p.email}`);
            }
            // Nested email in a 'user' or 'participant' property
            else if (p.user && typeof p.user === "object" && p.user.email) {
              participantEmails.push(p.user.email);
              console.log(`  - Found nested email in user: ${p.user.email}`);
            }
            else if (p.participant && typeof p.participant === "object" && p.participant.email) {
              participantEmails.push(p.participant.email);
              console.log(`  - Found nested email in participant: ${p.participant.email}`);
            }
            // Try to access all properties to find an email
            else {
              console.log(`  - Scanning all properties for email`);
              Object.keys(p).forEach(key => {
                if (typeof p[key] === "string" && p[key].includes("@")) {
                  participantEmails.push(p[key]);
                  console.log(`  - Found email in property ${key}: ${p[key]}`);
                }
              });
            }
          }
        });
        
        console.log(`Found ${participantEmails.length} participant emails: ${participantEmails.join(', ')}`);

        // Add the creator's email if not already in the list
        if (appointment.creator_email && !participantEmails.includes(appointment.creator_email)) {
          participantEmails.push(appointment.creator_email);
          console.log(`Added creator email: ${appointment.creator_email}`);
        }

        // Skip if no participants to send reminders to
        if (participantEmails.length === 0) {
          console.log(`Skipping reminder for appointment ${appointment.id}: No participants`);
          continue;
        }

        // Send the reminder email
        await emailService.sendAppointmentReminder(appointment, participantEmails);

        // Mark the appointment as having been sent a reminder
        await this.pool.query(
          "UPDATE appointments SET reminder_sent = true WHERE id = $1",
          [appointment.id]
        );

        console.log(`✅ Reminder sent for appointment ${appointment.id}: "${appointment.title}"`);
      } catch (error) {
        console.error(`Error sending reminder for appointment ${appointment.id}:`, error);
      }
    }
  }

  /**
   * Stop all scheduler jobs
   */
  shutdown() {
    console.log("Shutting down scheduler");
    this.jobs.forEach(job => job.stop());
    this.jobs = [];
    this.initialized = false;
  }
}

// Export a singleton instance
module.exports = new Scheduler();
