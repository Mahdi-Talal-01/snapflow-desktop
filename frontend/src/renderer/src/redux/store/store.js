import { configureStore } from "@reduxjs/toolkit";
import uploadModelReducer from "../Slices/uploadModelSlice";
import userReducer from "../Slices/userSlice";

export const store = configureStore({
  reducer: {
    uploadModel: uploadModelReducer,
    user: userReducer
  },
});
