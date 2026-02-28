'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '@/components/Sidebar';
import type { RootState } from '@/redux/store';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const userData = useSelector((state: RootState) => state.user.userData);
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = userData?.role || 'patient';
  const displayName = userData?.name || loginData?.displayName || loginData?.email || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 h-14 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 text-xl"
          >
            ☰
          </button>
          <div className="md:hidden font-bold text-gray-800 flex items-center gap-2">
            <span>🏥</span> ClinicAI
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 hidden sm:block">{displayName}</div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

