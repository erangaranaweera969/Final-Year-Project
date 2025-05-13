import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const initialScores = {
    Spanish: { "Beginner Basics": 0, "Intermediate Grammar": 0, "Advanced Conversation": 0 },
    French: { "Beginner Basics": 0, "Intermediate Grammar": 0, "Advanced Conversation": 0 },
  };
  
  QuizProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const [scores, setScores] = useState(initialScores);

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem("quizScores");
      if (savedScores) {
        const parsedScores = JSON.parse(savedScores);
        setScores({
          ...initialScores,
          ...parsedScores,
          Spanish: { ...initialScores.Spanish, ...parsedScores.Spanish },
          French: { ...initialScores.French, ...parsedScores.French },
          Italian: { ...initialScores.Italian, ...parsedScores.Italian },
        });
      }
    } catch (error) {
      console.error("Error loading scores from localStorage:", error);
      localStorage.setItem("quizScores", JSON.stringify(initialScores));
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("quizScores", JSON.stringify(scores));
    } catch (error) {
      console.error("Error saving scores to localStorage:", error);
    }
  }, [scores]);

  const updateScore = (language, level, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [language]: {
        ...prevScores[language],
        [level]: score,
      },
    }));
  };

  const resetScores = () => {
    setScores(initialScores);
    localStorage.setItem("quizScores", JSON.stringify(initialScores));
  };

  return (
    <QuizContext.Provider value={{ scores, updateScore, resetScores }}>
      {children}
    </QuizContext.Provider>
  );
};