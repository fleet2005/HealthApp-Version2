import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import './css/nutrientPage.css'; // Importing external CSS

function Nutrient() {
    const [url, setUrl] = useState(null);
    const [inputFields, setInputFields] = useState([{ name: '', weight: '' }]);

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
        </div>
    );
}

export default Nutrient;
