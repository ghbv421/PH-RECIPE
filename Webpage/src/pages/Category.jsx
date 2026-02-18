import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import recipes from "../data/recipes"; // Assuming your data is in a data folder
import "../styles/category.css";

export default function Category() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        
        <div className="content">
          <div className="category-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="category-card">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="category-img" 
                />
                <span className="category-label">{recipe.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}