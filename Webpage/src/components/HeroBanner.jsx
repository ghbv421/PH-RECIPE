// src/components/HeroBanner.jsx

import { useState, useEffect } from "react";

const BASE_URL = "http://127.0.0.1:8000";

const getImageUrl = (recipe) => {
  if (!recipe) return "";

  if (recipe.image && typeof recipe.image === "string") {
    if (recipe.image.startsWith("http")) return recipe.image;

    const path = recipe.image.startsWith("/")
      ? recipe.image
      : `/${recipe.image}`;

    return `${BASE_URL}${path}`;
  }

  if (recipe.image_key && recipe.image_key !== "...") {
    const fileName = recipe.image_key.includes(".")
      ? recipe.image_key
      : `${recipe.image_key}.png`;

    return `${BASE_URL}/media/images/${fileName}`;
  }

  return "https://via.placeholder.com/1200x500?text=No+Image";
};

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch first 5 recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/recipes/`);
        const data = await res.json();

        const formattedSlides = data.slice(0, 5).map((recipe) => ({
          title: recipe.name,
          mainImg: getImageUrl(recipe),
          thumb: getImageUrl(recipe),
        }));

        setSlides(formattedSlides);
      } catch (err) {
        console.error("Failed to load hero recipes:", err);
      }
    };

    fetchRecipes();
  }, []);

  // Auto slide
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <section className="hero">
        <div
          style={{
            height: "450px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "24px",
          }}
        >
          Loading recipes...
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      {/* Main Image */}
      <img
        key={currentIndex}
        src={slides[currentIndex].mainImg}
        alt={slides[currentIndex].title}
        className="hero-main-img"
      />

      {/* Title */}
      <h1 key={`title-${currentIndex}`}>
        {slides[currentIndex].title}
      </h1>

      {/* Thumbnail List */}
      <div className="top-list-wrap">
        <div className="top-list-label">Hot Top 5 Recipes</div>

        <div className="top-list">
          {slides.map((slide, i) => (
            <img
              key={i}
              src={slide.thumb}
              alt={slide.title}
              onClick={() => setCurrentIndex(i)}
              className={currentIndex === i ? "active-thumb" : ""}
              style={{
                border:
                  currentIndex === i
                    ? "3px solid orange"
                    : "2px solid rgba(255,255,255,0.5)",
                transform:
                  currentIndex === i
                    ? "scale(1.15)"
                    : "scale(1)",
                opacity: currentIndex === i ? 1 : 0.7,
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}