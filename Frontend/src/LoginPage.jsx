import "./css/loginPage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
    const [Visible, SetVisible] = useState(true); // default to Sign In
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");
    const [error, setError] = useState("");
    const [demoMessageVisible, setDemoMessageVisible] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        SetVisible(!Visible);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (Visible) {
                handleLogin(e);
            } else {
                handleRegister(e);
            }
        }
    };

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

    const fillWithDemoCredentials = () => {
        // Force switch to Sign In mode if not already there
        if (!Visible) {
            SetVisible(true);
        }
        SetEmail("user@example.com");
        SetPassword("ungamma");
        setDemoMessageVisible(true);
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
                            marginTop: "-2vw",
                            width: "15vw",
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
                            <h2>Sign In</h2> <br />
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
                            <br />
                            <button
                                type="button"
                                onClick={handleLogin}
                                style={{
                                    backgroundColor: "#28A745",
                                    color: "white",
                                    marginBottom: "-1vw",
                                    fontSize: "1.2vw",
                                    width: "8vw",
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
                            <br />
                            <button
                                type="button"
                                onClick={fillWithDemoCredentials}
                                style={{
                                    backgroundColor: "#FFC107",
                                    color: "black",
                                    fontSize: "1.2vw",
                                    width: "12vw",
                                    border: "none",
                                    borderRadius: "1vw",
                                    cursor: "pointer",
                                    marginTop: "1vw",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#e0a800")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#FFC107")}
                            >
                                Use Demo Account
                            </button>
                            {demoMessageVisible && (
                                <p style={{ marginTop: "0.5vw", fontSize: "1vw", color: "#333" }}>
                                    Please Click Login
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <h2>Sign Up</h2>
                            <br />
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
                            <br />
                            <button
                                type="button"
                                onClick={handleRegister}
                                style={{
                                    backgroundColor: "#28A745",
                                    color: "white",
                                    marginBottom: "-1vw",
                                    height: "3.5vw",
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
                            <br />
                            {/* The demo button here only switches to sign in without autofilling in the register section */}
                            <button
                                type="button"
                                onClick={fillWithDemoCredentials}
                                style={{
                                    backgroundColor: "#FFC107",
                                    color: "black",
                                    fontSize: "1.2vw",
                                    width: "12vw",
                                    border: "none",
                                    borderRadius: "1vw",
                                    cursor: "pointer",
                                    marginTop: "1vw",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#e0a800")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#FFC107")}
                            >
                                Use Demo Account
                            </button>
                            {demoMessageVisible && (
                                <p style={{ marginTop: "0.5vw", fontSize: "1vw", color: "#333" }}>
                                    Please Click Login
                                </p>
                            )}
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
