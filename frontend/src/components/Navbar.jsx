import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Dumbbell, User, ChevronDown } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { streak } = useUser();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Dumbbell className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">FitTrack Pro</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center bg-indigo-700 px-3 py-1 rounded-full"></div>

            <div className="relative">
              <button
                className="flex items-center space-x-1 hover:text-gray-200 focus:outline-none"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg overflow-hidden z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    See Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/exercises"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Exercises
            </Link>
            <Link
              to="/nutrition"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Nutrition
            </Link>
            <Link
              to="/bmi"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
              onClick={() => setIsMenuOpen(false)}
            >
              BMI Calculator
            </Link>
            <Link
              to="/progress"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Progress
            </Link>
            <Link
              to="/ai-trainer"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Trainer
            </Link>

            <div className="flex items-center px-3 py-2">
              <span className="text-yellow-300 font-bold mr-1">{streak}</span>
              <span>day streak 🔥</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
