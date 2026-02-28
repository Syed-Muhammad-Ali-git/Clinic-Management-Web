'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientsAction, deletePatientAction } from '@/redux/actions/patient-action/patient-action';
import type { AppDispatch, RootState } from '@/redux/store';
import Link from 'next/link';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { Patient } from '@/app/types/patient';

export default function PatientsList() {
  const { loading } = useRequireAuth();
  const dispatch = useDispatch() as AppDispatch;
  const patients = useSelector((state: RootState) => state.patient.patients);
  const userRole = useSelector((state: RootState) => state.user.userData?.role);
  const isLoading = useSelector((state: RootState) => state.patient.loading);

  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'other'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPatientsAction());
  }, [dispatch]);

  const filtered = useMemo(() => {
    let list: Patient[] = [...patients];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q) ||
          p.phone?.toLowerCase().includes(q)
      );
    }
    if (genderFilter !== 'all') {
      list = list.filter((p) => p.gender === genderFilter);
    }
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

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500 mt-0.5">{patients.length} patient{patients.length !== 1 ? 's' : ''} registered</p>
        </div>
        {(userRole === 'admin' || userRole === 'receptionist') && (
          <Link href="/patients/create"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
            ➕ New Patient
          </Link>
        )}
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value as typeof genderFilter)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white">
          <option value="all">All genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <span className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No patients found</p>
          <p className="text-sm mt-1">{search ? 'Try a different search term.' : 'No patients registered yet.'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">DOB</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Gender</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Blood</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p: Patient) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          {p.name?.[0]?.toUpperCase() ?? '?'}
                        </span>
                        {p.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{p.phone || (p as any).contact || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{p.dateOfBirth || (p as any).dob || '—'}</td>
                    <td className="px-4 py-3">
                      {p.gender ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${
                          p.gender === 'male' ? 'bg-blue-50 text-blue-600' :
                          p.gender === 'female' ? 'bg-pink-50 text-pink-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>{p.gender}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.bloodGroup ? (
                        <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium">{p.bloodGroup}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/patients/${p.id}`}
                          className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                          View
                        </Link>
                        <Link href={`/patients/${p.id}/history`}
                          className="text-xs px-2.5 py-1.5 border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 transition">
                          History
                        </Link>
                        {(userRole === 'admin' || userRole === 'receptionist') && (
                          <>
                            <Link href={`/patients/${p.id}/edit`}
                              className="text-xs px-2.5 py-1.5 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 transition">
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(p)}
                              disabled={deleting === p.id}
                              className="text-xs px-2.5 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition disabled:opacity-50">
                              {deleting === p.id ? '...' : 'Delete'}
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
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {patients.length} patients
          </div>
        </div>
      )}
    </div>
  );
}
