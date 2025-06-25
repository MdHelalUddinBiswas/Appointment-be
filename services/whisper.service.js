const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const transcribeAudio = async (audioFilePath) => {
  try {
    console.log('Transcribing audio file:', audioFilePath);
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-1",
      language: "en", // Optional: specify language
      response_format: "json",
      temperature: 0,
    });

    console.log('Transcription result:', transcription.text);
    return transcription.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
};

const cleanupAudioFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Cleaned up audio file:', filePath);
    }
  } catch (error) {
    console.error('Error cleaning up audio file:', error);
  }
};

module.exports = {
  transcribeAudio,
  cleanupAudioFile,
};