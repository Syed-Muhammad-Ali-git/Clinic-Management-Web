// Main reducer file...!

import { combineReducers } from "redux";
import authReducer from "../slices/authSlice";
import userReducer from "./user-reducer/user-reducer";
import patientReducer from './patient-reducer/patient-reducer';
import appointmentReducer from './appointment-reducer/appointment-reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  patient: patientReducer,
  appointment: appointmentReducer,
});

export default rootReducer;
