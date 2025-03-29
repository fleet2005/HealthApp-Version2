import React from "react";
import "./css/flex.css";
import JWT from "/assets/JWT.png"; 
import Chatbot from "/assets/Chatbot.png";
import Bcrypt from "/assets/Bcrypt.png";
import Markov from "/assets/Markov.png";
import Charting from "/assets/Charting.png";
import History from "/assets/History.png";

const items = [
  { text: "Bcrypt", image: Bcrypt, hoverText: "Securely store and manage your health data." },
  { text: "JWT", image: JWT, hoverText: "Keep your login sessions safe and secure." },
  { text: "Markov", image: Markov, hoverText: "Get Next food predictions with our Markov Model." },
  { text: "Chatbot", image: Chatbot, hoverText: "Get instant health advice with our AI chatbot." },
  { text: "History", image: History, hoverText: "Track your past calories consumption and expenditure." },
  { text: "Charting", image: Charting, hoverText: "Visualize your health progress with charts." },
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
