/*
--------------------------------- Explanation -----------------------------------

The line import mongoose from "mongoose"; indicates that we are importing the Mongoose library, which is essential for interacting with MongoDB databases in a Node.js environment.

The comment // Function to connect to the MongoDB database succinctly describes the purpose of the connectDB function, which is to establish a connection to the database.

Inside the try block, the comment // Attempting to connect to the MongoDB using the URI from environment variables clarifies that we are trying to connect to MongoDB using a URI stored in the environment variables, ensuring that sensitive information is not hard-coded.

The line // Logging the host of the connected MongoDB instance explains that we are outputting the host information of the MongoDB connection to the console, which can be useful for debugging and confirmation of a successful connection.

Finally, the comment // Logging any errors that occur during the connection attempt indicates that if an error occurs while trying to connect, it will be logged to the console, allowing for easier troubleshooting.
*/

import mongoose from "mongoose"; // Importing the mongoose library for MongoDB interactions

// Function to connect to the MongoDB database
export const connectDB = async () => {
  try {
    // Attempting to connect to the MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    // Logging the host of the connected MongoDB instance
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Logging any errors that occur during the connection attempt
    console.log(error);
  }
};
