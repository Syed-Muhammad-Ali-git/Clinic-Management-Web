'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientsAction } from '@/redux/actions/patient-action/patient-action';
import { fetchAppointmentsAction, updateAppointmentAction } from '@/redux/actions/appointment-action/appointment-action';
import type { AppDispatch, RootState } from '@/redux/store';
import Link from 'next/link';

export default function DoctorDashboard() {
  const dispatch = useDispatch() as AppDispatch;
  const user = useSelector((state: RootState) => state.auth.loginData);
  const patients = useSelector((state: RootState) => state.patient.patients);
  const appointments = useSelector((state: RootState) => state.appointment.appointments);

  useEffect(() => {
    dispatch(fetchPatientsAction());
    dispatch(fetchAppointmentsAction(user?.uid ? { doctorId: user.uid } : {}));
  }, [dispatch, user?.uid]);

  const todayStr = new Date().toLocaleDateString();
  const todayApts = appointments.filter((a: any) => {
    const d = a.scheduledAt?.seconds ? new Date(a.scheduledAt.seconds * 1000) : new Date(a.scheduledAt);
    return d.toLocaleDateString() === todayStr;
  });
  const pending = appointments.filter((a: any) => a.status === 'pending');

  const handleStatus = (id: string, status: string) => {
    dispatch(updateAppointmentAction(id, { status: status as import('@/app/types/appointment').AppointmentStatus }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Dr. {user?.displayName || user?.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">👥</div>
          <div><div className="text-sm text-gray-500">My Patients</div><div className="text-2xl font-bold">{patients.length}</div></div>
        </div>
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">📅</div>
          <div><div className="text-sm text-gray-500">Today&apos;s Visits</div><div className="text-2xl font-bold">{todayApts.length}</div></div>
        </div>
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-2xl">⏳</div>
          <div><div className="text-sm text-gray-500">Pending</div><div className="text-2xl font-bold">{pending.length}</div></div>
        </div>
      </div>

      {/* Today's appointments */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Today&apos;s Appointments</h2>
          <Link href="/appointments" className="text-sm text-blue-600 hover:underline">All appointments →</Link>
        </div>
        {todayApts.length ? (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400 text-xs border-b">
              <th className="pb-2">Patient</th><th className="pb-2">Time</th><th className="pb-2">Status</th><th className="pb-2">Action</th>
            </tr></thead>
            <tbody>
              {todayApts.map((a: any) => {
                const t = a.scheduledAt?.seconds ? new Date(a.scheduledAt.seconds * 1000) : new Date(a.scheduledAt);
                return (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 font-medium">{a.patientName || a.patientId}</td>
                    <td className="py-2.5 text-gray-500">{t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize
                        ${a.status === 'completed' ? 'bg-green-100 text-green-700' :
                          a.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-2.5">
                      {a.status !== 'completed' && (
                        <button onClick={() => handleStatus(a.id, 'completed')}
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                          Mark complete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-sm">No appointments scheduled for today</p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/patients/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            ➕ Add Patient
          </Link>
          <Link href="/appointments/create" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
            📅 Book Appointment
          </Link>
          <Link href="/prescriptions" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">
            💊 Prescriptions
          </Link>
        </div>
      </div>
    </div>
  );
}
