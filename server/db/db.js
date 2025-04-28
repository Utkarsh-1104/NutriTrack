import 'dotenv/config'
import mongoose from 'mongoose'

export async function db() {
    const URI = process.env.MONGODB_URI
    await mongoose.connect(URI)
    console.log('Connected to database')   
}