const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Chat routes
router.post('/', authenticateToken, chatController.handleChatRequest);

module.exports = router;
