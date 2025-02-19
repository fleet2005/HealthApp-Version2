import LoginPage from './LoginPage.jsx'
import HomePage from './HomePage.jsx';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from './PrivateRoute.jsx';  


//Reason: JSX Differentiation
// Uppercase components (e.g., <LoginPage />) are treated as React components.
// Lowercase elements (e.g., <div>, <span>) are treated as HTML elements

function App()
{
    return (

        <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path='/homepage'  element={<PrivateRoute><HomePage /></PrivateRoute>}/> 
            </Routes>
        </Router>
    );
}

export default App;
