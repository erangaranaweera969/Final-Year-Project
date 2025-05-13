import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Quiz.css";
import logo from "../../assets/Logo.png";
import spanishQuiz from "../../data/spanish-quiz.json";
import frenchQuiz from "../../data/french-quiz.json";
import italianQuiz from "../../data/italian-quiz.json";
import ReactConfetti from "react-confetti";
import { QuizContext } from "../../context/QuizContext";

const quizData = {
  spanish: spanishQuiz,
  french: frenchQuiz,
  italian: italianQuiz,
};

const Quiz = () => {
  const navigate = useNavigate();
  const { language, level } = useParams();
  const { updateScore } = useContext(QuizContext);
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState(null);

  let Option1 = useRef(null);
  let Option2 = useRef(null);
  let Option3 = useRef(null);
  let Option4 = useRef(null);
  let option_array = [Option1, Option2, Option3, Option4];

  const levelMap = {
    "beginner-basics": "Beginner Basics",
    "intermediate-grammar": "Intermediate Grammar",
    "advanced-conversation": "Advanced Conversation",
  };

  useEffect(() => {
    if (!quizData[language.toLowerCase()] || !levelMap[level]) {
      setError("Invalid language or level.");
      return;
    }
    try {
      const formattedLevel = levelMap[level];
      const data = quizData[language.toLowerCase()][formattedLevel];
      if (!data || data.length === 0) {
        setError("No questions found for this quiz.");
        return;
      }
      const formattedQuestions = data.map((q) => ({
        question: q.question,
        option1: q.options[0],
        option2: q.options[1],
        option3: q.options[2],
        option4: q.options[3],
        ans: q.options.indexOf(q.correctAnswer) + 1,
      }));
      setQuestions(formattedQuestions);
      setQuestion(formattedQuestions[0]);
      setIndex(0);
      setScore(0);
      setResult(false);
      setLock(false);
      setError(null);
      console.log("Loaded questions:", formattedQuestions);
    } catch (err) {
      console.error("Error loading questions:", err);
      setError("Failed to load quiz questions.");
    }
  }, [language, level]);

  useEffect(() => {
    if (result && questions.length > 0) {
      try {
        const percentage = Math.round((score / questions.length) * 100);
        console.log(`Updating score: ${language} - ${levelMap[level]}: ${percentage}%`);
        updateScore(
          language.charAt(0).toUpperCase() + language.slice(1),
          levelMap[level],
          percentage
        );
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } catch (err) {
        console.error("Error updating score:", err);
        setError("Failed to save score.");
      }
    }
  }, [result]);

  const checkAns = (e, ans) => {
    if (!lock && question) {
      try {
        if (question.ans === ans) {
          e.target.classList.add("correct");
          setScore((prev) => prev + 1);
        } else {
          e.target.classList.add("wrong");
          option_array[question.ans - 1].current.classList.add("correct");
        }
        setLock(true);
        console.log(`Answered question ${index + 1}: Correct=${question.ans === ans}, Score=${score}`);
      } catch (err) {
        console.error("Error checking answer:", err);
        setError("Error processing answer.");
      }
    }
  };

  const next = () => {
    if (!lock || !question) return;
    try {
      if (index >= questions.length - 1) {
        setResult(true);
        console.log("Quiz completed. Final score:", score);
        return;
      }
      setIndex((prev) => prev + 1);
      setQuestion(questions[index + 1]);
      setLock(false);
      option_array.forEach((option) => {
        if (option.current) {
          option.current.classList.remove("wrong", "correct");
        }
      });
      console.log(`Moving to question ${index + 2}`);
    } catch (err) {
      console.error("Error advancing to next question:", err);
      setError("Error advancing to next question.");
    }
  };

  const reset = () => {
    try {
      setIndex(0);
      setQuestion(questions[0]);
      setScore(0);
      setLock(false);
      setResult(false);
      setError(null);
      setShowConfetti(false);
      console.log("Quiz reset");
    } catch (err) {
      console.error("Error resetting quiz:", err);
      setError("Error resetting quiz.");
    }
  };

  const goBack = () => {
    try {
      navigate("/lessons");
      console.log("Navigating back to lessons");
    } catch (err) {
      console.error("Error navigating back:", err);
      setError("Error navigating back.");
    }
  };

  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <img src={logo} alt="Website Logo" className="quiz-logo" />
          <h1 className="quiz-title">Language Master</h1>
        </div>
        <div className="quiz-content">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={goBack}>Back to Lessons</button>
        </div>
      </div>
    );
  }

  if (!question || questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <img src={logo} alt="Website Logo" className="quiz-logo" />
          <h1 className="quiz-title">Language Master</h1>
        </div>
        <div className="quiz-content">
          <h2>Loading...</h2>
          <button onClick={goBack}>Back to Lessons</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {showConfetti && <ReactConfetti numberOfPieces={100} recycle={false} />}
      <div className="quiz-header">
        <img src={logo} alt="Website Logo" className="quiz-logo" />
        <h1 className="quiz-title">Language Master</h1>
      </div>
      <div className="quiz-content">
        <h2>
          {language.charAt(0).toUpperCase() + language.slice(1)} Quiz - {levelMap[level]}
        </h2>
        <hr />
        {result ? (
          <>
            <h2>
              You Scored {score} out of {questions.length} (
              {Math.round((score / questions.length) * 100)}%)
            </h2>
            <button onClick={reset}>Try Again</button>
            <button onClick={goBack}>Back to Lessons</button>
          </>
        ) : (
          <>
            <h2>
              {index + 1}. {question.question}
            </h2>
            <ul>
              <li ref={Option1} onClick={(e) => checkAns(e, 1)}>
                {question.option1}
              </li>
              <li ref={Option2} onClick={(e) => checkAns(e, 2)}>
                {question.option2}
              </li>
              <li ref={Option3} onClick={(e) => checkAns(e, 3)}>
                {question.option3}
              </li>
              <li ref={Option4} onClick={(e) => checkAns(e, 4)}>
                {question.option4}
              </li>
            </ul>
            <button onClick={next} disabled={!lock}>
              Next
            </button>
            <div className="index">
              {index + 1} of {questions.length} questions
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;