// Patient actions - all Firestore patient CRUD operations live here

import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppDispatch } from '@/redux/store';
import {
  setPatients,
  setCurrentPatient,
  clearCurrentPatient,
  setPatientLoading,
  setPatientError,
} from '@/redux/reducers/patient-reducer/patient-reducer';
import { Patient, CreatePatientData, UpdatePatientData } from '@/app/types/patient';

/**
 * Thunk action to fetch all patients ordered by creation date.
 */
export const fetchPatientsAction = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setPatientLoading(true));
    dispatch(setPatientError(null));

    // Try ordered query first; fall back to unordered if index missing
    let snap;
    try {
      const q = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
      snap = await getDocs(q);
    } catch {
      snap = await getDocs(collection(db, 'patients'));
    }
    const patients: Patient[] = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    } as Patient));

    dispatch(setPatients(patients));
    return patients;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch patients';
    dispatch(setPatientError(message));
    throw error;
  } finally {
    dispatch(setPatientLoading(false));
  }
};

/**
 * Thunk action to fetch a single patient by Firestore document ID.
 */
export const getPatientAction =
  (patientId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setPatientLoading(true));
      dispatch(setPatientError(null));

      const snap = await getDoc(doc(db, 'patients', patientId));
      if (snap.exists()) {
        const patient = { id: snap.id, ...snap.data() } as Patient;
        dispatch(setCurrentPatient(patient));
        return patient;
      } else {
        dispatch(clearCurrentPatient());
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get patient';
      dispatch(setPatientError(message));
      throw error;
    } finally {
      dispatch(setPatientLoading(false));
    }
  };

/**
 * Thunk action to create a new patient document in Firestore.
 */
export const createPatientAction =
  (patientData: CreatePatientData) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setPatientLoading(true));
      dispatch(setPatientError(null));

      await addDoc(collection(db, 'patients'), {
        ...patientData,
        createdAt: new Date().toISOString(),
      });

      await dispatch(fetchPatientsAction());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create patient';
      dispatch(setPatientError(message));
      throw error;
    } finally {
      dispatch(setPatientLoading(false));
    }
  };

/**
 * Thunk action to update an existing patient document in Firestore.
 */
export const updatePatientAction =
  (patientId: string, updates: UpdatePatientData) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setPatientLoading(true));
      dispatch(setPatientError(null));

      await updateDoc(doc(db, 'patients', patientId), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      await dispatch(fetchPatientsAction());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update patient';
      dispatch(setPatientError(message));
      throw error;
    } finally {
      dispatch(setPatientLoading(false));
    }
  };

/**
 * Thunk action to delete a patient document from Firestore.
 */
export const deletePatientAction =
  (patientId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setPatientLoading(true));
      dispatch(setPatientError(null));

      await deleteDoc(doc(db, 'patients', patientId));
      await dispatch(fetchPatientsAction());
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete patient';
      dispatch(setPatientError(message));
      throw error;
    } finally {
      dispatch(setPatientLoading(false));
    }
  };
