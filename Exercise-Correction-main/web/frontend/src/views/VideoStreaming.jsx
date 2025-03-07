import React, { useState } from "react";
import axios from "axios";
import Dropzone from "../components/Dropezone";
import DropzoneLoading from "../components/Dropzoneloading";
import Result from "../components/Result";
import { API_BASE_URL } from "../config";
import "./VideoStreaming.css"; // Import the new CSS file for better styling

const EXERCISES = ["Squat", "Plank", "Bicep Curl", "Lunge"];

const VideoStreaming = () => {
  const [submitData, setSubmitData] = useState({
    videoFile: null,
    exerciseType: null,
  });
  const [processedData, setProcessedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const uploadToServer = async () => {
    if (!submitData.videoFile) return alert("📂 Please select a video.");
    if (!submitData.exerciseType)
      return alert("💪 Please select an exercise type.");

    setProcessedData(null);
    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("file", submitData.videoFile);

      const { data } = await axios.post(
        `${API_BASE_URL}/api/video/upload?type=${submitData.exerciseType.toLowerCase()}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProcessedData(data);
    } catch (e) {
      console.error("❌ Error uploading video:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="video-streaming-container">
      <h1 className="title">📹 Upload Your Workout Video</h1>
      <p className="subtitle">
        Choose your exercise and let's process that form!
      </p>

      <div className="input-section">
        <div className="dropzone-wrapper">
          <Dropzone
            isProcessing={isProcessing}
            onFileUploaded={(file) =>
              setSubmitData({ ...submitData, videoFile: file })
            }
          />
          {isProcessing && <DropzoneLoading />}
        </div>

        <div className="right-panel">
          <h3 className="exercise-title">Select Exercise</h3>
          <div className="exercise-list">
            {EXERCISES.map((exercise) => (
              <button
                key={exercise}
                className={`exercise-btn ${
                  submitData.exerciseType === exercise ? "active" : ""
                }`}
                onClick={() =>
                  setSubmitData({ ...submitData, exerciseType: exercise })
                }
              >
                {exercise}
              </button>
            ))}
          </div>

          <button className="process-btn" onClick={uploadToServer}>
            🚀 Process Video
          </button>
        </div>
      </div>

      {/* Results Section */}
      {processedData && <Result data={processedData} />}
    </div>
  );
};

export default VideoStreaming;
