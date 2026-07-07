import mongoose from "mongoose";
import process from "process";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  const options: mongoose.ConnectOptions = {
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      allowPartialTrustChain: undefined,
      ALPNProtocols: undefined,
      ca: undefined,
      cert: undefined,
      checkServerIdentity: undefined,
      ciphers: undefined,
      crl: undefined,
      ecdhCurve: undefined,
      key: undefined,
      minDHSize: undefined,
      passphrase: undefined,
      pfx: undefined,
      rejectUnauthorized: undefined,
      secureContext: undefined,
      secureProtocol: undefined,
      servername: undefined,
      session: undefined,
      autoSelectFamily: undefined,
      autoSelectFamilyAttemptTimeout: undefined,
      keepAliveInitialDelay: undefined,
      family: undefined,
      hints: undefined,
      localAddress: undefined,
      localPort: undefined,
      lookup: undefined
  };

  try {
    await mongoose.connect(uri, options);
    console.log("MongoDB connected:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}