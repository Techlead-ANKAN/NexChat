// Importing the Cloudinary library, specifically version 2
import { v2 as cloudinary } from "cloudinary";

// Importing the config function from the dotenv package to manage environment variables
import { config } from "dotenv";

// Invoking the config function to load environment variables from a .env file
config();

// Configuring Cloudinary with the necessary credentials from environment variables
cloudinary.config({
  // Setting the cloud name for Cloudinary account
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // Setting the API key for authentication
  api_key: process.env.CLOUDINARY_API_KEY,
  // Setting the API secret for secure access
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Exporting the configured Cloudinary instance for use in other modules
export default cloudinary;
