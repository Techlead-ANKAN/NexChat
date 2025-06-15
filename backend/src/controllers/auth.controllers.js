import User from "../models/user.models.js"; // Importing the User model for database operations
import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing
import { generateToken } from "../utils/utils.js"; // Importing the token generation utility

// Signup function to handle user registration
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body; // Destructuring request body to get user details
  try {
    // Check if all required fields are provided
    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "All fields are required" }); // Respond with error if fields are missing
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" }); // Respond with error if password is too short
    }

    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" }); // Respond with error if email is already registered

    // Generate a salt for hashing the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with the provided details
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword, // Store the hashed password
    });

    // Check if the new user instance is created successfully
    if (newUser) {
      generateToken(newUser._id, res); // Generate a token for the new user
      await newUser.save(); // Save the new user to the database

      // Respond with the new user's details
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.email, // Note: This should likely be newUser.fullName
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" }); // Respond with error if user data is invalid
    }
  } catch (error) {
    console.log("Error in signup controller", error.message); // Log any errors that occur
    res.status(500).json({ message: "Internal Server error" }); // Respond with a server error
  }
};

// Login function to handle user authentication
export const login = async (req, res) => {
  const { email, password } = req.body; // Destructuring request body to get user credentials

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" }); // Respond with error if user not found
    }

    // Compare the provided password with the stored hashed password
    const isPasswordCrct = await bcrypt.compare(password, user.password);
    if (!isPasswordCrct) {
      return res.status(400).json({ message: "Invalid credentials" }); // Respond with error if password is incorrect
    }

    generateToken(user._id, res); // Generate a token for the authenticated user
    // Respond with the user's details
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      password: user.password, // Note: It's not advisable to send the password back
    });
  } catch (error) {
    console.log("Error in login controller: ", error.message); // Log any errors that occur
    res.status(500).json({ message: "Internal Server Error" }); // Respond with a server error
  }
};

// Logout function to handle user logout
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); // Clear the JWT cookie
    res.status(200).json({ message: "Logged out successfully" }); // Respond with a success message
  } catch (error) {
    console.log("Error in logout controller", error.message); // Log any errors that occur
    res.status(500).json({ message: "Internal Server Error" }); // Respond with a server error
  }
};

// Update profile function placeholder
export const updateProfile = async (req, res) => {
  // Functionality to be implemented
};
