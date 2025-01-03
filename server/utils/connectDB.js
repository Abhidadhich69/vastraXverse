const mongoose = require("mongoose");
require('dotenv').config();

async function connectDB() {
    try {
        if (!process.env.MONGO_DB_URI) {
            throw new Error("MONGO_DB_URI is not defined in the environment variables");
        }
        await mongoose.connect(process.env.MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        process.exit(1); 
    }
}


module.exports= connectDB;