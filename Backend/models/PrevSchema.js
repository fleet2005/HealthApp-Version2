const mongoose = require("mongoose");

const PrevSchema = new mongoose.Schema({
    date: { type: Date, required: true }, // Each day’s entry
    
    nutrition: {
        consumed_energy_kcal: { type: Number, required: true },
        consumed_protein_g: { type: Number, required: true },
        consumed_fat_g: { type: Number, required: true },
    },

    exercise: {
        total_calories_burned: { type: Number, required: true },
    }
});

const UserDataSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, 
    last7Days: [PrevSchema] 
});

module.exports = { UserDataSchema, PrevSchema };
