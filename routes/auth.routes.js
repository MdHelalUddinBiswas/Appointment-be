const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.get('/me', authenticateToken, authController.getUserProfile);
router.put('/update-profile', authenticateToken, authController.updateUserProfile);
router.delete('/delete', authController.deleteUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/update-schema/reset-password', authController.updateSchemaForResetPassword);

// Test OTP email route (for development only)
router.get('/test/send-otp', async (req, res) => {
  try {
    const email = req.query.email || "test@example.com";
    const name = req.query.name || "Test User";
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Log OTP for debugging
    console.log(`Test endpoint: Sending OTP ${otp} to ${email}`);

    // Import email service
    const { sendOTPEmail } = require('../services/email.service');
    await sendOTPEmail(email, otp, name);

    res.json({
      success: true,
      message: `OTP sent to ${email}. Check console for OTP code.`,
      otp: otp, // Showing OTP in response for testing purposes
    });
  } catch (error) {
    console.error("Test OTP sending error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send test OTP email" });
  }
});

module.exports = router;
