import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import recipes from "../data/recipes";
import "../styles/recent.css";

export default function Recent() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate(); // 2. Initialize hook

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="content">
          <div className="recent-header">
            <h1>Recently Viewed</h1>
            <p>Pick up right where you left off.</p>
          </div>

          <div className="recent-grid">
            {recipes.map((recipe, index) => (
              <div key={recipe.id} className="recent-card">
                <div className="recent-image-container">
                  <img src={recipe.image} alt={recipe.title} />
                  <div className="time-badge">
                    {index === 0 ? "Just now" : `${index + 1}h ago`}
                  </div>
                </div>
                <div className="recent-info">
                  <h3>{recipe.title}</h3>
                  <button 
                    className="view-btn" 
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedRecipe(null)}>&times;</button>
            
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedRecipe.image} alt={selectedRecipe.title} />
              </div>
              <div className="modal-details">
                <h2>{selectedRecipe.title}</h2>
                <div className="modal-stats">
                  <span>⏱️ 45 mins</span>
                  <span>🔥 Medium Heat</span>
                  <span>👤 2-4 Servings</span>
                </div>
                <hr />
                <h3>Ingredients</h3>
                <ul>
                  <li>Authentic Filipino Spices</li>
                  <li>Freshly Sourced Protein</li>
                  <li>Secret PH Recipe Sauce</li>
                </ul>
                <h3>Instructions</h3>
                <p>Sauté the aromatics, add the main protein, and simmer until the flavors are perfectly locked in.</p>
                
                {/* 3. Updated Navigation Trigger */}
                <button 
                  className="start-cooking"
                  onClick={() => navigate("/cooking", { state: { recipe: selectedRecipe } })}
                >
                  Start Cooking Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}