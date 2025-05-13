import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar"; 
import Footer from "./Components/Footer/Footer";
import Home from "./Components/HomePage/Home";
import LoginSignup from "./Components/Login-SignUp/LoginSignup";
import Dashboard from "./Components/Dashboard/Dashboard";
import LessonsPage from "./Components/Lessons/LessonsPage";
import Chatbot from "./Components/ChatBot/Chatbot";
import Quiz from "./Components/Quizes/Quiz";
import { QuizProvider } from "./context/QuizContext";

function App() {
  return (
    <QuizProvider>
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-signup" element={<LoginSignup />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/quiz/:language/:level" element={<Quiz />} />
        </Routes>
        <Footer />
      </Router>
    </QuizProvider>
  );
}

export default App;