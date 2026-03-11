import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import "../styles/cooking.css";

export default function Cooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

  const [activeStep, setActiveStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);

  const steps = [
    { desc: "Prepare all ingredients and wash the vegetables thoroughly.", time: 60 },
    { desc: "Heat the oil in a large pan and sauté garlic and onions.", time: 300 },
    { desc: "Add the main protein and cook until browned on all sides.", time: 180 },
    { desc: "Pour in the PH Recipe secret sauce and let it simmer.", time: 600 },
    { desc: "Garnish with fresh herbs and serve hot with steamed rice.", time: 60 }
  ];

  useEffect(() => {
    if (steps.length > 0) setTimeLeft(steps[0].time);
  }, []);

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      setTimeLeft(steps[nextStep].time);
      setIsPaused(false);
    } else {
      // Trigger Rating Modal instead of alert
      setShowRatingModal(true);
      setIsPaused(true);
    }
  };

  useEffect(() => {
    if (isPaused || showRatingModal) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextStep();
    }
  }, [timeLeft, isPaused, activeStep, showRatingModal]);

  const handleRateAndExit = () => {
    // Here you would typically save the rating to your DB
    console.log(`User rated ${recipe.title}: ${rating} stars`);
    navigate("/recent");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!recipe) return <div className="layout"><Sidebar /><div className="main"><Header /></div></div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="content">
          <div className="cooking-container">
            <div className="cooking-visual">
              <img src={recipe.image} alt={recipe.title} className="cooking-main-img" />
              <div className="iot-timer-card">
                <div className="iot-badge">IoT CONNECTED</div>
                <div className="timer-display">{formatTime(timeLeft)}</div>
                <div className="timer-controls">
                  <button className="timer-btn pause" onClick={() => setIsPaused(!isPaused)}>
                    {isPaused ? "▶ Resume" : "⏸ Pause"}
                  </button>
                  <button className="timer-btn skip" onClick={handleNextStep}>
                    Next ⏭️
                  </button>
                </div>
              </div>
            </div>

            <div className="cooking-instructions">
              <div className="instruction-header">
                <span className="recipe-tag">Cooking Mode</span>
                <h1>{recipe.title}</h1>
              </div>
              <div className="steps-list">
                {steps.map((step, index) => (
                  <div key={index} className={`step-item ${index === activeStep ? "active" : index < activeStep ? "completed" : ""}`}>
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                        <p className="step-text">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RATING MODAL --- */}
      {showRatingModal && (
        <div className="rating-modal-overlay">
          <div className="rating-modal-content">
            <div className="confetti-icon">🎉</div>
            <h2>Delicious!</h2>
            <p>You've finished cooking <strong>{recipe.title}</strong>. How would you rate this recipe?</p>
            
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`star ${rating >= star ? "filled" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <button 
              className="submit-rating-btn" 
              disabled={rating === 0}
              onClick={handleRateAndExit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}