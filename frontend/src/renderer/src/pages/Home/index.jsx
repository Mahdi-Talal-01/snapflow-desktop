import React, { useEffect, useState } from 'react'
import './style.css'
import { Icon } from '@iconify/react'
import { useDispatch } from 'react-redux'
import { setFile } from '../../redux/Slices/uploadModelSlice'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  console.log('Home component mounted')
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loadImages = async () => {
    try {
      console.log('Loading images...')
      if (!window.api) {
        const errorMsg = 'window.api is not available'
        console.error(errorMsg)
        setError(errorMsg)
        return
      }
      const imageFiles = await window.api.getImages()
      console.log('Received images:', imageFiles)
      if (!Array.isArray(imageFiles)) {
        const errorMsg = 'Invalid response format from getImages'
        console.error(errorMsg)
        setError(errorMsg)
        return
      }

      // Load image data for each file
      const imagesWithData = await Promise.all(
        imageFiles.map(async (filename) => {
          try {
            const imageData = await window.api.getImageData(filename)
            return {
              filename,
              dataUrl: `data:image/${getImageType(filename)};base64,${imageData}`
            }
          } catch (error) {
            console.error(`Error loading image data for ${filename}:`, error)
            return {
              filename,
              dataUrl: null,
              error: 'Failed to load image'
            }
          }
        })
      )

      setImages(imagesWithData)
      setError(null)
    } catch (error) {
      const errorMsg = `Error loading images: ${error.message}`
      console.error(errorMsg)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const getImageType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'jpeg'
      case 'png':
        return 'png'
      case 'gif':
        return 'gif'
      case 'webp':
        return 'webp'
      case 'avif':
        return 'avif'
      default:
        return 'jpeg'
    }
  }

  useEffect(() => {
    console.log('Home useEffect triggered')
    loadImages()
  }, [])

  const handleImageClick = async (filename) => {
    try {
      console.log('Image clicked:', filename)
      if (!window.api) {
        throw new Error('window.api is not available')
      }
      const imageData = await window.api.getImageData(filename)
      if (!imageData) {
        throw new Error('No image data received')
      }
      console.log('Image data received successfully')
      const dataUrl = `data:image/${getImageType(filename)};base64,${imageData}`
      dispatch(setFile({ url: dataUrl, filename }))
      navigate("/edit-image")
    } catch (error) {
      console.error('Error handling image click:', error)
      alert(`Error loading image: ${error.message}`)
    }
  }

  const handleDeleteClick = async (filename) => {
    try {
      console.log('Attempting to delete:', filename)
      if (!window.api) {
        throw new Error('window.api is not available')
      }
      if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
        const response = await window.api.deleteImage(filename)
        console.log('Delete response:', response)
        if (response.success) {
          console.log('Image deleted successfully')
          loadImages()
        } else {
          throw new Error(response.error || 'Failed to delete image')
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert(`Error deleting image: ${error.message}`)
    }
  }

  return (
    <div className="home-container">
      {error && (
        <div className="error-message">
          <Icon icon="mdi:alert-circle" width="24" height="24" />
          <span>{error}</span>
        </div>
      )}
      {isLoading ? (
        <div className="loading-container">
          <Icon icon="mdi:loading" className="spin" width="48" height="48" />
          <p>Loading images...</p>
        </div>
      ) : images.length > 0 ? (
        <div className="gallery">
          {images.map(({ filename, dataUrl, error }) => (
            <div key={filename} className="image-card">
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt={filename}
                  onClick={() => handleImageClick(filename)}
                />
              ) : (
                <div className="image-error">
                  <Icon icon="mdi:image-broken" width="48" height="48" />
                  <p>{error || 'Failed to load image'}</p>
                </div>
              )}
              <div className="image-overlay">
                <span className="image-name">{filename}</span>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(filename)
                  }}
                >
                  <Icon icon="mdi:delete" width="24" height="24" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon icon="mdi:image-multiple" width="64" height="64" />
          <h2>No Images Yet</h2>
          <p>Upload your first image to get started</p>
        </div>
      )}
    </div>
  )
}

export default Home
