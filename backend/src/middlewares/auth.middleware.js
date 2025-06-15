/*
--------------------------------- Explanation -----------------------------------

In the provided code, comments have been added to clarify the purpose and functionality of each section.

Import Statements: Comments explain the purpose of importing the jsonwebtoken library and the User model, which are essential for token verification and user data retrieval, respectively.

Middleware Function: The comment preceding the protectRoute function indicates that this is a middleware function designed to protect certain routes.

Token Retrieval: A comment is added to describe the action of retrieving the JWT from cookies, which is crucial for authentication.

Token Validation: Comments are included to explain the checks for the presence and validity of the token, along with the corresponding responses sent back to the client.

User Retrieval: The comment clarifies the process of finding the user based on the ID extracted from the decoded token, emphasizing the importance of this step in ensuring that the user exists.

Error Handling: Comments are added to explain the logging of errors and the response sent in case of an internal server error, which is vital for debugging and user feedback.
*/


import jwt from "jsonwebtoken"; // Importing the jsonwebtoken library for token verification
import User from "../models/user.models.js"; // Importing the User model to interact with the user database

// Middleware function to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Retrieving the JWT from cookies
    // Check if the token is not provided
    if (!token) {
      return res
        .status(401) // Sending a 401 Unauthorized response
        .json({ message: "Unauthorized - No token provided" }); // JSON response indicating no token
    }

    // Verifying the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is invalid
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" }); // JSON response indicating invalid token
    }

    // Finding the user by ID from the decoded token
    const user = await User.findById(decoded.userId).select("-password");

    // Check if the user does not exist
    if (!user) {
      return res.status(404).json({ message: "user not found" }); // JSON response indicating user not found
    }

    req.user = user; // Attaching the user object to the request for further use

    next(); // Proceeding to the next middleware or route handler
  } catch (error) {
    console.log("Error in protectroute middleware", error.message); // Logging the error message for debugging
    res.status(500).json({ message: "Internal Server Error" }); // Sending a 500 Internal Server Error response
  }
};
