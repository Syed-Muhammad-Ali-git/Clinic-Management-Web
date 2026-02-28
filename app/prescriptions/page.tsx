'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Link from 'next/link';

export default function PrescriptionsPage() {
  const { loading } = useRequireAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const load = async () => {
      setFetching(true);
      const snap = await getDocs(query(collection(db, 'prescriptions'), orderBy('createdAt', 'desc')));
      const arr: any[] = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setPrescriptions(arr);
      setFetching(false);
    };
    load();
  }, [user?.uid]);

  if (loading || fetching) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-500 text-sm mt-1">{prescriptions.length} total prescriptions</p>
        </div>
        <Link href="/prescriptions/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          ➕ New Prescription
        </Link>
      </div>

      {prescriptions.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prescriptions.map((p: any) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-900">{p.patientId}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : '—'}
                  </div>
                </div>
                {p.pdfUrl && (
                  <a href={p.pdfUrl} target="_blank" rel="noreferrer"
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium transition">
                    📥 PDF
                  </a>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="text-xs font-semibold text-gray-500 mb-1">Notes</div>
                <div className="text-sm text-gray-700">{p.notes || '—'}</div>
              </div>

              {p.meds?.length ? (
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">Medications</div>
                  <div className="space-y-1">
                    {p.meds.map((m: any, i: number) => (
                      <div key={i} className="text-xs text-gray-600 bg-blue-50 rounded px-2 py-1">
                        💊 {m.name} — {m.dose} — {m.frequency}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">💊</p>
          <p className="text-gray-500 text-sm">No prescriptions found</p>
          <Link href="/prescriptions/create" className="mt-4 inline-block text-blue-600 text-sm hover:underline">
            Create first prescription →
          </Link>
        </div>
      )}
    </div>
  );
}
