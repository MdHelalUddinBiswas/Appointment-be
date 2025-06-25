const multer = require('multer');
const path = require('path');
const { processChat } = require('../services/openai.service');
const { getVectorStoreInstance } = require('../services/vectorStore.service');
const { transcribeAudio, cleanupAudioFile } = require('../services/whisper.service');

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/audio';
    // Create directory if it doesn't exist
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `audio-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
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
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit (Whisper's max)
  }
});

// Handle text chat requests
const handleChatRequest = async (req, res) => {
  try {
    const { message } = req?.body;
    const userId = req.user?.id;
    const userEmail = req.user?.email;

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

    const result = await processChat(message, { userId, userEmail });
    
    res.json(result);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Handle audio chat requests
const handleAudioChatRequest = async (req, res) => {
  console.log('Received audio file:', req.file);
  let audioFilePath = null;
  
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    audioFilePath = req.file.path;
    console.log('Received audio file:', audioFilePath);

    // Check if vector store is initialized
    const pgvectorStore = getVectorStoreInstance();
    if (!pgvectorStore) {
      return res.status(503).json({
        error: "AI service is still initializing. Please try again in a moment.",
      });
    }

    // Transcribe audio to text
    const transcribedText = await transcribeAudio(audioFilePath);
    
    if (!transcribedText || transcribedText.trim() === '') {
      return res.status(400).json({ 
        error: "Could not transcribe audio. Please try speaking more clearly." 
      });
    }

    // Process the transcribed text through your existing chat logic
    const result = await processChat(transcribedText, { userId, userEmail });
    
    // Return both transcription and chat response
    res.json({
      ...result,
      transcription: transcribedText,
    });

  } catch (error) {
    console.error("Audio chat error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    // Clean up uploaded audio file
    if (audioFilePath) {
      cleanupAudioFile(audioFilePath);
    }
  }
};

module.exports = {
  handleChatRequest,
  handleAudioChatRequest,
  uploadAudio: upload.single('audio'),
};