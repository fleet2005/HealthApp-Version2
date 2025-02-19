const asyncHandler = require("express-async-handler");
const signupmodel = require("./models/UserLoginSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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

module.exports = { signin, signup };
