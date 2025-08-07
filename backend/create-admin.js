import { config } from "dotenv";
config();

import { connectDB } from "./src/lib/db.js";
import User from "./src/models/user.models.js";
import bcrypt from "bcryptjs";

const createAdminUser = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@nexchat.com" });
    if (existingAdmin) {
      console.log("✅ Admin user already exists!");
      console.log("📧 Email: admin@nexchat.com");
      console.log("🔑 Password: admin123");
      console.log("🛡️ Role:", existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    
    const adminUser = new User({
      email: "admin@nexchat.com",
      fullName: "NexChat Admin",
      password: hashedPassword,
      role: "admin",
      profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    });

    await adminUser.save();
    console.log("🎉 Admin user created successfully!");
    console.log("📧 Email: admin@nexchat.com");
    console.log("🔑 Password: admin123");
    console.log("🛡️ Role: admin");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit(0);
  }
};

createAdminUser();
