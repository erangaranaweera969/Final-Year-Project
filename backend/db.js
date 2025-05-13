import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb+srv://user:Password123@cluster0.dhveqrl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    if (!mongoURI) throw new Error("MONGO_URI not found in environment variables.");

    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
