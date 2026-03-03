import { useState, useEffect } from "react";
import img1 from "../assets/images/beefpares.svg";
import img2 from "../assets/images/chickenadobo.svg";
import img3 from "../assets/images/bulalo.svg";
import img4 from "../assets/images/friedchicken.svg";
import img5 from "../assets/images/porkadobo.svg";

export default function HeroBanner() {
  // Data array linking thumbnails to main display content
  const slides = [
    {
      title: "Fried Rice",
      mainImg: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
      thumb: img1
    },
    {
      title: "Beef Pares",
      mainImg: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", 
      thumb: img1
    },
    {
      title: "Chicken Adobo",
      mainImg: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
      thumb: img2
    },
    {
      title: "Bulalo",
      mainImg: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
      thumb: img3
    },
    {
      title: "Pork Adobo",
      mainImg: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
      thumb: img5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play logic: changes slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="hero">
      {/* Main Hero Image with a key to trigger CSS animations on change */}
      <img
        key={currentIndex}
        src={slides[currentIndex].mainImg}
        alt={slides[currentIndex].title}
        className="hero-main-img"
      />

      <h1 key={`title-${currentIndex}`}>{slides[currentIndex].title}</h1>

      <div className="top-list-wrap">
        <div className="top-list-label">Hot Top 5 list</div>
        <div className="top-list">
          {slides.map((slide, i) => (
            <img
              key={i}
              src={slide.thumb}
              alt={`Top ${i + 1}`}
              onClick={() => setCurrentIndex(i)} // Manual click to change slide
              className={currentIndex === i ? "active-thumb" : ""}
              style={{
                border: currentIndex === i ? "3px solid orange" : "2px solid rgba(255,255,255,0.5)",
                transform: currentIndex === i ? "scale(1.15)" : "scale(1)",
                opacity: currentIndex === i ? 1 : 0.7,
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}