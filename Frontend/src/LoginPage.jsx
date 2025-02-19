import "./css/loginPage.css"
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const LoginPage = () => {

    const [Visible, SetVisible] = useState(false);
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleClick = () => {
        SetVisible(!Visible);
    }

    const handleLogin = async (e) => {

        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/signin", {
                email : Email,
                password : Password,
            });
            
            if (response.status === 200) {
                alert("Login Successful!");
                localStorage.setItem("token", response.data.accessToken); 
                navigate("/homepage"); 
            } else {
                setError("Invalid credentials");
            }
        }

        catch (error) {
            setError("Invalid email or password");
            console.error("Login error:", error);
        }

    }

    const handleRegister = async (e) =>{
        
        e.preventDefault();
        try{

            const response = await axios.post("http://localhost:5000/signup", {
                email : Email,
                password : Password,
            });

            if (response.status === 200) {
                alert("Registration Successful! Please Login");
                navigate("/"); 
            } else {
                setError("Error while Registering");
            }
        }
        catch(error)
        {
            setError("Error occured");
            console.error(error);
        }

    }

    return(
        <div className = "login-page">
            <div className = "login-box" >

                {Visible && ( 
                    <form>
                        <button type = "button" onClick={handleClick}> Sign In </button> 
                        <label> Email Id : </label>
                        <input
                            type = "email"
                            placeholder = "Please enter the Email Id"
                            value = {Email}
                            onChange={(e) => SetEmail(e.target.value)}
                            required
                        />
                        <label> Password : </label>
                        <input
                            type = "password"
                            placeholder = "Please enter the Password"
                            value = {Password}
                            onChange={(e) => SetPassword(e.target.value)}
                            required
                        />
                        <button type = "button" onClick={handleLogin}>Login</button>
                    </form>
                    
                )}
            </div>

            <div className="login-box">
                
                {!Visible && (
                    <form>
                    <button type = "button" onClick={handleClick}> Sign Up </button> 
                    <label> Email Id : </label>
                    <input
                        type = "email"
                        placeholder = "Please enter the Email Id"
                        value = {Email}
                        onChange={(e) => SetEmail(e.target.value)}
                        required
                    />
                    <label> Password : </label>
                    <input
                        type = "password"
                        placeholder = "Please enter the Password"
                        value = {Password}
                        onChange={(e) => SetPassword(e.target.value)} 
                        required
                    />

                    <button type="button" onClick={handleRegister}>Register</button>

                </form>
                )}
            </div>
            
        </div>
    );

}

export default LoginPage;


{/* e.target.value is used to get the current value of an input field in React.

                🔹 Explanation
                e refers to the event object.
                e.target refers to the element that triggered the event (like an <input> field).
                e.target.value gets the current value entered in that input field. */}

// Input is a self closing tag <input/>