const mongoose = require('mongoose');

// Cache the database connection for serverless environments
let cachedConnection = null;

const connectDB = async () => {
    // If we have a cached connection and it's connected, reuse it
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Using cached MongoDB connection');
        return cachedConnection;
    }

    try {
        console.log('Attempting to connect to MongoDB...');
        // Debugging: Log the URI (masked)
        const uri = process.env.MONGO_URI || '';
        const maskedURI = uri.replace(/:([^:@]+)@/, ':****@');
        console.log(`Connecting to: ${maskedURI}`);

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            // Optimize for serverless
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        cachedConnection = conn;
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Don't exit process in serverless environment
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        throw error;
    }
};

module.exports = connectDB;
