// User reducer slices are defined here...!

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  usersList: [],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    FETCH_ALL_USERS: (state, action) => {
      //   console.log("Users in redux: ", action.payload);
      state.usersList = action.payload;
    },
  },
});

export const { FETCH_ALL_USERS } = userSlice.actions;
export default userSlice.reducer;
