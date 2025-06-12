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

// Helper function to format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Create prompt template for answering questions about appointments
const template = `You are a helpful assistant for the MeetNing Appointment AI system. 
Today's date is ${formatDate(new Date())}.

Using ONLY the following context, answer the question about appointments, schedules, and meetings. Format your response in a clear and organized way. Include all relevant details about appointments that match the query.

Context:
{context}

Question: {question}

Answer: `;

const prompt = PromptTemplate.fromTemplate(template);
const outputParser = new StringOutputParser();

// Create chain for generating responses
const createChatChain = (userContext) => {
  const pgvectorStore = getVectorStoreInstance();

  return RunnableSequence.from([
    {
      context: async (input) => {
        // input can be an object: { message, userId, userEmail }
        const query = typeof input === 'object' && input.message ? input.message : input;
        const userId = typeof input === 'object' && input.userId ? input.userId : (userContext?.userId || null);
        const userEmail = typeof input === 'object' && input.userEmail ? input.userEmail : (userContext?.userEmail || null);

        const docs = await pgvectorStore.similaritySearch(query, 10);
        console.log("Search input:", query);
        console.log("Found documents:", docs.length);

        // Filter docs by user_id or participants
        const filteredDocs = docs.filter(doc => {
          const isOwner = doc.metadata?.user_id === userId;
          const isParticipant = Array.isArray(doc.metadata?.participants) &&
            doc.metadata.participants.some(
              p => (typeof p === "string" ? p : p?.email) === userEmail
            );
          return isOwner || isParticipant;
        });

        return filteredDocs
          .map(
            (doc) =>
              `[Appointment: ${doc.metadata.title || "Untitled"}] ${
                doc.pageContent
              } - Start: ${doc.metadata.start_time || "Unknown"} - End: ${
                doc.metadata.end_time || "Unknown"}
              } - Status: ${doc.metadata.status || "Unknown"} - Participants: ${
                doc.metadata.participants_count || "0"}
              }
              - participants: ${
                Array.isArray(doc.metadata?.participants)
                  ? doc.metadata.participants.map((p) => typeof p === "string" ? p : p?.email).join(", ")
                  : "Unknown"
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
const processChat = async (message, userContext = {}) => {
  const lowerCaseMessage = message.toLowerCase().trim();
  const greetings = ["hi", "hello", "hey"];
  if (greetings.includes(lowerCaseMessage)) {
    return {
      response: "Hello! How can I help you with your appointments today?",
      hasDocuments: true,
    };
  }

  const pgvectorStore = getVectorStoreInstance();
  const userId = userContext.userId;
  const userEmail = userContext.userEmail;

  // First check if we have any documents for this user (as owner or participant)
  const docs = await pgvectorStore.similaritySearch(message, 5);
  const filteredDocs = docs.filter(doc => {
    const isOwner = doc.metadata?.user_id === userId;
    const isParticipant = Array.isArray(doc.metadata?.participants) &&
      doc.metadata.participants.some(
        p => (typeof p === "string" ? p : p?.email) === userEmail
      );
    return isOwner || isParticipant;
  });

  if (!filteredDocs || filteredDocs.length === 0) {
    return {
      response:
        "I don't have any information about your appointments yet. Please add your appointment data first.",
      hasDocuments: false,
    };
  }

  // Pass user context to the chain for further filtering
  const chain = createChatChain(userContext);
  const result = await chain.invoke({ message, ...userContext });

  return {
    response: result.trim(),
    hasDocuments: true,
  };
};

module.exports = {
  processChat,
};
