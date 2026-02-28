// Auth actions - all Firebase Auth API calls live here

import { setCookie, deleteCookie } from 'cookies-next/client';
import { AppDispatch } from '@/redux/store';
import {
  loginUser,
  logoutUser,
  setAuthLoading,
  setAuthError,
  setRequestPasswordEmail,
} from '@/redux/reducers/auth-reducer/auth-reducer';
import { clearUser } from '@/redux/reducers/user-reducer/user-reducer';
import { signup, login, logout, signInWithGoogle, forgotPassword } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { fetchUserDataAction } from '@/redux/actions/user-action/user-action';
import { LoginCredentials, SignupData } from '@/app/types/auth';

/**
 * Thunk action to sign up a new user with email & password.
 * Creates a Firestore user document with the selected role.
 */
export const signupUserAction =
  (signupData: SignupData) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setAuthLoading(true));
      dispatch(setAuthError(null));

      const user = await signup(signupData.email, signupData.password, signupData.name);

      // Create Firestore user profile doc
      await setDoc(doc(db, 'users', user.uid), {
        name: signupData.name,
        email: signupData.email,
        role: signupData.role || 'patient',
        createdAt: new Date().toISOString(),
      });

      const token = await user.getIdToken();
      setCookie('token', token, { path: '/' });

      dispatch(loginUser({ uid: user.uid, email: user.email, displayName: user.displayName }));
      await dispatch(fetchUserDataAction(user.uid));

      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      dispatch(setAuthError(message));
      throw error;
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

/**
 * Thunk action to log in an existing user with email & password.
 */
export const loginUserAction =
  (credentials: LoginCredentials) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setAuthLoading(true));
      dispatch(setAuthError(null));

      const user = await login(credentials.email, credentials.password);

      const token = await user.getIdToken();
      setCookie('token', token, { path: '/' });

      dispatch(loginUser({ uid: user.uid, email: user.email, displayName: user.displayName }));
      await dispatch(fetchUserDataAction(user.uid));

      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch(setAuthError(message));
      throw error;
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

/**
 * Thunk action to log out - clears cookies and Redux state.
 */
export const logoutUserAction = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    await logout();
    deleteCookie('token', { path: '/' });

    dispatch(logoutUser());
    dispatch(clearUser());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    dispatch(setAuthError(message));
    throw error;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * Thunk action to sign in / sign up via Google OAuth popup.
 * Creates Firestore profile doc on first sign-in (role defaults to 'patient').
 */
export const googleSignInAction = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    const user = await signInWithGoogle();

    const token = await user.getIdToken();
    setCookie('token', token, { path: '/' });

    dispatch(loginUser({ uid: user.uid, email: user.email, displayName: user.displayName }));
    await dispatch(fetchUserDataAction(user.uid));

    return user;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Google sign-in failed';
    dispatch(setAuthError(message));
    throw error;
  } finally {
    dispatch(setAuthLoading(false));
  }
};

/**
 * Thunk action to send a password reset email.
 */
export const sendPasswordResetAction =
  (email: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setAuthLoading(true));
      dispatch(setAuthError(null));

      await forgotPassword(email);
      dispatch(setRequestPasswordEmail(email));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      dispatch(setAuthError(message));
      throw error;
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
