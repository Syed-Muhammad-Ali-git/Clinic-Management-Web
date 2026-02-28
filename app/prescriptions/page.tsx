'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AiModalProps {
  prescription: any;
  onClose: () => void;
}

function AiExplainModal({ prescription, onClose }: AiModalProps) {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prescription }),
        });
        const data = await res.json();
        setExplanation(data.explanation ?? 'No explanation available.');
      } catch {
        setExplanation('Unable to load AI explanation. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [prescription]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h2 className="text-lg font-bold text-gray-900">AI Explanation</h2>
          </div>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            ✕
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-blue-500 mb-1">Patient: {prescription.patientId}</p>
          {prescription.meds?.map((m: any, i: number) => (
            <p key={i} className="text-xs text-blue-700">💊 {m.name} — {m.dose}, {m.frequency}</p>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center gap-3 py-6 justify-center">
            <span className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Generating explanation...</span>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
            {explanation}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          {!loading && (
            <button
              onClick={() => { navigator.clipboard.writeText(explanation); toast.success('Copied to clipboard'); }}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">
              📋 Copy
            </button>
          )}
          <button onClick={onClose}
            className="text-xs px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PrescriptionsPage() {
  const { loading } = useRequireAuth();
  const user = useSelector((state: RootState) => state.auth.loginData);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [aiTarget, setAiTarget] = useState<any | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const load = async () => {
      setFetching(true);
      try {
        const snap = await getDocs(query(collection(db, 'prescriptions'), orderBy('createdAt', 'desc')));
        const arr: any[] = [];
        snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
        setPrescriptions(arr);
      } catch {
        toast.error('Failed to load prescriptions.');
      } finally {
        setFetching(false);
      }
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
      <ToastContainer position="top-right" autoClose={3000} />
      {aiTarget && <AiExplainModal prescription={aiTarget} onClose={() => setAiTarget(null)} />}

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
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-900">{p.patientId}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : '—'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAiTarget(p)}
                    className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 font-medium transition flex items-center gap-1">
                    🤖 AI Explain
                  </button>
                  {p.pdfUrl && (
                    <a href={p.pdfUrl} target="_blank" rel="noreferrer"
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium transition">
                      📥 PDF
                    </a>
                  )}
                </div>
              </div>

              {p.notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="text-xs font-semibold text-gray-500 mb-1">Notes</div>
                  <div className="text-sm text-gray-700">{p.notes}</div>
                </div>
              )}

              {p.meds?.length ? (
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">Medications ({p.meds.length})</div>
                  <div className="space-y-1">
                    {p.meds.map((m: any, i: number) => (
                      <div key={i} className="text-xs text-gray-600 bg-blue-50 rounded px-2 py-1">
                        💊 {m.name} — {m.dose} — {m.frequency}
                        {m.duration && <span className="text-gray-400"> · {m.duration}</span>}
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
