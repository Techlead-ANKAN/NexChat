// import User from "../models/user.models.js"; // Importing the User model for database operations
// import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing
// import { generateToken } from "../utils/utils.js"; // Importing the token generation utility
// import cloudinary from "../lib/cloudinary.js";

// // Signup function to handle user registration
// export const signup = async (req, res) => {
//   const { fullName, email, password } = req.body; // Destructuring request body to get user details
//   try {
//     // Check if all required fields are provided
//     if (!fullName || !password || !email) {
//       return res.status(400).json({ message: "All fields are required" }); // Respond with error if fields are missing
//     }

//     // Validate password length
//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: "Password must be atleast 6 characters" }); // Respond with error if password is too short
//     }

//     // Check if the user already exists
//     const user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "Email already exists" }); // Respond with error if email is already registered

//     // Generate a salt for hashing the password
//     const salt = await bcrypt.genSalt(10);
//     // Hash the password using the generated salt
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create a new user instance with the provided details
//     const newUser = new User({
//       fullName: fullName,
//       email: email,
//       password: hashedPassword, // Store the hashed password
//     });

//     // Check if the new user instance is created successfully
//     if (newUser) {
//       generateToken(newUser._id, res); // Generate a token for the new user
//       await newUser.save(); // Save the new user to the database

//       // Respond with the new user's details
//       res.status(201).json({
//         _id: newUser._id,
//         fullName: newUser.email, // Note: This should likely be newUser.fullName
//         profilePic: newUser.profilePic,
//       });
//     } else {
//       res.status(400).json({ message: "Invalid user data" }); // Respond with error if user data is invalid
//     }
//   } catch (error) {
//     console.log("Error in signup controller", error.message); // Log any errors that occur
//     res.status(500).json({ message: "Internal Server error" }); // Respond with a server error
//   }
// };

// // Login function to handle user authentication
// export const login = async (req, res) => {
//   const { email, password } = req.body; // Destructuring request body to get user credentials

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" }); // Respond with error if user not found
//     }

//     // Compare the provided password with the stored hashed password
//     const isPasswordCrct = await bcrypt.compare(password, user.password);
//     if (!isPasswordCrct) {
//       return res.status(400).json({ message: "Invalid credentials" }); // Respond with error if password is incorrect
//     }

//     generateToken(user._id, res); // Generate a token for the authenticated user
//     // Respond with the user's details
//     res.status(200).json({
//       _id: user._id,
//       fullName: user.fullName,
//       email: user.email,
//       password: user.password, // Note: It's not advisable to send the password back
//     });
//   } catch (error) {
//     console.log("Error in login controller: ", error.message); // Log any errors that occur
//     res.status(500).json({ message: "Internal Server Error" }); // Respond with a server error
//   }
// };

// // Logout function to handle user logout
// export const logout = (req, res) => {
//   try {
//     res.cookie("jwt", "", { maxAge: 0 }); // Clear the JWT cookie
//     res.status(200).json({ message: "Logged out successfully" }); // Respond with a success message
//   } catch (error) {
//     console.log("Error in logout controller", error.message); // Log any errors that occur
//     res.status(500).json({ message: "Internal Server Error" }); // Respond with a server error
//   }
// };

// // Update profile function placeholder
// export const updateProfile = async (req, res) => {
//   // Functionality to be implemented
//   try {
//     console.log("BODY:", req.body);
//     const { profilePic } = req.body;
//     const userId = req.user._id;

//     if (!profilePic) {
//       return res.status(400).json({ message: "profile pic is required" });
//     }

//     const uploadResponse = await cloudinary.uploader.upload(profilePic);
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: uploadResponse.secure_url },
//       { new: true }
//     );

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error(error); 
//     console.log("Error in updateProfile: ", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const checkAuth = async (req, res) => {
//   try {
//     res.status(200).json(req.user);
//   } catch (error) {
//     console.log("Error in checkAuth controller", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };







import User from "../models/user.models.js"; // Importing the User model for database operations
import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing
import { generateToken } from "../utils/utils.js"; // Importing the token generation utility
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Hardcoded admin credentials
    const ADMIN_EMAIL = "admin@nexchat.com";
    const ADMIN_PASSWORD = "admin123";
    
    // Check if it's admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create or find admin user
      let adminUser = await User.findOne({ email: ADMIN_EMAIL });
      
      if (!adminUser) {
        // Create admin user if doesn't exist
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
        adminUser = new User({
          email: ADMIN_EMAIL,
          fullName: "NexChat Admin",
          password: hashedPassword,
          role: "admin",
          profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
        });
        await adminUser.save();
      } else if (adminUser.role !== "admin") {
        // Update existing user to admin role
        adminUser.role = "admin";
        await adminUser.save();
      }
      
      generateToken(adminUser._id, res);
      
      return res.status(200).json({
        _id: adminUser._id,
        fullName: adminUser.fullName,
        email: adminUser.email,
        profilePic: adminUser.profilePic,
        role: adminUser.role
      });
    }

    // Regular user login
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};