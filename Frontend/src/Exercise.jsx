import { useState } from "react";

function Exercise() {
    const [activity, setActivity] = useState("");
    const [weight, setWeight]  = useState("");
    const [duration, setDuration] = useState("");
    const [calories, setCalories] = useState("");

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

    return (
        <div id="ex" style={{ backgroundColor: "purple", color: "white", outlineStyle: "solid", outlineColor: "green", outlineOffset: "2px" }}>
            <br/>
            <h1>EXERCISE CALORIES BURNED</h1>
            <br/>
            <form onSubmit={logger}>
                <input 
                    style={{ padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ced4da', borderRadius: '3px', marginRight: "35px", textAlign: "center" }} 
                    id="activity" 
                    placeholder="Exercise/Activity" 
                    value={activity} 
                    onChange={(e) => setActivity(e.target.value)} 
                    required 
                /> 
                <input 
                    style={{ padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ced4da', borderRadius: '3px', textAlign: "center" }} 
                    id="weight" 
                    placeholder="Weight (kg)" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)} 
                    required 
                /><br /> <br/>
                <input 
                    style={{ padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ced4da', borderRadius: '3px', textAlign: "center" }} 
                    id="duration" 
                    placeholder="Duration (mins)" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)} 
                    required 
                /><br /> <br />
                <button style={{ padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ced4da', borderRadius: '3px', textAlign: "center" }} type="submit">Fetch</button><br />
                <div id="replace1">{calories}</div><br />
            </form>
        </div>
    );
}

export default Exercise;
                        