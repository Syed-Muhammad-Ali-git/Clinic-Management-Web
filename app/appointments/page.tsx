"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointmentsAction,
  deleteAppointmentAction,
  updateAppointmentAction,
} from "@/redux/actions/appointment-action/appointment-action";
import type { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import useRequireAuth from "@/lib/hooks/useRequireAuth";
import { toast } from "react-toastify";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  confirmed: "bg-green-50  text-green-700  border border-green-200",
  completed: "bg-blue-50   text-blue-700   border border-blue-200",
  cancelled: "bg-red-50    text-red-700    border border-red-200",
};

export default function AppointmentsList() {
  const { loading } = useRequireAuth();
  const dispatch = useDispatch() as AppDispatch;

  const appointments = useSelector(
    (state: RootState) => state.appointment.appointments,
  );
  const isLoading = useSelector(
    (state: RootState) => state.appointment.loading,
  );
  const userRole = useSelector((state: RootState) => state.user.userData?.role);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAppointmentsAction()).catch(() =>
      toast.error("Failed to load appointments."),
    );
  }, [dispatch]);

  const filtered = useMemo(() => {
    let list = [...(appointments ?? [])];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          (a as any).patientName?.toLowerCase().includes(q) ||
          (a as any).doctorName?.toLowerCase().includes(q) ||
          (a as any).reason?.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all")
      list = list.filter((a) => a.status === statusFilter);
    return list;
  }, [appointments, search, statusFilter]);

  const handleDelete = async (id: string, patientName: string) => {
    if (
      !confirm(
        `Delete appointment for "${patientName}"? This cannot be undone.`,
      )
    )
      return;
    setDeleting(id);
    try {
      await dispatch(deleteAppointmentAction(id));
      toast.success(`Appointment deleted successfully.`);
    } catch {
      toast.error("Failed to delete appointment.");
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await dispatch(updateAppointmentAction(id, { status } as any));
      toast.success(`Status updated to "${status}".`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (val: any) => {
    if (!val) return "—";
    const ms = val?.seconds
      ? val.seconds * 1000
      : typeof val === "string"
        ? Date.parse(val)
        : val;
    return new Date(ms).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canManage =
    userRole === "admin" ||
    userRole === "receptionist" ||
    userRole === "doctor";

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
      </div>
    );

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {(appointments ?? []).length} appointment
            {(appointments ?? []).length !== 1 ? "s" : ""} total
          </p>
        </div>
        {canManage && (
          <Link
            href="/appointments/create"
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            📅 Book Appointment
          </Link>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient, doctor or reason..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500 bg-white"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <span className="w-6 h-6 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-medium">No appointments found</p>
          <p className="text-sm mt-1">
            {search
              ? "Try a different search term."
              : "No appointments scheduled yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Patient
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Doctor
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Date & Time
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Reason
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((a: any) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-xs font-bold">
                          {(a.patientName ||
                            a.patientId ||
                            "?")[0].toUpperCase()}
                        </span>
                        {a.patientName || a.patientId || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.doctorName || a.doctorId || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {formatDate(a.scheduledAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">
                      {a.reason || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {canManage ? (
                        <div className="relative inline-flex items-center">
                          <select
                            value={a.status}
                            disabled={updating === a.id}
                            onChange={(e) =>
                              handleStatusChange(a.id, e.target.value)
                            }
                            className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-200 pr-5 ${STATUS_COLORS[a.status] || "bg-gray-100 text-gray-600 border border-gray-200"}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {updating === a.id && (
                            <span className="absolute -right-4 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-cyan-300 border-t-cyan-600 rounded-full animate-spin" />
                          )}
                        </div>
                      ) : (
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[a.status] || "bg-gray-100 text-gray-600 border border-gray-200"}`}
                        >
                          {a.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/appointments/${a.id}`}
                          className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                        >
                          View
                        </Link>
                        {canManage && (
                          <button
                            onClick={() =>
                              handleDelete(
                                a.id,
                                a.patientName || a.patientId || "this patient",
                              )
                            }
                            disabled={deleting === a.id}
                            className="text-xs px-2.5 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                          >
                            {deleting === a.id ? "..." : "Delete"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {(appointments ?? []).length}{" "}
            appointments
          </div>
        </div>
      )}
    </div>
  );
}
