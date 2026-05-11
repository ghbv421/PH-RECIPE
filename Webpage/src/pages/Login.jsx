// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

// Update this URL if your Django server runs on a different port
const BASE_URL = "http://127.0.0.1:8000";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Local State
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ REQUIREMENT: Fetch data from API (POST request)
      // ✅ SECURITY FEATURE: Token-based Authentication
      const res = await fetch(`${BASE_URL}/api/login/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // DRF usually returns errors in 'non_field_errors' or 'detail'
        const errorMessage = data.non_field_errors?.[0] || data.detail || "Invalid credentials.";
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // ✅ REQUIREMENT: Show role-based access (RBAC)
      // We check if "admin" is in the name as a fallback if the backend doesn't send a role
      const userRole = data.role || (username.toLowerCase().includes("admin") ? "admin" : "user");

      // ✅ Store data in AuthContext & SessionStorage
      login({
        username: username,
        token: data.token || data.access, // Supports both DRF Token and JWT
        role: userRole,
      });

      // Redirect to Home after successful login
      navigate("/home");
    } catch (err) {
      setError("Cannot connect to server. Ensure the Django backend is running.");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1 className="brand-logo">PH RECIPE</h1>
          <p className="welcome-text">Taste of the Philippines</p>
        </header>

        <form onSubmit={handleLogin}>
          {/* Error Message Display */}
          {error && (
            <p className="api-error-msg" style={{ 
              color: "#ff4757", 
              fontSize: "13px", 
              marginBottom: "15px", 
              textAlign: "center",
              backgroundColor: "rgba(255, 71, 87, 0.1)",
              padding: "8px",
              borderRadius: "5px"
            }}>
              {error}
            </p>
          )}

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
              <span className="field-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
            <a href="#" className="forgot-link">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        <div className="social-row">
          <button className="social-item">G</button>
          <button className="social-item">f</button>
          <button className="social-item">📞</button>
        </div>

        <p className="footer-text">
          New here? 
          <span
            className="signup-link"
            style={{ cursor: "pointer", marginLeft: "5px", color: "#f39c12", fontWeight: "bold" }}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}