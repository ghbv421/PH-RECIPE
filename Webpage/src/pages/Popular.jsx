import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import recipes from "../data/recipes";
import "../styles/popular.css";

export default function Popular() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />

        <div className="content">
          <div className="popular-header">
            <h1>Most Popular Dishes</h1>
            <p>The highest-rated recipes by the community this week.</p>
          </div>

          <div className="popular-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="popular-card">
                <div className="image-wrapper">
                  <img src={recipe.image} alt={recipe.title} />
                  {/* Trending Badge */}
                  <div className="trending-badge">★ Top Rated</div>
                  {/* Heart button removed from here */}
                </div>
                
                <div className="popular-info">
                  <div className="title-row">
                    <h3>{recipe.title}</h3>
                    <span className="price-tag">Free</span>
                  </div>
                  <div className="stats-row">
                    <span>🔥 2k+ cooked</span>
                    <span>⏱️ 30 mins</span>
                  </div>
                  <button className="cook-now-btn">Cook Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}