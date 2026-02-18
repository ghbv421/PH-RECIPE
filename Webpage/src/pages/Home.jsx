import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import HeroBanner from "../components/HeroBanner";
import RecipeCard from "../components/RecipeCard";
import recipes from "../data/recipes";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        <HeroBanner />
        <section className="new-recipes">
          <h3>Newly Recipes Added &gt;</h3>
          <div className="recipe-grid">
            {recipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                isTall={recipe.title === "Beef Tapa"} 
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}