'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPatient } from '@/redux/actions/patient-action/patient-action';
import { useRouter } from 'next/navigation';
import useRequireAuth from '@/lib/hooks/useRequireAuth';

export default function CreatePatient() {
  const { loading } = useRequireAuth();
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    await dispatch<any>(createPatient({ name, dob, contact }));
    router.push('/patients');
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Add Patient</h1>
      <form className="mt-4 max-w-md" onSubmit={handleSubmit}>
        <label className="block mb-2">Name</label>
        <input className="w-full mb-3 p-2 border" value={name} onChange={e=>setName(e.target.value)} />
        <label className="block mb-2">DOB</label>
        <input className="w-full mb-3 p-2 border" value={dob} onChange={e=>setDob(e.target.value)} placeholder="YYYY-MM-DD" />
        <label className="block mb-2">Contact</label>
        <input className="w-full mb-3 p-2 border" value={contact} onChange={e=>setContact(e.target.value)} />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
      </form>
    </div>
  );
}
