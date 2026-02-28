// User actions - Firestore user profile API calls live here

import { AppDispatch } from '@/redux/store';
import {
  setUserData,
  setUserLoading,
  setUserError,
} from '@/redux/reducers/user-reducer/user-reducer';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '@/app/types/user';

/**
 * Thunk action to fetch the logged-in user's Firestore profile.
 * Dispatches setUserData with name, email, role, etc.
 */
export const fetchUserDataAction =
  (uid: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setUserLoading(true));
      dispatch(setUserError(null));

      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const profile = { uid: snap.id, ...snap.data() } as UserProfile;
        dispatch(setUserData(profile));
        return profile;
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user data';
      dispatch(setUserError(message));
      throw error;
    } finally {
      dispatch(setUserLoading(false));
    }
  };

/**
 * Thunk action to update logged-in user's Firestore profile fields.
 */
export const updateUserProfileAction =
  (uid: string, updates: Partial<UserProfile>) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setUserLoading(true));
      dispatch(setUserError(null));

      await setDoc(doc(db, 'users', uid), updates, { merge: true });
      await dispatch(fetchUserDataAction(uid));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      dispatch(setUserError(message));
      throw error;
    } finally {
      dispatch(setUserLoading(false));
    }
  };
