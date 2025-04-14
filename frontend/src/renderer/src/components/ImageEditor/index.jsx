import React, { useState, useRef, useEffect } from 'react'
import './style.css'
import useImageEditorLogic from '../../hooks/useImageEditor'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import { Icon } from '@iconify/react'
import 'react-image-crop/dist/ReactCrop.css'

const ImageEditor = ({ imageUrl, onSave }) => {
  const [selectedTool, setSelectedTool] = useState('transform')
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(null)
  const [isCropping, setIsCropping] = useState(false)
  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)

  const {
    canvasRef,
    handleTransform,
    applyFilter,
    addWatermark,
    watermarkText,
    setWatermarkText,
    getImageDataUrl
  } = useImageEditorLogic(imageUrl)

  // Load image into canvas when component mounts or imageUrl changes
  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
      }
      img.src = imageUrl
    }
  }, [imageUrl])

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    )
    setCrop(crop)
  }

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop)
  }

  const handleCrop = () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = previewCanvasRef.current
    const crop = completedCrop

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')
    const pixelRatio = window.devicePixelRatio

    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    // Update the main canvas with the cropped image
    const mainCtx = canvasRef.current.getContext('2d')
    mainCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    mainCtx.drawImage(canvas, 0, 0)
    
    // Reset cropping state
    setIsCropping(false)
    setSelectedTool('transform')
  }

  const handleSave = () => {
    const dataUrl = getImageDataUrl()
    if (dataUrl) {
      onSave(dataUrl)
    }
  }

  const handleStartCrop = () => {
    setIsCropping(true)
  }

  const handleCancelCrop = () => {
    setIsCropping(false)
    setSelectedTool('transform')
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="tool-tabs">
          <button
            className={`tab-button ${selectedTool === 'transform' ? 'active' : ''}`}
            onClick={() => setSelectedTool('transform')}
          >
            Transform
          </button>
          <button
            className={`tab-button ${selectedTool === 'filters' ? 'active' : ''}`}
            onClick={() => setSelectedTool('filters')}
          >
            Filters
          </button>
          <button
            className={`tab-button ${selectedTool === 'watermark' ? 'active' : ''}`}
            onClick={() => setSelectedTool('watermark')}
          >
            Watermark
          </button>
          <button
            className={`tab-button ${selectedTool === 'crop' ? 'active' : ''}`}
            onClick={() => {
              setSelectedTool('crop')
              handleStartCrop()
            }}
          >
            Crop
          </button>
        </div>
      </div>

      <div className="editor-content">
        <div className="tools-panel">
          {selectedTool === 'transform' && (
            <>
              <div className="filter-option">
                <span>Rotate Left</span>
                <button onClick={() => handleTransform('rotate', -90)} className="apply-button">
                  Apply
                </button>
              </div>
              <div className="filter-option">
                <span>Rotate Right</span>
                <button onClick={() => handleTransform('rotate', 90)} className="apply-button">
                  Apply
                </button>
              </div>
              <div className="filter-option">
                <span>Flip Horizontal</span>
                <button onClick={() => handleTransform('flipH')} className="apply-button">
                  Apply
                </button>
              </div>
              <div className="filter-option">
                <span>Flip Vertical</span>
                <button onClick={() => handleTransform('flipV')} className="apply-button">
                  Apply
                </button>
              </div>
            </>
          )}

          {selectedTool === 'filters' && (
            <>
              <div className="filter-option">
                <span>Black & White</span>
                <button onClick={() => applyFilter('blackAndWhite')} className="apply-button">
                  Apply
                </button>
              </div>
              <div className="filter-option">
                <span>Soft</span>
                <button onClick={() => applyFilter('soft')} className="apply-button">
                  Apply
                </button>
              </div>
              <div className="filter-option">
                <span>Warm</span>
                <button onClick={() => applyFilter('warm')} className="apply-button">
                  Apply
                </button>
              </div>
              <div className="filter-option">
                <span>Cool</span>
                <button onClick={() => applyFilter('cool')} className="apply-button">
                  Apply
                </button>
              </div>
            </>
          )}

          {selectedTool === 'watermark' && (
            <>
              <div className="watermark-input">
                <input
                  type="text"
                  placeholder="Enter watermark text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                />
              </div>
              <div className="filter-option">
                <span>Add Watermark</span>
                <button onClick={addWatermark} className="apply-button">
                  Apply
                </button>
              </div>
            </>
          )}

          {selectedTool === 'crop' && (
            <div className="crop-controls">
              <div className="crop-instructions">
                <p>Drag the corners or edges to adjust the crop area</p>
              </div>
              <div className="crop-actions">
                <button onClick={handleCancelCrop} className="cancel-button">
                  <Icon icon="mdi:close" width="20" height="20" />
                  Cancel
                </button>
                <button onClick={handleCrop} className="apply-crop-button">
                  <Icon icon="mdi:check" width="20" height="20" />
                  Apply Crop
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="canvas-container">
          {selectedTool === 'crop' ? (
            <div className="crop-container">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={1}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  onLoad={onImageLoad}
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </ReactCrop>
            </div>
          ) : (
            <canvas ref={canvasRef} />
          )}
          <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
        </div>
      </div>

      <div className="editor-footer">
        <button onClick={handleSave} className="save-button">
          Save
        </button>
      </div>
    </div>
  )
}

export default ImageEditor
