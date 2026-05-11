// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

const BASE_URL = "http://127.0.0.1:8000";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // ✅ SECURITY FEATURE 2: Registration with password validation on backend
      const res = await fetch(`${BASE_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setShowSuccessModal(true);
    } catch (err) {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <header className="signup-header">
          <h1 className="brand-logo">PH RECIPE</h1>
          <p className="welcome-text">Join our community of food lovers</p>
        </header>

        <form onSubmit={handleSignup}>
          {error && <p className="error-msg">{error}</p>}

          <div className="input-group">
            <div className="field-container">
              <span className="field-icon">👤</span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="field-container">
              <span className="field-icon">📧</span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="field-container">
              <span className="field-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min. 8 chars)"
                minLength="8"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer", fontSize: "14px", marginLeft: "8px" }}
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          <div className="input-group">
            <div className="field-container" style={{ border: error ? "1.5px solid #ff4757" : "1.5px solid #eee" }}>
              <span className="field-icon">✔️</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                minLength="8"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="divider"><span>or sign up with</span></div>

        <div className="social-row">
          <button className="social-item">G</button>
          <button className="social-item">f</button>
          <button className="social-item">📞</button>
        </div>

        <p className="footer-text">
          Already have an account?
          <span className="login-link" onClick={() => navigate("/")}>Sign In</span>
        </p>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">🎉</div>
            <h2>Account Created!</h2>
            <p>Your PH Recipe account is ready. Welcome to the family!</p>
            <button className="modal-btn" onClick={handleModalClose}>
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}