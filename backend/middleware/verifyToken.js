import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyToken = async (req, res, next) => {

  console.log("Incoming request headers:", req.headers.authorization);
  let token = req.headers.authorization?.split(" ")[1];
  console.log("Extracted 1 Token:", token);

  if (!token) {
    token = req.cookies.token; // Check in cookies
    console.log("Extracted 2 Token:", token);
  }

  if (!token) {
    console.log("No token provided in request!");
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  }

  console.log("Extracted Token:", token);

  try {
    let decoded;

    if (token.startsWith("ey")) {
      // Normal JWT from our backend
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } else if (token.length > 100) {
      // Google OAuth Token (Google ID tokens are usually long)
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      decoded = ticket.getPayload();
    } else {
      throw new Error("Invalid token format");
    }

    req.userId = decoded.userId || decoded.sub; // Google uses "sub" instead of "userId"
    req.isAdmin = decoded.isAdmin || false;

    next();
  } catch (error) {
    console.error("Error in verifyToken:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - invalid token" });
  }
};
