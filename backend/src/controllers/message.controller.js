/* 
-------------------------------------------------Explanation-------------------------------------------------------
In the provided code, comments have been added to clarify the purpose and functionality of each section. For instance, comments indicate the importation of models, the extraction of user IDs, and the handling of messages. Each controller function is annotated to explain its role, such as fetching users for the sidebar, retrieving messages, and sending messages.

The comments also highlight specific actions, such as excluding sensitive information (like passwords) from the user data and the process of uploading images to Cloudinary. Additionally, a placeholder comment is included for future implementation of real-time messaging functionality using socket.io. This structured commenting approach enhances code readability and maintainability, making it easier for developers to understand the logic and flow of the application.
*/


import User from "../models/user.models.js"; // Importing the User model for database operations
import Message from "../models/message.models.js"; // Importing the Message model for database operations

// Controller to fetch users for the sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Extracting the logged-in user's ID from the request
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }, // Finding users excluding the logged-in user
    }).select("-password"); // Excluding the password field from the result

    res.status(200).json(filteredUsers); // Sending the filtered users as a JSON response
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error.message); // Logging the error message
    res.status(500).json({ error: "Internal Server Error" }); // Sending a 500 error response
  }
};

// Controller to fetch messages between users
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // Extracting the ID of the user to chat with from the request parameters
    const myId = req.user._id; // Extracting the logged-in user's ID

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId }, // Finding messages sent by the logged-in user to the other user
        { senderId: userToChatId, receiverId: myId }, // Finding messages sent by the other user to the logged-in user
      ],
    });

    res.status(200).json(messages); // Sending the messages as a JSON response
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message); // Logging the error message
    res.status(500).json({ error: "Internal Server Error" }); // Sending a 500 error response
  }
};

// Controller to send a message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // Extracting the message text and image from the request body
    const { id: receiverId } = req.params; // Extracting the receiver's ID from the request parameters
    const senderId = req.user._id; // Extracting the logged-in user's ID

    let imageUrl; // Variable to hold the image URL
    if (image) {
      // Uploading base64 image to cloudinary if an image is provided
      const uploadResponse = await cloudinary.uploader.upload(image); // Uploading the image to Cloudinary
      imageUrl = uploadResponse.secureUrl; // Storing the secure URL of the uploaded image
    }

    const newMessage = new Message({
      // Creating a new message object
      senderId,
      receiverId,
      text,
      image: imageUrl, // Including the image URL if an image was uploaded
    });

    await newMessage.save(); // Saving the new message to the database

    // TODO: Implement real-time functionality using socket.io here

    res.status(201).json(newMessage); // Sending the newly created message as a JSON response
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message); // Logging the error message
    res.status(500).json({ error: "Internal Server Error" }); // Sending a 500 error response
  }
};
