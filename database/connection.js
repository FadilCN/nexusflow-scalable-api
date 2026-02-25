import mongoose from "mongoose";
const uri = process.env.MONGO_URI;

export function connectDatabase() { 

mongoose.connect(uri, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

}