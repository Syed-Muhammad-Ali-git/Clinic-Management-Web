'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentAction, updateAppointmentAction, deleteAppointmentAction } from '@/redux/actions/appointment-action/appointment-action';
import { useRouter, useParams } from 'next/navigation';
import type { AppDispatch, RootState } from '@/redux/store';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100  text-green-800',
  completed: 'bg-blue-100   text-blue-800',
  cancelled: 'bg-red-100    text-red-800',
};

export default function AppointmentView() {
  const { loading } = useRequireAuth();
  const dispatch    = useDispatch() as AppDispatch;
  const router      = useRouter();
  const params      = useParams();
  const id          = params?.id as string;

  const appointment = useSelector((state: RootState) => state.appointment.currentAppointment);
  const isLoading   = useSelector((state: RootState) => state.appointment.loading);
  const userRole    = useSelector((state: RootState) => state.user.userData?.role);

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) dispatch(getAppointmentAction(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (appointment?.status) setNewStatus(appointment.status);
  }, [appointment]);

  const formatDate = (val: any) => {
    if (!val) return '—';
    const ms = val?.seconds ? val.seconds * 1000 : typeof val === 'string' ? Date.parse(val) : val;
    return new Date(ms).toLocaleString('en-US', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const handleStatusUpdate = async () => {
    if (!id || !newStatus) return;
    setUpdating(true);
    try {
      await dispatch(updateAppointmentAction(id, { status: newStatus } as any));
      toast.success(`Status updated to "${newStatus}".`);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this appointment? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await dispatch(deleteAppointmentAction(id));
      toast.success('Appointment deleted.');
      router.push('/appointments');
    } catch {
      toast.error('Failed to delete appointment.');
      setDeleting(false);
    }
  };

  const canManage = userRole === 'admin' || userRole === 'receptionist' || userRole === 'doctor';

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setDownloadingPdf(true);
    try {
      const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth  = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth   = pageWidth - 20;  // 10 mm margin each side
      const imgHeight  = (canvas.height * imgWidth) / canvas.width;
      const y = imgHeight < pageHeight ? (pageHeight - imgHeight) / 2 : 10;
      pdf.addImage(imgData, 'PNG', 10, y > 10 ? 10 : y, imgWidth, imgHeight);
      pdf.save(`appointment-${id}.pdf`);
    } catch {
      toast.error('Failed to generate PDF.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading || isLoading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
    </div>
  );

  if (!appointment) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-5xl mb-4">📅</p>
      <p className="font-medium text-lg">Appointment not found.</p>
      <Link href="/appointments" className="mt-4 inline-block text-cyan-600 text-sm hover:underline">
        ← Back to Appointments
      </Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/appointments" className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 text-sm">
          ← Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
          <p className="text-sm text-gray-500 mt-0.5">ID: {id}</p>
        </div>
        {/* PDF Download — always visible */}
        <button
          onClick={handleDownloadPDF}
          disabled={downloadingPdf}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {downloadingPdf
            ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</>
            : '⬇ Download PDF'}
        </button>
      </div>

      <div ref={pdfRef} className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {/* ── Status badge ── */}
        <div className="px-6 py-4 flex items-center justify-between">
          <span className={`text-sm px-3 py-1 rounded-full font-semibold capitalize ${STATUS_COLORS[(appointment as any).status] || 'bg-gray-100 text-gray-600'}`}>
            {(appointment as any).status}
          </span>
          <span className="text-xs text-gray-400">{formatDate((appointment as any).scheduledAt)}</span>
        </div>

        {/* ── Info ── */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Patient</p>
            <p className="text-sm font-medium text-gray-900">
              {(appointment as any).patientName || (appointment as any).patientId || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Doctor</p>
            <p className="text-sm font-medium text-gray-900">
              {(appointment as any).doctorName || (appointment as any).doctorId || '—'}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Reason for Visit</p>
            <p className="text-sm text-gray-700">{(appointment as any).reason || '—'}</p>
          </div>
          {(appointment as any).notes && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{(appointment as any).notes}</p>
            </div>
          )}
        </div>

        {/* ── Actions (admin/doctor/receptionist only) ── */}
        {canManage && (
          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Update Status</p>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 bg-white"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === (appointment as any).status}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
              >
                {updating ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
                ) : '✓ Save Status'}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="ml-auto px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : '🗑 Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
