// src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth(); // ✅ Real logout from AuthContext

  const handleLogout = () => {
    logout();           // Clears token from sessionStorage and context
    navigate("/");      // Redirect to login
  };

  return (
    <aside className="sidebar">
      <div>
        <h2 className="logo">PH RECIPE</h2>

        <ul>
          <li
            className={location.pathname === "/home" ? "active" : ""}
            onClick={() => navigate("/home")}
          >
            Home
          </li>

          <li
            className={location.pathname === "/category" ? "active" : ""}
            onClick={() => navigate("/category")}
          >
            Categories
          </li>

          <li
            className={location.pathname === "/favorites" ? "active" : ""}
            onClick={() => navigate("/favorites")}
          >
            Favorites
          </li>

          <li
            className={location.pathname === "/popular" ? "active" : ""}
            onClick={() => navigate("/popular")}
          >
            Popular Food Recipes
          </li>

          <li
            className={location.pathname === "/recent" ? "active" : ""}
            onClick={() => navigate("/recent")}
          >
            Recently Viewed
          </li>
        </ul>
      </div>

      {/* ✅ Real logout — clears token and redirects to login */}
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}