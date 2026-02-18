import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

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

{/* Logout Button Section */}
<div className="logout-container">
  <button className="logout-button" onClick={() => navigate("/")}>
    Logout
  </button>
</div>
    </aside>
  );
}
