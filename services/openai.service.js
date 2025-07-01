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

// Helper function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Helper function to get date range based on query
const getDateFilter = (query) => {
  const lowerQuery = query.toLowerCase();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (lowerQuery.includes("today")) {
    return { type: "today", date: today };
  } else if (lowerQuery.includes("tomorrow")) {
    return { type: "tomorrow", date: tomorrow };
  } else if (lowerQuery.includes("this week")) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return { type: "week", start: weekStart, end: weekEnd };
  }
  return null;
};

// Get user's timezone from context
const currentUserTimezone = (userContext) => {
  return userContext?.userTimezone || "GMT";
};

const getPromptTemplate = (userContext = {}) => {
  const timezone = currentUserTimezone(userContext);
  return `You are a helpful assistant for the MeetNing Appointment AI system.

**Current Date & Time Information:**
- Current date: ${new Date().toLocaleDateString()}
- Current date and time: ${new Date().toLocaleString()}
- User's timezone: ${timezone}

You have access to the user's personal appointment data below, but you can also use your general knowledge to provide comprehensive answers about appointments, scheduling, time management, and related topics.

**IMPORTANT TIMEZONE HANDLING:**
- All times should be displayed in start time and end time convert to user's timezone: ${timezone} 
- When showing appointment times, always include the timezone for clarity
- When answering questions about "today", "tomorrow", or specific time periods, use the user's timezone to determine what constitutes "today" or "tomorrow"

**Response Guidelines:**
1. If the question is about the user's specific appointments for a particular day/time, filter and show ONLY those appointments
2. If no appointments match the requested timeframe, clearly state that
3. If the question needs general advice or information, use your knowledge
4. If both are relevant, combine personal data with general guidance
5. Format your response using GitHub-flavored markdown with headings, lists, and bold text
6. Always provide the current date/time context when relevant
7. Be precise about timing and always mention the timezone when displaying times

Personal Appointment Context:
{context}

Question: {question}

Answer: `;
};

const getPrompt = (userContext = {}) => {
  return PromptTemplate.fromTemplate(getPromptTemplate(userContext));
};
const outputParser = new StringOutputParser();

// Create chain for generating responses with proper date filtering
const createChatChain = (userContext = {}) => {
  const pgvectorStore = getVectorStoreInstance();
  const prompt = getPrompt(userContext);

  return RunnableSequence.from([
    {
      context: async (input) => {
        // input can be an object: { message, userId, userEmail }
        const query =
          typeof input === "object" && input.message ? input.message : input;
        const userId =
          typeof input === "object" && input.userId
            ? input.userId
            : userContext?.userId || null;
        const userEmail =
          typeof input === "object" && input.userEmail
            ? input.userEmail
            : userContext?.userEmail || null;

        // Try to get relevant appointment data
        try {
          const docs = await pgvectorStore.similaritySearch(query, 10);
          console.log("Search input:", query);

          // Filter docs by user_id or participants
          let filteredDocs = docs.filter((doc) => {
            const isOwner = doc.metadata?.user_id === userId;
            const isParticipant =
              Array.isArray(doc.metadata?.participants) &&
              doc.metadata.participants.some(
                (p) => (typeof p === "string" ? p : p?.email) === userEmail
              );
            return isOwner || isParticipant;
          });

          // Apply date filtering based on query
          const dateFilter = getDateFilter(query);
          if (dateFilter) {
            filteredDocs = filteredDocs.filter((doc) => {
              if (!doc.metadata?.start_time) return false;

              const appointmentDate = new Date(doc.metadata.start_time);

              switch (dateFilter.type) {
                case "today":
                  return isSameDay(appointmentDate, dateFilter.date);
                case "tomorrow":
                  return isSameDay(appointmentDate, dateFilter.date);
                case "week":
                  return (
                    appointmentDate >= dateFilter.start &&
                    appointmentDate <= dateFilter.end
                  );
                default:
                  return true;
              }
            });
          }

          // Sort by start time
          filteredDocs.sort((a, b) => {
            const dateA = new Date(a.metadata?.start_time || 0);
            const dateB = new Date(b.metadata?.start_time || 0);
            return dateA - dateB;
          });

          if (filteredDocs.length === 0) {
            const timeContext = dateFilter ? ` for ${dateFilter.type}` : "";
            return `No personal appointment data found${timeContext}.`;
          }

          return filteredDocs
            .map((doc) => {
              const startTime = doc.metadata.start_time
                ? new Date(doc.metadata.start_time).toLocaleString()
                : "Unknown";
              const endTime = doc.metadata.end_time
                ? new Date(doc.metadata.end_time).toLocaleString()
                : "Unknown";

              return `[Appointment: ${doc.metadata.title || "Untitled"}] ${
                doc.pageContent
              } - Start: ${startTime} - End: ${endTime} - Status: ${
                doc.metadata.status || "Unknown"
              } - Participants: ${doc.metadata.participants_count || "0"}
                - participants: ${
                  Array.isArray(doc.metadata?.participants)
                    ? doc.metadata.participants
                        .map((p) =>
                          typeof p === "string"
                            ? p
                            : `${p?.name || "Unknown"} <${
                                p?.email || "no-email"
                              }>`
                        )
                        .join(", ")
                    : "Unknown"
                }
                
                `;
            })
            .join("\n");
        } catch (error) {
          console.error("Error retrieving appointment data:", error);
          return "Error retrieving personal appointment data.";
        }
      },
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    outputParser,
  ]);
};

// Enhanced function to process chat queries with proper date handling
const processChat = async (message, userContext = {}) => {
  const lowerCaseMessage = message.toLowerCase().trim();

  // Handle greetings
  const greetings = ["hi", "hello", "hey"];
  if (greetings.includes(lowerCaseMessage)) {
    return {
      response:
        "Hello! I can help you with your personal appointments and provide general advice about scheduling and time management. How can I assist you today?",
      hasDocuments: true,
    };
  }
  const userTimezone = currentUserTimezone(userContext);

  // Always create and use the chain - it will handle both personal data and general knowledge
  const chain = createChatChain(userContext);

  try {
    const result = await chain.invoke({ message, ...userContext });

    return {
      response: result.trim(),
      hasDocuments: true,
    };
  } catch (error) {
    console.error("Error processing chat:", error);
    return {
      response:
        "I apologize, but I encountered an error while processing your request. Please try again.",
      hasDocuments: false,
    };
  }
};

// Enhanced function to determine query type with better date detection
const categorizeQuery = (message) => {
  const appointmentKeywords = [
    "appointment",
    "meeting",
    "schedule",
    "calendar",
    "book",
    "cancel",
    "reschedule",
    "today",
    "tomorrow",
    "this week",
    "next week",
    "my appointments",
    "my meetings",
    "my schedule",
  ];

  const dateKeywords = [
    "today",
    "tomorrow",
    "this week",
    "next week",
    "yesterday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const generalKeywords = [
    "how to",
    "what is",
    "best practices",
    "tips",
    "advice",
    "recommend",
    "suggest",
    "help me understand",
  ];

  const lowerMessage = message.toLowerCase();

  const hasAppointmentKeywords = appointmentKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );

  const hasDateKeywords = dateKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );

  const hasGeneralKeywords = generalKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  );

  if (hasDateKeywords || (hasAppointmentKeywords && !hasGeneralKeywords)) {
    return "appointment-specific";
  } else if (hasGeneralKeywords && !hasAppointmentKeywords) {
    return "general";
  } else {
    return "mixed";
  }
};

module.exports = {
  processChat,
  categorizeQuery,
};
