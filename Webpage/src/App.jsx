import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Cooking from "./pages/Cooking";
import Favorites from "./pages/Favorites";
import Popular from "./pages/Popular";
import Profile from "./pages/Profile";
import Recent from "./pages/Recent";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>

      {/* Default page */}
      <Route path="/" element={<Login />} />

      {/* Other pages */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/category" element={<Category />} />
      <Route path="/cooking" element={<Cooking />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/popular" element={<Popular />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/recent" element={<Recent />} />
      <Route path="/settings" element={<Settings />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;