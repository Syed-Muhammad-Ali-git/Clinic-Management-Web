// Auth reducer slices are defined here...!

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isAuthenticated: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    LOGIN_USER: (state, action) => {
      console.log("User in redux: ", action.payload);
      state.isAuthenticated = action.payload;
    },

    LOG_OUT_USER: (state, action) => {
      state.isAuthenticated = null;
    },
  },
});

export const { LOGIN_USER, LOG_OUT_USER } = authSlice.actions;
export default authSlice.reducer;
