'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { getPatientAction } from '@/redux/actions/patient-action/patient-action';
import { fetchAppointmentsAction } from '@/redux/actions/appointment-action/appointment-action';
import type { Appointment, AppointmentStatus } from '@/app/types/appointment';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import Link from 'next/link';

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const STATUS_DOT: Record<AppointmentStatus, string> = {
  pending: 'bg-yellow-400',
  confirmed: 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-400',
};

function formatDate(val: string | { seconds: number } | undefined): string {
  if (!val) return '—';
  if (typeof val === 'object' && 'seconds' in val) {
    return new Date(val.seconds * 1000).toLocaleString();
  }
  return new Date(val).toLocaleString();
}

export default function PatientHistory() {
  const { loading } = useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch() as AppDispatch;
  const router = useRouter();

  const patient = useSelector((state: RootState) => state.patient.currentPatient);
  const allAppointments = useSelector((state: RootState) => state.appointment.appointments);

  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');

  useEffect(() => {
    if (id) {
      dispatch(getPatientAction(id));
      dispatch(fetchAppointmentsAction({ patientId: id }));
    }
  }, [dispatch, id]);

  const appointments: Appointment[] = allAppointments
    .filter((a) => a.patientId === id)
    .sort((a, b) => {
      const toMs = (v: string | { seconds: number }) =>
        typeof v === 'object' && 'seconds' in v ? v.seconds * 1000 : new Date(v as string).getTime();
      return toMs((b.scheduledAt as any)) - toMs((a.scheduledAt as any));
    });

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500">
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient History</h1>
          {patient && (
            <p className="text-sm text-gray-500 mt-0.5">
              {patient.name} · {(patient as any).dateOfBirth || (patient as any).dob || '—'} · {patient.phone || (patient as any).contact || '—'}
            </p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
          {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => {
          const count = appointments.filter((a) => a.status === s).length;
          return (
            <div key={s} className={`rounded-xl border p-3 text-center ${STATUS_STYLES[s]}`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs capitalize mt-0.5">{s}</p>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
              filter === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}>
            {s === 'all' ? `All (${appointments.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${appointments.filter(a => a.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">No appointments found</p>
          <p className="text-sm mt-1">
            {filter !== 'all' ? `No ${filter} appointments.` : 'This patient has no appointment history yet.'}
          </p>
          <Link href="/appointments/create"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Book appointment
          </Link>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-4 pl-12">
            {filtered.map((appt) => (
              <div key={appt.id} className="relative bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
                {/* Dot on timeline */}
                <span className={`absolute -left-8 top-5 w-3 h-3 rounded-full border-2 border-white ${STATUS_DOT[appt.status]}`} />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_STYLES[appt.status]}`}>
                        {appt.status}
                      </span>
                      <span className="text-sm font-medium text-gray-800 truncate">
                        Dr. {appt.doctorName || appt.doctorId}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(appt.scheduledAt as any)}</p>
                    {appt.reason && (
                      <p className="text-sm text-gray-700 mt-2 bg-gray-50 rounded-lg p-2 border border-gray-100">
                        {appt.reason}
                      </p>
                    )}
                    {appt.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">Notes: {appt.notes}</p>
                    )}
                  </div>
                  <Link href={`/appointments/${appt.id}`}
                    className="shrink-0 text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
