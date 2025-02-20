import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import './css/nutrientPage.css'; // Importing external CSS

function Nutrient() {
    const [url, setUrl] = useState(null);
    const [inputFields, setInputFields] = useState([{ name: '', weight: '' }]);
    const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
    console.log(API_KEY)

    function logger(event) {
        event.preventDefault();
        const base_url = "https://api.api-ninjas.com/v1/nutrition?query=";
        const query = inputFields.map(item => `${item.weight} ${item.name}`).join(', ');
        setUrl(base_url + query);
    }

    const handleInputChange = (index, event) => {
        const values = [...inputFields];
        values[index][event.target.name] = event.target.value;
        setInputFields(values);
    };

    const handleAddFields = () => {
        setInputFields([...inputFields, { name: '', weight: '' }]);
    };

    const handleRemoveFields = index => {
        const values = [...inputFields];
        values.splice(index, 1);
        setInputFields(values);
    };

    useEffect(() => {
        async function fetchData() {
            if (!url) return;
            try {
                const headers = new Headers();
                headers.append('X-Api-Key', API_KEY);
                const response = await fetch(url, { headers });
                const data = await response.json();
                console.log(data);
                const repl = document.getElementById('replace');
                repl.innerText = "";
                data.items.forEach(item => {
                    const para = document.createElement('p');
                    para.innerText = `Item Name: ${item.name}, Calories: ${item.calories}, Fats: ${item.fat_total_g}`;
                    repl.appendChild(para);
                });
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
                            />
                            <input
                                type="text"
                                name="weight"
                                placeholder="Quantity"
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
