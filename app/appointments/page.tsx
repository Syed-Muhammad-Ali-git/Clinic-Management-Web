'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentsAction } from '@/redux/actions/appointment-action/appointment-action';
import type { AppDispatch, RootState } from '@/redux/store';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import Link from 'next/link';

export default function AppointmentsList() {
  const { loading } = useRequireAuth();
  const dispatch = useDispatch() as AppDispatch;
  const appointments = useSelector((state: RootState) => state.appointment.appointments);

  useEffect(() => { dispatch(fetchAppointmentsAction()); }, [dispatch]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <Link href="/appointments/create" className="px-4 py-2 bg-green-600 text-white rounded">Book</Link>
      </div>
      <div className="mt-6">
        {appointments?.length ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th className="border p-2">Patient</th>
                <th className="border p-2">Doctor</th>
                <th className="border p-2">At</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a:any)=> (
                <tr key={a.id}>
                  <td className="border p-2">{a.patientName || a.patientId}</td>
                  <td className="border p-2">{a.doctorName || a.doctorId}</td>
                  <td className="border p-2">{a.scheduledAt ? new Date(a.scheduledAt.seconds ? a.scheduledAt.seconds*1000 : a.scheduledAt).toLocaleString() : ''}</td>
                  <td className="border p-2">{a.status}</td>
                  <td className="border p-2"><Link href={`/appointments/${a.id}`} className="mr-2 text-blue-600">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No appointments yet.</p>
        )}
      </div>
    </div>
  );
}
