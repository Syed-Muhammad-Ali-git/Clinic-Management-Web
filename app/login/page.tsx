'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logInUser, googleSignIn, sendPasswordReset } from '@/redux/actions/auth-action/auth-action';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { RootState } from '@/redux/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch<any>(logInUser({ email, password }));
    router.push('/dashboard');
  };

  const handleGoogle = async () => {
    await dispatch<any>(googleSignIn());
    router.push('/dashboard');
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch<any>(sendPasswordReset(resetEmail));
    setResetSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ClinicAI</h1>
          <p className="text-gray-500 text-sm mt-1">Medical Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {!showForgot ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Welcome back</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="doctor@clinic.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition pr-14"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600">
                      {showPw ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={() => setShowForgot(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium">
                    Forgot password?
                  </button>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? (<><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</>) : 'Sign in'}
                </button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">OR</span></div>
              </div>

              <button onClick={handleGoogle} disabled={loading}
                className="w-full py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition flex items-center justify-center gap-3 disabled:opacity-60">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-blue-600 font-semibold hover:underline">Create account</Link>
              </p>
            </>
          ) : (
            <>
              <button onClick={() => { setShowForgot(false); setResetSent(false); }}
                className="text-sm text-gray-500 hover:text-gray-700 mb-5 flex items-center gap-1">← Back to login</button>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Reset password</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your email and we&apos;ll send a reset link.</p>

              {resetSent ? (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center">
                  ✅ Reset link sent! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                    <input type="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-60">
                    {loading ? 'Sending...' : 'Send reset link'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
