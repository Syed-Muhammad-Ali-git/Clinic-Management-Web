'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPatientAction } from '@/redux/actions/patient-action/patient-action';
import type { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import Link from 'next/link';

const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  phone: z.string().min(7, 'Phone number is too short').max(20, 'Phone number is too long'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], { error: 'Select a gender' }),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  medicalHistory: z.string().optional(),
});

type PatientForm = z.infer<typeof patientSchema>;

const inputCls =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const errorCls = 'text-xs text-red-600 mt-1';

export default function CreatePatient() {
  const { loading } = useRequireAuth(['admin', 'receptionist']);
  const dispatch = useDispatch() as AppDispatch;
  const router = useRouter();

  const [form, setForm] = useState<PatientForm>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'other',
    address: '',
    bloodGroup: '',
    medicalHistory: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PatientForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof PatientForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = patientSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof PatientForm, string>> = {};
      result.error.issues.forEach((issue: z.ZodIssue) => {
        const key = issue.path[0] as keyof PatientForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(createPatientAction(result.data));
      toast.success('Patient created successfully!');
      setTimeout(() => router.push('/patients'), 1200);
    } catch {
      toast.error('Failed to create patient. Please try again.');
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
        <Link href="/patients" className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500">← Back</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Patient</h1>
          <p className="text-sm text-gray-500 mt-0.5">Register a new patient record</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={set('name')} placeholder="Jane Doe" className={inputCls} />
            {errors.name && <p className={errorCls}>{errors.name}</p>}
          </div>
          <div>
            <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com" className={inputCls} />
            {errors.email && <p className={errorCls}>{errors.email}</p>}
          </div>
        </div>

        {/* Phone + DOB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
            <input value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" className={inputCls} />
            {errors.phone && <p className={errorCls}>{errors.phone}</p>}
          </div>
          <div>
            <label className={labelCls}>Date of Birth <span className="text-red-500">*</span></label>
            <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} className={inputCls} />
            {errors.dateOfBirth && <p className={errorCls}>{errors.dateOfBirth}</p>}
          </div>
        </div>

        {/* Gender + Blood Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Gender <span className="text-red-500">*</span></label>
            <select value={form.gender} onChange={set('gender')} className={inputCls}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
            {errors.gender && <p className={errorCls}>{errors.gender}</p>}
          </div>
          <div>
            <label className={labelCls}>Blood Group</label>
            <select value={form.bloodGroup} onChange={set('bloodGroup')} className={inputCls}>
              <option value="">— Select —</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className={labelCls}>Address</label>
          <input value={form.address} onChange={set('address')} placeholder="123 Main St, City" className={inputCls} />
        </div>

        {/* Medical History */}
        <div>
          <label className={labelCls}>Medical History / Allergies</label>
          <textarea
            value={form.medicalHistory}
            onChange={set('medicalHistory')}
            rows={3}
            placeholder="List any known conditions, allergies, or past illnesses..."
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
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
            ) : '👤 Create Patient'}
          </button>
          <Link href="/patients"
            className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
