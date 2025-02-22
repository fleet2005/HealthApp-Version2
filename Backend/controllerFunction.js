const asyncHandler = require("express-async-handler");
const signupmodel = require("./models/UserLoginSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nutrientModel = require("./models/NutrientSchema.js");
const exerciseModel = require("./models/ExerciseSchema.js");
const PrevDataModel = require('./models/PrevSchema.js');  



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
    console.log(email);

    try {
        // Find the user by email
        const user = await PrevDataModel.findOne({ email }, { entries: 1, _id: 0 });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send the last 7 entries
        res.status(200).json(user.entries.slice(-7));  // Only return the last 7 entries
    } catch (error) {
        console.error("Error fetching last 7 days data:", error);
        res.status(500).json({ error: error.message });
    }
});

const addOrUpdateUserData = asyncHandler(async (req, res) => {
    const { email, newEntry } = req.body;  // Make sure newEntry is in the request body

    try {
        // Find the user by email
        let userData = await PrevDataModel.findOne({ email });

        if (!userData) {
            // If user doesn't exist, create a new document with the first entry
            userData = new PrevDataModel({
                email,
                entries: [newEntry],  // Add the new entry to the entries array
            });
        } else {
            // If user exists, push the new entry into the entries array
            userData.entries.push(newEntry);
        }

        // Save the document and ensure we only keep 7 entries (handled by schema)
        await userData.save();
        
        res.status(200).json({ message: 'User data updated or created successfully!' });
    } catch (error) {
        console.error('Error adding/updating user data:', error);
        res.status(500).json({ message: 'Error adding/updating user data', error: error.message });
    }
});

 
module.exports = { signin, signup, nutrient, exercise, getLast7DaysData, addOrUpdateUserData};
