import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import "../styles/recent.css";

export default function Recent() {
  return (
    /* Connects the beige background and flex layout from your CSS */
    <div className="layout"> 
      
      <Sidebar />

      {/* The 'main' class handles the layout for the header and content */}
      <div className="main">
        <Header />

        {/* The 'content' class provides the 20px padding for your text */}
        <div className="content">
          <h1>Recent Recipes</h1>
          <p>Recently added recipes will appear here.</p>
        </div>
      </div>
    </div>
  );
}