// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./db.js";
// import authRoutes from "./routes/auth.js";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json({ limit: "200mb" }));
// app.use(express.urlencoded({ extended: true }));

// app.use("/api", authRoutes);

// const PORT = process.env.PORT || 8000;

// connectDB()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to start server due to MongoDB connection error:", error);
//     process.exit(1);
//   });



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { SpeechClient } from "@google-cloud/speech";
import { OpenAI } from "openai";
import textToSpeech from "@google-cloud/text-to-speech";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "./db.js";
import User from "./models/user.model.js";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import bodyParser from "body-parser";
import fs from "fs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token received:", token);
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

app.get("/api/verify-token", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    console.log("User found:", user);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { name: user.name } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Received signup request:", req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token, message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Load STT and TTS credentials separately
const sttCreds = JSON.parse(fs.readFileSync("./stt-key.json", "utf-8"));
const ttsCreds = JSON.parse(fs.readFileSync("./tts-key.json", "utf-8"));

// ✅ Initialize clients with separate credentials
const speechClient = new SpeechClient({ credentials: sttCreds });
const ttsClient = new TextToSpeechClient({ credentials: ttsCreds });
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🎤 POST: Voice input → Text → Chatbot → Voice output
app.post("/api/speech-to-text-chatbot", async (req, res) => {
  try {
    const { audioData, language } = req.body;

    const [sttResponse] = await speechClient.recognize({
      audio: { content: audioData },
      config: {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode: language || "en-US",
      },
    });

    const transcript = sttResponse.results
      .map(result => result.alternatives[0].transcript)
      .join("\n");

    if (!transcript) {
      return res.status(400).json({ error: "No transcript generated" });
    }

    const chatResponse = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful language learning chatbot." },
        { role: "user", content: transcript },
      ],
    });

    const chatbotReply = chatResponse.choices[0].message.content;

    const [ttsResponse] = await ttsClient.synthesizeSpeech({
      input: { text: chatbotReply },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    });

    const audioContent = ttsResponse.audioContent.toString("base64");

    res.json({ transcript, chatbotReply, audioContent });
  } catch (error) {
    console.error("Speech/Chatbot/TTS error:", error.message);
    res.status(500).json({ error: "Processing failed", details: error.message });
  }
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server due to MongoDB connection error:", error);
    process.exit(1);
  });