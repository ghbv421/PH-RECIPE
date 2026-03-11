import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    height: "70px",
    position: "fixed",
    top: 0,
    left: "240px", 
    width: "calc(100% - 240px)", 
    zIndex: 1000,
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "rgba(217, 210, 195, 0.9)", 
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    boxSizing: "border-box"
  };

  const searchWrapperStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: "0 1 400px" 
  };

  const searchInputStyle = {
    width: "100%",
    padding: "10px 15px 10px 45px",
    borderRadius: "25px",
    border: "1px solid rgba(0,0,0,0.1)",
    backgroundColor: "#ffffff",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease"
  };

  const rightSideStyle = {
    display: "flex",
    alignItems: "center",
    gap: "clamp(10px, 2vw, 25px)" 
  };

  const profilePillStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#ffffff",
    padding: "5px 15px 5px 6px",
    borderRadius: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    cursor: "pointer",
    whiteSpace: "nowrap"
  };

  const avatarStyle = {
    width: "32px",
    height: "32px",
    backgroundColor: "orange",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold"
  };

  return (
    <header style={headerStyle}>
      <div style={searchWrapperStyle}>
        <span style={{ position: "absolute", left: "15px", color: "#888" }}>🔍</span>
        <input
          style={searchInputStyle}
          placeholder="Search for recipes..."
          onFocus={(e) => (e.target.style.boxShadow = "0 0 12px rgba(255, 140, 0, 0.3)")}
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
      </div>

      <div style={rightSideStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "14px" }}>
          <span>🌐</span>
          <span className="hide-on-mobile">English</span>
        </div>
        
        <span 
          style={{ cursor: "pointer", fontSize: "18px" }} 
          onClick={() => navigate("/settings")}
        >
          ⚙️
        </span>

        {/* UPDATED ONCLICK HERE */}
        <div 
          style={profilePillStyle} 
          onClick={() => navigate("/profile")}
        >
          <div style={avatarStyle}>DRMF</div>
          <span style={{ fontSize: "14px", fontWeight: "600" }}>Doremifa</span>
        </div>
      </div>
    </header>
  );
}