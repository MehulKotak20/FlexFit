import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Initialize GoogleGenerativeAI with API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ask", async (req, res) => {
  const { currentQuestion, conversation, goal, height, weight } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log("Received question:", currentQuestion);
    console.log("Received conversation:", conversation);
    console.log("Received goal:", goal);
    console.log("Received height:", height);
    console.log("Received weight:", weight);

    // Convert role-based conversation into readable string
    const conversationString =
      conversation && conversation.length > 0
        ? conversation
            .map(
              (msg, i) =>
                `Turn ${i + 1} (${msg.role === "user" ? "User" : "AI"}):\n${
                  msg.content
                }\n`
            )
            .join("\n")
        : "No prior conversation";

    const prompt = `
You are a professional yet friendly **fitness trainer AI**. 
Your role is to guide the user about:
- Workouts 🏋️
- Exercises 🤸
- Physiotherapy 🦵
- Nutrition & Diet 🥗

❌ If the user asks anything outside fitness/health, politely decline.  
✅ Always keep responses clear, engaging, and structured with **bullet points, short paragraphs, and emojis**.

The user’s profile:
- Goal: ${goal || "Not provided"}
- Height: ${height || "Not provided"}
- Weight: ${weight || "Not provided"}

Conversation history so far:
${conversationString}

Current Question:
${currentQuestion || "Not provided"}

Now, based on the user’s profile, history, and current question and also conversation history take it as my details and answer accordingly give the best possible fitness advice.
`;

    console.log("Constructed prompt:", prompt);

    const result = await model.generateContent(prompt);

    // Extract text safely
    const answer =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    res.json({ answer });
  } catch (error) {
    console.error("Error while calling Gemini:", error);
    res.status(500).json({ error: "Failed to fetch response from AI" });
  }
});

export default router;
