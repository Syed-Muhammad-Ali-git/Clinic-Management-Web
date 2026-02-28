'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointment } from '@/redux/actions/appointment-action/appointment-action';
import { useRouter, useParams } from 'next/navigation';
import type { RootState } from '@/redux/store';
import useRequireAuth from '@/lib/hooks/useRequireAuth';

export default function AppointmentView() {
  const { loading } = useRequireAuth();
  const dispatch = useDispatch();
  const params = useParams();
  const id = params?.id as string;
  const appointment = useSelector((state: RootState) => state.appointment.current);

  useEffect(() => { if (id) dispatch<any>(getAppointment(id)); }, [dispatch, id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!appointment) return <div className="p-8">Appointment not found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Appointment</h1>
      <div className="mt-4">
        <p><strong>Patient:</strong> {appointment.patientName || appointment.patientId}</p>
        <p><strong>Doctor:</strong> {appointment.doctorName || appointment.doctorId}</p>
        <p><strong>When:</strong> {appointment.scheduledAt ? new Date(appointment.scheduledAt.seconds ? appointment.scheduledAt.seconds*1000 : appointment.scheduledAt).toLocaleString() : ''}</p>
        <p><strong>Status:</strong> {appointment.status}</p>
      </div>
    </div>
  );
}
