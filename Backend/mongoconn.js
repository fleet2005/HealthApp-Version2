const mongoose = require("mongoose");

const connectDB =  async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Successful connection to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);  
    }
};
module.exports = connectDB;

// In your MongoDB connection function, you don't need asyncHandler because:

// Not an Express Route Handler

// asyncHandler is specifically for Express route handlers to catch errors.
// The DB connection function (connectDB) is not a request handler; it runs once when the app starts.

// In this case, asyncHandler is required because signin is an Express route handler, and Express does not automatically catch errors inside async functions.

// 🔹 Why asyncHandler is Needed Here?
// Handles await Errors Automatically

// await signupmodel.findOne({ email, password }) may fail (e.g., database connection issues).
// Without asyncHandler, an unhandled rejection could crash your server.
// Ensures Express Handles Errors Properly

// If an error occurs inside an async route handler, Express won't catch it unless we use next(err).
// asyncHandler automatically passes errors to Express’ built-in error handler.
// Prevents Server Crashes

// Without asyncHandler, an unhandled error would leave your server running in an unstable state.