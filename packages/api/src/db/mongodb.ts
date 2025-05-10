import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kyc';

export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB connection already established');
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export function disconnectFromDatabase() {
  mongoose.disconnect();
  console.log('MongoDB disconnected');
}
