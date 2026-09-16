const mongoose = require('mongoose');

let isConnected = false;
let memoryServer = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://localhost:27017/campustales';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (primaryErr) {
    console.warn(`⚠️ Primary MongoDB connection failed (${primaryErr.message}).`);

    // In development, provide seamless fallback with MongoMemoryServer
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('🔄 Initializing in-memory MongoDB fallback for local development...');
        const path = require('path');
        const os = require('os');
        const cacheDir = path.join(os.homedir(), '.cache', 'mongodb-binaries');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create({
          binary: {
            downloadDir: cacheDir,
          },
        });
        const memUri = memoryServer.getUri();

        const memConn = await mongoose.connect(memUri);
        isConnected = true;
        console.log(`✅ MongoDB Memory Server Connected: ${memUri}`);
        return memConn;
      } catch (memErr) {
        console.error(`❌ In-memory MongoDB failed to start: ${memErr.message}`);
        isConnected = false;
      }
    } else {
      console.error(`❌ Database connection failed in production: ${primaryErr.message}`);
      isConnected = false;
      process.exit(1);
    }
  }
};

const getConnectionStatus = () => {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    state: states[stateCode] || 'Unknown',
    isConnected: stateCode === 1,
    isMemoryDB: Boolean(memoryServer),
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null,
  };
};

module.exports = {
  connectDB,
  getConnectionStatus,
};
