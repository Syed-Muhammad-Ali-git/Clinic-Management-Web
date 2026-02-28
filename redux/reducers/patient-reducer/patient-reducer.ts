// Patient reducer slices

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  patients: [],
  currentPatient: null,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    FETCH_PATIENTS: (state, action) => {
      state.patients = action.payload;
    },
    SET_CURRENT_PATIENT: (state, action) => {
      state.currentPatient = action.payload;
    },
    CLEAR_CURRENT_PATIENT: (state) => {
      state.currentPatient = null;
    },
  },
});

export const { FETCH_PATIENTS, SET_CURRENT_PATIENT, CLEAR_CURRENT_PATIENT } = patientSlice.actions;
export default patientSlice.reducer;
