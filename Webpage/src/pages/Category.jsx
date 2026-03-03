import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import recipes from "../data/recipes"; 
import "../styles/category.css";

export default function Category() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        
        <div className="content">
          <div className="category-header">
            <h1>Browse Categories</h1>
            <p>Explore traditional Filipino flavors by dish type.</p>
          </div>

          <div className="category-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="category-card">
                <div className="category-image-wrapper">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="category-img" 
                  />
                  {/* Subtle gradient overlay for better text contrast */}
                  <div className="category-overlay"></div>
                </div>
                <div className="category-info">
                  <span className="category-label">{recipe.title}</span>
                  <button className="explore-btn">Explore &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}