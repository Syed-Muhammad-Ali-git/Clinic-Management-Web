'use client';

import React from 'react';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import AdminDashboard from './admin/page';
import DoctorDashboard from './doctor/page';
import ReceptionistDashboard from './receptionist/page';
import PatientDashboard from './patient/page';

export default function DashboardPage() {
  const { loading } = useRequireAuth();
  const userProfile = useSelector((state: RootState) => state.user.userData);
  const role = userProfile?.role || null;

  if (loading || !role) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin inline-block" />
        <span className="text-sm">Loading dashboard...</span>
      </div>
    </div>
  );

  if (role === 'admin') return <AdminDashboard />;
  if (role === 'doctor') return <DoctorDashboard />;
  if (role === 'receptionist') return <ReceptionistDashboard />;
  return <PatientDashboard />;
}
