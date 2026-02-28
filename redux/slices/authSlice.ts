// Re-export from auth-reducer for backward compatibility.
// All new code should import directly from '@/redux/reducers/auth-reducer/auth-reducer'.
export {
  loginUser,
  logoutUser,
  setAuthLoading as setLoading,
  setAuthError as setError,
  clearAuthError,
  setRequestPasswordEmail,
} from '@/redux/reducers/auth-reducer/auth-reducer';

export { default } from '@/redux/reducers/auth-reducer/auth-reducer';
