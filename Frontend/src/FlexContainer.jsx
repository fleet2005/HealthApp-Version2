import React from "react";
import "./css/flex.css";
import JWT from "/assets/JWT.png"; 
import Chatbot from "/assets/Chatbot.png";
import Bcrypt from "/assets/Bcrypt.png";
import Markov from "/assets/Markov.png";
import Charting from "/assets/Charting.png"
import History from "/assets/History.png"


const items = [
  { text: "Bcrypt", image: Bcrypt, hoverText: "New Text" },
  { text: "JWT", image: JWT, hoverText: "New Text" },
  { text: "Markov", image: Markov, hoverText: "New Text" },
  { text: "Chatbot", image: Chatbot, hoverText: "New Text" },
  { text: "History", image: History, hoverText: "New Text" },
  { text: "Charting", image: Charting, hoverText: "New Text" },
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
