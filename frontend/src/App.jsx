import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components and Pages

import FloatingShape from "./components/FloatingShape";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

// import FloatingShape from "./components/FloatingShape";
// import LoadingSpinner from "./components/LoadingSpinner";
import SignUpPage from "./pages/SignUpPage";

import LoginPage from "./pages/LoginPage";
 import EmailVerificationPage from "./pages/EmailVerificationPage";
 import DashboardPage from "./pages/DashboardPage";
 import ForgotPasswordPage from "./pages/ForgotPasswordPage";
 import ResetPasswordPage from "./pages/ResetPasswordPage";

// Auth Store
import { useAuthStore } from "./store/authStore";

// Protected Routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// Redirect Authenticated Users
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};
const AuthUI = ({children}) => (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background Container */}
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: "url('./Images/man.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "blur(2px)", 
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1, 
      }}
    >
      {/* Gradient Overlay
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 opacity-70"></div> */}
    </div>

      {/* Main Content */}
      <div className="relative w-full max-w-lg mx-auto p-6">{children}</div><Toaster />
      </div>
);

// Main App Component
function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
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
              <AuthUI>
              <RedirectAuthenticatedUser>    
                <LoginPage />
            </RedirectAuthenticatedUser>
            </AuthUI>
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
          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
       
    
  );
}

export default App;

