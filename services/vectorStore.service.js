const { OpenAIEmbeddings } = require("@langchain/openai");
const { PGVectorStore } = require("@langchain/community/vectorstores/pgvector");
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

// Helper function to create vector store
async function getVectorStore(config, embeddings) {
  return await PGVectorStore.initialize(embeddings, {
    postgresConnectionOptions: {
      connectionString: config.connectionString,
    },
    tableName: config.tableName || "embeddings",
    columns: {
      idColumnName: "id",
      vectorColumnName: "embedding",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
  });
}

// Initialize vector store
let pgvectorStore;

const initializeVectorStore = async () => {
  try {
    pgvectorStore = await getVectorStore(
      {
        connectionString: process.env.DATABASE_URL,
        tableName: "embeddings",
      },
      embeddings
    );
    console.log("Vector store initialized successfully");
    return pgvectorStore;
  } catch (error) {
    console.error("Error initializing vector store:", error);
    // Create a mock vector store for fallback
    pgvectorStore = {
      similaritySearch: async () => [],
      addDocuments: async () =>
        console.log("Mock vector store: addDocuments called"),
    };
    return pgvectorStore;
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
