import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import NewUser from "./components/NewUser.jsx";
import ChatBot from "./chatbot/chatbot/ChatBot.jsx";
import "./css/exercise.css";

function Exercise() {
    const [chartData, setChartData] = useState([]);
    const [activity, setActivity] = useState("");
    const [weight, setWeight] = useState("");
    const [duration, setDuration] = useState("");
    const [calories, setCalories] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);
    const [isChatbotVisible, setIsChatbotVisible] = useState(false);
    const userEmail = localStorage.getItem("Email");
    const authToken = localStorage.getItem("AuthToken");

    async function logger(event) {
        event.preventDefault();

        if (!activity || !duration || !weight) {
            alert("Please fill in all fields!");
            return;
        }

        try {
            const finalurl = `https://health-app-version2-backend.vercel.app/exercise?exerciseName=${activity}`;
            const response = await fetch(finalurl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Data:", data);

            if (data && data.length > 0) {
                const caloriesPerKg = data[0].Calories_Per_Kg || null;
                if (caloriesPerKg !== null) {
                    const calculatedCalories = caloriesPerKg * weight * duration/60;
                    setCalories(`${calculatedCalories.toFixed(2)} Calories`);
                    const exerciseData = { total_calories_burned: parseFloat(calculatedCalories.toFixed(2)) };
                    localStorage.setItem("exerciseData", JSON.stringify(exerciseData));
                } else {
                    setCalories("Exercise data not found, Apologies");
                }
            } else {
                setCalories("Exercise data not found, Apologies");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setCalories("Error fetching data");
        }
    }

    useEffect(() => {
        async function fetchContent() {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`https://health-app-version2-backend.vercel.app/getLast7DaysData?email=${localStorage.getItem("user")}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                
                if (!response.data || response.data.length === 0) {
                    setIsNewUser(true);
                    return;
                }

                const formattedData = response.data.map(item => ({
                    date: new Date(item.date).toLocaleDateString(),
                    burnedCalories: item.exercise.total_calories_burned,
                }));

                setChartData(formattedData);
            } catch (error) {
                console.warn("User data not found. Displaying new user setup.");
                setIsNewUser(true);
            }
        }
        fetchContent();
    }, [userEmail, authToken]);

    return (
        <>
            <Navbar />
            <div id="ex">
                <br/>
                <h1>EXERCISE CALORIES BURNED</h1>
                <form onSubmit={logger}>
                    <input id="activity" placeholder="Exercise/Activity" value={activity} onChange={(e) => setActivity(e.target.value)} required /> 
                    <input id="weight" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required /><br />
                    <input id="duration" placeholder="Duration (mins)" value={duration} onChange={(e) => setDuration(e.target.value)} required /><br />
                    <button type="submit">Fetch</button>
                </form>
                <div id="replace1">{calories}</div>
            </div>

            {isNewUser ? <NewUser /> : (
                <div className="chart-container">
                    <h2>Calories Expended - Last 7 Entries</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="burnedCalories" fill="#82ca9d" name="Calories Burned" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
            <br/>
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
        </>
    );
}

export default Exercise;
