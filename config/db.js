import mongoose from 'mongoose';

// Import the dotenv package to load environment variables from a .env file
// and mongoose to interact with MongoDB.

export const connectDB = async () => {  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);   // Exit the process with failure (0 means success, 1 means failure)
  }
}

export default connectDB;