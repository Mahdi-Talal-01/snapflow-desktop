import { configureStore } from "@reduxjs/toolkit";
import uploadModelReducer from "../Slices/uploadModelSlice";

export const store = configureStore({
  reducer: {
    uploadModel: uploadModelReducer,
  },
});
