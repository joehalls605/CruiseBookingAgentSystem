import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

// Connection URL and Database Name from the .env file
const url = process.env.MONGO_URI;
const dbName = "CruiseBookingSystem";

const bookingData = [
    {
        "bookingId": "B001",
        "passengerName": "John Doe",
        "cruiseDestination": "Caribbean",
        "departureDate": "2025-03-15",
        "status": "Confirmed"
    },
    {
        "bookingId": "B002",
        "passengerName": "Jane Smith",
        "cruiseDestination": "Mediterranean",
        "departureDate": "2025-04-20",
        "status": "Pending"
    },
    {
        "bookingId": "B003",
        "passengerName": "Alice Johnson",
        "cruiseDestination": "Alaska",
        "departureDate": "2025-06-05",
        "status": "Confirmed"
    }
];

// Using async to connect

async function insertBookings() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection("bookings");

        // Insert multiple booking documents
        const result = await collection.insertMany(bookingData);
        console.log(`${result.insertedCount} documents were inserted`);
    } catch (error) {
        console.error("Error connecting to MongoDB or inserting documents:", error);
    } finally {
        await client.close();
    }
}

insertBookings();
