import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import "./VideoPlayer.css";

const VideoPlayer = ({ videoName }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (videoName) {
      const streamUrl = `${API_BASE_URL}/api/video/stream?video_name=${videoName}&t=${Date.now()}`;
      setUrl(streamUrl);

      // Optional debug fetch — just to see if your backend is responding
      fetch(streamUrl)
        .then((res) => {
          if (!res.ok)
            throw new Error(`Fetch failed with status: ${res.status}`);
          console.log("✅ Video stream reachable:", res);
        })
        .catch((err) => console.error("❌ Video fetch error:", err));
    }
  }, [videoName]);

  return (
    <div className="player">
      <p>
        <strong>Video URL:</strong>{" "}
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open Video in New Tab
        </a>
      </p>

      <p>
        (If video does not play here, click the link above to watch directly.)
      </p>
    </div>
  );
};

export default VideoPlayer;
