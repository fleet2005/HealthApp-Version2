import { useEffect, useState } from "react";
import "./css/slider.css";

const slides = [
  { text: "Track Your Nutrients", image: "/public/assets/Food.jpg" },
  { text: "Monitor Your BMI", image: "/public/assets/bmi.jpg" },
  { text: "Stay Active with Exercise Tracking", image: "/public/assets/exercise.jpg" },
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
            <h2>{slide.text}</h2>
          </div>
          <div className="progress-bar"></div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
