import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


import {
  Dumbbell,
  Play,
  CheckCircle,
  Clock,
  Flame,
  Filter,
  Search,
  Plus,
} from "lucide-react";
import axios from "axios";

const exerciseData = [
  {
    id: "1",
    name: "Push-ups",
    category: "Strength",
    duration: 10,
    caloriesBurned: 100,
    difficulty: "beginner",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1663040268906-5ddcfa26cfbd?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //https://plus.unsplash.com/premium_photo-1663040268906-5ddcfa26cfbd?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
    description:
      "A classic bodyweight exercise that targets the chest, shoulders, and triceps.",
    animation:
      "https://lottie.host/ce75001c-fd49-4049-832f-5f17680dc9d0/yY7r3air01.lottie",
  },
  {
    id: "2",
    name: "Squats",
    category: "Strength",
    duration: 15,
    caloriesBurned: 150,
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description:
      "A lower body exercise that targets the quadriceps, hamstrings, and glutes.",
    animation:
      "https://lottie.host/8489aacf-6e5a-4d1d-8ab9-43da95077b4b/eYMZeqpHjS.lottie",
  },
  {
    id: "3",
    name: "Plank",
    category: "Core",
    duration: 5,
    caloriesBurned: 50,
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description:
      "An isometric core exercise that strengthens the abdominals, back, and shoulders.",
    animation:
      "https://lottie.host/724024ef-1bf0-4e80-94b2-fca815a42ce7/pXJRslOtQb.lottie",
  },
  {
    id: "4",
    name: "Jumping Jacks",
    category: "Cardio",
    duration: 10,
    caloriesBurned: 100,
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description:
      "A full-body cardio exercise that increases heart rate and improves coordination.",
    animation:
      "https://lottie.host/102e2fb2-4873-49eb-bf52-045494133223/QkKAJXnrxi.lottie",
  },
  {
    id: "5",
    name: "Lunges",
    category: "Strength",
    duration: 12,
    caloriesBurned: 120,
    difficulty: "intermediate",
    imageUrl:
      "https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description:
      "A lower body exercise that targets the quadriceps, hamstrings, and glutes while improving balance.",
    animation:
      "https://lottie.host/f971b44a-bd84-4f21-8482-5b3e11bb0905/lZyBBF78oy.lottie",
  },
  {
    id: "6",
    name: "Burpees",
    category: "HIIT",
    duration: 15,
    caloriesBurned: 150,
    difficulty: "advanced",
    imageUrl:
      "https://images.unsplash.com/photo-1593476123561-9516f2097158?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description:
      "A high-intensity full-body exercise that combines a squat, push-up, and jump.",
    animation:
      "https://lottie.host/1011982d-9154-4a66-8b5b-6edc507c9498/XmEUJn05bq.lottie",
  },
];

const Exercises = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  const [isExercising, setIsExercising] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const categories = ["All", "Strength", "Cardio", "Core", "HIIT"];
  const difficulties = ["All", "beginner", "intermediate", "advanced"];

  const filteredExercises = exerciseData.filter((ex) => {
    const matchSearch = ex.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      !selectedCategory ||
      selectedCategory === "All" ||
      ex.category === selectedCategory;
    const matchDifficulty =
      !selectedDifficulty ||
      selectedDifficulty === "All" ||
      ex.difficulty === selectedDifficulty;
    return matchSearch && matchCategory && matchDifficulty;
  });

  useEffect(() => {
    let timer;
    console.log("isExercising:", isExercising); // Check if isExercising is true
    console.log("timeLeft:", timeLeft); // Check the current timeLeft

    if (isExercising && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isExercising) {
      completeExercise();
    }

    return () => clearInterval(timer);
  }, [isExercising, timeLeft]);


