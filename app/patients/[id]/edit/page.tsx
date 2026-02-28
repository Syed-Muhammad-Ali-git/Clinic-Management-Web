'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientAction, updatePatientAction } from '@/redux/actions/patient-action/patient-action';
import { useRouter, useParams } from 'next/navigation';
import type { AppDispatch, RootState } from '@/redux/store';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';

const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export default function EditPatient() {
  const { loading } = useRequireAuth(['admin', 'receptionist']);
  const dispatch    = useDispatch() as AppDispatch;
  const params      = useParams();
  const id          = params?.id as string;
  const router      = useRouter();

  const patient   = useSelector((state: RootState) => state.patient.currentPatient);
  const isLoading = useSelector((state: RootState) => state.patient.loading);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', dateOfBirth: '',
    gender: 'other', address: '', bloodGroup: '', medicalHistory: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) dispatch(getPatientAction(id)).catch(() => toast.error('Failed to load patient.'));
  }, [dispatch, id]);

  useEffect(() => {
    if (patient) {
      const p = patient as any;
      setForm({
        name:           p.name           || '',
        email:          p.email          || '',
        phone:          p.phone          || p.contact || '',
        dateOfBirth:    p.dateOfBirth    || p.dob     || '',
        gender:         p.gender         || 'other',
        address:        p.address        || '',
        bloodGroup:     p.bloodGroup     || '',
        medicalHistory: p.medicalHistory || '',
      });
    }
  }, [patient]);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required.'); return; }
    setSubmitting(true);
    try {
      await dispatch(updatePatientAction(id, form as any));
      toast.success('Patient updated successfully!');
      router.push(`/patients/${id}`);
    } catch {
      toast.error('Failed to update patient. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || (isLoading && !patient)) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/patients/${id}`} className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 text-sm">← Back</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Patient</h1>
          <p className="text-sm text-gray-500 mt-0.5">{patient?.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={set('name')} placeholder="Jane Doe" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="jane@example.com" className={inputCls} />
          </div>
        </div>

        {/* Phone + DOB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Phone Number</label>
            <input value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Date of Birth</label>
            <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} className={inputCls} />
          </div>
        </div>

        {/* Gender + Blood Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Gender</label>
            <select value={form.gender} onChange={set('gender')} className={inputCls}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
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
            placeholder="List any known conditions, allergies..."
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
            ) : '✓ Save Changes'}
          </button>
          <Link href={`/patients/${id}`}
            className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

