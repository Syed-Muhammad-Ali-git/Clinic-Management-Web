'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Unauthorized() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-4">
      {/* background orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-md w-full">
        {/* icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center shadow-2xl shadow-red-500/30 rotate-3">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20A10 10 0 0012 2z" />
          </svg>
        </div>

        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-2">403</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          You don&apos;t have permission to view this page.<br />
          Please contact your administrator if you believe this is a mistake.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-white/10 text-gray-300 rounded-lg text-sm font-medium hover:bg-white/5 transition"
          >
            ← Go Back
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
