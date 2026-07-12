import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  const options: mongoose.ConnectOptions = {
    maxPoolSize: 20,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  };

  try {
    await mongoose.connect(uri, options);
    console.log("MongoDB connected:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}
