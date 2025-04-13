export const loadUploadedImagesHandler = async ({ setIsLoading, setUploadedImages }) => {
    try {
      setIsLoading(true);
      const images = await window.api.getImages();
      setUploadedImages(images);
    } catch (error) {
      console.error('Home - Error loading uploaded images:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  export const handleImageClick = async ({ filename, dispatch, navigate, setFile }) => {
    try {
      console.log('Getting image data for:', filename)
      const imageData = await window.api.getImageData(filename)
      if (imageData) {
        console.log('Image data received successfully')
        const dataUrl = `data:image/jpeg;base64,${imageData}`
        dispatch(setFile({ url: dataUrl, filename }))
        navigate("/edit-image")
      } else {
        console.error('No image data received')
      }
    } catch (error) {
      console.error('Error handling image click:', error)
    }
  };
  
  export const handleDeleteClick = async ({ filename, loadImages }) => {
    try {
      console.log('Attempting to delete:', filename)
      if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
        const response = await window.api.deleteImage(filename)
        console.log('Delete response:', response)
        if (response.success) {
          console.log('Image deleted successfully')
          loadImages()
        } else {
          console.error('Failed to delete image:', response.error)
          alert('Failed to delete image. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('An error occurred while deleting the image.')
    }
  };
  
  export const handleUploadClick = (dispatch, openUploadModel) => {
    dispatch(openUploadModel());
  };
  