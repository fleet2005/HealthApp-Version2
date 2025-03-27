import React from "react";
import "./css/flex.css";

const items = [
  { text: "Bcrypt", image: "https://via.placeholder.com/100", hoverText: "New Text" },
  { text: "JWT", image: "https://via.placeholder.com/100", hoverText: "New Text" },
  { text: "Markov", image: "https://via.placeholder.com/100", hoverText: "New Text" },
  { text: "Chatbot", image: "https://via.placeholder.com/100", hoverText: "New Text" },
  { text: "History", image: "https://via.placeholder.com/100", hoverText: "New Text" },
  { text: "Charting", image: "https://via.placeholder.com/100", hoverText: "New Text" },
];

const FlexContainer = () => {
  return (
    <div className="flex-container">
      {items.map((item, index) => (
        <div className="item" key={index}>
          <div className="flip-container">
            <div className="flipper">
              <div className="front">
                <img src={item.image} alt={item.text} className="item-image" />
                <span className="item-text">{item.text}</span>
              </div>
              <div className="back">
                <span className="hover-text">{item.hoverText}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlexContainer;
