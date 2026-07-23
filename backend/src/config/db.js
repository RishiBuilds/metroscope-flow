import mongoose from 'mongoose';
import dns from 'node:dns';
import { DB_SERVER_SELECTION_TIMEOUT_MS, MONGO_URI } from './env.js';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {
}

mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: DB_SERVER_SELECTION_TIMEOUT_MS,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
