'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointmentAction } from '@/redux/actions/appointment-action/appointment-action';
import { fetchPatientsAction } from '@/redux/actions/patient-action/patient-action';
import type { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Select a patient'),
  patientName: z.string().min(1, 'Patient name is required'),
  doctorId: z.string().min(1, 'Select a doctor'),
  doctorName: z.string().optional(),
  scheduledAt: z.string().min(1, 'Select a date and time'),
  reason: z.string().min(3, 'Provide a reason (at least 3 characters)'),
  notes: z.string().optional(),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;
type DoctorOption = { uid: string; name: string; email: string };

const inputCls =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white text-gray-900';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const errorCls = 'text-xs text-red-600 mt-1';

export default function CreateAppointment() {
  const { loading } = useRequireAuth(['admin', 'receptionist', 'doctor']);
  const dispatch = useDispatch() as AppDispatch;
  const router = useRouter();
  const patients = useSelector((state: RootState) => state.patient.patients);
  const currentUser = useSelector((state: RootState) => state.user.userData);

  const isDoctor = currentUser?.role === 'doctor';

  const [form, setForm] = useState<AppointmentForm>({
    patientId: '',
    patientName: '',
    doctorId: isDoctor ? (currentUser?.uid ?? '') : '',
    doctorName: isDoctor ? (currentUser?.name ?? '') : '',
    scheduledAt: '',
    reason: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);

  // Fetch patients list
  useEffect(() => {
    dispatch(fetchPatientsAction()).catch(() => {});
  }, [dispatch]);

  // Fetch doctors list (for admin/receptionist)
  useEffect(() => {
    if (isDoctor) return;
    setDoctorsLoading(true);
    getDocs(query(collection(db, 'users'), where('role', '==', 'doctor')))
      .then((snap) => {
        const list: DoctorOption[] = snap.docs.map((d) => {
          const data = d.data();
          return { uid: d.id, name: data.name ?? data.displayName ?? 'Doctor', email: data.email ?? '' };
        });
        setDoctors(list);
      })
      .catch(() => toast.error('Could not load doctors list.'))
      .finally(() => setDoctorsLoading(false));
  }, [isDoctor]);

  // Auto-fill doctor when logged in as doctor
  useEffect(() => {
    if (currentUser?.role === 'doctor') {
      setForm((prev) => ({
        ...prev,
        doctorId: currentUser.uid,
        doctorName: currentUser.name ?? '',
      }));
    }
  }, [currentUser]);

  const set = (field: keyof AppointmentForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = patients.find((p) => p.id === e.target.value);
    setForm((prev) => ({
      ...prev,
      patientId: e.target.value,
      patientName: selected?.name ?? '',
    }));
    setErrors((prev) => ({ ...prev, patientId: undefined }));
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = doctors.find((d) => d.uid === e.target.value);
    setForm((prev) => ({
      ...prev,
      doctorId: e.target.value,
      doctorName: selected?.name ?? '',
    }));
    setErrors((prev) => ({ ...prev, doctorId: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = appointmentSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AppointmentForm, string>> = {};
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const key = issue.path[0] as keyof AppointmentForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        createAppointmentAction({
          ...result.data,
          doctorName: result.data.doctorName ?? '',
          scheduledAt: new Date(result.data.scheduledAt).toISOString(),
        })
      );
      toast.success('Appointment booked successfully!');
      setTimeout(() => router.push('/appointments'), 1200);
    } catch (err: any) {
      const msg = err?.message || 'Failed to book appointment. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/appointments" className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 text-sm">← Back</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-sm text-gray-500 mt-0.5">Schedule a new appointment for a patient</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

        {/* Patient */}
        <div>
          <label className={labelCls}>Patient <span className="text-red-500">*</span></label>
          {patients.length > 0 ? (
            <select value={form.patientId} onChange={handlePatientChange} className={inputCls}>
              <option value="">— Select patient —</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name}{p.email ? ` (${p.email})` : p.phone ? ` (${p.phone})` : ''}</option>
              ))}
            </select>
          ) : (
            <div>
              <input value={form.patientId} onChange={set('patientId')} placeholder="Enter patient ID" className={inputCls} />
              <p className="text-xs text-gray-400 mt-1">No patients loaded — enter patient ID manually</p>
            </div>
          )}
          {errors.patientId && <p className={errorCls}>{errors.patientId}</p>}
        </div>

        {/* Doctor */}
        <div>
          <label className={labelCls}>Doctor <span className="text-red-500">*</span></label>
          {isDoctor ? (
            <input value={form.doctorName || form.doctorId} readOnly className={`${inputCls} bg-gray-50 cursor-not-allowed`} />
          ) : doctorsLoading ? (
            <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-400 bg-white">
              <span className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" /> Loading doctors...
            </div>
          ) : doctors.length > 0 ? (
            <select value={form.doctorId} onChange={handleDoctorChange} className={inputCls}>
              <option value="">— Select doctor —</option>
              {doctors.map((d) => (
                <option key={d.uid} value={d.uid}>{d.name}{d.email ? ` (${d.email})` : ''}</option>
              ))}
            </select>
          ) : (
            <div>
              <input value={form.doctorId} onChange={set('doctorId')} placeholder="Enter doctor UID" className={inputCls} />
              <p className="text-xs text-gray-400 mt-1">No doctors found — enter doctor UID manually</p>
            </div>
          )}
          {errors.doctorId && <p className={errorCls}>{errors.doctorId}</p>}
        </div>

        {/* Date / Time */}
        <div>
          <label className={labelCls}>Date &amp; Time <span className="text-red-500">*</span></label>
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={set('scheduledAt')}
            min={new Date().toISOString().slice(0, 16)}
            className={inputCls}
          />
          {errors.scheduledAt && <p className={errorCls}>{errors.scheduledAt}</p>}
        </div>

        {/* Reason */}
        <div>
          <label className={labelCls}>Reason for Visit <span className="text-red-500">*</span></label>
          <input value={form.reason} onChange={set('reason')} placeholder="e.g. Fever, Follow-up, Annual checkup" className={inputCls} />
          {errors.reason && <p className={errorCls}>{errors.reason}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className={labelCls}>Notes <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea value={form.notes} onChange={set('notes')} rows={2} placeholder="Any additional information..." className={`${inputCls} resize-none`} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Booking...</>
              : 'Book Appointment'}
          </button>
          <Link href="/appointments" className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
