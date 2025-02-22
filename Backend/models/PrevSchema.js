const mongoose = require('mongoose');

// Define the PrevDataSchema
const PrevDataSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // User's email (unique)
    entries: [
        {
            date: { type: Date, required: true }, // Each day's entry
            nutrition: {
                consumed_energy_kcal: { type: Number, required: true },
                consumed_protein_g: { type: Number, required: true },
                consumed_fat_g: { type: Number, required: true },
            },
            exercise: {
                total_calories_burned: { type: Number, required: true },
            },
        },
    ],
});

// Pre-save hook to ensure that only 7 entries are stored (keeps the latest 7)
PrevDataSchema.pre('save', function (next) {
    if (this.entries.length > 7) {
        // Remove older entries if there are more than 7
        this.entries = this.entries.slice(-7);
    }
    next();
});

module.exports = mongoose.model('PrevDataSchema', PrevDataSchema);  // Correct model export
