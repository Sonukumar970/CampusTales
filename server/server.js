require('dotenv').config();
const app = require('./app');
const { connectDB, closeDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // 1. Establish database connection and seed initial data
    try {
      console.log('🔄 Connecting to database...');
      await connectDB();
      const seedStoriesData = require('./scripts/seedStories');
      await seedStoriesData();
    } catch (dbErr) {
      console.warn(`Database connection notice: ${dbErr.message}`);
    }

    // 2. Start HTTP server once DB is ready
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 CampusTales Backend running on http://localhost:${PORT}`);
      console.log(`🩺 Health check available at: http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async () => {
      console.log('\n🛑 Gracefully shutting down server...');
      server.close(async () => {
        try {
          await closeDB();
        } catch (e) {
          // ignore shutdown error
        }
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

    // Handle unhandled promise rejections without crashing the entire server
    process.on('unhandledRejection', (err) => {
      console.error(`❌ Unhandled Rejection: ${err?.message || err}`);
    });
  } catch (error) {
    console.error(`❌ Server initialization error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
