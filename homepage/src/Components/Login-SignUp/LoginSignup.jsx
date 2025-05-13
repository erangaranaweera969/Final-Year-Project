import { useState } from "react";
import axios from "axios";
import "./LoginSignup.css";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? "/api/signup" : "/api/login";
      const body = isSignUp
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      console.log("Sending request to:", `http://localhost:8000${endpoint}`);
      console.log("Request body:", body);

      const response = await axios.post(`http://localhost:8000${endpoint}`, body, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      console.log("Response received:", response.data);

      setSuccess(response.data.message);
      if (response.data.token) {
        document.cookie = `token=${response.data.token}; path=/; max-age=3600; Secure; SameSite=Strict`;
    } else {
        console.error("Token is missing in the response");
    }
    
      setFormData({ name: "", email: "", password: "" });

      window.location.href = "/"; 
      
    } catch (err) {
      console.error("Request error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to connect to the server. Please check if the backend is running.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-signup-container">
      <div className="header">
        <h1 className="website-name">Language Master</h1>
      </div>
      <div className="form-container">
        <div className="form-header">
          <div className={`tab ${isSignUp ? "active" : ""}`} onClick={() => setIsSignUp(true)}>
            Sign Up
          </div>
          <div className={`tab ${!isSignUp ? "active" : ""}`} onClick={() => setIsSignUp(false)}>
            Login
          </div>
        </div>
        <div className="form-inputs">
          {isSignUp && (
            <div className="input-group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          )}
          <div className="input-group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2c0 .738.402 1.378 1 1.723V15a1 1 0 001 1h1a1 1 0 001-1v-2.277c.598-.345 1-.985 1-1.723zm9-2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h1V5a4 4 0 018 0v2h1a2 2 0 012 2z" />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {!isSignUp && (
          <div className="forgot-password">
            Forgot Password? <span>Click Here!</span>
          </div>
        )}
        <button className="submit-button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginSignup;