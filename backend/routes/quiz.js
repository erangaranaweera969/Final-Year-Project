import express from "express";
import Quiz from "../models/Quiz.js";
import Score from "../models/Score.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.get("/:language/:level", async (req, res) => {
  try {
    const { language, level } = req.params;
    const questions = await Quiz.find({ language, level });
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/scores", authenticateToken, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user.userId });
    res.json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/scores", authenticateToken, async (req, res) => {
  try {
    const { language, level, score } = req.body;
    const existingScore = await Score.findOne({
      user: req.user.userId,
      language,
      level,
    });
    if (existingScore) {
      existingScore.score = score;
      await existingScore.save();
    } else {
      const newScore = new Score({
        user: req.user.userId,
        language,
        level,
        score,
      });
      await newScore.save();
    }
    res.json({ message: "Score saved" });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/scores", authenticateToken, async (req, res) => {
  try {
    await Score.deleteMany({ user: req.user.userId });
    res.json({ message: "Scores reset" });
  } catch (error) {
    console.error("Error resetting scores:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;