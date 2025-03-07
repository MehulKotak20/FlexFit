import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    height: { type: Number },
    weight: { type: Number },
    age: { type: Number },
    gender: { type: String },
    goal: { type: String, default: "maintain" },
    activityLevel: { type: String, default: "moderate" },
    streak: { type: Number, default: 0 },
    exercises: [
      {
        name: String,
        date: String, // Track date user did it if you care about history
        caloriesBurned: Number,
      },
    ],
    nutrition: [
      {
        name: String,
        date: Date, // Optional, if you want to track when they consumed
        calories: Number,
        protein: Number,
      },
    ],
  },

  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
