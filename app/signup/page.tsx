'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser, googleSignIn } from '@/redux/actions/auth-action/auth-action';
import { useRouter } from 'next/navigation';
import type { RootState } from '@/redux/store';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.auth.loading);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await dispatch<any>(signUpUser({ name, email, password }));
    router.push('/dashboard');
  };

  const handleGoogle = async () => {
    await dispatch<any>(googleSignIn());
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Full name</label>
          <input className="w-full mb-3 p-2 border" value={name} onChange={e=>setName(e.target.value)} />
          <label className="block mb-2">Email</label>
          <input className="w-full mb-3 p-2 border" value={email} onChange={e=>setEmail(e.target.value)} />
          <label className="block mb-2">Password</label>
          <input type="password" className="w-full mb-3 p-2 border" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="w-full bg-green-600 text-white p-2 rounded" disabled={loading}>{loading ? 'Loading...' : 'Create account'}</button>
        </form>
        <div className="mt-4">
          <button onClick={handleGoogle} className="w-full border p-2 rounded">Sign up with Google</button>
        </div>
      </div>
    </div>
  );
}
