import { useState } from "react";
import Navbar from './Navbar.jsx';

function Bmi() {
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);

  function calculate(event) {
    event.preventDefault();
    const result = (weight / (height * height)) * 10000;
    document.getElementById("replace2").innerText = result;

    const categories = ["underweight", "healthyweight", "overweight", "obesity"];
    categories.forEach(category => {
      const elements = document.getElementsByClassName(category);
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "";
      }
    });

    if (result < 18.5) {
      const elements = document.getElementsByClassName("underweight");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "red";
      }
    } else if (result >= 18.5 && result <= 24.9) {
      const elements = document.getElementsByClassName("healthyweight");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "green";
      }
    } else if (result >= 25 && result <= 29.9) {
      const elements = document.getElementsByClassName("overweight");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "orange";
      }
    } else {
      const elements = document.getElementsByClassName("obesity");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "red";
      }
    }
  }

  function handler(event) {
    if (event.target.id === "height") {
      setHeight(event.target.value);
    } else {
      setWeight(event.target.value);
    }
  }

  const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '2vw',
    backgroundColor: '#f2f2f2',
    textAlign : "center",
  };

  return (
    <>
      <Navbar /> <br/><br/><br/><br/>
      <div id ="bmi" style={{backgroundColor: "purple" , color:"white", outlineStyle: "solid", outlineColor:"black", outlineOffset:"2px"}}>
      <br/>
      <h1 align="center">BMI CALCULATOR & INDICATOR</h1>
      <br/>
      <form onSubmit={calculate}>
        <input style={{ padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ced4da', borderRadius: '3px', marginRight: "35px", textAlign:"center"}} id="height" onChange={handler} placeholder="Height (in cms)" /> <br /><br />
        <input style={{ padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ced4da', borderRadius: '3px', marginRight: "35px",textAlign:"center"}} id="weight" onChange={handler} placeholder="Weight (in kgs)"/> <br /><br />
        <button style={{padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ced4da', borderRadius: '3px',marginRight: "35px"}} type="submit">Submit</button> <br /><br />
      </form>
      </div><br/>
      <br/>
      <div id="replace2"> </div>

      <div style={{ color:" rgb(108,40,97) ", outlineStyle: "solid", outlineColor:"black", outlineOffset:"2px"}}>
      <div style={{ width: '90vw', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center',color:"white",backgroundColor: "Purple"  }}>BMI Categories and Weight Status Mapping</h2> 
        <table style={{ width: '100%', borderCollapse: 'collapse', align:"center" }}>
          <thead>
            <tr>
              <th style={{tableCellStyle, color:"black"}}>BMI</th>
              <th style={{tableCellStyle, color:"black"}}>Weight Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="underweight" style={tableCellStyle}>Below 18.5</td>
              <td className="underweight" style={tableCellStyle}>Underweight</td>
            </tr>
            <tr>
              <td className="healthyweight" style={tableCellStyle}>18.5—24.9</td>
              <td className="healthyweight" style={tableCellStyle}>Healthy Weight</td>
            </tr>
            <tr>
              <td className="overweight" style={tableCellStyle}>25.0—29.9</td>
              <td className="overweight" style={tableCellStyle}>Overweight</td>
            </tr>
            <tr>
              <td className="obesity" style={tableCellStyle}>30.0 and Above</td>
              <td className="obesity" style={tableCellStyle}>Obesity</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

export default Bmi;
