import { useEffect, useState } from "react";
import "./css/Slider.css";

const slides = [
  { text: "Hello, this is Vishal", color: "linear-gradient(to right, #ff7eb3, #ff758c)" },
  { text: "Slide 2", color: "linear-gradient(to right, #67B26F, #4ca2cd)" },
  { text: "Slide 3", color: "linear-gradient(to right, #FF512F, #DD2476)" },
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
      <div 
        className="slide fade"
        style={{ background: slides[currentSlide].color }}
      >
        {slides[currentSlide].text}
        <div className="progress-bar"></div> 
      </div>
    </div>
  );
};

export default Slider;
