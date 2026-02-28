// Root reducer - combines all feature slices

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth-reducer/auth-reducer';
import userReducer from './user-reducer/user-reducer';
import patientReducer from './patient-reducer/patient-reducer';
import appointmentReducer from './appointment-reducer/appointment-reducer';
import prescriptionReducer from './prescription-reducer/prescription-reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  patient: patientReducer,
  appointment: appointmentReducer,
  prescription: prescriptionReducer,
});

export default rootReducer;
