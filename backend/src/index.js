/* 
--------------------------------- Explanation -----------------------------------
In the code above, each comment serves to clarify the purpose of the corresponding line or block of code. For instance, the comment // Importing the express framework for building web applications succinctly describes the role of the express import, making it easier for developers to understand the code's functionality at a glance.

Similarly, comments like // Middleware to parse JSON request bodies and // Mounting the authentication routes at the /api/auth endpoint provide context on how the application processes incoming requests and organizes its routing structure.

The final comment, // Calling the function to connect to the database, indicates that the application is establishing a connection to the database, which is crucial for its operation. Each comment enhances the readability and maintainability of the code, ensuring that future developers can quickly grasp the intent behind each line.
*/

import express from "express"; // Importing the express framework for building web applications
import dotenv from "dotenv"; // Importing dotenv to manage environment variables
import cookieParser from "cookie-parser"; // Importing cookie-parser to parse cookies in requests
import authRoutes from "./routes/auth.routes.js"; // Importing authentication routes from a separate module
import messageRoutes from "./routes/message.routes.js"; // Importing message routes from a separate module
import { connectDB } from "./lib/db.js"; // Importing the database connection function
import cors from "cors";
import { updateProfile } from "./controllers/auth.controllers.js";
import { protectRoute } from "./middlewares/auth.middleware.js";

const app = express(); // Creating an instance of an Express application

dotenv.config(); // Loading environment variables from a .env file

const PORT = process.env.PORT || 3000; // Setting the port to the value from environment variables or defaulting to 3000

app.use(express.json({ limit: "10mb" })); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); // Middleware to parse cookies from requests

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes); // Mounting the authentication routes at the /api/auth endpoint
app.use("/api/message", messageRoutes); // Mounting the message routes at the /api/message endpoint

app.put("/api/user/update-profile", protectRoute, updateProfile);
app.listen(PORT, () => {
  // Starting the server and listening on the specified port
  console.log(`Server is running on port ${PORT}`); // Logging a message to the console indicating the server is running
  connectDB(); // Calling the function to connect to the database
});
