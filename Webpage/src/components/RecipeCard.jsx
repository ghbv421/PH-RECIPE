import { useState } from "react";

export default function RecipeCard({ recipe, isTall }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    // Prevent clicking the heart from triggering other card actions
    e.stopPropagation(); 
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={`recipe-card ${isTall ? "tall-card" : ""}`}>
      <div className="image-container">
        <img src={recipe.image} alt={recipe.title} />
        
        {/* Heart Icon Button */}
        <button 
          className={`heart-button ${isFavorite ? "active" : ""}`} 
          onClick={toggleFavorite}
          aria-label="favorite"
        >
          {isFavorite ? "❤️" : "♡"}
        </button>
      </div>
      <p className="recipe-title">{recipe.title}</p>
    </div>
  );
}