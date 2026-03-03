import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const handleLogin = (e) => { e.preventDefault(); navigate("/home"); };

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1 className="brand-logo">PH RECIPE</h1>
          <p className="welcome-text">Taste of the Philippines</p>
        </header>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <div className="field-container">
              <span className="field-icon">📧</span>
              <input type="email" placeholder="Email Address" required />
            </div>
          </div>

          <div className="input-group">
            <div className="field-container">
              <span className="field-icon">🔒</span>
              <input type="password" placeholder="Password" required />
            </div>
            <a href="#" className="forgot-link">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn">Sign In</button>
        </form>

        <div className="divider"><span>or</span></div>

        <div className="social-row">
          <button className="social-item">G</button>
          <button className="social-item">f</button>
          <button className="social-item">📞</button>
        </div>

        <p className="footer-text">
          New here? 
          {/* UPDATED: Added navigate logic here */}
          <span 
            className="signup-link" 
            style={{ cursor: 'pointer', marginLeft: '5px' }}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}