import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import recipes from "../data/recipes";
import "../styles/popular.css";

export default function Popular() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />

        <div className="content">
          <div className="popular-header">
            <h1>Most Popular Dishes</h1>
            <p>The highest-rated recipes by the community this week.</p>
          </div>

          <div className="popular-grid">
            {recipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="popular-card"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="image-wrapper">
                  <img src={recipe.image} alt={recipe.title} />
                  <div className="trending-badge">★ Top Rated</div>
                </div>
                
                <div className="popular-info">
                  <div className="title-row">
                    <h3>{recipe.title}</h3>
                    <span className="price-tag">Free</span>
                  </div>
                  <div className="stats-row">
                    <span>🔥 2k+ cooked</span>
                    <span>⏱️ 30 mins</span>
                  </div>
                  <button className="cook-now-btn">Cook Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Aesthetic Modal Integration --- */}
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
                
                {/* Redirects to IoT Cooking Mode */}
                <button 
                  className="start-cooking-btn"
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