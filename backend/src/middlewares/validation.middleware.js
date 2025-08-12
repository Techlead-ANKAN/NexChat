import bcrypt from "bcryptjs";
import User from "../models/user.models.js";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation - at least 6 characters
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return null;
};

// Email validation
const validateEmail = (email) => {
  if (!email || !emailRegex.test(email)) {
    return "Please provide a valid email address";
  }
  return null;
};

// Full name validation
const validateFullName = (fullName) => {
  if (!fullName || fullName.trim().length < 2) {
    return "Full name must be at least 2 characters long";
  }
  if (fullName.trim().length > 50) {
    return "Full name must be less than 50 characters";
  }
  return null;
};

// Middleware to validate profile update data
export const validateProfileUpdate = (req, res, next) => {
  const { fullName } = req.body;
  
  if (fullName !== undefined) {
    const nameError = validateFullName(fullName);
    if (nameError) {
      return res.status(400).json({ message: nameError });
    }
  }
  
  next();
};

// Middleware to validate email update
export const validateEmailUpdate = async (req, res, next) => {
  const { newEmail, currentPassword } = req.body;
  
  // Validate new email
  const emailError = validateEmail(newEmail);
  if (emailError) {
    return res.status(400).json({ message: emailError });
  }
  
  // Check if current password is provided
  if (!currentPassword) {
    return res.status(400).json({ message: "Current password is required to change email" });
  }
  
  // Verify current password
  try {
    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Check if new email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    next();
  } catch (error) {
    console.log("Error in validateEmailUpdate:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to validate password update
export const validatePasswordUpdate = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  
  // Check if all fields are provided
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All password fields are required" });
  }
  
  // Validate new password
  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }
  
  // Check if new password matches confirmation
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "New passwords do not match" });
  }
  
  // Check if new password is different from current
  if (currentPassword === newPassword) {
    return res.status(400).json({ message: "New password must be different from current password" });
  }
  
  // Verify current password
  try {
    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    next();
  } catch (error) {
    console.log("Error in validatePasswordUpdate:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Rate limiting middleware (simple implementation)
const updateAttempts = new Map();

export const rateLimitProfileUpdates = (req, res, next) => {
  const userId = req.user._id.toString();
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10; // Max 10 profile updates per 15 minutes
  
  if (!updateAttempts.has(userId)) {
    updateAttempts.set(userId, []);
  }
  
  const userAttempts = updateAttempts.get(userId);
  
  // Remove old attempts outside the window
  const recentAttempts = userAttempts.filter(timestamp => now - timestamp < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return res.status(429).json({ 
      message: "Too many profile update attempts. Please try again later." 
    });
  }
  
  // Add current attempt
  recentAttempts.push(now);
  updateAttempts.set(userId, recentAttempts);
  
  next();
};
