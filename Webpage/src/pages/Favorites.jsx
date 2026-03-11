import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import recipes from "../data/recipes"; 
import "../styles/favorites.css";

export default function Favorites() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();
  
  // Static filter for your favorites list
  const [favoriteRecipes, setFavoriteRecipes] = useState(
    recipes.filter(r => [1, 2, 3].includes(r.id))
  );

  const handleClearAll = () => {
    if(window.confirm("Are you sure you want to clear your favorites?")) {
      setFavoriteRecipes([]);
    }
  };

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
            {favoriteRecipes.length > 0 && (
              <button className="clear-all-btn" onClick={handleClearAll}>
                Clear All
              </button>
            )}
          </div>

          <div className="favorites-grid">
            {favoriteRecipes.map((recipe) => (
              <div 
                key={recipe.id} 
                className="fav-card" 
                onClick={() => setSelectedRecipe(recipe)}
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

          {favoriteRecipes.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
              <h3>No saved recipes yet.</h3>
              <button className="view-all-btn" onClick={() => navigate("/home")}>Go to Home</button>
            </div>
          )}
        </div>
      </div>

      {/* --- Aesthetic Modal Logic --- */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-modal" 
              onClick={() => setSelectedRecipe(null)}
              style={{ position: 'absolute', top: '20px', right: '25px', fontSize: '30px', border: 'none', background: 'white', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10 }}
            >
              &times;
            </button>
            
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedRecipe.image} alt={selectedRecipe.title} />
              </div>
              <div className="modal-details">
                <h2 style={{ fontFamily: 'Georgia, serif', color: 'orange', fontSize: '32px', marginBottom: '15px' }}>
                  {selectedRecipe.title}
                </h2>
                <div className="modal-stats" style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                  <span>⏱️ 45 mins</span>
                  <span>🔥 Medium Heat</span>
                  <span>👤 2-4 Servings</span>
                </div>
                <hr style={{ border: '0.5px solid #eee', marginBottom: '20px' }} />
                <h3>Ingredients</h3>
                <ul style={{ paddingLeft: '20px', color: '#444' }}>
                  <li>Authentic Filipino Spices</li>
                  <li>Freshly Sourced Protein</li>
                  <li>Secret PH Recipe Sauce</li>
                </ul>
                <h3>Instructions</h3>
                <p style={{ color: '#444', lineHeight: '1.6' }}>
                  Sauté the aromatics, add the main protein, and simmer until the flavors are perfectly locked in.
                </p>
                <button 
                  className="start-cooking"
                  onClick={() => navigate("/cooking", { state: { recipe: selectedRecipe } })}
                  style={{ marginTop: '30px', width: '100%', padding: '15px', background: 'orange', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
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