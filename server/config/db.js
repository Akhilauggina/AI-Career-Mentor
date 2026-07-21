const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/ai-mentor';
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error('Set the MONGO_URI environment secret to connect to your database.');
    // Do not exit — let the server run so other routes remain reachable
  }
};

module.exports = connectDB;
