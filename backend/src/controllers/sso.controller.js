import User from "../models/user.models.js";
import { generateToken } from "../utils/utils.js";
import { mapSSOTypeToRole } from "../utils/sso-utils.js";

/**
 * Handle SSO user authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const handleSSOAuth = async (req, res) => {
    try {
        const { id, type, name, email, phone } = req.body;

        // Validate required fields
        if (!id || !type || !name || !email) {
            return res.status(400).json({ 
                message: "Missing required SSO fields" 
            });
        }

        // Validate user type
        const validTypes = ['Member', 'Mentor', 'Admin'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ 
                message: "Invalid user type" 
            });
        }

        // Check if user exists by SSO ID or email
        let user = await User.findOne({
            $or: [
                { ssoId: id.toString() },
                { email: email.toLowerCase() }
            ]
        });

        if (user) {
            // Update existing user with latest SSO data
            user.ssoId = id.toString();
            user.ssoType = type;
            user.fullName = name;
            user.email = email.toLowerCase();
            user.phone = phone || user.phone;
            user.isSSOUser = true;
            user.lastSSOLogin = new Date();
            user.ssoProvider = "Laravel";

            // Update role if SSO type changed
            const newRole = mapSSOTypeToRole(type);
            if (user.role !== newRole) {
                user.role = newRole;
            }

            await user.save();
        } else {
            // Create new SSO user
            const newRole = mapSSOTypeToRole(type);
            
            user = new User({
                ssoId: id.toString(),
                ssoType: type,
                fullName: name,
                email: email.toLowerCase(),
                phone: phone || "",
                role: newRole,
                isSSOUser: true,
                ssoProvider: "Laravel",
                lastSSOLogin: new Date(),
                profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`
            });

            await user.save();
        }

        // Check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({ 
                message: "Account is blocked. Please contact support." 
            });
        }

        // Generate JWT token
        generateToken(user._id, res);

        // Return user data (excluding sensitive fields)
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            role: user.role,
            isSSOUser: user.isSSOUser,
            ssoType: user.ssoType,
            phone: user.phone
        };

        res.status(200).json({
            message: "SSO authentication successful",
            user: userResponse
        });

    } catch (error) {
        console.error("Error in SSO authentication:", error);
        res.status(500).json({ 
            message: "Internal server error during SSO authentication" 
        });
    }
};

/**
 * Get SSO user information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSSOUserInfo = async (req, res) => {
    try {
        const { ssoId, email } = req.query;

        if (!ssoId && !email) {
            return res.status(400).json({ 
                message: "SSO ID or email is required" 
            });
        }

        const query = {};
        if (ssoId) query.ssoId = ssoId;
        if (email) query.email = email.toLowerCase();

        const user = await User.findOne(query).select("-password");

        if (!user) {
            return res.status(404).json({ 
                message: "SSO user not found" 
            });
        }

        res.status(200).json({
            user: {
                _id: user._id,
                ssoId: user.ssoId,
                ssoType: user.ssoType,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isSSOUser: user.isSSOUser,
                profilePic: user.profilePic,
                lastSSOLogin: user.lastSSOLogin
            }
        });

    } catch (error) {
        console.error("Error getting SSO user info:", error);
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
};

/**
 * Link existing account to SSO
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const linkAccountToSSO = async (req, res) => {
    try {
        const { ssoId, ssoType } = req.body;
        const userId = req.user._id;

        if (!ssoId || !ssoType) {
            return res.status(400).json({ 
                message: "SSO ID and type are required" 
            });
        }

        // Check if SSO ID is already linked to another account
        const existingSSOUser = await User.findOne({ ssoId });
        if (existingSSOUser && existingSSOUser._id.toString() !== userId.toString()) {
            return res.status(400).json({ 
                message: "SSO ID is already linked to another account" 
            });
        }

        // Update user with SSO information
        const user = await User.findByIdAndUpdate(
            userId,
            {
                ssoId,
                ssoType,
                isSSOUser: true,
                ssoProvider: "Laravel",
                lastSSOLogin: new Date()
            },
            { new: true, select: "-password" }
        );

        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        res.status(200).json({
            message: "Account linked to SSO successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
                role: user.role,
                isSSOUser: user.isSSOUser,
                ssoType: user.ssoType,
                ssoId: user.ssoId
            }
        });

    } catch (error) {
        console.error("Error linking account to SSO:", error);
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
};
