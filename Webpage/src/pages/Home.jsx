import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import HeroBanner from "../components/HeroBanner";
import RecipeCard from "../components/RecipeCard";
import recipes from "../data/recipes";
import "../styles/home.css";

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="home-container">
          <HeroBanner /> 
          
          <section className="new-recipes">
            <div className="section-header">
              <h3>Newly Added Recipes</h3>
              <button className="view-all-btn" onClick={() => navigate("/popular")}>
                View All &rarr;
              </button>
            </div>
            <div className="recipe-grid">
              {recipes.map(recipe => (
                <div key={recipe.id} onClick={() => setSelectedRecipe(recipe)}>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* --- Unified Modal Logic --- */}
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
                </div>
                <hr />
                <h3>Ingredients</h3>
                <ul>
                  <li>Authentic Filipino Spices</li>
                  <li>Secret PH Recipe Sauce</li>
                </ul>
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