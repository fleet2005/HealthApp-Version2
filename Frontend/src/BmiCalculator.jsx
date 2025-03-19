import { useState } from "react";
import Navbar from './Navbar.jsx';
import './css/bmi.css';  // Import the new CSS file
import ChatBot from "./chatbot/chatbot/ChatBot.jsx"; // Import the ChatBot component

function Bmi() {
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false); // New state for ChatBot visibility

  function calculate(event) {
    event.preventDefault();
    const result = (weight / (height * height)) * 10000;
    document.getElementById("replace2").innerText = result.toFixed(2);
  
    const categories = ["underweight", "healthyweight", "overweight", "obesity"];
    categories.forEach(category => {
      document.querySelectorAll("." + category).forEach(el => {
        el.classList.remove(
          "highlight-underweight",
          "highlight-healthyweight",
          "highlight-overweight",
          "highlight-obesity"
        );
      });
    });
  
    if (result < 18.5) {
      document.querySelectorAll(".underweight").forEach(el => el.classList.add("highlight-underweight"));
    } else if (result >= 18.5 && result <= 24.9) {
      document.querySelectorAll(".healthyweight").forEach(el => el.classList.add("highlight-healthyweight"));
    } else if (result >= 25 && result <= 29.9) {
      document.querySelectorAll(".overweight").forEach(el => el.classList.add("highlight-overweight"));
    } else {
      document.querySelectorAll(".obesity").forEach(el => el.classList.add("highlight-obesity"));
    }
  }
  
  function handler(event) {
    if (event.target.id === "height") {
      setHeight(event.target.value);
    } else {
      setWeight(event.target.value);
    }
  }

  return (
    <>
      <Navbar />
      <div id="bmi">
        <h1>BMI CALCULATOR & INDICATOR</h1>
        <form onSubmit={calculate}>
          <input id="height" onChange={handler} placeholder="Height (in cm)" />
          <input id="weight" onChange={handler} placeholder="Weight (in kg)" />
          <button type="submit">Calculate BMI</button>
        </form>
      </div>

      <div id="replace2"></div>

      <div className="bmi-table-container">
        <h2>BMI Categories and Weight Status Mapping</h2>
        <table>
          <thead>
            <tr>
              <th>BMI</th>
              <th>Weight Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="underweight">Below 18.5</td>
              <td className="underweight">Underweight</td>
            </tr>
            <tr>
              <td className="healthyweight">18.5—24.9</td>
              <td className="healthyweight">Healthy Weight</td>
            </tr>
            <tr>
              <td className="overweight">25.0—29.9</td>
              <td className="overweight">Overweight</td>
            </tr>
            <tr>
              <td className="obesity">30.0 and Above</td>
              <td className="obesity">Obesity</td>
            </tr>
          </tbody>
        </table>
      </div>
      <br/>

      {/* Chatbot Section */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button 
          className="chatbot-toggle-btn"
          onClick={() => setIsChatbotVisible(!isChatbotVisible)}
        >
          {isChatbotVisible ? 'Hide Chatbot' : 'Show Chatbot'}
        </button>
        <ChatBot 
          isVisible={isChatbotVisible} 
          onToggle={() => setIsChatbotVisible(!isChatbotVisible)} 
        />
      </div>
    </>
  );
}

export default Bmi;
