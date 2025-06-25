const express = require("express");
const router = express.Router();
const {
  uploadAudio,
  handleAudioChatRequest,
} = require("../controllers/chat.controller");
const chatController = require("../controllers/chat.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

// Chat routes
router.post("/", authenticateToken, chatController.handleChatRequest);

// Audio chat route
router.post(
  "/audio",
  authenticateToken,
  uploadAudio,
  handleAudioChatRequest
);

module.exports = router;
