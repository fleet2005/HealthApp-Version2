const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get token from "Authorization" header
  if (!token) {
    return res.status(403).json({ message: "Access Denied" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = user; // Add the decoded user to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateJWT;

// const express = require("express");
// const authenticateJWT = require("./authMiddleware");
// const router = express.Router();

// // Example of a protected route
// router.get("/user-data", authenticateJWT, (req, res) => {
//   // This route is now protected
//   // Access user data using req.user, which was set by the JWT middleware
//   res.json({ message: "Protected user data", user: req.user });
// });

// module.exports = router;
