import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./css/homePage.css";
import NewUser from "./components/NewUser.jsx";

const HomePage = () => {
  const navigate = useNavigate();  
  const [chartData, setChartData] = useState([]);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Redirecting to login.");
          navigate("/");
          return;
        }
        const response = await axios.get(`http://localhost:5000/getLast7DaysData?email=${localStorage.getItem("user")}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

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

  const handleLogout = () => {
    localStorage.removeItem("token");  
    navigate("/");  
  };

  if (isNewUser) {
    return (
      <div>
        <div className="header">
        <nav className="navbar">
          <img src="/assets/favicon.png" alt="Logo" />
          <span style={{ marginRight: '1vw' }}> HealthApp </span>
          <ul className="Items">
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/homepage"); }}>Overview</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/exercise"); }}>Exercise Monitoring</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/bmi"); }}>BMI Calculator</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/nutrient"); }}> Nutrient Tracking</a></li>
          </ul>
          <span style={{ marginLeft: "3vw", fontSize: "1.5vw" }}>
            <a href="/" onClick={handleLogout}>Logout</a>  
          </span>
        </nav>
      </div>

      <NewUser/>
      
    </div>
    );
  }

  return (
    <div>
      <div className="header">
        <nav className="navbar">
          <img src="/assets/favicon.png" alt="Logo" />
          <span style={{ marginRight: '1vw' }}> HealthApp </span>
          <ul className="Items">
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/homepage"); }}>Overview</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/exercise"); }}>Exercise Monitoring</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/bmi"); }}>BMI Calculator</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/nutrient"); }}> Nutrient Tracking</a></li>
          </ul>
          <span style={{ marginLeft: "3vw", fontSize: "1.5vw" }}>
            <a href="/" onClick={handleLogout}>Logout</a>  
          </span>
        </nav>
      </div>

      {/* Chart Section */}
      <div style={{ width: "80%", margin: "20px auto" }}>
        <h2>Calories Consumed vs. Burned (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="consumedCalories" stroke="#8884d8" name="Calories Consumed" />
            <Line type="monotone" dataKey="burnedCalories" stroke="#82ca9d" name="Calories Burned" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HomePage;
