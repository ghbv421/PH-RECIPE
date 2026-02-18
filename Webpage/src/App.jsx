import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Category from "./pages/Category";
import Favorites from "./pages/Favorites";
import Popular from "./pages/Popular";
import Recent from "./pages/Recent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/recent" element={<Recent />} />
      </Routes>
    </Router>
  );
}

export default App;
