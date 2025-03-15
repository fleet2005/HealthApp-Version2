import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import NewUser from "./NewUser";

function Exercise() {
    const [chartData, setChartData] = useState([]);
    const [activity, setActivity] = useState("");
    const [weight, setWeight] = useState("");
    const [duration, setDuration] = useState("");
    const [calories, setCalories] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);
    const userEmail = localStorage.getItem("Email");
    const authToken = localStorage.getItem("AuthToken");

    async function logger(event) {
        event.preventDefault();

        // Convert weight to pounds
        const weightInPounds = weight * 2.204723;
        setWeight(weightInPounds);

        if (!activity || !duration) {
            alert("Please fill in all fields!");
            return;
        }

        try {
            const finalurl = `http://localhost:5000/exercise?exerciseName=${activity}`;
            const response = await fetch(finalurl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Data:", data);

            if (data && data.length > 0) {
                setCalories(`${data[0].total_calories} Calories`);
            } else {
                setCalories("No data available");
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
                const response = await axios.get(`http://localhost:5000/getLast7DaysData?email=${localStorage.getItem("user")}`, {
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
                console.warn("User data not found. Redirecting to new user setup.");
                setIsNewUser(true);
            }
        }
        fetchContent();
    }, [userEmail, authToken]);

    if (isNewUser) {
        return (
            <div>
                <Navbar />
                <NewUser />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <br/><br/><br/><br/>
            <div id="ex" style={{ backgroundColor: "purple", color: "white", outlineStyle: "solid", outlineColor: "green", outlineOffset: "2px" }}>
                <br/>
                <h1>EXERCISE CALORIES BURNED</h1>
                <br/>
                <form onSubmit={logger}>
                    <input 
                        style={{ padding: "0.5rem", marginBottom: "1rem", border: "1px solid #ced4da", borderRadius: "3px", marginRight: "35px", textAlign: "center" }} 
                        id="activity" 
                        placeholder="Exercise/Activity" 
                        value={activity} 
                        onChange={(e) => setActivity(e.target.value)} 
                        required 
                    /> 
                    <input 
                        style={{ padding: "0.5rem", marginBottom: "1rem", border: "1px solid #ced4da", borderRadius: "3px", textAlign: "center" }} 
                        id="weight" 
                        placeholder="Weight (kg)" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)} 
                        required 
                    /><br /> <br/>
                    <input 
                        style={{ padding: "0.5rem", marginBottom: "1rem", border: "1px solid #ced4da", borderRadius: "3px", textAlign: "center" }} 
                        id="duration" 
                        placeholder="Duration (mins)" 
                        value={duration} 
                        onChange={(e) => setDuration(e.target.value)} 
                        required 
                    /><br /> <br />
                    <button style={{ padding: "0.5rem", marginBottom: "1rem", border: "1px solid #ced4da", borderRadius: "3px", textAlign: "center" }} type="submit">Fetch</button><br />
                    <div id="replace1">{calories}</div><br />
                </form>
            </div>

            {/* Chart Section */}
            <div style={{ width: "80%", margin: "20px auto" }}>
                <h2>Calories Expended Over Last 7 Days</h2>
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
        </>
    );
}

export default Exercise;
