/* 
---------------------------------------------------------Explanation---------------------------------------------------------
In the code above, comments have been added to clarify the purpose and functionality of each section.

Import Statement: The comment indicates that the mongoose library is being imported for MongoDB object modeling, which is essential for interacting with the database.

Schema Definition: The comment preceding the schema definition explains that a new schema for messages is being created. This is crucial for understanding the structure of the data.

Field Comments: Each field within the schema has a comment that describes its purpose:

senderId and receiverId fields are explained to indicate that they store the IDs of the sender and receiver, respectively, and that they are required fields.
The text and image fields are commented to specify that they hold the message content and any associated image.
Timestamps: The comment regarding timestamps clarifies that this option will automatically manage the creation and update times for each message.

Model Creation: The comment before the model creation indicates that a new model named Message is being created based on the defined schema, which is a key step in making the schema usable.

Export Statement: Finally, the comment explains that the Message model is being exported for use in other parts of the application, which is essential for modularity and reusability.
*/

import mongoose from "mongoose"; // Importing mongoose library for MongoDB object modeling

// Defining the message schema using mongoose
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      // Field for the ID of the sender
      type: mongoose.Schema.Types.ObjectId, // Specifying the type as ObjectId
      ref: "User", // Reference to the User model
      required: true, // This field is mandatory
    },
    receiverId: {
      // Field for the ID of the receiver (null for group messages)
      type: mongoose.Schema.Types.ObjectId, // Specifying the type as ObjectId
      ref: "User", // Reference to the User model
      required: false, // Not required for group messages
    },
    chatType: {
      // Field to distinguish between direct and group messages
      type: String,
      enum: ["direct", "group"],
      default: "direct",
      required: true,
    },
    text: {
      // Field for the message text
      type: String, // Specifying the type as String
    },
    image: {
      // Field for the message image
      type: String, // Specifying the type as String
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Enabling timestamps for createdAt and updatedAt fields
);

// Creating the Message model based on the message schema
const Message = mongoose.model("Message", messageSchema);

// Exporting the Message model for use in other parts of the application
export default Message;
