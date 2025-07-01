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

  return `You are a helpful AI assistant for the MeetNing Appointment system. You can help with both appointment-related queries and general conversations about scheduling, productivity, and time management.

**Current Date & Time Information:**
- Your current time: ${userCurrentTime}
- Your timezone: ${timezone}

**YOUR CAPABILITIES:**
1. **Personal Appointments**: Access and discuss the user's specific appointment data
2. **General Advice**: Provide scheduling tips, productivity advice, and time management guidance
3. **Casual Conversation**: Engage in friendly, helpful dialogue about various topics
4. **Mixed Queries**: Combine personal appointment data with general knowledge

**TIMEZONE DISPLAY RULES (For Appointments Only):**
- ALWAYS show appointment times in user's timezone: ${timezone}
- ALWAYS include timezone in parentheses: "MMM DD, YYYY at HH:MM AM/PM (${timezone})"
- When comparing times (today, tomorrow), use user's timezone context
- Never show appointment times without timezone indication

**RESPONSE STRATEGY:**
1. **Appointment-Specific Queries** (e.g., "What's my schedule today?", "Do I have meetings tomorrow?"):
   - Show ONLY relevant appointments for the requested timeframe
   - Use proper timezone formatting for all times
   - If no appointments found, clearly state "No appointments found for [timeframe]"

2. **General Questions** (e.g., "How to be more productive?", "Tips for scheduling?"):
   - Provide helpful advice using your general knowledge
   - Don't force appointment data into the response
   - Be conversational and informative

3. **Mixed Queries** (e.g., "I have a busy day, any tips?"):
   - Combine relevant appointment data with helpful advice
   - Use appointment context to provide personalized suggestions

4. **Casual Conversation** (e.g., "Hello", "How are you?"):
   - Be friendly and conversational
   - Offer to help with appointments or general questions
   - Don't unnecessarily mention appointment data

**FORMATTING GUIDELINES:**
- Use GitHub-flavored markdown for structure
- Be concise but thorough
- Match your tone to the user's query (formal for business, casual for general chat)
- Always be helpful and positive

**Example Responses:**

*For appointment query:*
"## Today's Schedule
**Project Review**
- Start: Jul 1, 2025 at 2:00 PM (${timezone})
- End: Jul 1, 2025 at 3:00 PM (${timezone})"

*For general query:*
"Here are some effective time management strategies:
1. Use time-blocking for focused work
2. Set realistic deadlines
3. Take regular breaks to maintain productivity"

*For mixed query:*
"Based on your busy schedule today, here are some tips:
- You have 3 meetings, so plan short breaks between them
- Block time for email responses
- Keep healthy snacks handy for energy"

**Personal Appointment Context:**
{context}

**User Question:** {question}

**Your Response:**`;
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
