import express from "express";
import { 
    handleSSOAuth, 
    getSSOUserInfo, 
    linkAccountToSSO 
} from "../controllers/sso.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * SSO Authentication Routes
 */

// Handle SSO user authentication (login/signup)
router.post("/auth", handleSSOAuth);

// Get SSO user information (public route)
router.get("/user-info", getSSOUserInfo);

// Link existing account to SSO (protected route)
router.post("/link-account", protectRoute, linkAccountToSSO);

export default router;
