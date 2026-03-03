import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import HeroBanner from "../components/HeroBanner"; // Importing the child
import RecipeCard from "../components/RecipeCard";
import recipes from "../data/recipes";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="home-container">
          {/* The HeroBanner is placed here as a single tag */}
          <HeroBanner /> 
          
          <section className="new-recipes">
            <div className="section-header">
              <h3>Newly Added Recipes</h3>
              <button className="view-all-btn">View All &rarr;</button>
            </div>
            <div className="recipe-grid">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}