// User profile types

export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  profileImage?: string;
  [key: string]: unknown;
}

export interface UserState {
  userData: UserProfile | null;
  loading: boolean;
  error: string | null;
}
