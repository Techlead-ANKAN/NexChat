import express from "express";
import { adminRoute } from "../middlewares/admin.middleware.js";
import {
  getAllUsers,
  getUserDetails,
  toggleUserBlock,
  getAllMessages,
  deleteMessage,
  getDashboardStats,
  getConversation,
  promoteToAdmin,
  sendWarningToUser
} from "../controllers/admin.controller.js";

const router = express.Router();

// Dashboard stats
router.get("/dashboard/stats", adminRoute, getDashboardStats);

// User management routes
router.get("/users", adminRoute, getAllUsers);
router.get("/users/:userId", adminRoute, getUserDetails);
router.patch("/users/:userId/toggle-block", adminRoute, toggleUserBlock);
router.patch("/users/:userId/promote", adminRoute, promoteToAdmin);
router.post("/users/:userId/warn", adminRoute, sendWarningToUser);

// Message management routes
router.get("/messages", adminRoute, getAllMessages);
router.delete("/messages/:messageId", adminRoute, deleteMessage);
router.get("/conversations/:user1Id/:user2Id", adminRoute, getConversation);

export default router;
