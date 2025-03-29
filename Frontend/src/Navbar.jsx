import { useNavigate } from "react-router-dom";
import LogoutIcon from "/assets/Logout.png";
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
            <span style={{marginRight: '3vw'}}> HealthApp </span>

          <ul className="Items">
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/homepage"); }}>Overview</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/exercise"); }}>Exercise Monitoring</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/bmi"); }}>BMI Calculator</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/nutrient"); }}> Nutrient Tracking</a></li>
          </ul>

          <span style={{ marginLeft: "3vw", fontSize: "1.5vw", display: "flex", alignItems: "center" }}>
            <a href="/" onClick={handleLogout} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                <img src={LogoutIcon} alt="Logout" style={{ width: "5vw", height: "5vw", marginRight: "0.5vw" }} />
            </a>
          </span>
        </nav>
      </div>
  );
};

export default Navbar;
