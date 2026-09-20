const mongoose = require('mongoose');
const app = require('../server/app');
const { connectDB } = require('../server/config/db');

let isSeeded = false;

module.exports = async (req, res) => {
  // Check and establish MongoDB connection if needed
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
      if (!isSeeded && mongoose.connection.readyState === 1) {
        isSeeded = true;
        const seedStoriesData = require('../server/scripts/seedStories');
        await seedStoriesData();
      }
    } catch (err) {
      console.warn('MongoDB connection notice in serverless:', err.message);
    }
  }

  // Fast-fail if DB is disconnected and this is not a health check
  const isHealthCheck = req.url === '/api/health' || req.url === '/health' || req.url === '/';
  if (mongoose.connection.readyState !== 1 && !isHealthCheck) {
    return res.status(503).json({
      success: false,
      message:
        'Database not connected on Vercel. Please add your MongoDB Atlas connection string as the MONGO_URI environment variable in Vercel Project Settings.',
      error: 'DATABASE_DISCONNECTED',
      help: 'Go to Vercel Dashboard -> Project Settings -> Environment Variables -> add MONGO_URI',
    });
  }

  return new Promise((resolve, reject) => {
    res.on('finish', resolve);
    res.on('close', resolve);
    res.on('error', reject);
    app(req, res);
  });
};

