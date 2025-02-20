const asyncHandler = require("express-async-handler");
const signupmodel = require("./models/UserLoginSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nutrientModel = require("./models/NutrientSchema.js");


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
      const { foodName } = req.query;  // Assuming you're passing the food name as a query parameter
      
      // If foodName is provided, perform a partial match query
      const nutrientData = await nutrientModel.find({
        food_name: { $regex: foodName, $options: 'i' } // Case-insensitive partial match
      });
  
      res.status(200).json(nutrientData);  // Sending the matched data as the response
    } catch (error) {
      res.status(500).json({ message: 'Error fetching nutrient data', error: error.message });
    }
  });
  

module.exports = { signin, signup, nutrient};
