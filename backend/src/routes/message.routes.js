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

import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadMessageCounts,
} from "../controllers/message.controller.js";

const router = express.Router();

// ✅ Static routes go FIRST
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/unread-counts", protectRoute, getUnreadMessageCounts);
router.post("/mark-read", protectRoute, markMessagesAsRead);

// 👇 Dynamic route goes LAST
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
