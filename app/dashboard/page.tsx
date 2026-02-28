'use client';

import React from 'react';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';
import { logOutUser } from '@/redux/actions/auth-action/auth-action';

export default function DashboardPage() {
  const { loading } = useRequireAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-4">
        <p>Welcome, {user?.displayName || user?.email}</p>
        <p>UID: {user?.uid}</p>
      </div>
      <div className="mt-6">
        <button onClick={() => dispatch<any>(logOutUser())} className="px-4 py-2 bg-red-600 text-white rounded">Logout</button>
      </div>
    </div>
  );
}
