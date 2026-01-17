import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Flame, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Calendar, 
  Award,
  ArrowRight
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuthStore } from "../store/authStore";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const { 
    user, 
    streak, 
    calculateBMI, 
    totalCaloriesBurned, 
    totalCaloriesConsumed,
    totalProteinConsumed
  } = useUser();

  console.log("User data:", user);
  console.log("Streak:", streak);
  
 
  const bmi = calculateBMI();
  
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obese', color: 'text-red-500' };
  };
  
  const bmiInfo = getBMICategory(bmi);
  
  // Get today's date in a readable format
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {today}
        </div>
      </div>
      
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Welcome back, {user.name}!</h2>
        <p className="opacity-90 mb-4">
          {streak > 0 
            ? `Amazing! You're on a ${streak}-day workout streak. Keep it up!` 
            : "Let's start your fitness journey today!"}
        </p>
        <div className="flex flex-wrap gap-4 mt-4">
          <Link 
            to="/exercises" 
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center text-sm font-medium"
          >
            Start Workout <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link 
            to="/ai-trainer" 
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center text-sm font-medium"
          >
            Talk to AI Trainer <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BMI Card */}
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">BMI</p>
              <p className="text-2xl font-bold mt-1">{bmi}</p>
              <p className={`text-sm font-medium ${bmiInfo.color}`}>
                {bmiInfo.category}
              </p>
            </div>
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <Link 
            to="/bmi" 
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center mt-4"
          >
            View details <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        
        {/* Streak Card */}
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Streak</p>
              <p className="text-2xl font-bold mt-1">{streak} days</p>
              <p className="text-sm text-gray-500">
                {streak > 0 ? 'Keep going!' : 'Start today!'}
              </p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full" 
              style={{ width: `${Math.min(streak * 10, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Calories Burned Card */}
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Calories Burned</p>
              <p className="text-2xl font-bold mt-1">{totalCaloriesBurned}</p>
              <p className="text-sm text-gray-500">kcal total</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <Dumbbell className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <Link 
            to="/exercises" 
            className="text-xs text-green-600 hover:text-green-800 font-medium flex items-center mt-4"
          >
            View workouts <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        
        {/* Nutrition Card */}
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Nutrition</p>
              <p className="text-2xl font-bold mt-1">{totalCaloriesConsumed}</p>
              <p className="text-sm text-gray-500">kcal consumed</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <Apple className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <Link 
            to="/nutrition" 
            className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center mt-4"
          >
            View nutrition <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
      
      {/* Recent Activity & Upcoming Workouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            <Link to="/progress" className="text-sm text-indigo-600 hover:text-indigo-800">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {/* If no activities yet, show placeholder */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-indigo-100 p-2 rounded-full mr-3">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Start tracking your activities</p>
                <p className="text-xs text-gray-500">Your recent activities will appear here</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Upcoming Workouts</h3>
            <Link to="/exercises" className="text-sm text-indigo-600 hover:text-indigo-800">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {/* If no upcoming workouts, show placeholder */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <Dumbbell className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Schedule your next workout</p>
                <p className="text-xs text-gray-500">Plan your fitness routine</p>
              </div>
              <Link 
                to="/exercises" 
                className="ml-auto bg-green-500 text-white px-3 py-1 rounded-md text-xs font-medium"
              >
                Add
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Achievements */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Achievements</h3>
          <span className="text-sm text-gray-500">Unlock more by staying active</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg text-center ${streak > 0 ? 'bg-yellow-100' : 'bg-gray-100'}`}>
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm mb-2">
              <Award className={`h-6 w-6 ${streak > 0 ? 'text-yellow-500' : 'text-gray-400'}`} />
            </div>
            <p className="text-sm font-medium">First Workout</p>
            <p className="text-xs text-gray-500">{streak > 0 ? 'Completed' : 'Not started'}</p>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${streak >= 7 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm mb-2">
              <Flame className={`h-6 w-6 ${streak >= 7 ? 'text-indigo-500' : 'text-gray-400'}`} />
            </div>
            <p className="text-sm font-medium">7-Day Streak</p>
            <p className="text-xs text-gray-500">{streak >= 7 ? 'Completed' : `${streak}/7 days`}</p>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${totalCaloriesBurned >= 1000 ? 'bg-green-100' : 'bg-gray-100'}`}>
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm mb-2">
              <Dumbbell className={`h-6 w-6 ${totalCaloriesBurned >= 1000 ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            <p className="text-sm font-medium">1000 kcal Burned</p>
            <p className="text-xs text-gray-500">
              {totalCaloriesBurned >= 1000 ? 'Completed' : `${totalCaloriesBurned}/1000 kcal`}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg text-center bg-gray-100`}>
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm mb-2">
              <Activity className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium">BMI Goal</p>
            <p className="text-xs text-gray-500">In progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;