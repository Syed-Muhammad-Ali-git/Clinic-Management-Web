'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatient } from '@/redux/actions/patient-action/patient-action';
import { useRouter, useParams } from 'next/navigation';
import type { RootState } from '@/redux/store';
import useRequireAuth from '@/lib/hooks/useRequireAuth';

export default function PatientView() {
  const { loading } = useRequireAuth();
  const dispatch = useDispatch();
  const params = useParams();
  const id = params?.id as string;
  const patient = useSelector((state: RootState) => state.patient.currentPatient);

  useEffect(() => { if (id) dispatch<any>(getPatient(id)); }, [dispatch, id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!patient) return <div className="p-8">Patient not found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{patient.name}</h1>
      <div className="mt-4">
        <p><strong>DOB:</strong> {patient.dob}</p>
        <p><strong>Contact:</strong> {patient.contact}</p>
      </div>
    </div>
  );
}
