import { User } from "../models/user.model.js";

export const addExercises = async (req, res) => {
  try {
    const { exercises } = req.body; // Array of { name, date, caloriesBurned }

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid exercises data" });
    }

    // Add the exercises to the user's profile
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { exercises: { $each: exercises } } },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, message: "Exercises added", user });
  } catch (error) {
    console.log("Error adding exercises:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add exercises" });
  }
};

export const addNutrition = async (req, res) => {
  try {
    console.log("Received nutrition data:", req.body.nutrition); // Log the received data

    const { nutrition } = req.body; // Array of { name, date, calories, protein }

    if (!Array.isArray(nutrition) || nutrition.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid nutrition data" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $push: { nutrition: { $each: nutrition } } },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, message: "Nutrition added", user });
  } catch (error) {
    console.log("Error adding nutrition:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add nutrition" });
  }
};


// Get full user profile (including exercises & nutrition)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user profile" });
  }
};

// Update user profile (height, weight, goal, etc.)
export const updateUserProfile = async (req, res) => {
  try {
    const { height, weight, age, gender, goal, activityLevel } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: { height, weight, age, gender, goal, activityLevel } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.log("Error updating profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};

// Optional: Clear all exercises and nutrition (e.g., reset button)
export const clearUserData = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: { exercises: [], nutrition: [] } },
      { new: true }
    ).select("-password");

    res
      .status(200)
      .json({ success: true, message: "User data cleared", user: updatedUser });
  } catch (error) {
    console.log("Error clearing user data:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to clear user data" });
  }
};
