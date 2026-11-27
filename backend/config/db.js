const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connects to MongoDB. The app needs a real database now (users, listings, offers),
 * so a failed connection stops the server instead of silently using fake data.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-exchange';
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`Could not connect to MongoDB at ${uri}: ${err.message}`);
    console.error('Start MongoDB locally or set MONGODB_URI (e.g. a MongoDB Atlas connection string).');
    process.exit(1);
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
