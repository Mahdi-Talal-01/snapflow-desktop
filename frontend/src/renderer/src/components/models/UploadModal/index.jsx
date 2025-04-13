import { Icon } from '@iconify/react'
import { useState, useRef } from 'react'
import './style.css'
import { useDispatch, useSelector } from 'react-redux'
import { closeUploadModel, setFile } from '../../../redux/Slices/uploadModelSlice'

const UploadModal = () => {
  const [localImage, setLocalImage] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const dispatch = useDispatch()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFile(file)
    }
  }

  const handleFile = (file) => {
    setUploadedFile(file)
    setLocalImage(URL.createObjectURL(file))
  }

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      handleFile(selected)
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile) return
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const fileData = {
          name: uploadedFile.name,
          data: e.target.result.split(',')[1]
        }

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })
        }, 200)

        const response = await window.api.saveImage(fileData)
        clearInterval(progressInterval)

        if (response.success) {
          setUploadProgress(100)
          // Get the path of the saved image
          const imagePath = await window.api.getImagePath(uploadedFile.name)
          dispatch(setFile(imagePath))
          setTimeout(() => {
            dispatch(closeUploadModel())
          }, 500)
        } else {
          alert(`Save failed: ${response.error}`)
        }
      }
      reader.readAsDataURL(uploadedFile)
    } catch (error) {
      alert(`Error uploading file: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCloseModel = () => {
    dispatch(closeUploadModel())
  }

  const handleRemoveImage = () => {
    setLocalImage(null)
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Upload Photo</h2>
          <button className="close-button" onClick={handleCloseModel}>
            <Icon icon="mdi:close" width="24" height="24" />
          </button>
        </div>

        <p className="modal-description">
          Upload a photo to your collection for editing and organizing
        </p>

        <div
          className={`upload-area ${isDragging ? 'dragging' : ''} ${localImage ? 'has-image' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !localImage && fileInputRef.current?.click()}
        >
          {localImage ? (
            <div className="preview-container">
              <img src={localImage} alt="preview" className="preview-image" />
              <button
                className="remove-image"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage()
                }}
              >
                x
              </button>
            </div>
          ) : (
            <>
              <Icon icon="tabler:image-in-picture" width="48" height="48" />
              <span className="upload-area-text">Drag & drop or click to upload</span>
              <span className="upload-area-subtext">Support: JPG, PNG, GIF</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
        </div>

        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
            <span className="progress-text">{uploadProgress}%</span>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={handleCloseModel} className="cancel-button">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className={`upload-button ${isUploading ? 'uploading' : ''}`}
            disabled={!uploadedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Icon icon="mdi:loading" className="spin" width="20" height="20" />
                <span>Uploading...</span>
              </>
            ) : (
              'Upload'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadModal
