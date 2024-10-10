import mongoose from "mongoose";

export default async function connectDB() { 
const MONGODB_URL = process.env.MONGODB_URL

    try {
      await mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4
      })
  
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
    }
  }