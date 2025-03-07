import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import passport from "../passportConfig.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// Google authentication route
// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user) {
      console.error("Google authentication failed. No user data received.");
      return res
        .status(401)
        .json({ message: "Google login failed. No user data." });
    }

    const { user, token } = req.user;

    if (!token) {
      console.error("Google authentication failed. No token received.");
      return res
        .status(401)
        .json({ message: "Google login failed. No token." });
    }

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain:
        process.env.NODE_ENV === "production" ? ".yourdomain.com" : "localhost",
    });

    console.log("Google login successful:", user.email);

    return res.redirect(`${process.env.CLIENT_URL}/`);
  }
);

export default router;
