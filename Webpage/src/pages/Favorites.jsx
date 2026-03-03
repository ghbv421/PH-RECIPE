import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import recipes from "../data/recipes"; 
import "../styles/favorites.css";

export default function Favorites() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // Filtering data for your specific favorites
  const favoriteRecipes = recipes.filter(r => r.id === 1 || r.id === 2);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        
        <div className="content">
          <div className="favorites-header">
            <div className="title-section">
              <h1>Saved Recipes <span className="title-heart">❤️</span></h1>
              <p>Your curated collection of Filipino favorites.</p>
            </div>
          </div>

          <div className="favorites-grid">
            {favoriteRecipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="fav-card" 
                onClick={() => setSelectedRecipe(recipe)} // Trigger Modal
              >
                <div className="fav-image-wrapper">
                  <img src={recipe.image} alt={recipe.title} />
                  <div className="fav-badge">Favorite</div>
                </div>
                <div className="fav-info">
                  <button className="fav-heart-active">❤️</button>
                  <span className="fav-title">{recipe.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Shared Aesthetic Modal Logic --- */}
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
                <button className="start-cooking">Start Cooking Now</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}