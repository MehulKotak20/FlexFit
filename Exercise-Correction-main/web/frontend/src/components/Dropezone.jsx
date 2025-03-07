import React, { useState, useRef } from "react";
import "./Dropzone.css"; // Assuming styles are in a separate CSS file

const Dropzone = ({ onFileUploaded }) => {
  const dropzoneInput = useRef(null);
  const [uploadedVideoFile, setUploadedVideoFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const isUploaded = uploadedVideoFile ? true : false;

  // Handle drag events
  const removeDragEventDefault = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragOver = (event) => {
    removeDragEventDefault(event);
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    removeDragEventDefault(event);
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    removeDragEventDefault(event);
    setIsDragOver(false);

    const videoFile = event.dataTransfer.files[0];

    let dataTransfer = new DataTransfer();
    dataTransfer.items.add(videoFile);
    let filesToBeAdded = dataTransfer.files;

    dropzoneInput.current.files = filesToBeAdded;
    setUploadedVideoFile(videoFile);
    onFileUploaded(videoFile);
  };

  // Handle file input
  const openFileInput = () => {
    dropzoneInput.current.click();
  };

  const handleClickUpload = (event) => {
    const file = event.target.files[0];
    setUploadedVideoFile(file);
    onFileUploaded(file);
  };

  // Convert byte size to MB
  const byteToMB = (bytes) => {
    return Math.round(bytes / 1000000);
  };

  return (
    <div
      className={`dropzone ${isDragOver ? "dropzone-dragging" : ""}`}
      id="dropzone"
      onDrag={removeDragEventDefault}
      onDragStart={removeDragEventDefault}
      onDragEnd={removeDragEventDefault}
      onDragOver={handleDragOver}
      onDragEnter={handleDragLeave}
      onDragLeave={removeDragEventDefault}
      onDrop={handleDrop}
      onClick={openFileInput}
    >
      {/* Initial Stage */}
      {!isUploaded ? (
        <>
          <i className="fa-solid fa-cloud-arrow-up dropzone-icon"></i>
          Drop files or Click here to select files to upload.
        </>
      ) : (
        <>
          <i className="fa-regular fa-file-video dropzone-icon"></i>
          {uploadedVideoFile.name} ({byteToMB(uploadedVideoFile.size)} MB)
        </>
      )}

      <input
        type="file"
        name="files"
        className="dropzone-input"
        ref={dropzoneInput}
        onChange={handleClickUpload}
      />
    </div>
  );
};

export default Dropzone;
