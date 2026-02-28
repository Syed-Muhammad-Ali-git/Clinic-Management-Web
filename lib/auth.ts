import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from './firebase';

export const signup = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }

    return userCredential.user;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Signup failed';
    throw new Error(msg);
  }
};

export const login = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Login failed';
    throw new Error(msg);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Logout failed';
    throw new Error(msg);
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Password reset failed';
    throw new Error(msg);
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
