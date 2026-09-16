const { getConnectionStatus } = require('../config/db');

/**
 * @desc   Health check endpoint verifying server & DB status
 * @route  GET /api/health
 * @access Public
 */
const getHealth = (req, res) => {
  const dbStatus = getConnectionStatus();

  res.status(200).json({
    success: true,
    message: '🎓 CampusTales API is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus.state,
      connected: dbStatus.isConnected,
      mode: dbStatus.isMemoryDB ? 'in-memory-dev-fallback' : 'mongo-uri',
      host: dbStatus.host,
    },
    version: '1.0.0',
    phase: 'Phase 1 - Project Foundation'
  });
};

module.exports = {
  getHealth,
};
