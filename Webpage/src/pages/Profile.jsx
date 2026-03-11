import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import "../styles/profile.css";

export default function Profile() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        
        <div className="content">
          <div className="profile-container">

            <div className="profile-cover">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-large">DRMF</div>
              </div>
            </div>

            <div className="profile-header-info">
              <h1>Doremifa</h1>
              <p className="profile-subtitle">BSIT Student | Back-end Developer</p>
            </div>

            <div className="profile-grid">

              <section className="profile-card">
                <h3>Personal Information</h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">Juan Dela Cruz</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address</span>
                    <span className="info-value">Cagayan de Oro, Philippines</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">University Role</span>
                    <span className="info-value">BSIT-3R2 Student</span>
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