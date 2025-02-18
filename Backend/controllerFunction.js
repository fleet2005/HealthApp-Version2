const asyncHandler = require("express-async-handler");
const signupmodel = require("./models/UserLoginSchema.js");

const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const document = await signupmodel.findOne({ email, password });

    if (document) {
        res.json({"sts":"true"});
    } else {
        res.status(400).json({"sts":"false"});
    }
});


const signup = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const newDocument = new signupmodel({ email, password });

    await newDocument.save();

    res.status(200).json({"sts": "Registered Successfully"});
});

module.exports = { signin, signup };
