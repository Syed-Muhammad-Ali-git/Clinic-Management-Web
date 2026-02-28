// User reducer - manages the logged-in user's profile data

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, UserState } from '@/app/types/user';

const initialState: UserState = {
  userData: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /** Set full user profile (name, email, role, etc.) from Firestore */
    setUserData: (state, action: PayloadAction<UserProfile | null>) => {
      state.userData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      state.error = null;
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    /** Clear user profile data on logout */
    clearUser: (state) => {
      state.userData = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const { setUserData, setUserLoading, setUserError, clearUser } = userSlice.actions;
export default userSlice.reducer;
