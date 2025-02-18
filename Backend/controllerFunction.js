const asyncHandler = require("express-async-handler");
const signupmodel = require("./models/UserLoginSchema.js");
const bcrypt = require("bcrypt")

const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const document = await signupmodel.findOne({ email });

    if (document && await bcrypt.compare(password, document.password)) {
        res.json({"sts":"true"});
    } else {
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
