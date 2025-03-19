import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './Navbar.jsx';
import './css/nutrientPage.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from "axios";
import NewUser from "./components/NewUser.jsx";
import debounce from 'lodash/debounce';
import ChatBot from "./chatbot/chatbot/ChatBot.jsx"; // Import ChatBot component

function Nutrient() {
    const [url, setUrl] = useState(null);
    const [inputFields, setInputFields] = useState([{ name: '', weight: '' }]);
    const [calorieData, setCalorieData] = useState([]);
    const [macroData, setMacroData] = useState([]);
    const [isNewUser, setIsNewUser] = useState(false);
    const [prediction, setPrediction] = useState("rice");
    const userEmail = localStorage.getItem("Email");
    const authToken = localStorage.getItem("AuthToken");
    const [isChatbotVisible, setIsChatbotVisible] = useState(false); // New state for ChatBot visibility

    // Function to fetch prediction
    const fetchPrediction = async (foodName) => {
        if (!foodName) return; // Don't fetch if food name is empty
        try {
            console.log("Fetching prediction for:", foodName); // Debug log
            
            // Use the proxied URL
            const response = await axios.post('https://healthapp-version2-10.onrender.com/predict/', {
                food_name: foodName
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("Prediction response:", response.data); // Debug log
            
            if (response.data.predictions && response.data.predictions.length > 0) {
                setPrediction(response.data.predictions[0]);
            } else {
                setPrediction("No prediction available");
            }
        } catch (error) {
            console.error('Error fetching prediction:', error);
            setPrediction("Error getting prediction");
        }
    };

    // Debounced version of fetchPrediction
    const debouncedFetchPrediction = useCallback(
        debounce((foodName) => {
            fetchPrediction(foodName);
        }, 500),
        []
    );

    function logger(event) { 
        event.preventDefault();
        if (inputFields.length === 0) return;

        const food = encodeURIComponent(inputFields[0].name);
        const finalUrl = `https://health-app-version2-backend.vercel.app/nutrient?foodName=${food}`;
        setUrl(finalUrl);
        
        // Fetch new prediction after adding food
        fetchPrediction(food);
    }

    const handleInputChange = (index, event) => {
        const values = [...inputFields];
        values[index][event.target.name] = event.target.value;
        setInputFields(values);

        // If the name field is being changed, trigger prediction
        if (event.target.name === 'name') {
            const newValue = event.target.value;
            console.log("Input changed to:", newValue); // Debug log
            debouncedFetchPrediction(newValue);
        }
    };

    const handleAddFields = () => {
        setInputFields([...inputFields, { name: '', weight: '' }]);
    };

    const handleRemoveFields = (index) => {
        setInputFields(inputFields.filter((_, i) => i !== index));
    };

    const handlePredictionClick = () => {
        if (prediction === "No prediction available" || prediction === "Error getting prediction") {
            return; // Don't add invalid predictions
        }
        setInputFields([...inputFields, { name: prediction, weight: '1' }]);
        // Fetch new prediction after adding the predicted food
        fetchPrediction(prediction);
    };

    // Cleanup debounced function on component unmount
    useEffect(() => {
        return () => {
            debouncedFetchPrediction.cancel();
        };
    }, [debouncedFetchPrediction]);

    // Initial prediction fetch
    useEffect(() => {
        if (inputFields[0]?.name) {
            fetchPrediction(inputFields[0].name);
        }
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (!url) return;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);

                const repl = document.getElementById('replace');
                repl.innerText = "";
                
                if (data) {
                    const para = document.createElement('p');
                    para.innerText = `Item Name: ${data.food_name}, Calories: ${data.calories}, Fats: ${data.fat_total_g}`;
                    repl.appendChild(para);
                } else {
                    repl.innerText = "No data found.";
                }

            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [url]);

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

            console.log("Fetched Data:", response.data);
            
            if (!response.data || response.data.length === 0) {
                setIsNewUser(true);
                return;
            }

            const formattedCalorieData = response.data.map((entry, index) => ({
                name: `Day ${index + 1}`,
                Calories: entry.nutrition.consumed_energy_kcal
            }));
            setCalorieData(formattedCalorieData);
            
            const latestEntry = response.data[response.data.length - 1].nutrition;
            setMacroData([ 
                { name: "Protein", value: latestEntry.consumed_protein_g },
                { name: "Fat", value: latestEntry.consumed_fat_g }
            ]);
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
        <div>
            <Navbar /> <br/><br/><br/><br/>
            <div id="fetching">
                <form onSubmit={logger}>
                    <label> Calories Gained Through Eating</label>  
                    {inputFields.map((inputField, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Item-Name"
                                value={inputField.name}
                                onChange={event => handleInputChange(index, event)}
                                required
                            />
                            <input
                                type="text"
                                name="weight"
                                placeholder="Quantity (not used now)"
                                value={inputField.weight}
                                onChange={event => handleInputChange(index, event)}
                            />
                            <button type="button" onClick={() => handleRemoveFields(index)} className="remove-item">Remove</button>
                        </div>
                    ))}  
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button type="button" onClick={handleAddFields} className="add-item">Add-Item</button>
                        <span 
                            onClick={handlePredictionClick}
                            style={{ 
                                cursor: prediction === "No prediction available" || prediction === "Error getting prediction" ? 'default' : 'pointer',
                                opacity: 0.7,
                                padding: '5px 10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                backgroundColor: '#f8f9fa'
                            }}
                        >
                            Suggested: {prediction}
                        </span>
                    </div>
                    <button type="submit">Submit</button>
                </form>
                <div id="replace"></div>
            </div>
            
            {/* Bar Chart for Calories */}
            <h2>Calories Consumed: Last 7 Entries</h2>
            <div className="chart-container">
                <ResponsiveContainer width="80%" height={300}>
                    <BarChart data={calorieData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Calories" fill="#dc3545" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            {/* Pie Chart for Macros */}
            <h2>Protein vs Fat Distribution</h2>
            <div className="chart-container">
                <ResponsiveContainer width="50%" height={300}>
                    <PieChart>
                        <Pie data={macroData} dataKey="value" nameKey="name" outerRadius={100} label>
                            <Cell key="Protein" fill="#82ca9d" />
                            <Cell key="Fat" fill="#ff7300" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
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
        </div>
    );
}

export default Nutrient;
