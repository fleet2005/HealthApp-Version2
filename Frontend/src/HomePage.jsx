import "./css/homePage.css"

const HomePage = () => {
  return (
      <div className="header">
        <nav className="navbar">
            <img src="/assets/favicon.png" alt="Logo" />
            <span style={{marginRight: '1vw'}}> HealthApp </span>

          <ul className="Items">
            <li><a href="/">Overview</a></li>
            <li><a href="/">Exercise Monitoring</a></li>
            <li><a href="/">BMI Calculator</a></li>
            <li><a href="/">Nutrient Tracking</a></li>
          </ul>

          <span style={{marginLeft : "3vw", fontSize :"1.5vw"}}><a href="/">Logout</a></span>
        </nav>
      </div>
  );
};

export default HomePage;
