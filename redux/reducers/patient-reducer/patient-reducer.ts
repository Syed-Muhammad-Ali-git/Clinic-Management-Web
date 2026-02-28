// Patient reducer - manages patients list and individual patient detail

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Patient, PatientState } from '@/app/types/patient';

const initialState: PatientState = {
  patients: [],
  currentPatient: null,
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    /** Replace the full patients list after fetch */
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
      state.loading = false;
      state.error = null;
    },
    /** Set a single patient for view/edit operations */
    setCurrentPatient: (state, action: PayloadAction<Patient>) => {
      state.currentPatient = action.payload;
      state.loading = false;
    },
    /** Clear the currently viewed/edited patient */
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
    setPatientLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPatientError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setPatients,
  setCurrentPatient,
  clearCurrentPatient,
  setPatientLoading,
  setPatientError,
} = patientSlice.actions;

export default patientSlice.reducer;
