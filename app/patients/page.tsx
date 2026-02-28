'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients } from '@/redux/actions/patient-action/patient-action';
import type { RootState } from '@/redux/store';
import Link from 'next/link';
import useRequireAuth from '@/lib/hooks/useRequireAuth';

export default function PatientsList() {
  const { loading } = useRequireAuth();
  const dispatch = useDispatch();
  const patients = useSelector((state: RootState) => state.patient.patients);

  useEffect(() => { dispatch<any>(fetchPatients()); }, [dispatch]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <Link href="/patients/create" className="px-4 py-2 bg-green-600 text-white rounded">Add Patient</Link>
      </div>
      <div className="mt-6">
        {patients?.length ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th className="border p-2">Name</th>
                <th className="border p-2">DOB</th>
                <th className="border p-2">Contact</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p:any)=> (
                <tr key={p.id}>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">{p.dob}</td>
                  <td className="border p-2">{p.contact}</td>
                  <td className="border p-2"><Link href={`/patients/${p.id}`} className="mr-2 text-blue-600">View</Link><Link href={`/patients/${p.id}/edit`} className="text-orange-600">Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No patients yet.</p>
        )}
      </div>
    </div>
  );
}
