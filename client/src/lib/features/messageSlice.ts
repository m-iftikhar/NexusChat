import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  error: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addLocalMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessageError: (state, action) => {
      state.error = action.payload;
    },
    addSocketMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  }, // <-- Closing brace for reducers object
}); // <-- Closing parenthesis for createSlice

export const { setMessages, addMessage, setMessageError,addLocalMessage,addSocketMessage} = messageSlice.actions;
export default messageSlice.reducer;
