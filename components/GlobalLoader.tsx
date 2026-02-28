"use client";

import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

/**
 * Global loading overlay — appears whenever ANY redux slice is in loading state.
 * Shows a slim progress bar at the top + a subtle backdrop.
 */
export default function GlobalLoader() {
  const authLoading = useSelector((state: RootState) => state.auth.loading);
  const userLoading = useSelector((state: RootState) => state.user.loading);
  const patientLoading = useSelector((state: RootState) => state.patient.loading);
  const appointmentLoading = useSelector(
    (state: RootState) => state.appointment.loading
  );
  const prescriptionLoading = useSelector(
    (state: RootState) => state.prescription.loading
  );

  const isLoading =
    authLoading ||
    userLoading ||
    patientLoading ||
    appointmentLoading ||
    prescriptionLoading;

  if (!isLoading) return null;

  return (
    <>
      {/* Top progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          zIndex: 9999,
          background: "linear-gradient(90deg, #06b6d4, #3b82f6, #06b6d4)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.2s infinite linear",
        }}
      />

      {/* Inline keyframes */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </>
  );
}
