import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./LessonsPage.css";
import spanishIcon from "../../assets/spanish.png";
import frenchIcon from "../../assets/french.jpg";
import italianIcon from "../../assets/italian.jpg";
import { Circles } from "react-loader-spinner";
import ReactConfetti from "react-confetti";
import { QuizContext } from "../../context/QuizContext";

const LessonsPage = () => {
  const navigate = useNavigate();
  const { scores} = useContext(QuizContext);
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
  const [selectedLevel, setSelectedLevel] = useState("Beginner Basics");
  const [darkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed] = useState(false);
  const [showConfetti] = useState(false);

  console.log("Scores in LessonsPage:", scores);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setSelectedLevel("Beginner Basics");
  };


  const handleStartQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/quiz/${selectedLanguage.toLowerCase()}/${selectedLevel.toLowerCase().replace(" ", "-")}`);
    }, 2000);
  };

  const levels = ["Beginner Basics", "Intermediate Grammar", "Advanced Conversation"];

  const currentScore = scores?.[selectedLanguage]?.[selectedLevel] ?? 0;

  return (
      <div className={`lessonsContainer ${darkMode ? "dark" : ""}`}>
        <header className="lessonsHeader">
          <h1>Lessons & Quizzes</h1>
          <p>Select a language and level to start practicing!</p>
        </header>
        <div className="languageNav">
          <div className="languageCarousel">
            <div className="languageTile" onClick={() => handleLanguageChange("Spanish")}>
              <img src={spanishIcon} alt="Spanish" />
              <p>Spanish</p>
            </div>
            <div className="languageTile" onClick={() => handleLanguageChange("French")}>
              <img src={frenchIcon} alt="French" />
              <p>French</p>
            </div>
            <div className="languageTile" onClick={() => handleLanguageChange("Italian")}>
              <img src={italianIcon} alt="Italian" />
              <p>Italian</p>
            </div>
          </div>
          <div className="lessonList">
            <h2>{selectedLanguage} Quizzes</h2>
            <ul>
              {levels.map((level) => (
                <li
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={selectedLevel === level ? "active" : ""}
                >
                  {level} - Score: {scores?.[selectedLanguage]?.[level] ?? 0}%
                </li>
              ))}
            </ul>
            <div className="progressContainer">
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{ width: `${currentScore}%` }}
                ></div>
              </div>
              <span className="progressText">
                {currentScore}% Completed
              </span>
            </div>
            <div className="progressContainer">
              <span className="progressText">
                {`${levels.filter((level) => scores?.[selectedLanguage]?.[level] >= 100).length}/${levels.length}`} Levels Completed
              </span>
            </div>
            {completed && <div className="completionBadge">✔️ Quiz Completed!</div>}
            <button className="startLessonBtn" onClick={handleStartQuiz}>
              {loading ? <Circles color="#4682B4" height={30} width={30} /> : "Start Quiz"}
            </button>
          </div>
        </div>
        {showConfetti && <ReactConfetti />}
      </div>
  );
};

export default LessonsPage;