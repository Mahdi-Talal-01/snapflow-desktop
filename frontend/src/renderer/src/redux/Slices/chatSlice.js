import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  loading: false,
  error: null,
  connected: false,
  currentUser: null,
  welcomeMessage: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      // Check if message already exists
      const existingIndex = state.messages.findIndex(msg => msg.id === action.payload.id);
      if (existingIndex >= 0) {
        // Update existing message
        state.messages[existingIndex] = action.payload;
      } else {
        // Add new message immutable >>>>>>
        state.messages.push(action.payload);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
      if (action.payload) {
        state.error = null; // Clear error when connected
      }
    },
    setCurrentUser: (state, action) => {
      console.log('Setting current user in chat reducer:', action.payload);
      if (action.payload) {
        state.currentUser = {
          id: action.payload.id,
          name: action.payload.name ,
          email: action.payload.email
        };
        console.log('Current user set to:', state.currentUser);
      } else {
        state.currentUser = null;
        console.log('Current user cleared');
      }
    },
    setWelcomeMessage: (state, action) => {
      state.welcomeMessage = action.payload;
      state.connected = true; // Set connected to true when we receive welcome message
      state.error = null; // Clear any errors
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
      state.welcomeMessage = null;
      state.connected = false;
      state.currentUser = null;
    }
  }
});

export const {
  setMessages,
  addMessage,
  setLoading,
  setError,
  setConnected,
  setCurrentUser,
  setWelcomeMessage,
  clearChat
} = chatSlice.actions;

export default chatSlice.reducer;