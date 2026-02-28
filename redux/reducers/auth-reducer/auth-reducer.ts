// Auth reducer - manages authentication state

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from '@/app/types/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  loginData: null,
  userEmail: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Set auth user after successful login/signup/google sign-in */
    loginUser: (state, action: PayloadAction<AuthUser>) => {
      state.isAuthenticated = true;
      state.loginData = action.payload;
      state.loading = false;
      state.error = null;
    },
    /** Clear auth state on logout */
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.loginData = null;
      state.loading = false;
      state.error = null;
    },
    /** Store email used for password reset flow */
    setRequestPasswordEmail: (state, action: PayloadAction<string>) => {
      state.userEmail = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  setRequestPasswordEmail,
  setAuthLoading,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
