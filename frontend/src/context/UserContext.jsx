import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const defaultUser = {
  name: "User",
  height: null,
  weight: null,
  age: null,
  gender: "",
  goal: "",
  activityLevel: "",
};

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true); // track loading state
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get("/api/user/profile"); // Matches your GET /profile route
      const userData = data.user || {};

      setUser({
        name: userData.name || "User",
        height: userData.height,
        weight: userData.weight,
        age: userData.age,
        gender: userData.gender,
        goal: userData.goal,
        activityLevel: userData.activityLevel,
      });

      setExerciseLogs(userData.exercises || []);
      setNutritionLogs(userData.nutrition || []);
      setStreak(userData.streak || 0);

      // Redirect to profile setup if any essential data is missing
      if (!userData.height || !userData.weight || !userData.age) {
        navigate("/profile-setup");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.response?.data?.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Runs only once on mount to fetch the data

  // Only allow redirects once data is fetched and loaded
//   useEffect(() => {
//     if (!loading && (!user.height || !user.weight || !user.age)) {
//       navigate("/profile-setup");
//     }
//   }, [user, loading, navigate]);

  const updateUser = async (updates) => {
    try {
      const { data } = await axios.patch("/api/user/profile", updates); // This is now PATCH to match your backend
      setUser((prev) => ({ ...prev, ...data.user })); // Merge new data with existing user state
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const addExerciseLog = async (log) => {
    try {
      const { data } = await axios.post("/api/user/exercises", log); // This matches your /exercises route
      setExerciseLogs(data.exercises);
    } catch (err) {
      console.error("Error adding exercise log:", err);
      setError(err.response?.data?.message || "Failed to add exercise log");
    }
  };

 const addNutritionLog = async (nutritionLog) => {
   try {
     // Wrap the nutritionLog in an array before sending it
     const { data } = await axios.post("/api/user/nutrition", {
       nutrition: [nutritionLog],
     });
     setNutritionLogs(data.user.nutrition);
   } catch (err) {
     console.error("Error adding nutrition log:", err);
     setError(err.response?.data?.message || "Failed to add nutrition log");
   }
 };


  useEffect(() => {
    const checkStreak = () => {
      const today = new Date().toISOString().split("T")[0];
      const hasExercisedToday = exerciseLogs.some((log) => log.date === today);

      if (hasExercisedToday) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const hasExercisedYesterday = exerciseLogs.some(
          (log) => log.date === yesterdayStr
        );

        setStreak((prev) => (hasExercisedYesterday ? prev + 1 : 1));
      }
    };

    checkStreak();
    const interval = setInterval(checkStreak, 86400000); // Once a day
    return () => clearInterval(interval);
  }, [exerciseLogs]);

  const calculateBMI = () => {
    if (!user?.height || !user?.weight) return 0;
    const heightInMeters = user.height / 100;
    return parseFloat(
      (user.weight / (heightInMeters * heightInMeters)).toFixed(1)
    );
  };

  const totalCaloriesBurned = exerciseLogs.reduce(
    (total, log) => total + (log.caloriesBurned || 0),
    0
  );

  const totalCaloriesConsumed = nutritionLogs.reduce(
    (total, log) => total + (log.calories || 0),
    0
  );

  const totalProteinConsumed = nutritionLogs.reduce(
    (total, log) => total + (log.protein || 0),
    0
  );

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        addExerciseLog,
        addNutritionLog,
        streak,
        exerciseLogs,
        nutritionLogs,
        calculateBMI,
        totalCaloriesBurned,
        totalCaloriesConsumed,
        totalProteinConsumed,
        loading,
        error,
        fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
