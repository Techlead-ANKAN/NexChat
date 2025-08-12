import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "BULK_MESSAGE_DELETION",
        "USER_BLOCKED",
        "USER_UNBLOCKED", 
        "USER_DELETED",
        "MESSAGE_DELETED",
        "ADMIN_LOGIN",
        "ADMIN_SETTINGS_CHANGE"
      ]
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    adminName: {
      type: String,
      required: true
    },
    adminEmail: {
      type: String,
      required: true
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // Only for user-specific actions
    },
    targetUserName: {
      type: String,
      required: false // Only for user-specific actions
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Flexible object for action-specific details
      required: false
    },
    stats: {
      type: mongoose.Schema.Types.Mixed, // For storing statistics like deletion counts
      required: false
    },
    errorMessages: [{ // Renamed from 'errors' to avoid reserved keyword warning
      type: String
    }],
    ipAddress: {
      type: String,
      required: false
    },
    userAgent: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    suppressReservedKeysWarning: true // Suppress warnings for reserved keys
  }
);

// Index for efficient querying
auditLogSchema.index({ adminId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
