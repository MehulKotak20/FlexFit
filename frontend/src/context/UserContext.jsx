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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    let token = localStorage.getItem("token");

    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/user/profile",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );

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
      setStreak(0); // will be recalculated below

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
  }, []);

  const updateUser = async (updates) => {
    let token = localStorage.getItem("token");
    console.log("Updating user with:", updates);
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/user/profile",
        updates,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      setUser((prev) => ({ ...prev, ...data.user }));
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const addExerciseLog = async (log) => {
    let token = localStorage.getItem("token");
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/exercises",
        log,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      setExerciseLogs(data.exercises); // streak recalculates automatically
    } catch (err) {
      console.error("Error adding exercise log:", err);
      setError(err.response?.data?.message || "Failed to add exercise log");
    }
  };

  const addNutritionLog = async (nutritionLog) => {
    let token = localStorage.getItem("token");
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/nutrition",
        {
          nutrition: [nutritionLog],
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      setNutritionLogs(data.user.nutrition);
    } catch (err) {
      console.error("Error adding nutrition log:", err);
      setError(err.response?.data?.message || "Failed to add nutrition log");
    }
  };

  // ✅ Streak calculation logic
useEffect(() => {
  const calculateStreak = async() => {
    if (!exerciseLogs.length) {
      setStreak(0);
      await updateUser({ streak: 0 }); // ⬅️ save in DB
      return;
    }

    const formatDateIST = (date) =>
      new Date(date).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

    const dates = exerciseLogs
      .map((log) => formatDateIST(log.date))
      .filter(Boolean);
    const uniqueDates = [...new Set(dates)].sort(
      (a, b) => new Date(b) - new Date(a)
    );

    const today = formatDateIST(new Date());
    const yesterday = formatDateIST(
      new Date(new Date().setDate(new Date().getDate() - 1))
    );

    console.log("Unique Dates:", uniqueDates);

    let streakCount = 0;

    if (!uniqueDates.includes(yesterday)) {
      if (uniqueDates.includes(today)) {
        setStreak(1);
         await updateUser({ streak: 1 }); // ⬅️ save in DB
        return;
      }
      setStreak(0);
      await updateUser({ streak: 0 }); // ⬅️ save in DB
      return;
    }

    streakCount = 1;
    let prevDate = new Date(yesterday);

    while (true) {
      prevDate.setDate(prevDate.getDate() - 1);
      const expectedDate = formatDateIST(prevDate);

      if (uniqueDates.includes(expectedDate)) {
        streakCount++;
      } else {
        break;
      }
    }

    setStreak(streakCount);
    await updateUser({ streak: streakCount }); // ⬅️ save in DB
  };

  calculateStreak();
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
