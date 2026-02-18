import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="brand-title">PH RECIPE</h1>
        
        <h2 className="login-header">LogIn</h2>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-box">
            <label>Email:</label>
            <div className="input-field">
              <span>📧</span>
              <input type="email" placeholder="username@gmail.com" required />
            </div>
          </div>

          <div className="input-box">
            <label>Password:</label>
            <div className="input-field">
              <span>🔒</span>
              <input type="password" placeholder="password:" required />
            </div>
            <a href="#" className="forgot-pass">Forget Password?</a>
          </div>

          <button type="submit" className="signin-btn">Sign in</button>
        </form>

        <div className="separator">or continue with</div>

        <div className="social-login">
          <button className="social-icon">G</button>
          <button className="social-icon">📞</button>
          <button className="social-icon">f</button>
        </div>

        <p className="signup-link">
          Don't have an account yet? <a href="#">Sign Up</a>
        </p>
      </div>
    </div>
  );
}