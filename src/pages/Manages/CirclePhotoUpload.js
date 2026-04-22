import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import admin from "../../images/admin.png";

const CirclePhotoUpload = ({ onImageSelect, existingImage, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(admin);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (existingImage) {
      setPreview(existingImage);
    } else {
      setPreview(admin);
    }
  }, [existingImage]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      if (onImageSelect) onImageSelect(file);
    }
  };

  const openFileBrowser = () => {
    fileInputRef.current.click();
  };

  const handleDeleteClick = () => {
    setSelectedImage(null);
    setPreview(admin);
    if (onDelete) onDelete();
  };

  const isImageUploaded = selectedImage !== null || existingImage;

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "150px",
          height: "150px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <img
          src={preview}
          alt="employee"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
            // border: "3px solid #ddd",
          }}
        />

        {/* ?? EDIT ICON */}
        <div
          onClick={openFileBrowser}
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            // background: "black",
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <FaEdit size={20} color="white" />
        </div>

        {/* ?? DELETE ICON (only after upload) */}
        {isImageUploaded && preview !== admin && (
          <div
            onClick={handleDeleteClick}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "red",
              borderRadius: "50%",
              width: "45px",
              height: "45px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FaTrash size={20} color="white" />
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default CirclePhotoUpload;