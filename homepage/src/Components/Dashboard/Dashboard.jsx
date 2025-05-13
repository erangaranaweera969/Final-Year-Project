import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import profilePic from "../../assets/profile.jpg";
import chatbotIcon from "../../assets/chatbot.jpg";
import { QuizContext } from "../../context/QuizContext";
import { AuthContext } from "../../context/AuthContext";

function Dashboard() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const { scores, resetScores } = useContext(QuizContext);

  const { user } = useContext(AuthContext);

  const languages = ["Spanish", "French", "Italian"];
  const levels = ["Beginner Basics", "Intermediate Grammar", "Advanced Conversation"];
  const totalQuizzes = languages.length * levels.length;
  const completedQuizzes = languages.reduce((count, lang) => {
    return (
      count +
      levels.reduce((acc, level) => (scores[lang][level] > 0 ? acc + 1 : acc), 0)
    );
  }, 0);
  const progressPercent = Math.round((completedQuizzes / totalQuizzes) * 100);

  const challengesCompleted = completedQuizzes;
  const points = languages.reduce(
    (sum, lang) =>
      sum +
      levels.reduce((acc, level) => acc + scores[lang][level], 0),
    0
  );
  const achievements = [
    ...(completedQuizzes >= 3 ? ["Beginner Badge"] : []),
    ...(completedQuizzes >= 6 ? ["Intermediate Badge"] : []),
    ...(completedQuizzes >= 9 ? ["Advanced Badge"] : []),
  ];

  const handleResetScores = () => {
    if (window.confirm("Are you sure you want to reset all quiz scores?")) {
      resetScores();
      console.log("Scores reset");
    }
  };

  return (
    <div className="dashboardContainer">
      <aside className="sidebar">
        <div className="profileSection">
          <img src={profilePic} alt="Profile" className="profilePic" />
          <h3 className="profileName">{user?.name || "Guest"}</h3>
        </div>
        <nav className="navLinks">
          <Link to="/">Home</Link>
          <Link to="/lessons">Lessons</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/login-signup">Sign Up/Login</Link>
          <a
            href="#notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            Notifications
          </a>
        </nav>
      </aside>

      <main className="mainContent">
        <div className="welcomeBanner">
          <h1>Hi, {user?.name || "Guest"}!</h1>
          <p>Ready to enhance your language skills?</p>
        </div>

        <div className="learningStatus">
          <div className="progressBarContainer">
            <span>Overall Quiz Progress:</span>
            <div className="progressBar">
              <div
                className="progressFill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span>{progressPercent}% Completed ({completedQuizzes}/{totalQuizzes} quizzes)</span>
          </div>
        </div>

        <div className="quizScoresSection">
          <h3>Quiz Scores</h3>
          <div className="quizScoresGrid">
            {languages.map((lang) => (
              <div key={lang} className="quizScoreCard">
                <h4>{lang}</h4>
                <ul>
                  {levels.map((level) => (
                    <li key={level}>
                      {level}: {scores[lang][level]}%
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button className="resetScoresButton" onClick={handleResetScores}>
            Reset All Scores
          </button>
        </div>

        <div className="chatbotSection">
          <img src={chatbotIcon} alt="Chatbot" className="chatbotIcon" />
          <div className="chatbotPrompt">
            <h2>Let’s practice a conversation in French!</h2>
            <button className="chatbotButton" onClick={() => navigate("/chatbot")}>
              Open Chatbot
            </button>
          </div>
        </div>

        <div className="chartsContainer">
          <div className="chartBox">
            <h3>Pronunciation Accuracy</h3>
            <div className="chartPlaceholder">Chart Placeholder</div>
          </div>
          <div className="chartBox">
            <h3>Completion Rates</h3>
            <div className="chartPlaceholder">Chart Placeholder</div>
          </div>
        </div>

        <div className="gamificationStats">
          <h3>Recent Achievements</h3>
          <ul>
            {achievements.length > 0 ? (
              achievements.map((ach, index) => <li key={index}>{ach}</li>)
            ) : (
              <li>No achievements yet. Complete more quizzes!</li>
            )}
          </ul>
          <p>
            You’ve completed <strong>{challengesCompleted}</strong> quizzes and
            earned <strong>{points}</strong> points so far!
          </p>
          </div>
        </main>

      {notificationsOpen && (
        <div className="notificationsPanel">
          <h4>Notifications</h4>
          <ul>
            <li>You have a new lesson available.</li>
            <li>Reminder: Practice your spoken Spanish today!</li>
            <li>New badge: 5-Day Streak!</li>
          </ul>
          <button onClick={() => setNotificationsOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;