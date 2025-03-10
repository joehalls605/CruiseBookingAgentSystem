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
    firstName: {
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    cruiseDestination: {
        type: String,
        required: true
    },
    cabinType:{
        type: String,
        enum: ["interiorCabin", "oceanViewCabin", "Suite"]
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

// GET BOOKINGS
app.get("/bookings", async(req, res) => {
    try {
        console.log("Database connection state:", mongoose.connection.readyState);
        console.log("Database name:", mongoose.connection.db.databaseName);
        console.log("Fetching bookings from collection 'bookings'...");

        // List all collections to verify
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Available collections:", collections.map(c => c.name));

        const bookings = await Booking.find();
        res.json(bookings);
    } catch(err) {
        console.error("Error fetching bookings:", err);
        res.status(500).send("Server Error");
    }
});

// POST NEW BOOKING
app.post("/bookings", async (req, res) => {
    try{
        // Destructuring (pull out) the data from req.body so I can use the variables
        const { bookingId, firstName, surname, cruiseDestination, cabinType, departureDate, status} = req.body;

        // Checking all fields are present
        if(!bookingId || !firstName || !surname || !cruiseDestination || !departureDate || !status || !cabinType){
            return res.status(400).send("All fields are required");
        }

        // Create a new booking instance
        const newBooking = new Booking({
            bookingId,
            firstName,
            surname,
            cruiseDestination,
            departureDate,
            status,
            cabinType
        });

        // Save to database
        await newBooking.save();
        res.status(201).send("Booking created successfully");
    }catch(err){
        console.log("Error creating booking", err);
        res.status(500).send("Server Error");
    }
});

// DELETE - Delete a booking by _id

app.delete("/bookings/:id", async (req,res) => {
    try{
        const bookingId = req.params.id;

        // Find the booking by _id and delete it
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);

        if(!deletedBooking){
            return res.status(404).send("Booking not found");
        }
        res.status(200).send("Booking deleted successfully");
    }catch(err){
        console.error("Error deleting bookings", err);
        res.status(500).send("Server Error");
    }
});






// =================== SERVER STARTUP ===================
// Start the Express server on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});