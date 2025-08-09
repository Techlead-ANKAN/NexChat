// /*
// -------------------------------------------------Explanation-------------------------------------------------------
// In the provided code, comments have been added to clarify the purpose and functionality of each section. For instance, comments indicate the importation of models, the extraction of user IDs, and the handling of messages. Each controller function is annotated to explain its role, such as fetching users for the sidebar, retrieving messages, and sending messages.

// The comments also highlight specific actions, such as excluding sensitive information (like passwords) from the user data and the process of uploading images to Cloudinary. Additionally, a placeholder comment is included for future implementation of real-time messaging functionality using socket.io. This structured commenting approach enhances code readability and maintainability, making it easier for developers to understand the logic and flow of the application.
// */

// import User from "../models/user.models.js"; // Importing the User model for database operations
// import Message from "../models/message.models.js"; // Importing the Message model for database operations

// import cloudinary from "../lib/cloudinary.js";

// import {getReceiverSocketId, io} from "../lib/socket.js"

// // Controller to fetch users for the sidebar
// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id; // Extracting the logged-in user's ID from the request
//     const filteredUsers = await User.find({
//       _id: { $ne: loggedInUserId }, // Finding users excluding the logged-in user
//     }).select("-password"); // Excluding the password field from the result

//     res.status(200).json(filteredUsers); // Sending the filtered users as a JSON response
//   } catch (error) {
//     console.log("Error in getUsersForSidebar: ", error.message); // Logging the error message
//     res.status(500).json({ error: "Internal Server Error" }); // Sending a 500 error response
//   }
// };

// // Controller to fetch messages between users
// export const getMessages = async (req, res) => {
//   try {
//     const { id: userToChatId } = req.params; // Extracting the ID of the user to chat with from the request parameters
//     const myId = req.user._id; // Extracting the logged-in user's ID

//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: userToChatId }, // Finding messages sent by the logged-in user to the other user
//         { senderId: userToChatId, receiverId: myId }, // Finding messages sent by the other user to the logged-in user
//       ],
//     });

//     res.status(200).json(messages); // Sending the messages as a JSON response
//   } catch (error) {
//     console.log("Error in getMessages controller: ", error.message); // Logging the error message
//     res.status(500).json({ error: "Internal Server Error" }); // Sending a 500 error response
//   }
// };

// // Controller to send a message
// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body; // Extracting the message text and image from the request body
//     const { id: receiverId } = req.params; // Extracting the receiver's ID from the request parameters
//     const senderId = req.user._id; // Extracting the logged-in user's ID

//     let imageUrl; // Variable to hold the image URL
//     if (image) {
//       // Uploading base64 image to cloudinary if an image is provided
//       const uploadResponse = await cloudinary.uploader.upload(image); // Uploading the image to Cloudinary
//       imageUrl = uploadResponse.secure_url; // Storing the secure URL of the uploaded image
//     }

//     const newMessage = new Message({
//       // Creating a new message object
//       senderId,
//       receiverId,
//       text,
//       image: imageUrl, // Including the image URL if an image was uploaded
//     });

//     await newMessage.save(); // Saving the new message to the database

//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage); // Emitting a new
//     }

//     res.status(201).json(newMessage); // Sending the newly created message as a JSON response
//   } catch (error) {
//     console.log("Error in sendMessage controller: ", error.message); // Logging the error message
//     res.status(500).json({ error: "Internal Server Error" }); // Sending a 500 error response
//   }
// };

// import User from "../models/user.models.js"; // Importing the User model for database operations
// import Message from "../models/message.models.js"; // Importing the Message model for database operations

// import cloudinary from "../lib/cloudinary.js";

// import {getReceiverSocketId, io} from "../lib/socket.js"

// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;
//     const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

//     res.status(200).json(filteredUsers);
//   } catch (error) {
//     console.error("Error in getUsersForSidebar: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getMessages = async (req, res) => {
//   try {
//     const { id: userToChatId } = req.params;
//     const myId = req.user._id;

