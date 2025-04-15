import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../Slices/chatSlice';
import authReducer from '../Slices/authSlice';
import imageReducer from '../Slices/imageSlice';
import userReducer from '../Slices/userSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
    image: imageReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store; 