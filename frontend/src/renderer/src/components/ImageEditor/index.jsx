import React, { useState } from 'react'
import './style.css'
import useImageEditorLogic from '../../hooks/useImageEditor'

const ImageEditor = ({ imageUrl, onSave }) => {
  const [selectedTool, setSelectedTool] = useState('transform')

  const {
    canvasRef,
    handleTransform,
    applyFilter,
    addWatermark,
    watermarkText,
    setWatermarkText,
    getImageDataUrl
  } = useImageEditorLogic(imageUrl)

  const handleSave = () => {
    const dataUrl = getImageDataUrl()
    if (dataUrl) {
      onSave(dataUrl)
    }
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
        </div>

        <div className="canvas-container">
          <canvas ref={canvasRef} />
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
