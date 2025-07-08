// // Importing the express framework to create a router for handling HTTP requests
// import express from "express";

// // Importing middleware to protect routes from unauthorized access
// import { protectRoute } from "../middlewares/auth.middleware.js";

// // Importing controller functions to handle user and message-related operations
// import { getUsersForSidebar } from "../controllers/message.controller.js";
// import { getMessages } from "../controllers/message.controller.js";
// import { sendMessage } from "../controllers/message.controller.js";

// // Creating a new router instance using express
// const router = express.Router();

// // Defining a GET route to fetch users for the sidebar, protected by authentication middleware
// router.get("/users", protectRoute, getUsersForSidebar);

// // Defining a GET route to fetch messages by user ID, protected by authentication middleware
// router.get("/:id", protectRoute, getMessages);

// // Defining a POST route to send a message to a specific user by ID, protected by authentication middleware
// router.post("/send/:id", protectRoute, sendMessage);

// // Exporting the router to be used in other parts of the application
// export default router;








// Importing the express framework to create a router for handling HTTP requests
import express from "express";

// Importing middleware to protect routes from unauthorized access
import { protectRoute } from "../middlewares/auth.middleware.js";

// Importing controller functions to handle user and message-related operations
import {
  getUsersForSidebar,
  getMessages,
  sendMessage
} from "../controllers/message.controller.js";

// Creating a new router instance using express
const router = express.Router();

/**
 * @route   GET /api/messages/users
 * @desc    Fetch users for the sidebar
 * @access  Protected
 */
router.get("/users", protectRoute, getUsersForSidebar);

/**
 * @route   GET /api/messages/:id
 * @desc    Fetch messages for a specific user
 * @access  Protected
 */
router.get("/:id", protectRoute, getMessages);

/**
 * @route   POST /api/messages/send
 * @desc    Fallback for missing recipient ID
 * @access  Public (will respond with 400)
 */
router.post("/send", (req, res) => {
  return res.status(400).json({ message: "Recipient ID is required." });
});

/**
 * @route   POST /api/messages/send/:id
 * @desc    Send a message to a specific user
 * @access  Protected
 */
router.post("/send/:id", protectRoute, sendMessage);

// Exporting the router to be used in other parts of the application
export default router;
