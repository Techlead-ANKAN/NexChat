import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import { connectDB } from "../lib/db.js";

dotenv.config();

const createAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@nexchat.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";
    const adminName = process.env.ADMIN_NAME || "NexChat Admin";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new User({
      fullName: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      profilePic: "https://api.dicebear.com/7.x/initials/svg?seed=Admin"
    });

    await adminUser.save();

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("⚠️  Please change the default password after first login");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser();
}

export default createAdminUser;
