const express = require('express');
const router = express.Router();
const { checkUpcomingAppointments } = require('../services/reminder.service');

/**
 * Cron endpoint for Vercel Cron to trigger appointment reminder checks
 * This endpoint is protected by Vercel's authorization mechanism
 */
router.post('/check-reminders', async (req, res) => {
  try {
    // Verify request is from Vercel Cron (or other authorized source)
    // For additional security, implement a secret token verification here
    
    console.log('Cron job triggered for appointment reminders');
    
    // Execute the reminder check logic
    const result = await checkUpcomingAppointments();
    
    // Return the result
    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    console.error('Error in reminder cron endpoint:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while checking reminders',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
