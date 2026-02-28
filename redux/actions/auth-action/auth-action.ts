// Centralized auth actions that call lib/auth helpers and update redux state
import { signup, login, logout, signInWithGoogle, forgotPassword } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { setUser, setLoading, setError, clearAuth } from '@/redux/slices/authSlice';
import { setCookie, deleteCookie } from 'cookies-next/client';

interface UserData {
  name?: string;
  email: string;
  password?: string;
}

const signUpUser = (userData: UserData) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const user = await signup(userData.email, userData.password || '', userData.name || '');
      if (user) {
        // create user doc in Firestore with default role 'patient'
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || userData.name || '',
          email: user.email || userData.email,
          role: 'patient',
          createdAt: new Date(),
        });

        const token = await user.getIdToken();
        setCookie('token', token);
        dispatch(setUser({ uid: user.uid, email: user.email, displayName: user.displayName }));
      }
    } catch (err: any) {
      dispatch(setError(err?.message || 'Signup failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

const logInUser = (userData: UserData) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const user = await login(userData.email, userData.password || '');
      if (user) {
        const token = await user.getIdToken();
        setCookie('token', token);
        dispatch(setUser({ uid: user.uid, email: user.email, displayName: user.displayName }));
      }
    } catch (err: any) {
      dispatch(setError(err?.message || 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

const logOutUser = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      await logout();
      deleteCookie('token');
      dispatch(clearAuth());
    } catch (err: any) {
      dispatch(setError(err?.message || 'Logout failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

const googleSignIn = () => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const user = await signInWithGoogle();
      if (user) {
        const token = await user.getIdToken();
        setCookie('token', token);
        dispatch(setUser({ uid: user.uid, email: user.email, displayName: user.displayName }));
      }
    } catch (err: any) {
      dispatch(setError(err?.message || 'Google sign-in failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

const sendPasswordReset = (email: string) => {
  return async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      await forgotPassword(email);
    } catch (err: any) {
      dispatch(setError(err?.message || 'Password reset failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export { signUpUser, logInUser, logOutUser, googleSignIn, sendPasswordReset };