//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: userToChatId },
//         { senderId: userToChatId, receiverId: myId },
//       ],
//     });

//     res.status(200).json(messages);
//   } catch (error) {
//     console.log("Error in getMessages controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id;

//     let imageUrl;
//     if (image) {
//       // Upload base64 image to cloudinary
//       const uploadResponse = await cloudinary.uploader.upload(image);
//       imageUrl = uploadResponse.secure_url;
//     }

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       text,
//       image: imageUrl,
//     });

//     await newMessage.save();

//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log("Error in sendMessage controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

import mongoose from "mongoose";
import User from "../models/user.models.js"; // Importing the User model for database operations
import Message from "../models/message.models.js"; // Importing the Message model for database operations

import cloudinary from "../lib/cloudinary.js";

import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    })
    .populate("senderId", "fullName profilePic")
    .populate("receiverId", "fullName profilePic");

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      read: false,
      delivered: false, // Initially not delivered
    });

    await newMessage.save();

    // Populate sender information
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "fullName profilePic")
      .populate("receiverId", "fullName profilePic");

    // Send to receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Mark as delivered since receiver is online
      await Message.findByIdAndUpdate(newMessage._id, { 
        delivered: true, 
        deliveredAt: new Date() 
      });
      populatedMessage.delivered = true;
      populatedMessage.deliveredAt = new Date();
      
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
      
      // Notify sender about delivery status
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageDelivered", { 
          messageId: newMessage._id, 
          delivered: true,
          deliveredAt: new Date()
        });
      }
    }

    // Send back to sender to show their own message immediately
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.user._id;

    const readAt = new Date();

    const updatedMessages = await Message.updateMany(
      { senderId, receiverId, read: false },
      { $set: { read: true, readAt } }
    );

    // Notify sender that messages have been read
    if (updatedMessages.modifiedCount > 0) {
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", { 
          readBy: receiverId, 
          senderId,
          readAt 
        });
      }
    }

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.log("Error in markMessagesAsRead controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUnreadMessageCounts = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCounts = await Message.aggregate([
      {
        $match: {
          receiverId: userId, // ✅ Already an ObjectId, no wrapping needed
          read: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(unreadCounts); // [{ _id: senderId, count: 3 }]
  } catch (error) {
    console.log("Error in getUnreadMessageCounts: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Group Chat Controllers
export const getGroupMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatType: "group" })
      .populate("senderId", "fullName profilePic")
      .sort({ createdAt: 1 })
      .limit(100); // Limit to last 100 messages for performance

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getGroupMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      chatType: "group",
      text,
      image: imageUrl,
      read: false,
    });

    await newMessage.save();

    // Populate sender info for the response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "fullName profilePic");

    // Broadcast to ALL users (this is correct for group chat)
    io.emit("newGroupMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("Error in sendGroupMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Message Status Controllers
export const markMessageAsDelivered = async (req, res) => {
  try {
    const { messageId } = req.params;
    const deliveredAt = new Date();

    const message = await Message.findByIdAndUpdate(
      messageId,
      { delivered: true, deliveredAt },
      { new: true }
    ).populate("senderId", "fullName");

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Notify sender about delivery
    const senderSocketId = getReceiverSocketId(message.senderId._id);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageDelivered", {
        messageId,
        delivered: true,
        deliveredAt
      });
    }

    res.status(200).json({ message: "Message marked as delivered" });
  } catch (error) {
    console.log("Error in markMessageAsDelivered controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markGroupMessageAsSeen = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Add user to seenBy array if not already present
    if (!message.seenBy.includes(userId)) {
      message.seenBy.push(userId);
      await message.save();

      // Notify sender about the new view
      const senderSocketId = getReceiverSocketId(message.senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("groupMessageSeen", {
          messageId,
          seenBy: userId,
          seenAt: new Date()
        });
      }
    }

    res.status(200).json({ message: "Message marked as seen" });
  } catch (error) {
    console.log("Error in markGroupMessageAsSeen controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
