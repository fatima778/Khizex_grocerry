import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";
import { User } from "../models/User";
import mongoose from "mongoose";

dotenv.config();

async function seedAdmin(): Promise<void> {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Store Admin";

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env before running this script.");
    process.exit(1);
  }

  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log(`Existing user "${email}" promoted to admin.`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role: "admin" });
    console.log(`New admin user created: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
