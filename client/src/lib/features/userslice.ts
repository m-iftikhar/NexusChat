import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  user: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload; 
    },
    setUser: (state, action) => {
      state.user = action.payload; 
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setUsers, setError } = userSlice.actions;
export default userSlice.reducer;
