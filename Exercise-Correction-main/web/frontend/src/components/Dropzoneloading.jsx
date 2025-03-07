import React from "react";
import "./Dropzone.css"; // Assuming you place the CSS in a separate file

const DropzoneLoading = () => {
  return (
    <div className="dropzone">
      <div className="loading-animation">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      Processing ...
    </div>
  );
};

export default DropzoneLoading;
