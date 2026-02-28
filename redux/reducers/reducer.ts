// Main reducer file...!

import { combineReducers } from "redux";
import authReducer from "../slices/authSlice";
import userReducer from "./user-reducer/user-reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

export default rootReducer;
