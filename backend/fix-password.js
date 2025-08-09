import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./src/models/user.models.js";
import dotenv from "dotenv";

dotenv.config();

const fixUserPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find the user
    const user = await User.findOne({ email: "olivia.miller@example.com" });
    
    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("Current password length:", user.password.length);
    
    // Hash the password properly (assuming current password is "123456")
    const hashedPassword = await bcrypt.hash("123456", 12);
    
    // Update the user with the properly hashed password
    user.password = hashedPassword;
    await user.save();
    
    console.log("Password updated successfully!");
    console.log("New password length:", hashedPassword.length);
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

fixUserPassword();
