const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const {
  RunnableSequence,
  RunnablePassthrough,
} = require("@langchain/core/runnables");
const { getVectorStoreInstance } = require("./vectorStore.service");
require("dotenv").config();

// Initialize OpenAI chat model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
});

// Create prompt template for answering questions about appointments
const template = `You are a helpful assistant for the MeetNing Appointment AI system. Using ONLY the following context, answer the question about appointments, schedules, and meetings. Format your response in a clear and organized way. Include all relevant details about appointments that match the query.

Context:
{context}

Question: {question}

Answer: `;

const prompt = PromptTemplate.fromTemplate(template);
const outputParser = new StringOutputParser();

// Create chain for generating responses
const createChatChain = () => {
  const pgvectorStore = getVectorStoreInstance();

  return RunnableSequence.from([
    {
      context: async (input) => {
        const docs = await pgvectorStore.similaritySearch(input, 10);
        console.log("Search input:", input);
        console.log("Found documents:", docs.length);

        return docs
          .map(
            (doc) =>
              `[Appointment: ${doc.metadata.title || "Untitled"}] ${
                doc.pageContent
              } - Start: ${doc.metadata.start_time || "Unknown"} - End: ${
                doc.metadata.end_time || "Unknown"
              } - Status: ${doc.metadata.status || "Unknown"} - Participants: ${
                doc.metadata.participants_count || "0"
              }
              - participants: ${
                doc.metadata?.participants.map((p) => p?.email).join(", ") ||
                "Unknown"
              }`
          )
          .join("\n");
      },
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    outputParser,
  ]);
};

// Function to process chat queries
const processChat = async (message) => {
  const pgvectorStore = getVectorStoreInstance();

  // First check if we have any documents
  const docs = await pgvectorStore.similaritySearch(message, 5);
  if (!docs || docs.length === 0) {
    return {
      response:
        "I don't have any information about your appointments yet. Please add your appointment data first.",
      hasDocuments: false,
    };
  }

  const chain = createChatChain();
  const result = await chain.invoke(message);

  return {
    response: result.trim(),
    hasDocuments: true,
  };
};

module.exports = {
  processChat,
};
