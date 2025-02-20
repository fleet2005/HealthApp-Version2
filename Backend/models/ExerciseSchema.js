const mongoose = require("mongoose");

const ExerciseSchema = mongoose.Schema(
    {
        
        Activity_Per_Hour:{
            type: String,
            required: [true, "Please enter Activity"],
        },

        Calories_Per_Kg:{
            type: Number,
            required: [true, "Please enter fats"],
        },
    
    
    },
    {
        timestamps : true,
    }
);

module.exports = mongoose.model("ExerciseSchema",ExerciseSchema);