const { Server } = require("socket.io");
const Groq = require("groq-sdk");
require("dotenv").config();
const SystemPrompt = require('./models/SystemPrompt.model');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const initSocket = (httpServer) => {
  const getAllowedOrigins = () => {
    const rawAllowed = process.env.CLIENT_URL || 'http://localhost:5173';
    return rawAllowed
      .split(',')
      .map((url) => url.trim().replace(/\/+$/, ''))
      .filter(Boolean);
  };

  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/+$/, '');
        const allowed = getAllowedOrigins();

        if (
          allowed.includes(normalized) ||
          /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized) ||
          /^https:\/\/[a-zA-Z0-9-]+\.onrender\.com$/.test(normalized)
        ) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Listen for live interview responses
    socket.on("live_answer", async ({ questionText, answerText, expectedKeywords }) => {
      try {
        let systemPromptText = `Act as an AI interviewer. The candidate just responded to the following question. Provide a brief, conversational, and direct 1-3 sentence follow-up or acknowledgment based ONLY on their answer. Do not return JSON. Just speak as an interviewer naturally.`;
        try {
          const doc = await SystemPrompt.findOne({ category: 'interview' });
          if (doc) systemPromptText = doc.content;
        } catch (e) { /* ignore fallback */ }

        const prompt = `${systemPromptText}

Question: ${questionText}
Expected Keywords: ${expectedKeywords?.join(', ') || 'None'}
Candidate Answer: ${answerText || '(silence)'}`;

        const stream = await groq.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          max_tokens: 150,
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            socket.emit("ai_chunk", content);
          }
        }
        
        // Let the client know the AI finished speaking
        socket.emit("ai_complete");
      } catch (error) {
        console.error("Socket Groq Error:", error);
        socket.emit("ai_error", "Failed to get AI response.");
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSocket;
