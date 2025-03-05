const express = require("express");
const router = express.Router();
const { signin, signup, nutrient, exercise, getLast7DaysData, addOrUpdateUserData } = require("./controllerFunction");
const authenticateJWT = require("./authMiddleware");

// Public Routes (No authentication required)
router.post('/signin', signin);
router.post('/signup', signup);
router.get("/", (req, res) => res.json({ "message": "backend success" }));
router.get("/nutrient", nutrient);
router.get("/exercise", exercise);

// Protected Routes (Require authentication)
router.get("/getLast7DaysData", authenticateJWT, getLast7DaysData);
router.post("/addOrUpdateUserData", authenticateJWT, addOrUpdateUserData);

module.exports = router;
