const nodemailer = require('nodemailer');
require('dotenv').config();

// Create Nodemailer transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn("EMAIL_USER or EMAIL_PASSWORD not configured.");
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
};

// Send OTP email for account verification
const sendOTPEmail = async (email, otp, name) => {
  try {
    // Log the OTP for debugging purposes
    console.log("\n\n==================================================");
    console.log(`🔐 OTP CODE FOR ${email}: ${otp}`);
    console.log("==================================================\n\n");

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn("EMAIL_USER or EMAIL_PASSWORD not configured. OTP email not sent.");
      return true; // Continue the flow even if email is not sent
    }

    const transporter = createTransporter();
    if (!transporter) {
      return true; // Continue the flow even if transporter creation fails
    }

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("❌ SMTP connection verification failed:", verifyError);
      // Continue anyway to see the specific sending error
    }

    // Create email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
            }
            .container {
              padding: 20px;
              border: 1px solid #e0e0e0;
              border-radius: 5px;
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #e0e0e0;
            }
            .content {
              padding: 20px 0;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              text-align: center;
              letter-spacing: 5px;
              margin: 30px 0;
              color: #4a6cf7;
            }
            .footer {
              font-size: 12px;
              color: #888;
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Verify Your Email Address</h2>
            </div>
            <div class="content">
              <p>Hello ${name || "there"},</p>
              <p>Thank you for signing up for MeetNing. To complete your registration, please enter the following verification code in the app:</p>
              <div class="otp-code">${otp}</div>
              <p>This code will expire in 15 minutes.</p>
              <p>If you didn't request this code, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} MeetNing. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Add plain text version for better deliverability
    const textContent = `
      Verify Your Email Address
      
      Hello ${name || "there"},
      
      Thank you for signing up for MeetNing. To complete your registration, please enter the following verification code:
      
      ${otp}
      
      This code will expire in 15 minutes.
      
      If you didn't request this code, you can safely ignore this email.
      
      © ${new Date().getFullYear()} MeetNing. All rights reserved.
    `;

    // Send email using Nodemailer
    const mailOptions = {
      from: `"MeetNing" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - MeetNing",
      html: htmlContent,
      text: textContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    // Return true anyway to not block the signup flow
    return true;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetUrl, name) => {
  try {
    // Log the reset URL for debugging purposes
    console.log("\n\n==================================================");
    console.log(`🔗 PASSWORD RESET URL FOR ${email}: ${resetUrl}`);
    console.log("==================================================\n\n");

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn("Email credentials not configured. Password reset email not sent.");
      return;
    }

    const transporter = createTransporter();
    if (!transporter) {
      return; // Exit if transporter creation fails
    }

    // Format the user's name or use a default if not provided
    const userName = name || "User";

    // Create email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a5568;">MeetNing Password Reset</h2>
        <p>Hello ${userName},</p>
        <p>You recently requested to reset your password for your MeetNing account. Use the button below to reset it.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Your Password</a>
        </div>
        <p>This password reset link is only valid for the next 60 minutes.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>Thanks,<br>The MeetNing Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096;">
          <p>If you're having trouble with the button above, copy and paste the URL below into your web browser:</p>
          <p>${resetUrl}</p>
        </div>
      </div>
    `;

    const textContent = `
      MeetNing Password Reset
      
      Hello ${userName},
      
      You recently requested to reset your password for your MeetNing account. 
      
      Please go to this link to reset your password: ${resetUrl}
      
      This password reset link is only valid for the next 60 minutes.
      
      If you did not request a password reset, please ignore this email or contact support if you have questions.
      
      Thanks,
      The MeetNing Team
    `;

    // Send email using Nodemailer
    const mailOptions = {
      from: `"MeetNing" <${process.env.EMAIL_USER}>`,
      to: email.toLowerCase(),
      subject: "Reset Your MeetNing Password",
      html: htmlContent,
      text: textContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail
};
