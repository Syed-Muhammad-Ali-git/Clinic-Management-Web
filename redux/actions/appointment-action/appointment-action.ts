// Appointment actions - all Firestore appointment CRUD operations live here

import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppDispatch } from '@/redux/store';
import {
  setAppointments,
  setCurrentAppointment,
  clearCurrentAppointment,
  setAppointmentLoading,
  setAppointmentError,
} from '@/redux/reducers/appointment-reducer/appointment-reducer';
import {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilter,
} from '@/app/types/appointment';

/**
 * Thunk action to fetch appointments with optional doctor/patient/status filters.
 */
export const fetchAppointmentsAction =
  (filter: AppointmentFilter = {}) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setAppointmentLoading(true));
      dispatch(setAppointmentError(null));

      let q = query(collection(db, 'appointments'), orderBy('scheduledAt', 'desc'));

      if (filter.doctorId) {
        q = query(
          collection(db, 'appointments'),
          where('doctorId', '==', filter.doctorId),
          orderBy('scheduledAt', 'desc'),
        );
      } else if (filter.patientId) {
        q = query(
          collection(db, 'appointments'),
          where('patientId', '==', filter.patientId),
          orderBy('scheduledAt', 'desc'),
        );
      } else if (filter.status) {
        q = query(
          collection(db, 'appointments'),
          where('status', '==', filter.status),
          orderBy('scheduledAt', 'desc'),
        );
      }

      const snap = await getDocs(q);
      const appointments: Appointment[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      } as Appointment));

      dispatch(setAppointments(appointments));
      return appointments;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch appointments';
      dispatch(setAppointmentError(message));
      throw error;
    } finally {
      dispatch(setAppointmentLoading(false));
    }
  };

/**
 * Thunk action to fetch a single appointment by Firestore document ID.
 */
export const getAppointmentAction =
  (appointmentId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setAppointmentLoading(true));
      dispatch(setAppointmentError(null));

      const snap = await getDoc(doc(db, 'appointments', appointmentId));
      if (snap.exists()) {
        const appointment = { id: snap.id, ...snap.data() } as Appointment;
        dispatch(setCurrentAppointment(appointment));
        return appointment;
      } else {
        dispatch(clearCurrentAppointment());
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get appointment';
      dispatch(setAppointmentError(message));
      throw error;
    } finally {
      dispatch(setAppointmentLoading(false));
    }
  };

/**
 * Thunk action to book a new appointment in Firestore.
 */
export const createAppointmentAction =
  (appointmentData: CreateAppointmentData) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setAppointmentLoading(true));
      dispatch(setAppointmentError(null));

      await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      await dispatch(fetchAppointmentsAction());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create appointment';
      dispatch(setAppointmentError(message));
      throw error;
    } finally {
      dispatch(setAppointmentLoading(false));
    }
  };

/**
 * Thunk action to update an existing appointment (status, notes, etc.).
 */
export const updateAppointmentAction =
  (appointmentId: string, updates: UpdateAppointmentData) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setAppointmentLoading(true));
      dispatch(setAppointmentError(null));

      await updateDoc(doc(db, 'appointments', appointmentId), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      await dispatch(fetchAppointmentsAction());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update appointment';
      dispatch(setAppointmentError(message));
      throw error;
    } finally {
      dispatch(setAppointmentLoading(false));
    }
  };

/**
 * Thunk action to delete an appointment from Firestore.
 */
export const deleteAppointmentAction =
  (appointmentId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setAppointmentLoading(true));
      dispatch(setAppointmentError(null));

      await deleteDoc(doc(db, 'appointments', appointmentId));
      await dispatch(fetchAppointmentsAction());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete appointment';
      dispatch(setAppointmentError(message));
      throw error;
    } finally {
      dispatch(setAppointmentLoading(false));
    }
  };
