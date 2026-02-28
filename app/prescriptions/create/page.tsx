'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientsAction } from '@/redux/actions/patient-action/patient-action';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import type { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

type Med = { name: string; dose: string; frequency: string; duration: string };

export default function CreatePrescription() {
  const { loading } = useRequireAuth(['doctor', 'admin']);
  const dispatch = useDispatch() as AppDispatch;
  // Use user profile (has name + role) instead of auth slice (only has uid/email)
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const patients    = useSelector((state: RootState) => state.patient.patients);
  const router = useRouter();

  const [patientId,   setPatientId]   = useState('');
  const [patientName, setPatientName] = useState('');
  const [notes,       setNotes]       = useState('');
  const [meds,        setMeds]        = useState<Med[]>([{ name: '', dose: '', frequency: '', duration: '' }]);
  const [submitting,  setSubmitting]  = useState(false);
  const [pdfUrl,      setPdfUrl]      = useState('');
  const [pdfBase64,   setPdfBase64]   = useState('');
  const [error,       setError]       = useState('');

  // Load patients for dropdown
  useEffect(() => {
    dispatch(fetchPatientsAction()).catch(() => {});
  }, [dispatch]);

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = patients.find((p) => p.id === e.target.value);
    setPatientId(e.target.value);
    setPatientName(selected?.name ?? '');
  };

  const updateMed = (i: number, field: keyof Med, val: string) => {
    setMeds(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
  };

  const addMed    = () => setMeds(prev => [...prev, { name: '', dose: '', frequency: '', duration: '' }]);
  const removeMed = (i: number) => setMeds(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId.trim()) { toast.error('Patient is required.'); return; }
    const emptyMed = meds.find(m => !m.name || !m.dose || !m.frequency);
    if (emptyMed) { toast.error('Fill in all medication fields.'); return; }

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          patientName,
          doctorId:   currentUser?.uid   ?? '',
          doctorName: currentUser?.name  ?? currentUser?.email ?? '',
          meds,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create prescription');
      if (data.pdfUrl)    setPdfUrl(data.pdfUrl);
      if (data.pdfBase64) setPdfBase64(data.pdfBase64);
      toast.success('Prescription created and PDF generated!');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
      toast.error(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/prescriptions" className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 text-sm">
          ← Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Prescription</h1>
          <p className="text-gray-500 text-sm mt-0.5">Fill in details and generate PDF</p>
        </div>
      </div>

      {(pdfUrl || pdfBase64) ? (
        <div className="bg-white rounded-xl border border-green-200 p-8 text-center shadow-sm">
          <p className="text-4xl mb-3">✅</p>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Prescription Created!</h2>
          <p className="text-sm text-gray-500 mb-5">PDF has been generated and is ready to download.</p>
          <div className="flex gap-3 justify-center">
            {pdfUrl ? (
              <a href={pdfUrl} target="_blank" rel="noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                📥 Download PDF
              </a>
            ) : pdfBase64 ? (
              <a
                href={`data:application/pdf;base64,${pdfBase64}`}
                download={`prescription.pdf`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                📥 Download PDF
              </a>
            ) : null}
            <button onClick={() => router.push('/prescriptions')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              View all
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className={labelCls}>Patient <span className="text-red-500">*</span></label>
            {patients.length > 0 ? (
              <select value={patientId} onChange={handlePatientChange} className={inputCls}>
                <option value="">— Select patient —</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}{p.email ? ` (${p.email})` : p.phone ? ` (${p.phone})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div>
                <input
                  required
                  value={patientId}
                  onChange={e => { setPatientId(e.target.value); setPatientName(''); }}
                  placeholder="Enter patient ID"
                  className={inputCls}
                />
                <p className="text-xs text-gray-400 mt-1">No patients loaded — enter patient ID manually</p>
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>Notes / Diagnosis</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Notes about the prescription..."
              className={`${inputCls} resize-none`} />
          </div>

          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Medications <span className="text-red-500">*</span></label>
              <button type="button" onClick={addMed}
                className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
                ➕ Add medication
              </button>
            </div>
            <div className="space-y-3">
              {meds.map((m, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-0.5 block">Medicine name</label>
                      <input value={m.name} onChange={e => updateMed(i, 'name', e.target.value)} required
                        placeholder="e.g. Amoxicillin"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 bg-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-0.5 block">Dose</label>
                      <input value={m.dose} onChange={e => updateMed(i, 'dose', e.target.value)} required
                        placeholder="e.g. 500mg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 bg-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-0.5 block">Frequency</label>
                      <input value={m.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)} required
                        placeholder="e.g. Twice daily"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 bg-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-0.5 block">Duration</label>
                      <input value={m.duration} onChange={e => updateMed(i, 'duration', e.target.value)} required
                        placeholder="e.g. 7 days"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 bg-white" />
                    </div>
                  </div>
                  {meds.length > 1 && (
                    <button type="button" onClick={() => removeMed(i)}
                      className="text-xs text-red-500 hover:text-red-700 transition">
                      ✕ Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating PDF...</>
            ) : '💊 Create & Generate PDF'}
          </button>
        </form>
      )}
    </div>
  );
}
