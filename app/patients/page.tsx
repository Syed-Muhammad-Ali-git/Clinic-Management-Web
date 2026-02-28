'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientsAction, deletePatientAction } from '@/redux/actions/patient-action/patient-action';
import type { AppDispatch, RootState } from '@/redux/store';
import Link from 'next/link';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import { toast } from 'react-toastify';
import type { Patient } from '@/app/types/patient';

const GENDER_COLORS: Record<string, string> = {
  male:   'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  female: 'bg-pink-50 text-pink-700 ring-1 ring-pink-200',
  other:  'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
};

const BLOOD_COLORS: Record<string, string> = {
  'A+': 'bg-red-50 text-red-700', 'A-': 'bg-red-50 text-red-700',
  'B+': 'bg-orange-50 text-orange-700', 'B-': 'bg-orange-50 text-orange-700',
  'O+': 'bg-purple-50 text-purple-700', 'O-': 'bg-purple-50 text-purple-700',
  'AB+': 'bg-indigo-50 text-indigo-700', 'AB-': 'bg-indigo-50 text-indigo-700',
};

export default function PatientsList() {
  const { loading } = useRequireAuth();
  const dispatch = useDispatch() as AppDispatch;
  const patients  = useSelector((state: RootState) => state.patient.patients);
  const userRole  = useSelector((state: RootState) => state.user.userData?.role);
  const isLoading = useSelector((state: RootState) => state.patient.loading);

  const [search,       setSearch]       = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'other'>('all');
  const [deleting,     setDeleting]     = useState<string | null>(null);

  const canManage = userRole === 'admin' || userRole === 'receptionist';

  useEffect(() => {
    dispatch(fetchPatientsAction()).catch(() => toast.error('Failed to load patients.'));
  }, [dispatch]);

  const filtered = useMemo(() => {
    let list: Patient[] = [...patients];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q) ||
          p.phone?.toLowerCase().includes(q),
      );
    }
    if (genderFilter !== 'all') list = list.filter((p) => p.gender === genderFilter);
    return list;
  }, [patients, search, genderFilter]);

  const handleDelete = async (p: Patient) => {
    if (!confirm(`Delete patient "${p.name}"? This cannot be undone.`)) return;
    setDeleting(p.id);
    try {
      await dispatch(deletePatientAction(p.id));
      toast.success(`Patient "${p.name}" deleted.`);
    } catch {
      toast.error('Failed to delete patient.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  const maleCount   = patients.filter((p) => p.gender === 'male').length;
  const femaleCount = patients.filter((p) => p.gender === 'female').length;

  return (
    <div className="space-y-5">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patients</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and view all registered patients
          </p>
        </div>
        {canManage && (
          <Link
            href="/patients/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-200 transition-all"
          >
            <span className="text-base leading-none">+</span> New Patient
          </Link>
        )}
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',   value: patients.length,  color: 'bg-blue-600',   light: 'bg-blue-50',   text: 'text-blue-700' },
          { label: 'Male',    value: maleCount,        color: 'bg-sky-500',    light: 'bg-sky-50',    text: 'text-sky-700' },
          { label: 'Female',  value: femaleCount,      color: 'bg-pink-500',   light: 'bg-pink-50',   text: 'text-pink-700' },
          { label: 'Showing', value: filtered.length,  color: 'bg-violet-600', light: 'bg-violet-50', text: 'text-violet-700' },
        ].map((s) => (
          <div key={s.label} className={`${s.light} rounded-xl px-4 py-3 flex items-center justify-between`}>
            <span className={`text-xs font-semibold uppercase tracking-wide ${s.text}`}>{s.label}</span>
            <span className={`text-xl font-bold ${s.text}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white transition"
          />
        </div>
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value as typeof genderFilter)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-400 bg-white min-w-[140px]"
        >
          <option value="all">All genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48 bg-white rounded-2xl border border-gray-200">
          <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4 text-2xl">👤</div>
          <p className="font-semibold text-gray-700">No patients found</p>
          <p className="text-sm text-gray-400 mt-1">
            {search ? 'Try a different search term.' : 'No patients registered yet.'}
          </p>
          {canManage && !search && (
            <Link href="/patients/create"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium">
              + Add First Patient
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Patient</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Contact</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Date of Birth</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Gender</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Blood</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p: Patient) => (
                  <tr key={p.id} className="hover:bg-blue-50/40 transition-colors group">
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                          {p.name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                          <p className="text-xs text-gray-400 truncate">{p.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-4 py-4">
                      <p className="text-gray-700">{p.phone || (p as any).contact || '—'}</p>
                    </td>
                    {/* DOB */}
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                      {p.dateOfBirth || (p as any).dob || '—'}
                    </td>
                    {/* Gender */}
                    <td className="px-4 py-4">
                      {p.gender ? (
                        <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-lg capitalize font-semibold ${GENDER_COLORS[p.gender] ?? GENDER_COLORS.other}`}>
                          {p.gender}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    {/* Blood */}
                    <td className="px-4 py-4">
                      {p.bloodGroup ? (
                        <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-lg font-bold ${BLOOD_COLORS[p.bloodGroup] ?? 'bg-red-50 text-red-700'}`}>
                          {p.bloodGroup}
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/patients/${p.id}`}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition whitespace-nowrap">
                          View
                        </Link>
                        <Link href={`/patients/${p.id}/history`}
                          className="px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition whitespace-nowrap">
                          History
                        </Link>
                        {canManage && (
                          <>
                            <Link href={`/patients/${p.id}/edit`}
                              className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition whitespace-nowrap">
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(p)}
                              disabled={deleting === p.id}
                              className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50 whitespace-nowrap">
                              {deleting === p.id ? (
                                <span className="inline-flex items-center gap-1">
                                  <span className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                                </span>
                              ) : 'Delete'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{patients.length}</span> patients
            </p>
            {search && filtered.length !== patients.length && (
              <button onClick={() => setSearch('')} className="text-xs text-blue-600 hover:underline">
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
