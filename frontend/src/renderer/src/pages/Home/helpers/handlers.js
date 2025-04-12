
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
  
  export const handleImageClick = async ({ filename, dispatch, navigate ,setFile }) => {
    try {
      const imageData = await window.api.getImageData(filename);
      if (imageData) {
        const dataUrl = `data:image/jpeg;base64,${imageData}`;
        dispatch(setFile({ url: dataUrl, filename }));
        navigate("/edit-image");
      }
    } catch (error) {
      console.error('Home - Error handling image click:', error);
    }
  };
  
  export const handleDeleteClick = async ({ filename, loadImages }) => {
    try {
      if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
        const response = await window.api.deleteImage(filename);
        if (response.success) {
          loadImages();
        } else {
          alert('Failed to delete image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Home - Error deleting image:', error);
      alert('An error occurred while deleting the image.');
    }
  };
  
  export const handleUploadClick = (dispatch, openUploadModel) => {
    dispatch(openUploadModel());
  };
  