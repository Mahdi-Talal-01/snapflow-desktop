import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './style.css'
import ImageEditor from '../../components/ImageEditor'
import { Icon } from '@iconify/react'

const EditImage = () => {
  const imagefile = useSelector((state) => state.uploadModel.file)
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/')
  }

  const handleSave = async (editedImageData) => {
    try {
      // Remove the data:image/jpeg;base64, prefix
      const base64Data = editedImageData.split(',')[1]

      // Save the edited image
      const response = await window.api.saveImage({
        name: imagefile.filename,
        data: base64Data
      })

      if (response.success) {
        console.log('Image saved successfully')
        // Navigate back to home
        navigate('/')
      } else {
        console.error('Failed to save image:', response.error)
      }
    } catch (error) {
      console.error('Error saving image:', error)
    }
  }

  if (!imagefile?.url) {
    console.error('EditImage - No image URL found in imagefile:', imagefile)
    return (
      <div className="edit-image-container">
        <div className="edit-image-header">
          <button className="back-button" onClick={handleBack}>
            <Icon icon="mdi:arrow-left" width="24" height="24" />
            <span>Back</span>
          </button>
        </div>
        <div className="no-image">
          <p>No image selected</p>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-image-container">
      <div className="edit-image-header">
        <button className="back-button" onClick={handleBack}>
          <Icon icon="mdi:arrow-left" width="24" height="24" />
          <span>Back</span>
        </button>
      </div>
      <ImageEditor imageUrl={imagefile.url} onSave={handleSave} />
    </div>
  )
}

export default EditImage
