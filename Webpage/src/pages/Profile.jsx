// src/pages/Profile.jsx
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import "../styles/profile.css";

export default function Profile() {
  const { user } = useAuth(); // ✅ Real user data from AuthContext

  // Generate avatar initials from username
  const initials = user?.username
    ? user.username.slice(0, 4).toUpperCase()
    : "USER";

  const isAdmin = user?.role === "admin";

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />

        <div className="content">
          <div className="profile-container">

            <div className="profile-cover">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-large">{initials}</div>
              </div>
            </div>

            <div className="profile-header-info">
              {/* ✅ Real username from API login */}
              <h1>{user?.username || "Unknown User"}</h1>
              <p className="profile-subtitle">
                {isAdmin ? "👑 Administrator" : "🍽 Regular User"} | PH Recipe Member
              </p>
            </div>

            <div className="profile-grid">

              <section className="profile-card">
                <h3>Account Information</h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">Username</span>
                    <span className="info-value">{user?.username}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Role</span>
                    {/* ✅ RBAC: Shows actual role */}
                    <span className="info-value" style={{ color: isAdmin ? "#e67e00" : "#333", fontWeight: "bold" }}>
                      {isAdmin ? "Admin" : "User"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Auth Token</span>
                    {/* ✅ Shows token (truncated for security display) */}
                    <span className="info-value" style={{ fontFamily: "monospace", fontSize: "12px", color: "#888" }}>
                      {user?.token ? `${user.token.slice(0, 12)}...` : "None"}
                    </span>
                  </div>
                </div>
              </section>

              <section className="profile-card">
                <h3>Active Projects</h3>
                <div className="project-tags">
                  <span className="tag">PH Recipe Web</span>
                  <span className="tag">Smart Waste Bin</span>
                  <span className="tag">IoT Blood Pressure</span>
                </div>
                <p className="project-desc">Currently focusing on ReactJS and IoT system integration.</p>
              </section>

              {/* ✅ RBAC: Admin-only section */}
              {isAdmin && (
                <section className="profile-card" style={{ borderLeft: "4px solid #e67e00" }}>
                  <h3>🔐 Admin Privileges</h3>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="info-label">Can Add Recipes</span>
                      <span className="info-value" style={{ color: "green" }}>✅ Yes</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Can Delete Recipes</span>
                      <span className="info-value" style={{ color: "green" }}>✅ Yes</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Restricted Actions</span>
                      <span className="info-value" style={{ color: "green" }}>✅ Unlocked</span>
                    </div>
                  </div>
                </section>
              )}

              <section className="profile-card full-width">
                <h3>Account Activity</h3>
                <div className="stats-row">
                  <div className="stat-box">
                    <strong>12</strong>
                    <span>Saved Recipes</span>
                  </div>
                  <div className="stat-box">
                    <strong>5</strong>
                    <span>Categories Explored</span>
                  </div>
                  <div className="stat-box">
                    <strong>8</strong>
                    <span>Recent Searches</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}