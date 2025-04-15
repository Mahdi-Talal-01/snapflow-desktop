import { configureStore } from "@reduxjs/toolkit";
import uploadModelReducer from "../Slices/uploadModelSlice";
import userReducer from "../Slices/userSlice";
import chatReducer from "../Slices/chatSlice";

export const store = configureStore({
  reducer: {
    uploadModel: uploadModelReducer,
    user: userReducer,
    chat: chatReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
