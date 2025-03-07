import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Dashboard from "./pages/Dashboard";
import Exercises from "./pages/Exercises";
import Nutrition from "./pages/Nutrition";
import BMICalculator from "./pages/BMICalculator";
import AITrainer from "./pages/AITrainer";
import ProfileSetup from "./pages/profileSetup";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
<Route path="/profile-setup" element={<ProfileSetup />} />

import { UserProvider } from "./context/UserContext";
import { useAuthStore } from "./store/authStore";
import Progress from "./pages/Progress";

// Auth Wrapper Components
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;
  return children;
};



const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) return <Navigate to="/" replace />;
  return children;
};

const AuthUI = ({ children }) => (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: "url('./Images/man.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(2px)",
      }}
    />
    <div className="relative w-full max-w-lg mx-auto p-6">{children}</div>
    <Toaster />
  </div>
);

const MainLayout = () => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/bmi" element={<BMICalculator />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/ai-trainer" element={<AITrainer />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />

          {/* Catch all unknown routes in dashboard to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
    <Footer />
  </div>
);

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <UserProvider>
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <AuthUI>
                  <SignUpPage />
                </AuthUI>
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <AuthUI>
                  <LoginPage />
                </AuthUI>
              </RedirectAuthenticatedUser>
            }
          />
          
          <Route path="/verify-email" element={<AuthUI><EmailVerificationPage /></AuthUI>} />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <AuthUI>
                  <ForgotPasswordPage />
                </AuthUI>
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <AuthUI>
                  <ResetPasswordPage />
                </AuthUI>
              </RedirectAuthenticatedUser>
            }
          />

        {/* Protected Dashboard Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />

        {/* Catch all other unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
