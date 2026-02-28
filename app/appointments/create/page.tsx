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

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Select a patient'),
  patientName: z.string().min(1, 'Patient name is required'),
  doctorId: z.string().min(1, 'Doctor ID is required'),
  doctorName: z.string().optional(),
  scheduledAt: z.string().min(1, 'Select a date and time'),
  reason: z.string().min(3, 'Provide a reason (at least 3 characters)'),
  notes: z.string().optional(),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

const inputCls =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const errorCls = 'text-xs text-red-600 mt-1';

export default function CreateAppointment() {
  const { loading } = useRequireAuth(['admin', 'receptionist', 'doctor']);
  const dispatch = useDispatch() as AppDispatch;
  const router = useRouter();
  const patients = useSelector((state: RootState) => state.patient.patients);
  const currentUser = useSelector((state: RootState) => state.user.userData);

  const [form, setForm] = useState<AppointmentForm>({
    patientId: '',
    patientName: '',
    doctorId: currentUser?.uid ?? '',
    doctorName: currentUser?.name ?? '',
    scheduledAt: '',
    reason: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPatientsAction());
  }, [dispatch]);

  // Auto-fill doctor fields if current user is a doctor
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

  // When patient dropdown changes, also update patientName
  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = patients.find((p) => p.id === e.target.value);
    setForm((prev) => ({
      ...prev,
      patientId: e.target.value,
      patientName: selected?.name ?? '',
    }));
    setErrors((prev) => ({ ...prev, patientId: undefined }));
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
    } catch {
      toast.error('Failed to book appointment. Please try again.');
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
        <Link href="/appointments" className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500">← Back</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-sm text-gray-500 mt-0.5">Schedule a new appointment for a patient</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        {/* Patient select */}
        <div>
          <label className={labelCls}>Patient <span className="text-red-500">*</span></label>
          {patients.length > 0 ? (
            <select value={form.patientId} onChange={handlePatientChange} className={inputCls}>
              <option value="">— Select patient —</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.email || p.phone})</option>
              ))}
            </select>
          ) : (
            <input
              value={form.patientId}
              onChange={set('patientId')}
              placeholder="Enter patient ID"
              className={inputCls}
            />
          )}
          {errors.patientId && <p className={errorCls}>{errors.patientId}</p>}
        </div>

        {/* Doctor ID + Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Doctor ID <span className="text-red-500">*</span></label>
            <input
              value={form.doctorId}
              onChange={set('doctorId')}
              placeholder="doctor-uid"
              className={inputCls}
              readOnly={currentUser?.role === 'doctor'}
            />
            {errors.doctorId && <p className={errorCls}>{errors.doctorId}</p>}
          </div>
          <div>
            <label className={labelCls}>Doctor Name</label>
            <input
              value={form.doctorName}
              onChange={set('doctorName')}
              placeholder="Dr. Smith"
              className={inputCls}
            />
          </div>
        </div>

        {/* Date / Time */}
        <div>
          <label className={labelCls}>Scheduled At <span className="text-red-500">*</span></label>
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
          <input
            value={form.reason}
            onChange={set('reason')}
            placeholder="e.g. Fever, Follow-up, Annual checkup"
            className={inputCls}
          />
          {errors.reason && <p className={errorCls}>{errors.reason}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className={labelCls}>Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={set('notes')}
            rows={2}
            placeholder="Any additional information..."
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Booking...</>
            ) : '📅 Book Appointment'}
          </button>
          <Link href="/appointments"
            className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
