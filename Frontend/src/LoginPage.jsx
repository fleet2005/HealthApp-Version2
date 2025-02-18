import "./css/loginPage.css"
import React, {useState} from "react";



const LoginPage = () => {

    const [Visible, SetVisible] = useState(false);
    const [Email, SetEmail] = useState("");
    const [Password, SetPassword] = useState("");

    const handleClick = () => {
        SetVisible(!Visible);
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
                            onChange={(e) => SetEmail(e.target.value)}
                            required
                        />
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