const express = require("express");
const router = express.Router();
const { signin, signup, nutrient, exercise, getLast7DaysData, addOrUpdateUserData } = require("./controllerFunction");

router.post('/signin', signin);  

router.post('/signup', signup);

router.get("/", (req, res) => res.json({"message" : "backend success"}));

router.get("/nutrient", nutrient);

router.get("/exercise", exercise);

router.get("/getLast7DaysData", getLast7DaysData);

router.post("/addOrUpdateUserData", addOrUpdateUserData);

module.exports = router;
