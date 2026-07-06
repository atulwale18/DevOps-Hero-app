const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For now we don't throw if MONGO_URI is missing, just to prevent server crash during early dev if local mongo isn't running
    if (!process.env.MONGO_URI) {
      console.warn("MONGO_URI is not defined in .env. Skipping DB connection.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
