import LoginPage from './LoginPage.jsx'
import HomePage from './HomePage.jsx';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from './PrivateRoute.jsx';  
import Nutrient from './Nutrient.jsx';
import Bmi from './BmiCalculator.jsx';

//Reason: JSX Differentiation
// Uppercase components (e.g., <LoginPage />) are treated as React components.
// Lowercase elements (e.g., <div>, <span>) are treated as HTML elements

function App()
{
    return (

        <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path='/homepage'  element={<PrivateRoute> <HomePage/> </PrivateRoute>}/> 
              <Route path='/nutrient'  element={<PrivateRoute> <Nutrient/> </PrivateRoute>}/> 
              <Route path='/bmi' element={<PrivateRoute> <Bmi/> </PrivateRoute>}/> 
            </Routes>
        </Router>
    );
}

export default App;
