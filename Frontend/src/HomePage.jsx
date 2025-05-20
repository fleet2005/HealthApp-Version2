import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./css/homePage.css";
import NewUser from "./components/NewUser.jsx";
import ChatBot from "./Chatbot.jsx";
import Slider from "./Slider.jsx";
import FlexContainer from "./FlexContainer.jsx";
import Tips from "./Tips.jsx"
import LogoutIcon from "/assets/Logout.png";


const HomePage = () => {
  const navigate = useNavigate();  
  const [chartData, setChartData] = useState([]);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const hasAlertShown = sessionStorage.getItem("alertShown");
  
    if (!hasAlertShown) {
      alert("The Next Food Prediction and Chatbot may take up to 1 minute to respond to the initial request, as the server (Django backend deployment) needs to wake up from a cold start.");
      sessionStorage.setItem("alertShown", "true");
    }
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Redirecting to login.");
          navigate("/");
          return;
        }
        const response = await axios.get(
          `https://health-app-version2-backend.vercel.app/getLast7DaysData?email=${localStorage.getItem("user")}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        const formattedData = response.data.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          consumedCalories: item.nutrition.consumed_energy_kcal,
          burnedCalories: item.exercise.total_calories_burned,
        }));
        setChartData(formattedData);
      } catch (error) {
        if (error.response) {
          console.warn("User data not found. Redirecting to new user setup.");
          setIsNewUser(true);
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");  
    sessionStorage.removeItem("alertShown");
    navigate("/");  
  };

  return (
    <div>
      <div className="header">
        <nav className="navbar">
          <img src="/assets/favicon.png" alt="Logo" />
          <span style={{ marginRight: '3vw' }}> HealthApp </span>
          <ul className="Items">
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/homepage"); }}>
                Overview
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/exercise"); }}>
                Exercise Monitoring
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/bmi"); }}>
                BMI Calculator
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/nutrient"); }}>
                Nutrient Tracking
              </a>
            </li>
          </ul>
          <span style={{ marginLeft: "3vw", fontSize: "1.5vw", display: "flex", alignItems: "center" }}>
              <a href="/" onClick={handleLogout} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                  <img src={LogoutIcon} alt="Logout" style={{ width: "5vw", height: "5vw", marginRight: "0.5vw" }} />
              </a>
          </span>
        </nav>
      </div>
      
      <Slider/>
      <br/><br/><br/>
      <FlexContainer/>
      
      {/* Conditional Display: NewUser or Chart Section */}
      <div style={{ width: "80%", margin: "20px auto" }}>
        {isNewUser ? (
          <NewUser />
        ) : (
          <>
            <h2 style={{ fontWeight: "bold", color: "white" }}>Calories <span style={{ color: "red" }}>Consumed</span> vs. <span style={{ color: "lightgreen" }}>Burned</span> (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consumedCalories" stroke="red" name="Calories Consumed" />
                <Line type="monotone" dataKey="burnedCalories" stroke="lightgreen" name="Calories Burned" />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      <Tips/>

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
    </div>
  );
};

export default HomePage;
