import mongoose from 'mongoose';
import { MONGODB_URI } from '../config';


export async function connectToDatabase() {
  try {

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }
    await mongoose.connect(MONGODB_URI, 
    );
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
