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
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "10m"});

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

    console.log(req.user.user.email)

    //req.user set by jwt
    if(req.user.user.email!=email) return res.status(404).json({message : "Unauthorised Access"});

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
    const { email, newEntry } = req.body;

    if (req.user.user.email !== email)
        return res.status(403).json({ message: "Unauthorized Access" });

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Normalize to midnight

        let userData = await PrevDataModel.findOne({ email });

        if (!userData) {
            
            console.log('No user data found. Creating new entry...');
            userData = new PrevDataModel({
                email,
                entries: [{
                    date: new Date(newEntry.date),
                    nutrition: newEntry.nutrition,
                    exercise: newEntry.exercise
                }]
            });
        } else {
            let entries = userData.entries;

            console.log('User data found. Current entries:', entries);

            // Safely compare dates and find if today's entry exists
            const todayIndex = entries.findIndex(entry => {
                if (!entry.date) return false;
                const entryDate = new Date(entry.date);
                entryDate.setHours(0, 0, 0, 0);
                return entryDate.getTime() === new Date(newEntry.date).setHours(0, 0, 0, 0);
            });

            console.log('Today Index:', todayIndex);

            if (todayIndex !== -1) {
                // Update existing entry for that date
                console.log('Updating existing entry for today...');
                const existingEntry = entries[todayIndex];

                // Sum the nutrition and exercise values
                existingEntry.nutrition.consumed_energy_kcal += newEntry.nutrition.consumed_energy_kcal;
                existingEntry.nutrition.consumed_protein_g += newEntry.nutrition.consumed_protein_g;
                existingEntry.nutrition.consumed_fat_g += newEntry.nutrition.consumed_fat_g;
                existingEntry.exercise.total_calories_burned += newEntry.exercise.total_calories_burned;
            } else {
                // Add a new entry if no existing entry for that date
                console.log('Adding new entry for today...');
                entries.push({
                    date: new Date(newEntry.date),
                    nutrition: newEntry.nutrition,
                    exercise: newEntry.exercise
                });
            }

            // Keep only 7 unique days (latest first)
            const uniqueByDate = {};
            entries.forEach(entry => {
                if (entry.date) {
                    const dateKey = new Date(entry.date).toISOString().split('T')[0];
                    uniqueByDate[dateKey] = entry;
                }
            });

            console.log('Unique entries by date:', uniqueByDate);

            // Get the entries sorted by the most recent, keeping only the last 7 unique days
            const sortedUniqueEntries = Object.values(uniqueByDate)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 7) // Keep only the last 7 days
                .reverse(); // Optional: reverse to make it oldest to newest

            console.log('Sorted unique entries (last 7 days):', sortedUniqueEntries);

            // Set the updated entries back to the user data
            userData.entries = sortedUniqueEntries;
        }

        // Save the user data after updating
        await userData.save();
        console.log('Data saved successfully.');

        res.status(200).json({ message: "User data updated or created successfully!" });

    } catch (error) {
        console.error("Error adding/updating user data:", error);
        res.status(500).json({ message: "Error adding/updating user data", error: error.message });
    }
});



 
module.exports = { signin, signup, nutrient, exercise, getLast7DaysData, addOrUpdateUserData};
