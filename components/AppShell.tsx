'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '@/components/Sidebar';
import type { RootState } from '@/redux/store';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [role, setRole] = useState('patient');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      getDoc(doc(db, 'users', user.uid)).then(snap => {
        if (snap.exists()) setRole((snap.data() as any).role || 'patient');
      });
    }
  }, [user?.uid]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header (mobile burger + avatar) */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 h-14 flex items-center justify-between shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 text-xl">
            ☰
          </button>
          <div className="md:hidden font-bold text-gray-800 flex items-center gap-2">
            <span>🏥</span> ClinicAI
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
