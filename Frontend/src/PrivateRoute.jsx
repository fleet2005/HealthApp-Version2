import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("token"); 

  return isLoggedIn ? children : <Navigate to="/" replace />;  
};

export default PrivateRoute;

//for frontend route protection - private route
//for protected backend api endpoint access - jwt