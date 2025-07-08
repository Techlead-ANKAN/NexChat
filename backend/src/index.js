// /*
// --------------------------------- Explanation -----------------------------------
// In the code above, each comment serves to clarify the purpose of the corresponding line or block of code. For instance, the comment // Importing the express framework for building web applications succinctly describes the role of the express import, making it easier for developers to understand the code's functionality at a glance.

// Similarly, comments like // Middleware to parse JSON request bodies and // Mounting the authentication routes at the /api/auth endpoint provide context on how the application processes incoming requests and organizes its routing structure.

// The final comment, // Calling the function to connect to the database, indicates that the application is establishing a connection to the database, which is crucial for its operation. Each comment enhances the readability and maintainability of the code, ensuring that future developers can quickly grasp the intent behind each line.
// */

// import express from "express"; // Importing the express framework for building web applications
// import dotenv from "dotenv"; // Importing dotenv to manage environment variables
// import cookieParser from "cookie-parser"; // Importing cookie-parser to parse cookies in requests
// import authRoutes from "./routes/auth.routes.js"; // Importing authentication routes from a separate module
// import messageRoutes from "./routes/message.routes.js"; // Importing message routes from a separate module
// import { connectDB } from "./lib/db.js"; // Importing the database connection function
// import cors from "cors";
// import { updateProfile } from "./controllers/auth.controllers.js";
// import { protectRoute } from "./middlewares/auth.middleware.js";
// import { app, server } from "./lib/socket.js";

// import path from "path";

// dotenv.config(); // Loading environment variables from a .env file

// const PORT = process.env.PORT || 3000; // Setting the port to the value from environment variables or defaulting to 3000

// const __dirname = path.resolve();

// app.use(express.json({ limit: "10mb" })); // Middleware to parse JSON request bodies
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(cookieParser()); // Middleware to parse cookies from requests

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use("/api/auth", authRoutes); // Mounting the authentication routes at the /api/auth endpoint
// app.use("/api/messages", messageRoutes); // Mounting the message routes at the /api/message endpoint

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

// app.put("/api/user/update-profile", protectRoute, updateProfile);
// server.listen(PORT, () => {
//   // Starting the server and listening on the specified port
//   console.log(`Server is running on port ${PORT}`); // Logging a message to the console indicating the server is running
//   connectDB(); // Calling the function to connect to the database
// });

// import express from "express"; // Importing the express framework for building web applications
// import dotenv from "dotenv"; // Importing dotenv to manage environment variables
// import cookieParser from "cookie-parser"; // Importing cookie-parser to parse cookies in requests
// import authRoutes from "./routes/auth.routes.js"; // Importing authentication routes from a separate module
// import messageRoutes from "./routes/message.routes.js"; // Importing message routes from a separate module
// import { connectDB } from "./lib/db.js"; // Importing the database connection function
// import cors from "cors";
// import { updateProfile } from "./controllers/auth.controllers.js";
// import { protectRoute } from "./middlewares/auth.middleware.js";
// import { app, server } from "./lib/socket.js";

// import path from "path";

// dotenv.config();

// const PORT = process.env.PORT;
// const __dirname = path.resolve();

// app.use(express.json({ limit: '10mb' }));
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

// server.listen(PORT, () => {
//   console.log("server is running on PORT:" + PORT);
//   connectDB();
// });

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5001; // Added fallback port
const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS configuration - dynamic based on environment
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL || true // Allow any origin in production if not specified
      : "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
