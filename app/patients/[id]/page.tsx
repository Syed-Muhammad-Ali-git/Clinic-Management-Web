'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientAction } from '@/redux/actions/patient-action/patient-action';
import { useParams } from 'next/navigation';
import type { AppDispatch, RootState } from '@/redux/store';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';

const INFO = (label: string, value: string | undefined) =>
  value ? (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  ) : null;

export default function PatientView() {
  const { loading } = useRequireAuth();
  const dispatch = useDispatch() as AppDispatch;
  const params   = useParams();
  const id       = params?.id as string;

  const patient   = useSelector((state: RootState) => state.patient.currentPatient);
  const isLoading = useSelector((state: RootState) => state.patient.loading);
  const userRole  = useSelector((state: RootState) => state.user.userData?.role);

  useEffect(() => {
    if (id) dispatch(getPatientAction(id)).catch(() => toast.error('Failed to load patient.'));
  }, [dispatch, id]);

  const canEdit = userRole === 'admin' || userRole === 'receptionist';

  if (loading || isLoading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  if (!patient) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-5xl mb-4">👤</p>
      <p className="font-medium text-lg">Patient not found.</p>
      <Link href="/patients" className="mt-4 inline-block text-blue-600 text-sm hover:underline">← Back to Patients</Link>
    </div>
  );

  const p = patient as any;
  const initials = (p.name || '?').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/patients" className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 text-sm">← Back</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">ID: {id}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {/* ── Identity ── */}
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900">{p.name}</h2>
            <p className="text-sm text-gray-500">{p.email || '—'}</p>
          </div>
          {p.bloodGroup && (
            <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full font-semibold">{p.bloodGroup}</span>
          )}
          {p.gender && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
              p.gender === 'male' ? 'bg-blue-50 text-blue-600' :
              p.gender === 'female' ? 'bg-pink-50 text-pink-600' :
              'bg-gray-100 text-gray-500'
            }`}>{p.gender}</span>
          )}
        </div>

        {/* ── Details ── */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {INFO('Phone', p.phone || p.contact)}
          {INFO('Date of Birth', p.dateOfBirth || p.dob)}
          {INFO('Address', p.address)}
        </div>

        {/* ── Medical History ── */}
        {p.medicalHistory && (
          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Medical History / Allergies</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">{p.medicalHistory}</p>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="px-6 py-4 flex items-center gap-3 flex-wrap">
          <Link
            href={`/patients/${id}/history`}
            className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium hover:bg-purple-100 transition"
          >
            📋 View History
          </Link>
          {canEdit && (
            <Link
              href={`/patients/${id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              ✏️ Edit Patient
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

