import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  file: null,
  images: [],
  loading: false,
  error: null,
  shouldRefresh: false
};

const uploadModelSlice = createSlice({
  name: "uploadModel",
  initialState,
  reducers: {
    openUploadModel: (state) => {
      state.isOpen = true;
    },
    closeUploadModel: (state) => {
      state.isOpen = false;
      state.file = null;
    },
    setFile: (state, action) => {
      console.log('Redux - Setting file:', action.payload);
      state.file = action.payload;
    },
    addImage: (state, action) => {
      state.images = [...state.images, action.payload];
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFile: (state) => {
      state.file = null;
    },
    triggerRefresh: (state) => {
      state.shouldRefresh = true;
    },
    clearRefresh: (state) => {
      state.shouldRefresh = false;
    }
  },
});

export const {
  openUploadModel,
  closeUploadModel,
  setFile,
  addImage,
  setImages,
  setLoading,
  setError,
  clearError,
  clearFile,
  triggerRefresh,
  clearRefresh
} = uploadModelSlice.actions;

export default uploadModelSlice.reducer;
