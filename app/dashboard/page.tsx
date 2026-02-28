"use client";

import React from "react";
import useRequireAuth from "@/lib/hooks/useRequireAuth";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Text } from "@mantine/core";
import AdminDashboard from "./admin/page";
import DoctorDashboard from "./doctor/page";
import ReceptionistDashboard from "./receptionist/page";
import PatientDashboard from "./patient/page";

export default function DashboardPage() {
  const { loading } = useRequireAuth();
  const userProfile = useSelector((state: RootState) => state.user.userData);
  const role = userProfile?.role || null;

  // If still loading (auth or user data), show spinner
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
        <Text color="gray.5" fw={500}>
          Securing your session...
        </Text>
      </div>
    );

  // Fallback: If no role is found after loading, default to patient or redirect
  // For a management system, defaulting to patient is safer than an infinite spinner
  const finalRole = role || "patient";

  if (finalRole === "admin") return <AdminDashboard />;
  if (finalRole === "doctor") return <DoctorDashboard />;
  if (finalRole === "receptionist") return <ReceptionistDashboard />;
  return <PatientDashboard />;
}
