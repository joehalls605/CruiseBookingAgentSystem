// server.js handles the ongoing API operations

// =================== IMPORTS ===================
import express from 'express'; // Express.js framework for handling HTTP requests
import {MongoClient, ServerApiVersion} from 'mongodb'; // MongoDB client to interact with MongoDB
import dotenv from 'dotenv'; // Loads enviroment variables from .env file
import cors from 'cors'; // Middlewaare to handle Cross-Origin Resource Sharing (CORS)

// =================== CONFIGURATION ===================
// Load enviroment variables
dotenv.config();
console.log('MONGO_URI value:', process.env.MONGO_URI);

// Set up Express app and middleware
const app = express(); // Intialise the Express app
app.use(cors()); // Enable CORS to allow requests from different origins
app.use(express.json()); // Parse incoming requests with JSON payloads

// Setup server port and MongoDB connection string
const PORT = process.env.PORT || 5000; // Set server port (from environment or default to 5000)
const uri = process.env.MONGO_URI; // MongoDB connection string (loaded from .env)
const dbName = 'CruiseBookingSystem'; // The database to use in MongoDB
const usersCollection = 'users';  // The collection to fetch users from

// =================== DATABASE CONNECTION ===================
const client = new MongoClient(uri, { // Creates a new MongoClient with the provided URI
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Establish a connection to the MongoDB server
async function connectDB() {
    try {
        await client.connect(); // Connect to MongoDB
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
        throw error;
    }
}

// =================== HTTP REQUESTS ===================

// the GET route to fetch all users from the database

// The frontend request fetch triggers this async
app.get('/users', async (req, res) => {
    try {
        await connectDB(); // all connectDB to ensure MongoDB is connected
        const db = client.db(dbName); // // Access the specific database ('CruiseBookingSystem') declared earlier

        // Fetch all users from the 'users' collection and convert the result to an array
        const users = await db.collection(usersCollection).find().toArray();

        res.json(users); // Send the users data as a JSON response to the client
    } catch(error) {
        console.error("Error in /users route:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// =================== SERVER STARTUP ===================
// Start the Express server on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});