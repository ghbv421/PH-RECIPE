import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Logic for account creation would go here
    navigate("/home");
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <header className="signup-header">
          <h1 className="brand-logo">PH RECIPE</h1>
          <p className="welcome-text">Join our community of food lovers</p>
        </header>

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <div className="field-container">
              <span className="field-icon">👤</span>
              <input type="text" placeholder="Full Name" required />
            </div>
          </div>

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
          </div>

          <div className="input-group">
            <div className="field-container">
              <span className="field-icon">✔️</span>
              <input type="password" placeholder="Confirm Password" required />
            </div>
          </div>

          <button type="submit" className="signup-btn">Create Account</button>
        </form>

        <div className="divider"><span>or sign up with</span></div>

        <div className="social-row">
          <button className="social-item">G</button>
          <button className="social-item">f</button>
          <button className="social-item">📞</button>
        </div>

        <p className="footer-text">
          Already have an account? 
          <span 
            className="login-link" 
            onClick={() => navigate("/")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}