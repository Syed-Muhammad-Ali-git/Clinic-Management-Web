"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { roleRedirect } from './roleRedirect';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { loginData } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userData || loginData) {
      const role = userData?.role || 'patient';
      router.push(roleRedirect(role));
    }
  }, [userData, loginData, router]);

  return <>{children}</>;
}
