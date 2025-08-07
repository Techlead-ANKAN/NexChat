import jwt from "jsonwebtoken"; // Importing the jsonwebtoken library for token verification
import User from "../models/user.models.js"; // Importing the User model to interact with the user database

// Middleware function to protect admin routes
export const adminRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Retrieving the JWT from cookies

    // Check if the token is not provided
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Verifying the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is invalid
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Finding the user by ID from the decoded token
    const user = await User.findById(decoded.userId).select("-password");

    // Check if the user does not exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied - Admin privileges required" });
    }

    req.user = user; // Attaching the user object to the request for further use

    next(); // Proceeding to the next middleware or route handler
  } catch (error) {
    console.log("Error in adminRoute middleware", error.message); // Logging the error message for debugging
    res.status(500).json({ message: "Internal Server Error" }); // Sending a 500 Internal Server Error response
  }
};

// Middleware to check if user is admin (for optional admin features)
export const checkAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      req.isAdmin = false;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      req.isAdmin = false;
      return next();
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user || user.isBlocked) {
      req.isAdmin = false;
      return next();
    }

    req.isAdmin = user.role === "admin";
    req.user = user;
    next();
  } catch (error) {
    req.isAdmin = false;
    next();
  }
};
