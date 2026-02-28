'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientsAction } from '@/redux/actions/patient-action/patient-action';
import { fetchAppointmentsAction, updateAppointmentAction } from '@/redux/actions/appointment-action/appointment-action';
import type { AppDispatch, RootState } from '@/redux/store';
import Link from 'next/link';

export default function ReceptionistDashboard() {
  const dispatch = useDispatch() as AppDispatch;
  const patients = useSelector((state: RootState) => state.patient.patients);
  const appointments = useSelector((state: RootState) => state.appointment.appointments);

  useEffect(() => {
    dispatch(fetchPatientsAction());
    dispatch(fetchAppointmentsAction());
  }, [dispatch]);

  const pending = appointments.filter((a: any) => a.status === 'pending');
  const confirmed = appointments.filter((a: any) => a.status === 'confirmed');

  const confirm = (id: string) => dispatch(updateAppointmentAction(id, { status: 'confirmed' }));
  const cancel = (id: string) => dispatch(updateAppointmentAction(id, { status: 'cancelled' }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Receptionist Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage appointments and patient records</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">👥</div>
          <div><div className="text-sm text-gray-500">Total Patients</div><div className="text-2xl font-bold">{patients.length}</div></div>
        </div>
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-2xl">⏳</div>
          <div><div className="text-sm text-gray-500">Pending</div><div className="text-2xl font-bold">{pending.length}</div></div>
        </div>
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">✅</div>
          <div><div className="text-sm text-gray-500">Confirmed</div><div className="text-2xl font-bold">{confirmed.length}</div></div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link href="/patients/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          ➕ Register Patient
        </Link>
        <Link href="/appointments/create" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
          📅 Book Appointment
        </Link>
      </div>

      {/* Pending appointments for confirmation */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Pending Confirmation</h2>
          <Link href="/appointments" className="text-sm text-blue-600 hover:underline">All →</Link>
        </div>
        {pending.length ? (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400 text-xs border-b">
              <th className="pb-2">Patient</th><th className="pb-2">Scheduled</th><th className="pb-2">Actions</th>
            </tr></thead>
            <tbody>
              {pending.map((a: any) => {
                const t = a.scheduledAt?.seconds ? new Date(a.scheduledAt.seconds * 1000) : a.scheduledAt ? new Date(a.scheduledAt) : null;
                return (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 font-medium">{a.patientName || a.patientId}</td>
                    <td className="py-2.5 text-gray-500">{t ? t.toLocaleString() : '—'}</td>
                    <td className="py-2.5 flex gap-2">
                      <button onClick={() => confirm(a.id)} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">Confirm</button>
                      <button onClick={() => cancel(a.id)} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">Cancel</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">⏳</p>
            <p className="text-sm">No pending appointments</p>
          </div>
        )}
      </div>
    </div>
  );
}
