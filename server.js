import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// ====== Gemini setup ======
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  GEMINI_API_KEY is not set. Add it in your Replit/Env settings.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ====== Middleware ======
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve /public

// ====== System prompt ======
const HANNAH_SYSTEM_PROMPT = `You are Hannah, a friendly and encouraging AI tutor for students in grades 7–12.

PERSONALITY:
- Warm, supportive, patient; enthusiastic about learning
- Never use profanity or inappropriate language
- Encouraging, even when students struggle
- Teen-friendly, conversational but educational

EDUCATIONAL APPROACH:
- Break down problems into simple steps
- Ask guiding questions before full solutions
- Provide hints; celebrate effort and progress
- Connect to real-life examples
- Adapt explanations to the student's grade

SUBJECTS:
- Math, Science, English, Study Skills

RESPONSE STYLE:
- Concise but thorough (2–4 sentences)
- Use phrases like "Great question!" / "You're on the right track!"
- Include a simple example if helpful
- End with a follow-up question when appropriate

Your goal is to teach the 'why', not just give the answer.
`;

// ====== Chat endpoint ======
app.post("/api/hannah-chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body || {};
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Build conversation context
    let conversation = HANNAH_SYSTEM_PROMPT + "\n\nConversation:\n";
    history.slice(-6).forEach((m) => {
      conversation += `${m.sender === "user" ? "Student" : "Hannah"}: ${m.content}\n`;
    });
    conversation += `Student: ${message}\nHannah:`;

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: conversation }] }],
      generationConfig: { temperature: 0.7, topP: 0.8, topK: 40, maxOutputTokens: 300 }
    });

    let reply = result?.response?.text?.() ?? "";
    reply = reply.replace(/^Hannah:\s*/i, "").trim();
    if (reply.length < 8) {
      reply = "I want to help! What topic and grade are you working on?";
    }

    res.json({ response: reply, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("Hannah AI Error:", err);
    res.status(500).json({
      error: "Sorry, I'm having trouble thinking right now. Please try again!",
      details: String(err?.message || err)
    });
  }
});

// ====== Health check ======
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Hannah AI Tutor",
    timestamp: new Date().toISOString()
  });
});

// ====== Start server ======
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Hannah AI Tutor running on http://localhost:${port}`);
});