const startExercise = async (exercise) => {
  console.log("Start exercise clicked", exercise); // Log to check if function is triggered

  try {
    // Get current date
    const currentDate = new Date().toISOString();

    // Prepare the exercise data to send to the backend
    const exerciseData = [
      {
        name: exercise.name,
        date: currentDate, // Add the current date
        caloriesBurned: exercise.caloriesBurned,
      },
    ];

    let token = localStorage.getItem("token");
    // Send the exercise data to the backend
    const response = await axios.post(
      "/api/user/exercises",
      {
        exercises: exerciseData,
      },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}, // Send token if available
        withCredentials: true, // Include cookies in request (for Google login)
      }
    );

    console.log("API response:", response); // Log the response for debugging

    if (response.data.success) {
      console.log("Exercise added to profile:", response.data.user);
    }

    // Start the exercise timer
    setActiveExercise(exercise);
    setTimeLeft(exercise.duration * 60); // Convert to seconds
    setIsExercising(true);
  } catch (error) {
    console.error("Error adding exercise:", error);
  }
};


  const completeExercise = () => {
    setIsExercising(false);
    setActiveExercise(null);
    console.log("Exercise completed!");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exercises</h1>
        {/* <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg">
          <Plus className="h-4 w-4 mr-2" /> Create Custom Workout
        </button> */}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedCategory || "All"}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={selectedDifficulty || "All"}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* {isExercising && activeExercise && (
        <div className="p-6 bg-indigo-600 text-white rounded-lg">
          <h2 className="text-2xl">{activeExercise.name}</h2>
          <p>{activeExercise.description}</p>
          <div className="flex gap-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" /> {formatTime(timeLeft)}
            </div>
            <div className="flex items-center">
              <Flame className="h-5 w-5 mr-1" /> {activeExercise.caloriesBurned}{" "}
              kcal
            </div>
          </div>
          <button
            className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded"
            onClick={() => completeExercise()}
          >
            <CheckCircle className="h-4 w-4 mr-1" /> Complete Early
          </button>
        </div>
      )} */}
      {activeExercise && isExercising && (
  <Modal
    isOpen={isExercising}
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl flex items-center">
      {/* Left Side - Animation */}
      <div className="w-1/2 flex justify-center">
        {activeExercise.animation && (
          <DotLottieReact
            src={activeExercise.animation}
            loop
            autoplay
            className="w-64 h-64"
          />
        )}
      </div>

      {/* Right Side - Exercise Details */}
      <div className="w-1/2 pl-6">
        <h2 className="text-2xl font-bold">{activeExercise.name}</h2>
        <p className="text-gray-600">{activeExercise.description}</p>

        {/* Time & Calories */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-gray-700">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            {formatTime(timeLeft)}
          </div>
          <div className="flex items-center text-gray-700">
            <Flame className="h-5 w-5 mr-2 text-red-500" />
            {activeExercise.caloriesBurned} kcal
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-3 mt-4 overflow-hidden">
          <div
            className="bg-blue-600 h-3 transition-all duration-500"
            style={{
              width: `${
                ((activeExercise.duration * 60 - timeLeft) /
                  (activeExercise.duration * 60)) *
                100
              }%`,
            }}
          ></div>
        </div>

        {/* Complete Exercise Button */}
        <button
          className="mt-5 w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2 rounded flex items-center justify-center"
          onClick={completeExercise}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Complete Exercise
        </button>
        {/* <div className="mt-4">
          <p className="text-sm text-gray-500">🔥 Stay motivated with music!</p>
          <audio controls autoPlay loop className="w-full mt-2"  preload="auto">
            <source src="https://www.bensound.com/bensound-music/bensound-epic.mp3" type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div> */}
      </div>
    </div>
  </Modal>
)}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <img
              className="w-full h-48 object-cover"
              src={ex.imageUrl}
              alt={ex.name}
            />
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{ex.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getDifficultyClass(
                    ex.difficulty
                  )}`}
                >
                  {ex.difficulty}
                </span>
              </div>
              <p className="text-sm">{ex.description}</p>
              <div className="flex justify-between text-gray-500 text-xs mt-2">
                <span>
                  <Clock className="h-4 w-4 inline-block" /> {ex.duration} min
                </span>
                <span>
                  <Flame className="h-4 w-4 inline-block" /> {ex.caloriesBurned}{" "}
                  kcal
                </span>
                <span>
                  <Dumbbell className="h-4 w-4 inline-block" /> {ex.category}
                </span>
              </div>
              <button
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded"
                onClick={() => startExercise(ex)} // Ensure startExercise is called here
              >
                <Play className="h-4 w-4 mr-1 inline-block" /> Start Exercise
              </button>
              

            </div>
          </div>
        ))}
      </div>

      {!filteredExercises.length && (
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p>No exercises found. Try different filters.</p>
        </div>
      )}
    </div>
  );
};

const getDifficultyClass = (difficulty) => {
  return (
    {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    }[difficulty] || ""
  );
};

export default Exercises;
