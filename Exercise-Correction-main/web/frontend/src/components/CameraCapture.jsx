import React, { useRef, useState, useEffect } from "react";

const CameraCapture = () => {
  const cameraRef = useRef(null);
  const pictureRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
          setStream(stream);
        }
      } catch (err) {
        console.log("Error accessing camera: ", err);
      }
    };

    getVideo();

    // Clean up the stream when the component is unmounted
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const takeSnapshot = () => {
    const width = 500;
    const height = 500;
    const canvas = pictureRef.current;
    const ctx = canvas.getContext("2d");

    if (cameraRef.current) {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(cameraRef.current, 0, 0, width, height);
    }
  };

  return (
    <div className="camera">
      <div className="camera__wrapper">
        <video ref={cameraRef} autoPlay />
      </div>

      <button onClick={takeSnapshot}>SNAP!</button>

      <div className="result">
        <canvas ref={pictureRef}></canvas>
      </div>
    </div>
  );
};

export default CameraCapture;
