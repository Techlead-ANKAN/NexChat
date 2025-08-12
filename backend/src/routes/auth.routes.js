/*
--------------------------------- Explanation -----------------------------------

In the code above, comments have been added to clarify the purpose of each line and section.

Import Statements: Each import statement is annotated to indicate what is being imported and its purpose within the application. This helps in understanding the dependencies and their roles.

Router Instance: The creation of the router instance is commented to specify that it is a new instance of the express router, which is essential for defining routes.

Route Definitions: Each route definition is accompanied by a comment that describes the specific action being performed. This includes the HTTP method, the endpoint, and the corresponding controller function that handles the request.

Export Statement: The export statement is commented to indicate that the router is being made available for use in other modules, which is crucial for modular application design.
*/

import express from "express"; // Importing the express framework for building web applications
import {
  login,
  logout,
  signup,
  updateProfile,
  updateEmail,
  updatePassword,
  checkAuth
} from "../controllers/auth.controllers.js"; // Importing authentication controller functions
import { protectRoute } from "../middlewares/auth.middleware.js"; // Importing middleware to protect routes
import { 
  validateProfileUpdate, 
  validateEmailUpdate, 
  validatePasswordUpdate, 
  rateLimitProfileUpdates 
} from "../middlewares/validation.middleware.js"; // Importing validation middleware

const router = express.Router(); // Creating a new router instance

// Route for user signup, calls the signup function from the controller
router.post("/signup", signup);

// Route for user login, calls the login function from the controller
router.post("/login", login);

// Route for user logout, calls the logout function from the controller
router.post("/logout", logout);

// Route for updating user profile (fullName and profilePic), protected by middleware and validation
router.put("/update-profile", protectRoute, rateLimitProfileUpdates, validateProfileUpdate, updateProfile);

// Route for updating user email, protected by middleware and validation
router.put("/update-email", protectRoute, rateLimitProfileUpdates, validateEmailUpdate, updateEmail);

// Route for updating user password, protected by middleware and validation
router.put("/update-password", protectRoute, rateLimitProfileUpdates, validatePasswordUpdate, updatePassword);

// Route for checking user authentication status, protected by middleware, calls the checkAuth function from the controller
router.get("/check", protectRoute, checkAuth);

export default router; // Exporting the router for use in other parts of the application