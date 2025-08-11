import mongoose from "mongoose";
import Message from "./src/models/message.models.js";
import User from "./src/models/user.models.js";

// Connect to MongoDB
const MONGODB_URI = "mongodb+srv://mrankanmaity:x77UagvQo9zBRgpp@cluster0.tsdxqbw.mongodb.net/NexChat_DB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    return markMessagesAsSeen();
  })
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

async function markMessagesAsSeen() {
  try {
    // Test user ID (the one with 26 unread messages)
    const testUserId = "689488b045a52c83210f5403";
    
    console.log(`\n=== Marking some group messages as seen for user ${testUserId} ===`);
    
    // Get the first 3 group messages that this user hasn't seen
    const unseenMessages = await Message.find({
      chatType: "group",
      senderId: { $ne: testUserId },
      seenBy: { $ne: testUserId }
    }).limit(3);
    
    console.log(`Found ${unseenMessages.length} unseen messages to mark as seen`);
    
    for (const message of unseenMessages) {
      console.log(`Marking message ${message._id} as seen by ${testUserId}`);
      
      // Add user to seenBy array
      if (!message.seenBy.includes(testUserId)) {
        message.seenBy.push(testUserId);
        await message.save();
        console.log(`✅ Message ${message._id} marked as seen`);
      }
    }
    
    // Check the new unread count
    const newUnreadCount = await Message.countDocuments({
      chatType: "group",
      senderId: { $ne: testUserId },
      seenBy: { $ne: testUserId }
    });
    
    console.log(`\n🎯 New unread count for user ${testUserId}: ${newUnreadCount}`);
    
  } catch (error) {
    console.error("Error marking messages as seen:", error);
  }
}
