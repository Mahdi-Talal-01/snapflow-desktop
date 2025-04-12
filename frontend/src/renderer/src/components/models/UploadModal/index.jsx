import { Icon } from "@iconify/react";
import { useState } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  closeUploadModel,
  setFile,
} from "../../../redux/Slices/uploadModelSlice";

const UploadModal = () => {
  const [localImage, setLocalImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setUploadedFile(selected);
      setLocalImage(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = {
          name: uploadedFile.name,
          data: e.target.result.split(",")[1],
        };

        const response = await window.api.saveImage(fileData);
        if (response.success) {
          // Get the path of the saved image
          const imagePath = await window.api.getImagePath(uploadedFile.name);
          dispatch(setFile(imagePath));
          dispatch(closeUploadModel());
        } else {
          alert(`Save failed: ${response.error}`);
        }
      };
      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      alert(`Error uploading file: ${error.message}`);
    }
  };

  const handleCloseModel = () => {
    dispatch(closeUploadModel());
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload Photo</h2>
        <p>Upload a photo to your collection for editing and organizing</p>

        <div className="upload-area">
          {localImage ? (
            <img src={localImage} alt="preview" className="preview-image" />
          ) : (
            <>
              <Icon icon="mdi:gallery" width="48" height="48" />
              <p>Drag and Drop your picture Here</p>
              <span>Support: JPG, PNG</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            id="file-input"
            onChange={handleFileChange}
            hidden
          />
          <label htmlFor="file-input" className="select-button">
            Select from computer
          </label>
        </div>

        <div className="modal-actions">
          <button onClick={handleCloseModel} className="cancel-button">
            Cancel
          </button>
          <button 
            onClick={handleUpload} 
            className="upload-button"
            disabled={!uploadedFile}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
