import { useNavigate } from "react-router-dom";
import "./css/homePage.css";

const Navbar = () => {
  const navigate = useNavigate();   

  const handleLogout = () => {
    localStorage.removeItem("token");  
    navigate("/");  
  };

  return (
      <div className="header">
        <nav className="navbar">
            <img src="/assets/favicon.png" alt="Logo" />
            <span style={{marginRight: '1vw'}}> HealthApp </span>

          <ul className="Items">
            <li><a href="">Overview</a></li>
            <li><a href="">Exercise Monitoring</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/bmi"); }}>BMI Calculator</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/nutrient"); }}> Nutrient Tracking</a>
  </li>
          </ul>

          <span style={{marginLeft : "3vw", fontSize :"1.5vw"}}>
            <a href="/" onClick={handleLogout}>Logout</a>  
          </span>
        </nav>
      </div>
  );
};

export default Navbar;
