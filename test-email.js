const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email configuration
async function testEmailConfig() {
  console.log('\n----- EMAIL CONFIGURATION TEST -----');
  
  // Check if email credentials exist
  if (!process.env.EMAIL_USER) {
    console.error('❌ EMAIL_USER environment variable is not set');
  } else {
    console.log('✅ EMAIL_USER is configured:', process.env.EMAIL_USER);
  }
  
  if (!process.env.EMAIL_PASSWORD) {
    console.error('❌ EMAIL_PASSWORD environment variable is not set');
  } else {
    console.log('✅ EMAIL_PASSWORD is configured (value hidden)');
  }
  
  // Create transporter
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    
    // Verify SMTP connection
    console.log('Attempting to verify SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
    // Return success
    console.log('\nEmail configuration test passed successfully!');
    console.log('--------------------------------------');
  } catch (error) {
    console.error('❌ Error creating email transporter:', error);
    console.log('--------------------------------------');
  }
}

// Run the test
testEmailConfig();
