import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  file: null,
  loading: false,
  error: null,
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
    },
    setFile: (state, action) => {
      console.log('Redux - Setting file:', action.payload);
      state.file = action.payload;
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
  },
});

export const {
  openUploadModel,
  closeUploadModel,
  setFile,
  setLoading,
  setError,
  clearError,
  clearFile,
} = uploadModelSlice.actions;

export default uploadModelSlice.reducer;
