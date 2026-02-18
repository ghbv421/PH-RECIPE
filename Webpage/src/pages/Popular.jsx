import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import "../styles/popular.css";

export default function Popular() {
  return (
    /* Replace inline flex with the layout class for the beige background */
    <div className="layout"> 
      
      <Sidebar />

      {/* The 'main' class handles the flex growth and padding */}
      <div className="main">
        <Header />

        {/* The 'content' class ensures text doesn't touch the edges */}
        <div className="content">
          <h1>Popular Recipes</h1>
          <p>Most popular recipes will be shown here.</p>
        </div>
      </div>
    </div>
  );
}