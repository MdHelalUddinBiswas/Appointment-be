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

// Enhanced timezone conversion helper
const convertToUserTimezone = (dateString, userTimezone = "GMT") => {
  if (!dateString) return "Unknown";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    // Format with timezone
    const options = {
      timeZone: userTimezone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleString("en-US", options);
    return `${formattedDate} (${userTimezone})`;
  } catch (error) {
    console.error("Error converting timezone:", error);
    return "Time conversion error";
  }
};

// Helper function to check if two dates are the same day in user's timezone
const isSameDay = (date1, date2, userTimezone = "GMT") => {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Convert both dates to user's timezone for comparison
    const options = { timeZone: userTimezone };
    const d1Local = new Date(d1.toLocaleString("en-US", options));
    const d2Local = new Date(d2.toLocaleString("en-US", options));

    return (
      d1Local.getFullYear() === d2Local.getFullYear() &&
      d1Local.getMonth() === d2Local.getMonth() &&
      d1Local.getDate() === d2Local.getDate()
    );
  } catch (error) {
    console.error("Error comparing dates:", error);
    return false;
  }
};

// Enhanced date filter function with timezone awareness
const getDateFilter = (query, userTimezone = "GMT") => {
  const lowerQuery = query.toLowerCase();

  // Get current date in user's timezone
  const now = new Date();
  const userNow = new Date(
    now.toLocaleString("en-US", { timeZone: userTimezone })
  );

  const today = new Date(
    userNow.getFullYear(),
    userNow.getMonth(),
    userNow.getDate()
  );
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (lowerQuery.includes("today")) {
    return { type: "today", date: today, timezone: userTimezone };
  } else if (lowerQuery.includes("tomorrow")) {
    return { type: "tomorrow", date: tomorrow, timezone: userTimezone };
  } else if (lowerQuery.includes("this week")) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return {
      type: "week",
      start: weekStart,
      end: weekEnd,
      timezone: userTimezone,
    };
  }
  return null;
};

// Get user's timezone from context with fallback
const getCurrentUserTimezone = (userContext) => {
  return userContext?.userTimezone || userContext?.timezone || "GMT";
};

// Enhanced prompt template with better timezone handling
const getPromptTemplate = (userContext = {}) => {
  const timezone = getCurrentUserTimezone(userContext);
  const now = new Date();
  const userCurrentTime = convertToUserTimezone(now.toISOString(), timezone);

  return `You are a helpful assistant for the MeetNing Appointment AI system.

**Current Date & Time Information:**
- Your current time: ${userCurrentTime}
- Your timezone: ${timezone}

You have access to the user's personal appointment data below. All appointment times have been converted to the user's timezone (${timezone}) for accurate display.

**CRITICAL TIMEZONE DISPLAY RULES:**
1. ALWAYS show appointment times in the user's timezone: ${timezone}
2. ALWAYS include the timezone abbreviation or name in parentheses after each time
3. Format times as: "MMM DD, YYYY at HH:MM AM/PM (${timezone})"
4. When comparing times (today, tomorrow, etc.), use the user's timezone context
5. Never show times without timezone indication

**Response Guidelines:**
1. If asking about specific timeframes (today, tomorrow, this week), show ONLY matching appointments
2. If no appointments match, clearly state "No appointments found for [timeframe]"
3. Always format appointment times consistently with timezone
4. Use GitHub-flavored markdown for formatting
5. Be precise and clear about timing

**Example Time Format:**
- Start: Jul 1, 2025 at 4:30 AM (${timezone})
- End: Jul 1, 2025 at 5:30 AM (${timezone})

Personal Appointment Context:
{context}

Question: {question}

Answer: `;
};

const getPrompt = (userContext = {}) => {
  return PromptTemplate.fromTemplate(getPromptTemplate(userContext));
};

const outputParser = new StringOutputParser();

// Enhanced context formatter with proper timezone conversion
const formatAppointmentContext = (doc, userTimezone) => {
  const startTime = convertToUserTimezone(
    doc.metadata.start_time,
    userTimezone
  );
  const endTime = convertToUserTimezone(doc.metadata.end_time, userTimezone);

  const participantsList = Array.isArray(doc.metadata?.participants)
    ? doc.metadata.participants
        .map((p) =>
          typeof p === "string"
            ? p
            : `${p?.name || "Unknown"} <${p?.email || "no-email"}>`
        )
        .join(", ")
    : "Unknown";

  return `**${doc.metadata.title || "Untitled Appointment"}**
Description: ${doc.pageContent}
Start Time: ${startTime}
End Time: ${endTime}
Status: ${doc.metadata.status || "Unknown"}
Participants: ${participantsList} (${
    doc.metadata.participants_count || "0"
  } total)
---`;
};

// Create enhanced chain with proper timezone handling
const createChatChain = (userContext = {}) => {
  const pgvectorStore = getVectorStoreInstance();
  const prompt = getPrompt(userContext);
  const userTimezone = getCurrentUserTimezone(userContext);

  return RunnableSequence.from([
    {
      context: async (input) => {
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

        try {
          const docs = await pgvectorStore.similaritySearch(query, 10);
          console.log("Search input:", query);
          console.log("User timezone:", userTimezone);

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

          // Apply date filtering with timezone awareness
          const dateFilter = getDateFilter(query, userTimezone);
          if (dateFilter) {
            filteredDocs = filteredDocs.filter((doc) => {
              if (!doc.metadata?.start_time) return false;

              const appointmentDate = new Date(doc.metadata.start_time);

              switch (dateFilter.type) {
                case "today":
                  return isSameDay(
                    appointmentDate,
                    dateFilter.date,
                    userTimezone
                  );
                case "tomorrow":
                  return isSameDay(
                    appointmentDate,
                    dateFilter.date,
                    userTimezone
                  );
                case "week":
                  // Convert appointment time to user timezone for comparison
                  const appointmentInUserTZ = new Date(
                    appointmentDate.toLocaleString("en-US", {
                      timeZone: userTimezone,
                    })
                  );
                  return (
                    appointmentInUserTZ >= dateFilter.start &&
                    appointmentInUserTZ <= dateFilter.end
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
            return `No personal appointment data found${timeContext} in your timezone (${userTimezone}).`;
          }

          // Format appointments with proper timezone display
          return filteredDocs
            .map((doc) => formatAppointmentContext(doc, userTimezone))
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

// Enhanced chat processing with timezone context
const processChat = async (message, userContext = {}) => {
  const lowerCaseMessage = message.toLowerCase().trim();
  const userTimezone = getCurrentUserTimezone(userContext);

  // Handle greetings with timezone awareness
  const greetings = ["hi", "hello", "hey"];
  if (greetings.includes(lowerCaseMessage)) {
    const currentTime = convertToUserTimezone(
      new Date().toISOString(),
      userTimezone
    );
    return {
      response: `Hello! I can help you with your personal appointments and provide general advice about scheduling and time management. 

Your current time is: ${currentTime}

How can I assist you today?`,
      hasDocuments: true,
    };
  }

  // Create and use the chain
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

// Enhanced query categorization
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
    "what's next",
    "upcoming",
    "when is",
    "time",
    "when do I have",
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
    "morning",
    "afternoon",
    "evening",
    "tonight",
    "later",
    "soon",
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
    "explain",
    "tell me about",
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
  convertToUserTimezone,
  getCurrentUserTimezone,
};
