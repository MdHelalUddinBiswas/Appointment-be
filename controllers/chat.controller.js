const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { processChat } = require('../services/openai.service');
const { getVectorStoreInstance } = require('../services/vectorStore.service');
const { transcribeAudio, cleanupAudioFile } = require('../services/whisper.service');

// Function to ensure directory exists with proper error handling
const ensureDirectoryExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error);
    return false;
  }
};

// Function to get upload directory based on environment
const getUploadDirectory = () => {
  // For production, use system temp directory
  if (process.env.NODE_ENV === 'production') {
    const tempDir = path.join(os.tmpdir(), 'audio-uploads');
    if (ensureDirectoryExists(tempDir)) {
      return tempDir;
    }
  }
  
  // For development, use local uploads directory
  const localDir = path.join(process.cwd(), 'uploads', 'audio');
  if (ensureDirectoryExists(localDir)) {
    return localDir;
  }
  
  // Fallback to system temp directory
  return os.tmpdir();
};

// Configure multer for audio file uploads with better error handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadDir = getUploadDirectory();
      cb(null, uploadDir);
    } catch (error) {
      console.error('Error setting upload destination:', error);
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      // Generate unique filename with timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `audio-${uniqueSuffix}${path.extname(file.originalname)}`;
      cb(null, filename);
    } catch (error) {
      console.error('Error generating filename:', error);
      cb(error, null);
    }
  }
});

const fileFilter = (req, file, cb) => {
  try {
    // Accept audio files
    const allowedMimes = [
      'audio/wav',
      'audio/mpeg',
      'audio/mp3',
      'audio/mp4',
      'audio/m4a',
      'audio/webm',
      'audio/ogg'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'), false);
    }
  } catch (error) {
    console.error('Error in file filter:', error);
    cb(error, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit (Whisper's max)
  },
  onError: (err, next) => {
    console.error('Multer error:', err);
    next(err);
  }
});

// Handle text chat requests
const handleChatRequest = async (req, res) => {
  try {
    const userTimezone = req?.body?.userTimezone;
    const { message } = req?.body;
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    console.log(req.body.userTimezone);
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    

    // Check if vector store is initialized
    const pgvectorStore = getVectorStoreInstance();
    if (!pgvectorStore) {
      return res.status(503).json({
        error: "AI service is still initializing. Please try again in a moment.",
      });
    }

    const result = await processChat(message, { userId, userEmail, userTimezone });
    
    res.json(result);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ 
      error: process.env.NODE_ENV === 'production' 
        ? "An error occurred while processing your request." 
        : error.message 
    });
  }
};

// Handle audio chat requests with improved error handling
const handleAudioChatRequest = async (req, res) => {
  const userTimezone = req?.body?.userTimezone;
  console.log('Received audio chat request');
  let audioFilePath = null;
  
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    // Check if file was uploaded successfully
    if (!req.file) {
      console.error('No audio file received');
      return res.status(400).json({ error: "Audio file is required" });
    }

    audioFilePath = req.file.path;
    console.log('Audio file path:', audioFilePath);

    // Verify file exists
    if (!fs.existsSync(audioFilePath)) {
      console.error('Audio file does not exist at path:', audioFilePath);
      return res.status(500).json({ error: "Failed to save audio file" });
    }

    // Check if vector store is initialized
    const pgvectorStore = getVectorStoreInstance();
    if (!pgvectorStore) {
      return res.status(503).json({
        error: "AI service is still initializing. Please try again in a moment.",
      });
    }

    // Transcribe audio to text
    console.log('Starting audio transcription...');
    const transcribedText = await transcribeAudio(audioFilePath);
    console.log('Transcription result:', transcribedText);
    
    if (!transcribedText || transcribedText.trim() === '') {
      return res.status(400).json({ 
        error: "Could not transcribe audio. Please try speaking more clearly." 
      });
    }

    // Process the transcribed text through your existing chat logic
    console.log('Processing transcribed text through chat...');
    const result = await processChat(transcribedText, { userId, userEmail, userTimezone });
    
    // Return both transcription and chat response
    res.json({
      ...result,
      transcription: transcribedText,
    });

  } catch (error) {
    console.error("Audio chat error:", error);
    
    // More specific error messages
    let errorMessage = "An error occurred while processing your audio request.";
    
    if (error.message.includes('ENOENT')) {
      errorMessage = "Failed to access audio file. Please try again.";
    } else if (error.message.includes('ENOSPC')) {
      errorMessage = "Server storage full. Please try again later.";
    } else if (error.message.includes('EACCES')) {
      errorMessage = "Permission denied. Please contact support.";
    } else if (process.env.NODE_ENV !== 'production') {
      errorMessage = error.message;
    }
    
    res.status(500).json({ error: errorMessage });
  } finally {
    // Clean up uploaded audio file
    if (audioFilePath) {
      try {
        cleanupAudioFile(audioFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up audio file:', cleanupError);
      }
    }
  }
};

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  console.error('Multer middleware error:', error);
  
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ error: 'File too large. Maximum size is 25MB.' });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ error: 'Too many files uploaded.' });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ error: 'Unexpected file field.' });
      default:
        return res.status(400).json({ error: 'File upload error: ' + error.message });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: 'Invalid file type. Only audio files are allowed.' });
  }
  
  return res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Upload failed. Please try again.' 
      : error.message 
  });
};

module.exports = {
  handleChatRequest,
  handleAudioChatRequest,
  uploadAudio: upload.single('audio'),
  handleMulterError,
};