"use client";
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useRequireAuth(requiredRoles: string[] = []) {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const authLoading = useSelector((state: RootState) => state.auth.loading);
  const userRole = useSelector((state: RootState) => state.user.userData?.role);
  const userLoading = useSelector((state: RootState) => state.user.loading);

  const loading = authLoading || userLoading;

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (requiredRoles.length && userRole && !requiredRoles.includes(userRole)) {
      router.push('/unauthorized');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isAuthenticated, userRole]);

  return { loading };
}
