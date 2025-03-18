import "./css/loginPage.css";
import React, { useState } from "react";
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
    };

    const handleKeyPress = (e) => {
        if(e.key === 'Enter')
        {
            if (Visible) {
                handleLogin(e); // Trigger login if it's the login form
            } else {
                handleRegister(e); // Trigger register if it's the signup form
            }
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://health-app-version2-backend.vercel.app/signin", {
                email: Email,
                password: Password,
            });

            if (response.status === 200) {
                alert("Login Successful!");
                localStorage.setItem("user", Email);
                localStorage.setItem("token", response.data.accessToken);
                console.log(localStorage.getItem("token"));
                navigate("/homepage");
            } else {
                setError("Invalid credentials");
            }
        } catch (error) {
            setError("Invalid email or password");
            console.error("Login error:", error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://health-app-version2-backend.vercel.app/signup", {
                email: Email,
                password: Password,
            });

            if (response.status === 200) {
                alert("Registration Successful! Please Login");
                navigate("/");
            } else {
                setError("Error while Registering");
            }
        } catch (error) {
            setError("Error occurred");
            console.error(error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <form>
                <button
                    className="switch-btn"
                    type="button"
                    onClick={handleClick}
                    style={{
                        backgroundColor: "#6C757D",
                        color: "white",
                        fontSize: "1.2vw",
                        border: "none",
                        borderRadius: "1vw",
                        marginTop : "-2vw",
                        width : "15vw",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
                >
                    {Visible ? "Switch to Sign Up" : "Switch to Sign In"}
                </button>

                    {Visible ? (
                        <>
                            <h2>Sign In</h2> <br/>
                            <label>Email Id:</label>
                            <input
                                type="email"
                                placeholder="Please enter your Email Id"
                                value={Email}
                                onChange={(e) => SetEmail(e.target.value)}
                                required
                            />
                            <label>Password:</label>
                            <input
                                type="password"
                                placeholder="Please enter your Password"
                                value={Password}
                                onChange={(e) => SetPassword(e.target.value)}
                                onKeyDown={handleKeyPress}
                                required
                            />
                            <br/>
                            <button
                                type="button"
                                onClick={handleLogin}
                                style={{
                                    backgroundColor: "#28A745",
                                    color: "white",
                                    marginBottom : "-1vw",
                                    fontSize: "1.2vw",
                                    width : "8vw",
                                    border: "none",
                                    borderRadius: "1vw",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
                            >
                                Login
                            </button>


                        </>
                    ) : (
                        <>
                            <h2>Sign Up</h2>
                            <br/>
                            <label>Email Id:</label>
                            <input
                                type="email"
                                placeholder="Please enter your Email Id"
                                value={Email}
                                onChange={(e) => SetEmail(e.target.value)}
                                required
                            />
                            <label>Password:</label>
                            <input
                                type="password"
                                placeholder="Please enter your Password"
                                value={Password}
                                onChange={(e) => SetPassword(e.target.value)}
                                onKeyDown={handleKeyPress}
                                required
                            />
                            <br/>
                            <button
                                type="button"
                                onClick={handleRegister}
                                style={{
                                    backgroundColor: "#28A745",
                                    color: "white",
                                    marginBottom: "-1vw",
                                    height : "3.5vw",
                                    fontSize: "1.2vw",
                                    width: "8.5vw",
                                    border: "none",
                                    borderRadius: "1vw",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
                            >
                                Register
                            </button>

                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

{/* e.target.value is used to get the current value of an input field in React.

                🔹 Explanation
                e refers to the event object.
                e.target refers to the element that triggered the event (like an <input> field).
                e.target.value gets the current value entered in that input field. */}

// Input is a self closing tag <input/>