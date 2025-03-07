import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "../views/Home";
import VideoStreaming from "../views/VideoStreaming";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Define Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/video-streaming" element={<VideoStreaming />} />

        {/* Redirect for undefined routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
