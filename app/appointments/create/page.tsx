'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAppointment } from '@/redux/actions/appointment-action/appointment-action';
import { useRouter } from 'next/navigation';
import useRequireAuth from '@/lib/hooks/useRequireAuth';

export default function CreateAppointment() {
  const { loading } = useRequireAuth();
  const dispatch = useDispatch();
  const router = useRouter();

  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    await dispatch<any>(createAppointment({ patientId, patientName, doctorId, scheduledAt: new Date(scheduledAt) }));
    router.push('/appointments');
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Book Appointment</h1>
      <form className="mt-4 max-w-md" onSubmit={handleSubmit}>
        <label className="block mb-2">Patient ID</label>
        <input className="w-full mb-3 p-2 border" value={patientId} onChange={e=>setPatientId(e.target.value)} />
        <label className="block mb-2">Patient name</label>
        <input className="w-full mb-3 p-2 border" value={patientName} onChange={e=>setPatientName(e.target.value)} />
        <label className="block mb-2">Doctor ID</label>
        <input className="w-full mb-3 p-2 border" value={doctorId} onChange={e=>setDoctorId(e.target.value)} />
        <label className="block mb-2">When</label>
        <input type="datetime-local" className="w-full mb-3 p-2 border" value={scheduledAt} onChange={e=>setScheduledAt(e.target.value)} />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Book</button>
      </form>
    </div>
  );
}
