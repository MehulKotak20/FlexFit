import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Initialize GoogleGenerativeAI with API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ask", async (req, res) => {
  const { question,height,weight } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a fitness trainer AI. Only answer questions about workouts, exercises, physiotherapy, nutrition, or diet. Decline anything else politely. Format responses well, use bullet points for explanations, and include emojis where relevant.\nUser: ${question}`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text() || "No response from AI.";

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch response from AI" });
  }
});

export default router;
