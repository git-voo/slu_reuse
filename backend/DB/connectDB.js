import mongoose from "mongoose";

export default async function connectDB() {
    const MONGODB_URL = process.env.NODE_ENV === 'test' ?
        'mongodb://localhost:27017/SLU-ReuseDB-Test' :
        process.env.MONGODB_URL;

    try {
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        })

        console.log('Connected to MongoDB', MONGODB_URL)
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }
}