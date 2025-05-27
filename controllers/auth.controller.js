const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/database');
const { sendOTPEmail, sendPasswordResetEmail } = require('../services/email.service');
require('dotenv').config();

// Store pending users in memory temporarily
const pendingUsers = new Map();

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register a new user
const signup = async (req, res) => {
  console.log("Signup request:", req.body);
  try {
    const { name, email, password, timezone } = req.body;

    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP for email verification
    const otp = generateOTP();
    console.log("\n\nGenerated OTP:", otp, "for email:", email, "\n\n");

    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP valid for 15 minutes

    // Store user data temporarily until OTP verification
    pendingUsers.set(email, {
      name,
      email,
      password: hashedPassword,
      timezone,
      otp,
      otpExpiry,
      createdAt: new Date(),
    });

    console.log(`Stored pending user ${email} with OTP ${otp}`);

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.status(201).json({
      message:
        "Verification code sent to your email. Please verify to complete signup.",
      email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user
const login = async (req, res) => {
  console.log("Login request:", req.body);
  try {
    const { email, password } = req.body;

    // Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(`User ${email} logged in successfully`);

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        timezone: user.timezone,
        isVerified: user.is_verified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Check if this is a pending user from memory
    const pendingUser = pendingUsers.get(email);

    if (pendingUser) {
      console.log(`Found pending user for email: ${email}`);

      // Check if OTP is expired
      const now = new Date();
      if (pendingUser.otpExpiry < now) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      // Check if OTP matches
      if (pendingUser.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // OTP is valid, create the user in the database
      console.log(`OTP verified for ${email}, creating user in database`);

      try {
        // Insert the user into the database with verified status
        const result = await pool.query(
          `INSERT INTO users (name, email, password, timezone, is_verified) 
           VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, timezone`,
          [
            pendingUser.name,
            pendingUser.email,
            pendingUser.password,
            pendingUser.timezone,
            true,
          ]
        );

        // Remove from pending users
        pendingUsers.delete(email);

        console.log(
          `User ${email} successfully created in database with verified status`
        );

        res.status(200).json({
          message: "Email verified successfully. You can now log in.",
          user: {
            email: pendingUser.email,
            name: pendingUser.name,
          },
        });
      } catch (dbError) {
        console.error("Database error creating verified user:", dbError);
        return res.status(500).json({ message: "Error creating user account" });
      }
    } else {
      // Check if user exists in database (for users who were created before this change)
      const userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = userResult.rows[0];

      // Check if OTP is expired
      const now = new Date();
      if (user.otp_expiry && new Date(user.otp_expiry) < now) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      // Check if OTP matches
      if (user.verification_otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Update user verification status
      await pool.query(
        "UPDATE users SET is_verified = true, verification_otp = NULL, otp_expiry = NULL WHERE id = $1",
        [user.id]
      );

      res.status(200).json({ message: "Email verified successfully" });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if this is a pending user from memory
    const pendingUser = pendingUsers.get(email);

    if (pendingUser) {
      console.log(`Resending OTP for pending user: ${email}`);

      // Generate new OTP
      const otp = generateOTP();
      console.log(`New OTP for ${email}: ${otp}`);

      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP valid for 15 minutes

      // Update pending user with new OTP
      pendingUser.otp = otp;
      pendingUser.otpExpiry = otpExpiry;

      // Send OTP email
      await sendOTPEmail(email, otp, pendingUser.name);

      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      // Get user by email from database
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result.rows[0];

      // Generate new OTP
      const otp = generateOTP();
      console.log(`New OTP for ${email}: ${otp}`);

      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP valid for 15 minutes

      // Update user with new OTP
      await pool.query(
        "UPDATE users SET verification_otp = $1, otp_expiry = $2 WHERE id = $3",
        [otp, otpExpiry, user.id]
      );

      // Send OTP email
      await sendOTPEmail(email, otp, user.name);

      res.status(200).json({ message: "OTP sent successfully" });
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error during OTP resend" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, timezone FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, timezone } = req.body;

    // Build update query based on provided fields
    let updateFields = [];
    let queryParams = [req.user.id];
    let paramCounter = 2; // Starting from 2 since $1 is already used

    if (name) {
      updateFields.push(`name = $${paramCounter++}`);
      queryParams.push(name);
    }

    if (timezone) {
      updateFields.push(`timezone = $${paramCounter++}`);
      queryParams.push(timezone);
    }

    // If no fields to update, return error
    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Perform update
    const query = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE id = $1
      RETURNING id, name, email, timezone
    `;

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user account
const deleteUser = async (req, res) => {
  console.log("Delete request body:", req.body);
  try {
    const { userId } = req.body;

    console.log("Deleting appointments for user:", userId);
    await pool.query("DELETE FROM appointments WHERE user_id = $1", [userId]);

    console.log("Deleting user:", userId);
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password - Request password reset
const forgotPassword = async (req, res) => {
  console.log("Forgot password request body:", req.body);
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Check if user exists
    const userQuery = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    const userResult = await pool.query(userQuery);
    if (userResult.rows.length === 0) {
      // Don't reveal that the user doesn't exist for security reasons
      return res.status(200).json({
        success: true,
        message:
          "If your email exists in our system, you will receive a password reset link",
      });
    }

    const user = userResult.rows[0];

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    const updateQuery = {
      text: "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
      values: [resetToken, resetTokenExpiry, user.id],
    };

    await pool.query(updateQuery);

    // Send reset email
    const resetUrl = `${
      process.env.SITE_URL || "http://localhost:3000"
    }/auth/reset-password?token=${resetToken}`;

    console.log(`Generated reset URL: ${resetUrl}`);

    // Use the same email service you're using for OTP
    await sendPasswordResetEmail(email, resetUrl, user.name);

    res.status(200).json({
      success: true,
      message:
        "If your email exists in our system, you will receive a password reset link",
      // Only for development
      resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
    });
  }
};

// Reset Password - Set new password using token
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Token and password are required" });
    }

    // Find user with this reset token
    const userQuery = {
      text: "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2",
      values: [token, new Date()],
    };

    const userResult = await pool.query(userQuery);
    if (userResult.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const user = userResult.rows[0];

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token
    const updateQuery = {
      text: "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
      values: [hashedPassword, user.id],
    };

    await pool.query(updateQuery);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to reset password" });
  }
};

// Update database schema for reset password
const updateSchemaForResetPassword = async (req, res) => {
  try {
    // Add reset_token and reset_token_expiry columns to users table if they don't exist
    await pool.query(
      "DO $$ \n" +
        "BEGIN \n" +
        "  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'reset_token') THEN \n" +
        "    ALTER TABLE users ADD COLUMN reset_token VARCHAR(255); \n" +
        "  END IF; \n" +
        "  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'reset_token_expiry') THEN \n" +
        "    ALTER TABLE users ADD COLUMN reset_token_expiry TIMESTAMP; \n" +
        "  END IF; \n" +
        "END; \n" +
        "$$;"
    );

    res.json({
      success: true,
      message:
        "Database schema updated successfully for reset password functionality",
    });
  } catch (error) {
    console.error("Error updating database schema:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update database schema",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  verifyOTP,
  resendOTP,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  forgotPassword,
  resetPassword,
  updateSchemaForResetPassword
};
