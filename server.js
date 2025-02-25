// server.js handles the ongoing API operations

// =================== IMPORTS ===================
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// =================== CONFIGURATION ===================

// Loads environment variables
dotenv.config();
console.log('MONGO_URI value:', process.env.MONGO_URI);

// Express app instance created
const app = express(); // Intialise the Express app

// Middleware
app.use(express.json()); // Middleware to parse JSON request body
app.use(cors()); // Enable CORS for cross-origin requests

// Server port and MongoDB connection string
const PORT = process.env.PORT || 5000; // Set server port (from environment or default to 5000)
const uri = process.env.MONGO_URI; // MongoDB connection string (loaded from .env)

// Connecting to MongoDB
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Could not connect to MongoDB", err));

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${mongoose.connection.db.databaseName}`);
});

// Booking Schema
const bookingSchema = {
    bookingId: {
        type: String,
        required: true,
        unique: true
    },
    passengerName: {
        type: String,
        required: true
    },
    cruiseDestination: {    // Make sure this matches your DB field
        type: String,
        required: true
    },
    departureDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Confirmed", "Pending", "Cancelled"],
        required: true
    }
};

const Booking = mongoose.model('Booking', bookingSchema, 'bookings');

// The frontend request fetch triggers this async
app.get("/bookings", async(req, res) => {
    try {
        console.log("Database connection state:", mongoose.connection.readyState);
        console.log("Database name:", mongoose.connection.db.databaseName);
        console.log("Fetching bookings from collection 'bookings'...");

        // List all collections to verify
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Available collections:", collections.map(c => c.name));

        const bookings = await Booking.find();
        console.log("Bookings found:", bookings.length, bookings);
        res.json(bookings);
    } catch(err) {
        console.error("Error fetching bookings:", err);
        res.status(500).send("Server Error");
    }
});

// =================== SERVER STARTUP ===================
// Start the Express server on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});