// Appointment reducer - manages appointments list and individual appointment detail

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, AppointmentState } from '@/app/types/appointment';

const initialState: AppointmentState = {
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    /** Replace the full appointments list after fetch */
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
      state.loading = false;
      state.error = null;
    },
    /** Set a single appointment for view/edit operations */
    setCurrentAppointment: (state, action: PayloadAction<Appointment>) => {
      state.currentAppointment = action.payload;
      state.loading = false;
    },
    /** Clear the currently viewed/edited appointment */
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
    setAppointmentLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAppointmentError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setAppointments,
  setCurrentAppointment,
  clearCurrentAppointment,
  setAppointmentLoading,
  setAppointmentError,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
