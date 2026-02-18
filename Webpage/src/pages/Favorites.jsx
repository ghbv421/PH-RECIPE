import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import recipes from "../data/recipes"; 
import "../styles/favorites.css";

export default function Favorites() {
  // Filtering data to show specific favorites as seen in your screenshot
  const favoriteRecipes = recipes.filter(r => r.id === 1 || r.id === 2);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        
        <div className="content">
          <div className="favorites-header">
            <h2>Favorites <span className="heart-icon-top">♡</span></h2>
          </div>

          <div className="favorites-grid">
            {favoriteRecipes.map((recipe) => (
              <div key={recipe.id} className="fav-card">
                <div className="fav-image-wrapper">
                  <img src={recipe.image} alt={recipe.title} />
                </div>
                <div className="fav-info">
                  <span className="fav-heart-btn">♡</span>
                  <span className="fav-title">{recipe.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}