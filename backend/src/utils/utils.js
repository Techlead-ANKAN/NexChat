import jwt from "jsonwebtoken"; // Importing the jsonwebtoken library for token generation

// Function to generate a JWT token for a user
export const generateToken = (userId, res) => {
  // Signing the token with userId and a secret key, setting expiration to 7 days
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token will expire in 7 days
  });

  // Setting the cookie with the generated token
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (7 days)
    httpOnly: true, // Cookie is not accessible via JavaScript
    sameSite: "strict", // Cookie will only be sent in a first-party context
    secure: process.env.NODE_ENV !== "development", // Secure cookie in production environment
  });

  return token; // Returning the generated token
};
