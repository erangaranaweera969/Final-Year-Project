import { Link } from 'react-router-dom';
import './Home.css';

const MainBanner = () => {
  return (
    <section className="custom-main-banner">
      <div className="custom-banner-content">
        <h2>Master Languages with Interactive Chatbot & Speech Recognition</h2>
        <p>Practice Spanish, French, or Chinese with real-time feedback on your pronunciation.</p>
        <Link to="/login-signup"> 
          <button className="cta-button">Start Learning Now</button>
        </Link>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section className="custom-features">
      <div className="custom-feature">
        <h3>Speech Recognition</h3>
        <p>Enhance your pronunciation with real-time feedback.</p>
      </div>
      <div className="custom-feature">
        <h3>Interactive Lessons</h3>
        <p>Engage in immersive lessons for a better learning experience.</p>
      </div>
      <div className="custom-feature">
        <h3>Progress Tracker</h3>
        <p>Track your language learning progress every step of the way.</p>
      </div>
      <div className="custom-feature">
        <h3>Gamified Learning</h3>
        <p>Make learning fun with achievements and challenges.</p>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div>
      <MainBanner />
      <Features />
     
    </div>
  );
};

export default Home;
