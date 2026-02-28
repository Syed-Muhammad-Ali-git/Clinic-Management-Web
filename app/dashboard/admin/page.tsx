"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "@/redux/actions/patient-action/patient-action";
import { fetchAppointments } from "@/redux/actions/appointment-action/appointment-action";
import type { RootState } from "@/redux/store";
import Link from "next/link";

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}
    >
      {icon}
    </div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const patients = useSelector((state: RootState) => state.patient.patients);
  const appointments = useSelector(
    (state: RootState) => state.appointment.appointments,
  );

  useEffect(() => {
    dispatch<any>(fetchPatients());
    dispatch<any>(fetchAppointments());
  }, [dispatch]);

  const pending = appointments.filter(
    (a: any) => a.status === "pending",
  ).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">System overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="👥"
          label="Total Patients"
          value={patients.length}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon="📅"
          label="Total Appointments"
          value={appointments.length}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon="⏳"
          label="Pending"
          value={pending}
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          icon="✅"
          label="Completed"
          value={
            appointments.filter((a: any) => a.status === "completed").length
          }
          color="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent patients */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Patients</h2>
            <Link
              href="/patients"
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {patients.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Contact</th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 5).map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2.5 font-medium text-gray-900">
                      {p.name}
                    </td>
                    <td className="py-2.5 text-gray-500">{p.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">
              No patients yet
            </p>
          )}
        </div>

        {/* Recent appointments */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Appointments</h2>
            <Link
              href="/appointments"
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {appointments.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b">
                  <th className="pb-2">Patient</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((a: any) => (
                  <tr
                    key={a.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-2.5 font-medium text-gray-900">
                      {a.patientName || a.patientId}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize
                        ${
                          a.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : a.status === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : a.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">
              No appointments yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
