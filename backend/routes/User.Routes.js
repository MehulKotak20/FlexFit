import express from "express";
import {
  addExercises,
  addNutrition,
  getUserProfile,
  updateUserProfile,
  clearUserData,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protect middleware - make sure user is logged in
router.use(verifyToken);

// Profile routes
router.get("/profile", getUserProfile); // Fetch full profile
router.patch("/profile", updateUserProfile); // Update basic info (height, weight, etc.)

// Fitness and nutrition routes
router.post("/exercises", addExercises); // Add exercises to user
router.post("/nutrition", addNutrition); // Add nutrition items to user

// Optional clear route
router.delete("/clear-data", clearUserData); // Clear exercises + nutrition (if needed)

export default router;
