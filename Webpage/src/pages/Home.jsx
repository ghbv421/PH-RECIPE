import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import HeroBanner from "../components/HeroBanner";
import RecipeCard from "../components/RecipeCard";
import "../styles/home.css";

const BASE_URL = "http://127.0.0.1:8000";

// ✅ Helper to build full image URL from image_key
const getFullImageUrl = (imageKey) => {
  if (!imageKey || imageKey === "...") return "https://placehold.co/150x150.png";
  if (imageKey.startsWith("http")) return imageKey;

  const fileName = imageKey.includes(".") ? imageKey : `${imageKey}.png`;
  return `${BASE_URL}/media/images/${fileName}`;
};

export default function Home() {
  const [dbRecipes, setDbRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  // Task 3: Fetching data from API
  useEffect(() => {
    fetch(`${BASE_URL}/api/recipes/`)
      .then(res => res.json())
      .then(data => {
        setDbRecipes(data);
        setLoading(false);
        console.log("Web API Response:", data);
      })
      .catch(err => {
        setError("Failed to load backend data");
        setLoading(false);
      });
  }, []);

  // Task 4: Submit form data to API
  const addRecipe = (newRecipeData) => {
    fetch(`${BASE_URL}/api/recipes/add/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "c90c32d906f7fb597d310f44a4e8d4c6bb67e50e"
        },
        body: JSON.stringify(newRecipeData)
    })
    .then(res => res.json())
    .then(data => {
        alert("Recipe Successfully Created!");
        setDbRecipes(prev => [...prev, data]);
    });
  };

  // Task 8 Guards
  if (loading) return <div className="loader">Loading System Data...</div>;
  if (error) return <div className="error">{error}</div>;

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
              <button onClick={() => addRecipe({ 
                name: "Web Dish", 
                category: "Meat", 
                image_key: "...", 
                time: "20m", 
                rating: 4 
              })}>
                Add Sample
              </button>
            </div>
            <div className="recipe-grid">
              {dbRecipes.length > 0 ? (
                dbRecipes.map(recipe => (
                  <div key={recipe.id} onClick={() => setSelectedRecipe(recipe)}>
                    {/* ✅ Maps backend fields to what RecipeCard expects */}
                    <RecipeCard 
                      recipe={{ 
                        image: getFullImageUrl(recipe.image_key),  // image_key → image
                        title: recipe.name,                         // name → title
                      }} 
                    />
                  </div>
                ))
              ) : (
                <p>No recipes available in the database.</p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ✅ Modal with correct image URL and field names */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedRecipe(null)}>&times;</button>
            <div className="modal-body">
              <img 
                src={getFullImageUrl(selectedRecipe.image_key)} 
                alt={selectedRecipe.name}
                onError={(e) => e.target.src = "https://placehold.co/150x150.png"}
              />
              <h2>{selectedRecipe.name}</h2>
              <div className="modal-stats">
                <span>⏱️ {selectedRecipe.time}</span>
                <span>⭐ {selectedRecipe.rating}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}