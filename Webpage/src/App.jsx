// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

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

// ✅ RBAC: Protected route — redirects to login if not authenticated
function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  // ✅ RBAC: If route requires admin, check role
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />

      {/* Protected routes — must be logged in */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
      <Route path="/cooking" element={<ProtectedRoute><Cooking /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/popular" element={<ProtectedRoute><Popular /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/recent" element={<ProtectedRoute><Recent /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;