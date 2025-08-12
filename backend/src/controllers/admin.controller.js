import User from "../models/user.models.js";
import Message from "../models/message.models.js";
import AuditLog from "../models/audit.models.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { io, emitAllMessagesCleared } from "../lib/socket.js";

// Get all users for admin dashboard
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", blocked } = req.query;
    
    const filter = {};
    
    // Search filter
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    // Blocked filter
    if (blocked !== undefined) {
      filter.isBlocked = blocked === "true";
    }

    // Build query
    let query = User.find(filter)
      .select("-password")
      .populate("blockedBy", "fullName email")
      .sort({ createdAt: -1 });

    // Apply pagination only if limit is provided
    if (limit && limit !== "undefined") {
      query = query.limit(limit * 1).skip((page - 1) * limit);
    }

    const users = await query;
    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      users,
      totalPages: limit && limit !== "undefined" ? Math.ceil(totalUsers / limit) : 1,
      currentPage: page,
      totalUsers
    });
  } catch (error) {
    console.log("Error in getAllUsers controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user details including message history
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate("blockedBy", "fullName email");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get message stats
    const messageStats = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          sentMessages: {
            $sum: { $cond: [{ $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] }, 1, 0] }
          },
          receivedMessages: {
            $sum: { $cond: [{ $eq: ["$receiverId", new mongoose.Types.ObjectId(userId)] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = messageStats[0] || { totalMessages: 0, sentMessages: 0, receivedMessages: 0 };

    res.status(200).json({
      user,
      stats
    });
  } catch (error) {
    console.log("Error in getUserDetails controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Block or unblock a user
export const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (userId === adminId.toString()) {
      return res.status(400).json({ error: "Cannot block yourself" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ error: "Cannot block another admin" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isBlocked: !user.isBlocked,
        blockedAt: !user.isBlocked ? new Date() : null,
        blockedBy: !user.isBlocked ? adminId : null
      },
      { new: true }
    ).populate("blockedBy", "fullName email");

    res.status(200).json({
      message: `User ${updatedUser.isBlocked ? "blocked" : "unblocked"} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.log("Error in toggleUserBlock controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all messages with filters for admin moderation
export const getAllMessages = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      chatType = "all", 
      search = "", 
      userId,
      startDate,
      endDate 
    } = req.query;

    const filter = {};

    // Chat type filter
    if (chatType !== "all") {
      filter.chatType = chatType;
    }

    // User filter
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.$or = [
        { senderId: new mongoose.Types.ObjectId(userId) },
        { receiverId: new mongoose.Types.ObjectId(userId) }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Text search filter
    if (search) {
      filter.text = { $regex: search, $options: "i" };
    }

    const messages = await Message.find(filter)
      .populate("senderId", "fullName email profilePic role isBlocked")
      .populate("receiverId", "fullName email profilePic role isBlocked")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalMessages = await Message.countDocuments(filter);

    res.status(200).json({
      messages,
      totalPages: Math.ceil(totalMessages / limit),
      currentPage: page,
      totalMessages
    });
  } catch (error) {
    console.log("Error in getAllMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a message (admin moderation)
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ error: "Invalid message ID" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get admin dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get user stats
    const totalUsers = await User.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const activeUsers = totalUsers - blockedUsers;
    const adminUsers = await User.countDocuments({ role: "admin" });

    // Get message stats
    const totalMessages = await Message.countDocuments();
    const directMessages = await Message.countDocuments({ chatType: "direct" });
    const groupMessages = await Message.countDocuments({ chatType: "group" });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });
    const recentMessages = await Message.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    // Get daily message counts for the last 7 days
    const dailyMessageCounts = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      }
    ]);

    res.status(200).json({
      users: {
        total: totalUsers,
        active: activeUsers,
        blocked: blockedUsers,
        admins: adminUsers,
        recent: recentUsers
      },
      messages: {
        total: totalMessages,
        direct: directMessages,
        group: groupMessages,
        recent: recentMessages
      },
      activity: {
        dailyMessages: dailyMessageCounts
      }
    });
  } catch (error) {
    console.log("Error in getDashboardStats controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get conversation between two users (admin access)
export const getConversation = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(user1Id) || !mongoose.Types.ObjectId.isValid(user2Id)) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ],
      chatType: "direct"
    })
    .populate("senderId", "fullName email profilePic")
    .populate("receiverId", "fullName email profilePic")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const totalMessages = await Message.countDocuments({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ],
      chatType: "direct"
    });

    res.status(200).json({
      messages: messages.reverse(), // Reverse to show oldest first
      totalPages: Math.ceil(totalMessages / limit),
      currentPage: page,
      totalMessages
    });
  } catch (error) {
    console.log("Error in getConversation controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Promote user to admin
export const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ error: "User is already an admin" });
    }

    if (user.isBlocked) {
      return res.status(400).json({ error: "Cannot promote blocked user to admin" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "User promoted to admin successfully",
      user: updatedUser
    });
  } catch (error) {
    console.log("Error in promoteToAdmin controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send admin warning to user
export const sendWarningToUser = async (req, res) => {
  try {
    const { userId, warningMessage, severity = "moderate" } = req.body;
    const adminId = req.user._id;

    // Validate inputs
    if (!userId || !warningMessage) {
      return res.status(400).json({ error: "User ID and warning message are required" });
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get admin user
    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Create warning message templates based on severity
    const warningTemplates = {
      mild: {
        prefix: "⚠️ Community Guidelines Reminder",
        suffix: "Please review our community guidelines. Continued violations may result in account restrictions."
      },
      moderate: {
        prefix: "⚠️ Official Warning - Community Guidelines Violation",
        suffix: "This is an official warning. Further violations may result in temporary suspension or account termination."
      },
      severe: {
        prefix: "🚨 Final Warning - Serious Violation",
        suffix: "This is your final warning. Any further violations will result in immediate account termination."
      }
    };

    const template = warningTemplates[severity] || warningTemplates.moderate;
    
    const fullWarningMessage = `${template.prefix}\n\n${warningMessage}\n\n${template.suffix}\n\n--- \nWild By Nature Admin Team`;

    // Create warning message in database
    const warningMessageDoc = new Message({
      senderId: adminId,
      receiverId: userId,
      text: fullWarningMessage,
      isAdminWarning: true,
      warningSeverity: severity
    });

    await warningMessageDoc.save();

    // Update user's warning count and history
    await User.findByIdAndUpdate(userId, {
      $inc: { warningCount: 1 },
      $push: { 
        warnings: {
          severity: severity,
          reason: warningMessage,
          givenBy: adminId,
          givenAt: new Date()
        }
      },
      $set: {
        lastWarningAt: new Date()
      }
    });

    // Populate the message for response
    const populatedMessage = await Message.findById(warningMessageDoc._id)
      .populate("senderId", "fullName email profilePic role")
      .populate("receiverId", "fullName email");

    res.status(200).json({
      message: "Warning sent successfully",
      warning: populatedMessage
    });
  } catch (error) {
    console.log("Error in sendWarningToUser controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Clear All Messages - Admin Only Feature
 * Deletes all messages from database and cleans up Cloudinary storage
 * Preserves user profile pictures
 */
export const clearAllMessages = async (req, res) => {
  try {
    const { confirmation } = req.body;
    
    // Security check: require confirmation text
    if (confirmation !== "DELETE ALL MESSAGES") {
      return res.status(400).json({ 
        error: "Confirmation required. Type 'DELETE ALL MESSAGES' to proceed." 
      });
    }

    // Step 1: Get statistics before deletion
    const totalMessages = await Message.countDocuments();
    const messagesWithImages = await Message.countDocuments({ 
      image: { $exists: true, $ne: "" } 
    });

    console.log(`🗑️ Admin ${req.user.fullName} initiated bulk message deletion:`);
    console.log(`   📊 Total messages to delete: ${totalMessages}`);
    console.log(`   🖼️ Messages with images: ${messagesWithImages}`);

    // Step 2: Get all message images for Cloudinary cleanup
    const messageImages = await Message.find({ 
      image: { $exists: true, $ne: "" } 
    }).select("image");

    // Step 3: Extract Cloudinary public IDs from message images
    const messageImageUrls = messageImages.map(msg => msg.image);
    const messagePublicIds = extractCloudinaryPublicIds(messageImageUrls);

    // Step 4: Get all user profile pictures to avoid deleting them
    const userProfiles = await User.find({ 
      profilePic: { $exists: true, $ne: "" } 
    }).select("profilePic");
    
    const profilePicUrls = userProfiles.map(user => user.profilePic);
    const profilePublicIds = extractCloudinaryPublicIds(profilePicUrls);

    // Step 5: Filter out profile pictures from deletion list
    const imagesToDelete = messagePublicIds.filter(id => 
      !profilePublicIds.includes(id)
    );

    console.log(`   🔒 Profile pictures to preserve: ${profilePublicIds.length}`);
    console.log(`   🗑️ Message images to delete: ${imagesToDelete.length}`);

    // Step 6: Delete images from Cloudinary in batches
    let cloudinaryDeletionResults = { deleted: 0, failed: 0, errors: [] };
    
    if (imagesToDelete.length > 0) {
      try {
        // Cloudinary allows max 100 resources per delete request
        const batchSize = 100;
        
        for (let i = 0; i < imagesToDelete.length; i += batchSize) {
          const batch = imagesToDelete.slice(i, i + batchSize);
          
          try {
            const deleteResult = await cloudinary.api.delete_resources(batch, {
              resource_type: "image"
            });
            
            cloudinaryDeletionResults.deleted += Object.keys(deleteResult.deleted || {}).length;
            
            // Log any failed deletions
            if (deleteResult.partial) {
              cloudinaryDeletionResults.failed += batch.length - Object.keys(deleteResult.deleted || {}).length;
              cloudinaryDeletionResults.errors.push(`Batch ${i}-${i + batchSize}: Some images failed to delete`);
            }
            
          } catch (batchError) {
            console.error(`Error deleting Cloudinary batch ${i}-${i + batchSize}:`, batchError);
            cloudinaryDeletionResults.failed += batch.length;
            cloudinaryDeletionResults.errors.push(`Batch ${i}-${i + batchSize}: ${batchError.message}`);
          }
        }
        
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
        cloudinaryDeletionResults.errors.push(`Cloudinary API error: ${cloudinaryError.message}`);
      }
    }

    // Step 7: Delete all messages from database
    const deleteResult = await Message.deleteMany({});
    
    // Step 8: Log admin action for audit trail
    const auditLogData = {
      action: "BULK_MESSAGE_DELETION",
      adminId: req.user._id,
      adminName: req.user.fullName,
      adminEmail: req.user.email,
      stats: {
        messagesDeleted: deleteResult.deletedCount,
        imagesDeletedFromCloudinary: cloudinaryDeletionResults.deleted,
        imagesDeletionFailed: cloudinaryDeletionResults.failed,
        profilePicturesPreserved: profilePublicIds.length,
        totalMessagesBeforeDeletion: totalMessages,
        messagesWithImagesBeforeDeletion: messagesWithImages
      },
      errorMessages: cloudinaryDeletionResults.errors,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    // Save audit log to database
    try {
      const auditLog = new AuditLog(auditLogData);
      await auditLog.save();
      console.log("📋 Admin Action Audit Log saved to database:", auditLog._id);
    } catch (auditError) {
      console.error("Failed to save audit log:", auditError);
    }

    // Also log to console for immediate visibility
    console.log("📋 Admin Action Audit Log:", JSON.stringify(auditLogData, null, 2));

    // Step 9: Emit real-time update to all connected clients
    try {
      io.emit("allMessagesCleared", {
        message: "All messages have been cleared by administrator",
        timestamp: new Date(),
        clearedBy: req.user.fullName
      });
    } catch (socketError) {
      console.error("Socket emission error:", socketError);
    }

    // Step 10: Notify all connected users via socket
    emitAllMessagesCleared();

    // Step 11: Send success response
    res.status(200).json({
      success: true,
      message: "All messages cleared successfully",
      stats: {
        messagesDeleted: deleteResult.deletedCount,
        imagesDeleted: cloudinaryDeletionResults.deleted,
        imagesDeletionFailed: cloudinaryDeletionResults.failed,
        profilePicturesPreserved: profilePublicIds.length,
        totalProcessingTime: Date.now() - Date.now() // Will be very small since we're at the end
      },
      ...(cloudinaryDeletionResults.errors.length > 0 && {
        warnings: {
          message: "Some Cloudinary images could not be deleted",
          errors: cloudinaryDeletionResults.errors
        }
      })
    });

  } catch (error) {
    console.error("Error in clearAllMessages controller:", error);
    res.status(500).json({ 
      error: "Internal server error during message clearing",
      details: error.message 
    });
  }
};

/**
 * Get Clear Messages Statistics - Preview before deletion
 */
export const getClearMessagesStats = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const messagesWithImages = await Message.countDocuments({ 
      image: { $exists: true, $ne: "" } 
    });
    const totalUsers = await User.countDocuments();
    const usersWithProfilePics = await User.countDocuments({ 
      profilePic: { $exists: true, $ne: "" } 
    });

    // Get date range of messages
    const oldestMessage = await Message.findOne().sort({ createdAt: 1 });
    const newestMessage = await Message.findOne().sort({ createdAt: -1 });

    res.status(200).json({
      stats: {
        totalMessages,
        messagesWithImages,
        messagesWithTextOnly: totalMessages - messagesWithImages,
        totalUsers,
        usersWithProfilePics,
        dateRange: {
          oldest: oldestMessage?.createdAt || null,
          newest: newestMessage?.createdAt || null
        }
      },
      warning: "This action will permanently delete all messages and cannot be undone.",
      preservation: {
        userAccounts: "Will be preserved",
        profilePictures: "Will be preserved", 
        userSettings: "Will be preserved",
        adminLogs: "Will be preserved"
      }
    });

  } catch (error) {
    console.error("Error in getClearMessagesStats controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Helper function to extract Cloudinary public IDs from URLs
 */
function extractCloudinaryPublicIds(urls) {
  return urls
    .filter(url => url && typeof url === 'string')
    .map(url => {
      try {
        // Extract public ID from Cloudinary URL
        // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
        const matches = url.match(/\/v\d+\/(.+?)\./);
        return matches ? matches[1] : null;
      } catch (error) {
        console.error("Error extracting public ID from URL:", url, error);
        return null;
      }
    })
    .filter(id => id !== null);
}

// Get audit logs for admin dashboard
export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, action, adminId, startDate, endDate } = req.query;
    
    const filter = {};
    
    // Filter by action type
    if (action) {
      filter.action = action;
    }
    
    // Filter by admin ID
    if (adminId) {
      filter.adminId = adminId;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }
    
    const skip = (page - 1) * limit;
    
    const [logs, totalLogs] = await Promise.all([
      AuditLog.find(filter)
        .populate('adminId', 'fullName email profilePic')
        .populate('targetUserId', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments(filter)
    ]);
    
    const totalPages = Math.ceil(totalLogs / limit);
    
    res.status(200).json({
      success: true,
      logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalLogs,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error("Error in getAuditLogs controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      error: error.message
    });
  }
};

// Get audit log statistics
export const getAuditStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const [
      totalActions,
      actionsByType,
      actionsByAdmin,
      recentBulkDeletions
    ] = await Promise.all([
      // Total actions in the specified period
      AuditLog.countDocuments({
        createdAt: { $gte: startDate }
      }),
      
      // Actions grouped by type
      AuditLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: "$action", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Actions grouped by admin
      AuditLog.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { adminId: "$adminId", adminName: "$adminName" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      // Recent bulk deletions with stats
      AuditLog.find({
        action: "BULK_MESSAGE_DELETION",
        createdAt: { $gte: startDate }
      })
      .select('adminName createdAt stats errors')
      .sort({ createdAt: -1 })
      .limit(10)
    ]);
    
    res.status(200).json({
      success: true,
      period: `Last ${days} days`,
      stats: {
        totalActions,
        actionsByType,
        actionsByAdmin,
        recentBulkDeletions
      }
    });
    
  } catch (error) {
    console.error("Error in getAuditStats controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit statistics",
      error: error.message
    });
  }
};
