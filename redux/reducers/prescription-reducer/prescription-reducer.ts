// Prescription reducer - manages prescriptions list and individual prescription detail

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Prescription, PrescriptionState } from '@/app/types/prescription';

const initialState: PrescriptionState = {
  prescriptions: [],
  currentPrescription: null,
  loading: false,
  error: null,
};

const prescriptionSlice = createSlice({
  name: 'prescription',
  initialState,
  reducers: {
    /** Replace the full prescriptions list after fetch */
    setPrescriptions: (state, action: PayloadAction<Prescription[]>) => {
      state.prescriptions = action.payload;
      state.loading = false;
      state.error = null;
    },
    /** Set a single prescription for view operations */
    setCurrentPrescription: (state, action: PayloadAction<Prescription>) => {
      state.currentPrescription = action.payload;
      state.loading = false;
    },
    /** Clear the currently viewed prescription */
    clearCurrentPrescription: (state) => {
      state.currentPrescription = null;
    },
    setPrescriptionLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPrescriptionError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setPrescriptions,
  setCurrentPrescription,
  clearCurrentPrescription,
  setPrescriptionLoading,
  setPrescriptionError,
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;
