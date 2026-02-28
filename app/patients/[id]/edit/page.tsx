'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientAction, updatePatientAction } from '@/redux/actions/patient-action/patient-action';
import { useRouter, useParams } from 'next/navigation';
import type { AppDispatch, RootState } from '@/redux/store';
import useRequireAuth from '@/lib/hooks/useRequireAuth';

export default function EditPatient() {
  const { loading } = useRequireAuth();
  const dispatch = useDispatch() as AppDispatch;
  const params = useParams();
  const id = params?.id as string;
  const patient = useSelector((state: RootState) => state.patient.currentPatient);

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [contact, setContact] = useState('');
  const router = useRouter();

  useEffect(() => { if (id) dispatch(getPatientAction(id)); }, [dispatch, id]);
  useEffect(() => { if (patient) { setName(patient.name || ''); setDob((patient as any).dateOfBirth || (patient as any).dob || ''); setContact((patient as any).phone || (patient as any).contact || ''); } }, [patient]);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    await dispatch(updatePatientAction(id, { name, dateOfBirth: dob, phone: contact }));
    router.push(`/patients/${id}`);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Edit Patient</h1>
      <form className="mt-4 max-w-md" onSubmit={handleSubmit}>
        <label className="block mb-2">Name</label>
        <input className="w-full mb-3 p-2 border" value={name} onChange={e=>setName(e.target.value)} />
        <label className="block mb-2">DOB</label>
        <input className="w-full mb-3 p-2 border" value={dob} onChange={e=>setDob(e.target.value)} />
        <label className="block mb-2">Contact</label>
        <input className="w-full mb-3 p-2 border" value={contact} onChange={e=>setContact(e.target.value)} />
        <button className="px-4 py-2 bg-orange-600 text-white rounded">Save</button>
      </form>
    </div>
  );
}
