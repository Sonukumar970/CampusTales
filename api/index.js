const app = require('../server/app');
const { connectDB } = require('../server/config/db');

// Connect to MongoDB if not already connected
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.warn('MongoDB connection notice in serverless:', err.message);
    }
  }
  return app(req, res);
};
