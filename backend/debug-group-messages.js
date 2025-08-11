import mongoose from "mongoose";
import Message from "./src/models/message.models.js";
import User from "./src/models/user.models.js";

// Connect to MongoDB
const MONGODB_URI = "mongodb+srv://mrankanmaity:x77UagvQo9zBRgpp@cluster0.tsdxqbw.mongodb.net/NexChat_DB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    return checkGroupMessages();
  })
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

async function checkGroupMessages() {
  try {
    // Get recent group messages
    const groupMessages = await Message.find({ chatType: "group" })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("senderId", "fullName")
      .lean();

    console.log("\n=== Recent Group Messages ===");
    groupMessages.forEach((msg, index) => {
      console.log(`${index + 1}. Message ID: ${msg._id}`);
      console.log(`   Sender: ${msg.senderId.fullName}`);
      console.log(`   Text: ${msg.text.substring(0, 50)}...`);
      console.log(`   SeenBy: [${(msg.seenBy || []).join(", ")}]`);
      console.log(`   Created: ${msg.createdAt}`);
      console.log("");
    });

    // Check unread count for specific users
    const testUserIds = [
      "6894d11139d1f68b81161a81",
      "689488b045a52c83210f5403"
    ];

    for (const userId of testUserIds) {
      const unreadCount = await Message.countDocuments({
        chatType: "group",
        senderId: { $ne: userId },
        seenBy: { $ne: userId }
      });
      console.log(`Unread count for user ${userId}: ${unreadCount}`);
    }
  } catch (error) {
    console.error("Error checking group messages:", error);
  }
}
