'use client';

import { Provider } from 'react-redux';
import store from './store';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { loginUser, logoutUser } from '@/redux/reducers/auth-reducer/auth-reducer';
import { clearUser } from '@/redux/reducers/user-reducer/user-reducer';
import { fetchUserDataAction } from '@/redux/actions/user-action/user-action';
import { AppDispatch } from './store';
import { useDispatch } from 'react-redux';

// Inner component so we can use hooks inside the Provider
function AuthStateListener() {
  const dispatch = useDispatch() as AppDispatch;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          loginUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          }),
        );
        // Fetch Firestore profile (name, role, etc.) after auth resolves
        await dispatch(fetchUserDataAction(firebaseUser.uid));
      } else {
        dispatch(logoutUser());
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthStateListener />
      {children}
    </Provider>
  );
}
