const mongoose = require("mongoose");

const NutrientSchema = mongoose.Schema(
    {
        
        food_name:{
            type: String,
            required: [true, "Please enter Email"],
        },

        energy_kcal:{
            type: Number,
            required: [true, "Please enter energy"],
        },

        protein_g:{
            type: Number,
            required: [true, "Please enter protein"],
        },

        fat_g:{
            type: Number,
            required: [true, "Please enter fats"],
        },
    
    
    },
    {
        timestamps : true,
    }
);

module.exports = mongoose.model("NutrientSchema",NutrientSchema);