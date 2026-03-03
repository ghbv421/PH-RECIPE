import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import "../styles/settings.css";

export default function Settings() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        
        <div className="content">
          <div className="settings-container">
            <header className="settings-header">
              <h1>System Settings</h1>
              <p>Manage your account preferences and application configuration.</p>
            </header>

            <div className="settings-grid">
              {/* Profile Section */}
              <section className="settings-card">
                <h3>Profile Information</h3>
                <div className="profile-edit">
                  <div className="avatar-large">JD</div>
                  <div className="profile-fields">
                    <div className="input-group">
                      <label>Full Name</label>
                      <input type="text" defaultValue="Juan Dela Cruz" />
                    </div>
                    <div className="input-group">
                      <label>Email Address</label>
                      <input type="email" defaultValue="juan.delacruz@example.com" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Preferences Section */}
              <section className="settings-card">
                <h3>System Preferences</h3>
                <div className="preference-item">
                  <span>Dark Mode</span>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="preference-item">
                  <span>Email Notifications</span>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="preference-item">
                  <span>Language</span>
                  <select className="settings-select">
                    <option>English</option>
                    <option>Tagalog</option>
                    <option>Cebuano</option>
                  </select>
                </div>
              </section>

              {/* Security Section */}
              <section className="settings-card full-width">
                <h3>Security</h3>
                <button className="settings-btn secondary">Change Password</button>
                <button className="settings-btn danger">Delete Account</button>
              </section>
            </div>

            <footer className="settings-footer">
              <button className="settings-btn primary">Save Changes</button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}