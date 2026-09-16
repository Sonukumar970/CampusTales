require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Start server
const startServer = () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`🚀 CampusTales Backend running on http://localhost:${PORT}`);
      console.log(`🩺 Health check available at: http://localhost:${PORT}/api/health`);
    });

    // Connect to database asynchronously without blocking HTTP server
    connectDB()
      .then(async () => {
        const seedStoriesData = require('./scripts/seedStories');
        await seedStoriesData();
      })
      .catch((err) => {
        console.warn(`Database connection notice: ${err.message}`);
      });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error(`❌ Server initialization error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
