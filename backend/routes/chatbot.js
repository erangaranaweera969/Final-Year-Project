import express from "express";
import { recognizeSpeech } from "../services/speech.js";
import { synthesizeSpeech } from "../services/tts.js";
import { getChatResponse } from "../services/openai.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.post("/speech-to-text-chatbot", authenticateToken, async (req, res) => {
  try {
    const { audioData, language } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: "No audio data provided" });
    }

    const transcript = await recognizeSpeech(audioData, language);
    if (!transcript) {
      return res.status(500).json({ error: "Failed to extract transcript" });
    }

    const chatbotReply = await getChatResponse(transcript);
    const audioBase64 = await synthesizeSpeech(chatbotReply, language);

    res.json({ transcript, chatbotReply, audioBase64 });
  } catch (error) {
    console.error("Speech recognition or chatbot error:", error.message);
    res.status(500).json({ error: "Processing failed", details: error.message });
  }
});

export default router;