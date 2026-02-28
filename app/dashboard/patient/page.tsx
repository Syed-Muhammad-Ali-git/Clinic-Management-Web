"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointmentsAction } from "@/redux/actions/appointment-action/appointment-action";
import type { AppDispatch, RootState } from "@/redux/store";
import type { Appointment } from "@/app/types/appointment";
import Link from "next/link";

export default function PatientDashboard() {
  const dispatch = useDispatch() as AppDispatch;
  const user = useSelector((state: RootState) => state.auth.loginData);
  const appointments = useSelector(
    (state: RootState) => state.appointment.appointments,
  );

  useEffect(() => {
    if (user?.uid) dispatch(fetchAppointmentsAction({ patientId: user.uid }));
  }, [dispatch, user?.uid]);

  const upcoming = appointments.filter(
    (a: Appointment) => a.status !== "completed" && a.status !== "cancelled",
  );
  const completed = appointments.filter(
    (a: Appointment) => a.status === "completed",
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Health Portal</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome, {user?.displayName || user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
            📅
          </div>
          <div>
            <div className="text-sm text-gray-500">Upcoming Appointments</div>
            <div className="text-2xl font-bold">{upcoming.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
            ✅
          </div>
          <div>
            <div className="text-sm text-gray-500">Completed Visits</div>
            <div className="text-2xl font-bold">{completed.length}</div>
          </div>
        </div>
      </div>

      {/* Quick book */}
      <div className="flex gap-3 mb-6">
        <Link
          href="/appointments/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          📅 Book Appointment
        </Link>
        <Link
          href="/prescriptions"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          💊 My Prescriptions
        </Link>
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">
          Upcoming Appointments
        </h2>
        {upcoming.length ? (
          <div className="space-y-3">
            {upcoming.map((a: Appointment) => {
              const t = a.scheduledAt?.seconds
                ? new Date(a.scheduledAt.seconds * 1000)
                : a.scheduledAt
                  ? new Date(a.scheduledAt)
                  : null;
              return (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-sm text-gray-900">
                      Dr. {a.doctorId}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t ? t.toLocaleString() : "—"}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize
                    ${a.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {a.status}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-sm">No upcoming appointments</p>
            <Link
              href="/appointments/create"
              className="mt-3 inline-block text-blue-600 text-sm hover:underline"
            >
              Book one →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
