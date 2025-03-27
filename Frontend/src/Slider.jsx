import { useEffect, useState } from "react";
import "./css/slider.css";

const slides = [
  { 
    title: "Track Food Nutrients", 
    description: "Log your daily meals easily with predictive help", 
    image: "/assets/Food.jpg" 
  },
  { 
    title: "Monitor Your BMI & Health Trends", 
    description: "Stay on top of your weight goals with real-time BMI analysis", 
    image: "/assets/BMI.jpg" 
  },
  { 
    title: "Stay Active with Exercise Tracking", 
    description: "Set fitness goals, track workouts, and improve your lifestyle", 
    image: "/assets/Exercise.jpg" 
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-overlay">
            <h2>{slide.title}</h2>
            <div className="description-container">
              <img
                className="desc-image"
                src="https://via.placeholder.com/150"
                alt="description"
              />
              <p>{slide.description}</p>
            </div>
          </div>
          <div className="progress-bar"></div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
