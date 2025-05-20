import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './Navbar.jsx';
import './css/nutrientPage.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from "axios";
import NewUser from "./components/NewUser.jsx";
import debounce from 'lodash/debounce';
import ChatBot from "./Chatbot.jsx"; // Import ChatBot component

function Nutrient() {
  // State declarations
  const [url, setUrl] = useState(null);
  const [inputFields, setInputFields] = useState([{ name: '', weight: '' }]);
  const [calorieData, setCalorieData] = useState([]);
  const [macroData, setMacroData] = useState([]);
  const [isNewUser, setIsNewUser] = useState(false);
  const [prediction, setPrediction] = useState("rice");
  const userEmail = localStorage.getItem("Email");
  const authToken = localStorage.getItem("AuthToken");
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  console.log("[INIT] Component rendered");
  console.log("[INIT] User Email:", localStorage.getItem('user'), "Auth Token:", localStorage.getItem('token'));

  // Function to fetch prediction from backend for a given food name.
  const fetchPrediction = async (foodName) => {
    if (!foodName) {
      console.log("[PREDICTION] No food name provided.");
      return;
    }
    try {
      console.log("[PREDICTION] Fetching prediction for:", foodName);
      const response = await axios.post(
        'https://healthapp-version2-10.onrender.com/predict/',
        { food_name: foodName },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log("[PREDICTION] Response:", response.data);
      if (response.data.predictions && response.data.predictions.length > 0) {
        setPrediction(response.data.predictions[0]);
        console.log("[PREDICTION] Prediction set to:", response.data.predictions[0]);
      } else {
        setPrediction("No prediction available");
        console.log("[PREDICTION] No valid prediction received.");
      }
    } catch (error) {
      console.error("[PREDICTION] Error fetching prediction:", error);
      setPrediction("Error getting prediction");
    }
  };

  // Debounced function to avoid rapid API calls.
  const debouncedFetchPrediction = useCallback(
    debounce((foodName) => {
      fetchPrediction(foodName);
    }, 500),
    []
  );

  // Logger function - submit form data and fetch nutrition data.
  async function logger(event) {
    event.preventDefault();
    console.log("[SUBMIT] Form submission triggered.");

    if (inputFields.length === 0) {
      console.log("[SUBMIT] No input fields available. Aborting submission.");
      return;
    }

    const email = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    // Retrieve exerciseData from localStorage; ensure it's an object with total_calories_burned.
    const exerciseData = JSON.parse(localStorage.getItem("exerciseData")) || { total_calories_burned: 0 };

    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;

    // Process each food item from the input fields.
    for (const field of inputFields) {
      const food = field.name.trim();
      // Parse the weight as a number. Default to 0 if invalid.
      const weight = parseFloat(field.weight) || 0;

      // If either food name is missing or weight is zero, skip the Day.
      if (!food || weight <= 0) {
        console.warn(`[SUBMIT] Skipping food "${food}" with weight "${field.weight}"`);
        continue;
      }

      console.log(`[SUBMIT] Fetching nutrition data for: ${food} (Weight: ${weight} g)`);
      try {
        const response = await axios.get(`https://health-app-version2-backend.vercel.app/nutrient?foodName=${encodeURIComponent(food)}`);
        // Assume response.data returns an array and take the first object.
        const nutritionData = response.data;
        if (Array.isArray(nutritionData) && nutritionData.length > 0) {
          const data = nutritionData[0];
          // Multiply by (weight / 100) since nutrition data is per 100g.
          totalCalories += (data.energy_kcal || 0) * (weight / 100);
          totalProtein += (data.protein_g || 0) * (weight / 100);
          totalFat += (data.fat_g || 0) * (weight / 100);
          console.log(`[SUBMIT] Data for ${food}:`, data);
        } else {
          console.warn(`[SUBMIT] No nutrition data received for ${food}.`);
        }
      } catch (error) {
        console.error(`[SUBMIT] Error fetching nutrition data for ${food}:`, error);
      }
    }

    // Construct the new Day including exercise data.
    const today = new Date();
    const newEntry = {
      date: today.toLocaleDateString('en-CA'),
      nutrition: {
        consumed_energy_kcal: totalCalories,
        consumed_protein_g: totalProtein,
        consumed_fat_g: totalFat
      },
      exercise: {
        total_calories_burned: exerciseData.total_calories_burned || 0
      }
    };
    console.log(newEntry.date);
    console.log("[SUBMIT] New Day to be submitted:", newEntry);

    try {
      const submissionResponse = await axios.post(
        "https://health-app-version2-backend.vercel.app/addOrUpdateUserData",
        { email, newEntry },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      console.log("[SUBMIT] Backend submission response:", submissionResponse.data);
      alert("Data submitted successfully!");

      // Display nutritional info on the page.
      const repl = document.getElementById('replace');
      if (repl) {
        repl.innerHTML = `
          <div style="text-align: center;">
            <p style="color: white;"><strong>Total Calories:</strong> ${totalCalories.toFixed(2)} kcal</p>
            <p style="color: white;"><strong>Total Protein:</strong> ${totalProtein.toFixed(2)} g</p>
            <p style="color: white;"><strong>Total Fat:</strong> ${totalFat.toFixed(2)} g</p>
            <p style="color: white;"><strong>Total Exercise Calories:</strong> ${exerciseData.total_calories_burned} kcal</p>
          </div>
        `;
      }
      
    } catch (error) {
      console.error("[SUBMIT] Error during data submission:", error);
      alert("Failed to submit data. Please try again.");
    }
  }

  // Handle changes in input fields and trigger prediction for the name field.
  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
    console.log("[INPUT] Updated inputFields:", values);

    if (event.target.name === 'name') {
      const newValue = event.target.value;
      console.log("[INPUT] Name changed to:", newValue);
      debouncedFetchPrediction(newValue);
    }
  };

  // Adds a new food input field.
  const handleAddFields = () => {
    setInputFields([...inputFields, { name: '', weight: '' }]);
    console.log("[INPUT] Added new field. Current fields:", inputFields);
  };

  // Removes a specific food input field.
  const handleRemoveFields = (index) => {
    const updatedFields = inputFields.filter((_, i) => i !== index);
    setInputFields(updatedFields);
    console.log("[INPUT] Removed field at index", index, ". Updated fields:", updatedFields);
  };

  // When prediction text is clicked, add it as a new food item.
  const handlePredictionClick = () => {
    if (prediction === "No prediction available" || prediction === "Error getting prediction") {
      console.log("[PREDICTION] Clicked, but prediction is not valid:", prediction);
      return;
    }
    // Add the predicted food to the input fields with a default weight (e.g., 1g or 100g as needed)
    setInputFields([...inputFields, { name: prediction, weight: '100' }]);
    console.log("[PREDICTION] Added prediction to input fields:", prediction);
    // Optionally fetch a new prediction after accepting the current one.
    fetchPrediction(prediction);
  };

  // Cleanup the debounced function on component unmount.
  useEffect(() => {
    return () => {
      debouncedFetchPrediction.cancel();
      console.log("[CLEANUP] Debounced function cancelled.");
    };
  }, [debouncedFetchPrediction]);

  // Fetch initial prediction if the first input field has a name.
  useEffect(() => {
    if (inputFields[0]?.name) {
      console.log("[INIT] Fetching initial prediction for:", inputFields[0].name);
      fetchPrediction(inputFields[0].name);
    }
  }, []);

  // Optional: If URL is set, fetch data from it.
  useEffect(() => {
    async function fetchData() {
      if (!url) return;
      console.log("[FETCH URL] Fetching data from URL:", url);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("[FETCH URL] Data received:", data);
        const repl = document.getElementById('replace');
        if (repl) {
          repl.innerText = "";
          if (data) {
            const para = document.createElement('p');
            para.innerText = `Item Name: ${data.food_name}, Calories: ${data.energy_kcal}, Fats: ${data.fat_g}`;
            repl.appendChild(para);
          } else {
            repl.innerText = "No data found.";
          }
        }
      } catch (error) {
        console.error("[FETCH URL] Error fetching data:", error);
      }
    }
    fetchData();
  }, [url]);

  // Fetch the last 7 days of user data to update charts or mark as new user.
  useEffect(() => {
    async function fetchContent() {
      console.log("[DATA] Fetching last 7 days data for user:", userEmail);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://health-app-version2-backend.vercel.app/getLast7DaysData?email=${localStorage.getItem("user")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        console.log("[DATA] Fetched Data:", response.data);
        if (!response.data || response.data.length === 0) {
          console.log("[DATA] No user data found. Marking as new user.");
          setIsNewUser(true);
          return;
        }
        const formattedCalorieData = response.data.map((Day, index) => ({
          name: `Day ${index + 1}`,
          Calories: Day.nutrition.consumed_energy_kcal
        }));
        setCalorieData(formattedCalorieData);
        console.log("[DATA] Calorie data set:", formattedCalorieData);

        const latestEntry = response.data[response.data.length - 1].nutrition;
        const formattedMacroData = [
          { name: "Protein", value: latestEntry.consumed_protein_g },
          { name: "Fat", value: latestEntry.consumed_fat_g }
        ];
        setMacroData(formattedMacroData);
        console.log("[DATA] Macro data set:", formattedMacroData);
      } catch (error) {
        console.warn("[DATA] Error fetching user data:", error);
        setIsNewUser(true);
      }
    }
    fetchContent();
  }, [userEmail, authToken]);

  return (
    <div>
      <Navbar />
      <br /><br /><br /><br /><br/><br/>
      <div id="fetching">
        <form onSubmit={logger}>
        <label style={{ fontWeight: "bold", color: "white", fontSize: "1.8vw" }}>Calories Gained Through Eating</label>
          {inputFields.map((inputField, index) => (
            <div key={index}>
              <input
                type="text"
                name="name"
                placeholder="Item-Name"
                value={inputField.name}
                onChange={(event) => handleInputChange(index, event)}
                required
              />
              <input
                type="text"
                name="weight"
                placeholder="Quantity in gms"
                value={inputField.weight}
                onChange={(event) => handleInputChange(index, event)}
              />
              <button
                type="button"
                onClick={() => handleRemoveFields(index)}
                className="remove-item"
              >
                Remove
              </button>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="button" onClick={handleAddFields} className="add-item">
              Add-Item
            </button>
            <span
              onClick={handlePredictionClick}
              style={{
                cursor: (prediction === "No prediction available" || prediction === "Error getting prediction") ? 'default' : 'pointer',
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
      {isNewUser ? (
        <NewUser />
      ) : (
        <>
        <br/><br/><br/>
          <h2 style={{ fontWeight: "bold", color: "white", fontSize: "1.8vw" }}>Calories Consumed: Last 7 Entries</h2>
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
          <br/><br/><br/><br/>
          <h2 style={{ fontWeight: "bold", color: "white", fontSize: "1.8vw" }}>Protein vs Fat Distribution</h2>
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
        </>
      )}
      <br />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          className="chatbot-toggle-btn"
          onClick={() => {
            setIsChatbotVisible(!isChatbotVisible);
            console.log("[CHATBOT] Toggled chatbot visibility:", !isChatbotVisible);
          }}
        >
          {isChatbotVisible ? 'Hide Chatbot' : 'Show Chatbot'}
        </button>
        <ChatBot
          isVisible={isChatbotVisible}
          onToggle={() => {
            setIsChatbotVisible(!isChatbotVisible);
            console.log("[CHATBOT] onToggle callback invoked. New state:", !isChatbotVisible);
          }}
        />
      </div>
    </div>
  );
}

export default Nutrient;
