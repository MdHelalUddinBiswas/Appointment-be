const { processChat } = require('../services/openai.service');
const { getVectorStoreInstance } = require('../services/vectorStore.service');

// Handle chat requests
const handleChatRequest = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check if vector store is initialized
    const pgvectorStore = getVectorStoreInstance();
    if (!pgvectorStore) {
      return res.status(503).json({
        error:
          "AI service is still initializing. Please try again in a moment.",
      });
    }

    const result = await processChat(message);
    
    res.json(result);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleChatRequest
};
