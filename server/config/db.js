const mongoose = require('mongoose');

// Disable query buffering so disconnected queries fail fast instead of hanging 10s
mongoose.set('bufferCommands', false);

let isConnected = false;
let memoryServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  const primaryUri =
    process.env.MONGO_URI ||
    'mongodb+srv://kumarsonualways4u_db_user:sonu12345@cluster0.dvcy1sl.mongodb.net/campustales?retryWrites=true&w=majority';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
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
        if (!memoryServer) {
          memoryServer = await MongoMemoryServer.create({
            binary: {
              downloadDir: cacheDir,
            },
            instance: {
              launchTimeout: 60000,
            },
          });
        }
        const memUri = memoryServer.getUri();

        const memConn = await mongoose.connect(memUri);
        isConnected = true;
        console.log(`✅ MongoDB Memory Server Connected: ${memUri}`);
        return memConn;
      } catch (memErr) {
        console.error(`❌ In-memory MongoDB failed to start: ${memErr.message}`);
        isConnected = false;
        throw memErr;
      }
    } else {
      console.error(`❌ Database connection failed in production: ${primaryErr.message}`);
      isConnected = false;
      throw primaryErr;
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

const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
  isConnected = false;
};

module.exports = {
  connectDB,
  getConnectionStatus,
  closeDB,
};
