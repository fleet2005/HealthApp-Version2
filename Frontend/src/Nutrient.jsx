import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import './css/nutrientPage.css'; // Importing external CSS
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from "axios";

function Nutrient() {
    const [url, setUrl] = useState(null);
    const [inputFields, setInputFields] = useState([{ name: '', weight: '' }]);
    const [calorieData, setCalorieData] = useState([]);
    const [macroData, setMacroData] = useState([]);
    const userEmail = localStorage.getItem("Email");
    const authToken = localStorage.getItem("AuthToken");

    function logger(event) { 
        event.preventDefault();
        if (inputFields.length === 0) return;

        const food = encodeURIComponent(inputFields[0].name); // Taking only the first food item for now
        const finalUrl = `http://localhost:5000/nutrient?foodName=${food}`;
        setUrl(finalUrl);
    }

    const handleInputChange = (index, event) => {
        const values = [...inputFields];
        values[index][event.target.name] = event.target.value;
        setInputFields(values);
    };

    const handleAddFields = () => {
        setInputFields([...inputFields, { name: '', weight: '' }]);
    };

    const handleRemoveFields = (index) => {
        setInputFields(inputFields.filter((_, i) => i !== index));
    };

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
            const response = await axios.get(`http://localhost:5000/getLast7DaysData?email=${localStorage.getItem("user")}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("Fetched Data:", response.data);
            
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
            console.error("Error fetching data:", error);
          }
        }
        fetchContent();
      }, [userEmail, authToken]);

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
                            <button type="button" onClick={() => handleRemoveFields(index)}>Remove</button>
                        </div>
                    ))}  
                    <button type="button" onClick={handleAddFields}>Add-Item</button>
                    <button type="submit">Submit</button>
                </form>
                <div id="replace"></div>
            </div>
            
            {/* Bar Chart for Calories */}
            <h2>Calories Consumed Over Last 7 Days</h2>
            <ResponsiveContainer width="80%" height={300}>
                <BarChart data={calorieData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Calories" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            
            {/* Pie Chart for Macros */}
            <h2>Protein vs Fat Distribution</h2>
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
    );
}

export default Nutrient;
