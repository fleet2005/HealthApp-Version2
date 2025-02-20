const mongoose = require('mongoose');
const XLSX = require('xlsx');
const dotenv = require("dotenv").config();
const fs = require('fs');
const Nutrient = require('./models/ExerciseSchema.js');  // Ensure the model is named 'ExerciseSchema'
const connectDB = require("./mongoconn");

connectDB();

// Function to process Excel file and insert data into MongoDB
async function processExcelFile() {
    try {
        // Read the Excel file
        const filePath = 'C:/Users/nothi/Downloads/exercise_dataset.xlsx'; // Specify the path to your Excel file
        const workbook = XLSX.readFile(filePath);
        
        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Process each row of the data and insert into MongoDB
        for (const row of jsonData) {
            // Map the row data to match your Nutrient schema
            const exerciseData = {
                Activity_Per_Hour: row.Activity_Per_Hour, // Ensure column name in Excel is correct
                Calories_Per_Kg: row.Calories_Per_Kg,   // Ensure column name in Excel is correct
            };

            // Create a new document and save it to MongoDB
            const exercise = new Nutrient(exerciseData);
            await exercise.save();
            console.log(`Inserted: ${row.Activity_Per_Hour}`);
        }
        
        console.log('Data insertion complete!');
    } catch (error) {
        console.error('Error processing file:', error);
    }
}

// Run the function to process the Excel file
processExcelFile();
