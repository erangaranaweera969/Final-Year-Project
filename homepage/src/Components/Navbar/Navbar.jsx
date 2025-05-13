import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png"
import "./Navbar.css";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="custom-nav">
      <div className="custom-logo">
        <img src={logo} alt="Language Master Logo" />
        <h1>Language Master</h1>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/lessons">Lessons</Link></li>
          <li><Link to="/chatbot">Chatbot</Link></li>
          {user ? (
            <>
             <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  height: '100%',
                }}
              >
                {user.name}
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login-signup">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;