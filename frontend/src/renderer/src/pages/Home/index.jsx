import { useNavigate } from 'react-router-dom'
import './style.css'
import { useDispatch, useSelector } from 'react-redux'
import { setFile, openUploadModel } from '../../redux/Slices/uploadModelSlice'
import UploadModal from '../../components/models/UploadModal'
import { useEffect, useState, useCallback } from 'react'
import { Icon } from '@iconify/react'

import {
  loadUploadedImagesHandler,
  handleImageClick,
  handleDeleteClick,
  handleUploadClick
} from './helpers/handlers'

const Home = () => {
  const isModalOpen = useSelector((state) => state.uploadModel.isOpen)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [uploadedImages, setUploadedImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const loadUploadedImages = useCallback(() => {
    loadUploadedImagesHandler({ setIsLoading, setUploadedImages })
  }, [])

  useEffect(() => {
    loadUploadedImages()
  }, [])

 

  return (
    <div className="home-container">
      <div className="home-header">
        {/* <h1 className="logo">SnapFlow Editor</h1> */}
      
      </div>

      <div className="gallery-section">
        {uploadedImages.length > 0 ? (
          <div className="image-grid">
            {uploadedImages.map((filename, index) => {
              const imageUrl = `app:///${encodeURIComponent(filename)}`
              return (
                <div key={`uploaded-${index}`} className="image-card">
                  <div className="image-card-inner">
                    <img
                      src={imageUrl}
                      alt={`Uploaded Image ${index}`}
                      onClick={() => handleImageClick({ filename, dispatch, navigate, setFile })}
                      onError={(e) => {
                        console.error('Home - Error loading thumbnail:', {
                          filename,
                          url: imageUrl,
                          error: e
                        })
                        e.target.style.display = 'none'
                      }}
                    />
                    <div className="image-overlay">
                      <span className="image-name">{filename}</span>
                      <div className="image-actions">
                        <button
                          className="edit-button"
                          onClick={() => handleImageClick({ filename, dispatch, navigate })}
                        >
                          <Icon icon="mdi:edit" width="20" height="20" />
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={(e) =>
                            handleDeleteClick({
                              filename,
                              loadImages: loadUploadedImages
                            })
                          }
                        >
                          <Icon icon="mdi:delete" width="20" height="20" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Icon icon="mdi:image-multiple" width="64" height="64" />
            <h2>No images yet</h2>
            <p>Upload your first image to get started</p>
            <button
              className="upload-button"
              onClick={() => handleUploadClick(dispatch, openUploadModel)}
            >
              <Icon icon="mdi:upload" width="24" height="24" />
              <span>Upload Image</span>
            </button>
          </div>
        )}
      </div>

      {isModalOpen && <UploadModal />}
    </div>
  )
}

export default Home
