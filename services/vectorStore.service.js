const { OpenAIEmbeddings } = require("@langchain/openai");
const { PGVectorStore } = require("@langchain/community/vectorstores/pgvector");
const { pool } = require("../config/database");
require("dotenv").config();

// Helper function to get environment variables safely
function getEnvVariable(key, defaultValue = "") {
  const value = process.env[key];
  if (!value && defaultValue === "") {
    console.warn(`Warning: Environment variable ${key} is not set`);
  }
  return value || defaultValue;
}

// Initialize OpenAI embeddings
const OPENAI_API_KEY = getEnvVariable("OPENAI_API_KEY");
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: OPENAI_API_KEY,
  modelName: "text-embedding-ada-002",
  batchSize: 512,
  stripNewLines: true,
});

// Initialize vector store
let pgvectorStore;

const initializeVectorStore = async () => {
  try {
    // Use the existing pool from database.js
    pgvectorStore = new PGVectorStore(embeddings, {
      pool: pool,
      tableName: "embeddings",
      columns: {
        idColumnName: "id",
        vectorColumnName: "embedding",
        contentColumnName: "content",
        metadataColumnName: "metadata",
      },
    });

    console.log("Vector store initialized successfully");
    return pgvectorStore;
  } catch (error) {
    console.error("Error initializing vector store:", error);
    throw error;
  }
};

// Get vector store instance
const getVectorStoreInstance = () => {
  return pgvectorStore;
};

module.exports = {
  initializeVectorStore,
  getVectorStoreInstance,
  embeddings,
};
