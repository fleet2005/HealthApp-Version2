const asyncHandler = require("express-async-handler");
const signupmodel = require("./models/UserLoginSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nutrientModel = require("./models/NutrientSchema.js");
const exerciseModel = require("./models/ExerciseSchema.js");
const UserDataModel = require("../models/UserDataSchema");


const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const document = await signupmodel.findOne({ email });

    if (document && await bcrypt.compare(password, document.password)) 
    {
        const accessToken = jwt.sign({
            user : {
                email : document.email,
            },
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1m"});

        res.status(200).json({accessToken}); 
    } 

    else 
    {
        res.status(400).json({"sts":"false"});
    }
});

const signup = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const document = await signupmodel.findOne({email});

    if(document)
    {
        return res.status(400).json({"sts" : "User already exists"});
    }

    if (!password) 
    {
        return res.status(400).json({ "sts": "Password is required" });
    }

    console.log(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    const newDocument = new signupmodel({ email: email, password: hashedPassword});

    await newDocument.save();

    res.status(200).json({"sts": "Registered Successfully"});
});

const nutrient = asyncHandler(async (req, res) => {
    try {
        const { foodName } = req.query;  // Food name from query parameter
        
        const nutrientData = await nutrientModel.find({
            food_name: { $regex: foodName, $options: 'i' } // Case-insensitive partial match
        });

        res.status(200).json(nutrientData);  // Send response

    } catch (error) {
        res.status(500).json({ message: 'Error fetching nutrient data', error: error.message });
    }
});

const exercise = asyncHandler(async (req, res) => {
    try {
        const { exerciseName } = req.query;

        const exerciseData = await exerciseModel.find({
            Activity_Per_Hour: { $regex: exerciseName, $options: 'i' }
        });

        res.status(200).json(exerciseData);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching exercise data', error: error.message });
    }
});
 
const getLast7DaysData = asyncHandler(async (req, res) => {
    const { email } = req.query;

    try {
        const user = await UserDataModel.findOne({ userId: email }, { last7Days: 1, _id: 0 });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.last7Days);
    } catch (error) {
        console.error("Error fetching last 7 days data:", error);
        res.status(500).json({ error: error.message });
    }
});
 
const addEntry = asyncHandler(async (req, res) => {
    const { email, newEntry } = req.body;

    try {
        const user = await UserDataModel.findOne({ userId: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update last7Days with the new entry while keeping only the latest 7
        await UserDataModel.updateOne(
            { userId: email },
            { $push: { last7Days: { $each: [newEntry], $slice: -7 } } }
        );

        res.status(200).json({ message: "Entry added successfully" });
    } catch (error) {
        console.error("Error adding entry:", error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = { signin, signup, nutrient, exercise, getLast7DaysData, addEntry};
