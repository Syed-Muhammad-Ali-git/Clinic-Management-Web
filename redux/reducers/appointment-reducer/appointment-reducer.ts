import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  current: null,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    FETCH_APPOINTMENTS: (state, action) => { state.appointments = action.payload; },
    SET_CURRENT_APPOINTMENT: (state, action) => { state.current = action.payload; },
    CLEAR_CURRENT_APPOINTMENT: (state) => { state.current = null; },
  }
});

export const { FETCH_APPOINTMENTS, SET_CURRENT_APPOINTMENT, CLEAR_CURRENT_APPOINTMENT } = appointmentSlice.actions;
export default appointmentSlice.reducer;
