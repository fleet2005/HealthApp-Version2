const mongoose = require("mongoose");

const UserLoginSchema = mongoose.Schema(
    {
        
        email:{
            type: String,
            required: [true, "Please enter Email"],
        },

        password:{
            type: String,
            required: [true, "Please enter Password"],
        },

    
    },
    {
        timestamps : true,
    }
);

module.exports = mongoose.model("userLoginSchema",UserLoginSchema);