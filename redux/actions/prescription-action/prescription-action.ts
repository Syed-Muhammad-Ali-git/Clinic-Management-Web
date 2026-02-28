// Prescription actions - Firestore prescription CRUD + PDF generation via API route

import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppDispatch } from '@/redux/store';
import {
  setPrescriptions,
  setCurrentPrescription,
  clearCurrentPrescription,
  setPrescriptionLoading,
  setPrescriptionError,
} from '@/redux/reducers/prescription-reducer/prescription-reducer';
import {
  Prescription,
  CreatePrescriptionData,
} from '@/app/types/prescription';

/**
 * Thunk action to fetch all prescriptions.
 * Optionally filtered by patientId or doctorId.
 */
export const fetchPrescriptionsAction =
  (filter: { patientId?: string; doctorId?: string } = {}) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setPrescriptionLoading(true));
      dispatch(setPrescriptionError(null));

      let q = query(collection(db, 'prescriptions'), orderBy('createdAt', 'desc'));

      if (filter.patientId) {
        q = query(
          collection(db, 'prescriptions'),
          where('patientId', '==', filter.patientId),
          orderBy('createdAt', 'desc'),
        );
      } else if (filter.doctorId) {
        q = query(
          collection(db, 'prescriptions'),
          where('doctorId', '==', filter.doctorId),
          orderBy('createdAt', 'desc'),
        );
      }

      const snap = await getDocs(q);
      const prescriptions: Prescription[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      } as Prescription));

      dispatch(setPrescriptions(prescriptions));
      return prescriptions;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch prescriptions';
      dispatch(setPrescriptionError(message));
      throw error;
    } finally {
      dispatch(setPrescriptionLoading(false));
    }
  };

/**
 * Thunk action to fetch a single prescription by Firestore document ID.
 */
export const getPrescriptionAction =
  (prescriptionId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setPrescriptionLoading(true));
      dispatch(setPrescriptionError(null));

      const snap = await getDoc(doc(db, 'prescriptions', prescriptionId));
      if (snap.exists()) {
        const prescription = { id: snap.id, ...snap.data() } as Prescription;
        dispatch(setCurrentPrescription(prescription));
        return prescription;
      } else {
        dispatch(clearCurrentPrescription());
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to get prescription';
      dispatch(setPrescriptionError(message));
      throw error;
    } finally {
      dispatch(setPrescriptionLoading(false));
    }
  };

/**
 * Thunk action to create a new prescription.
 * Calls the /api/prescriptions route to generate a PDF and store in Firebase Storage.
 * Returns the new prescription ID and pdfUrl.
 */
export const createPrescriptionAction =
  (prescriptionData: CreatePrescriptionData) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setPrescriptionLoading(true));
      dispatch(setPrescriptionError(null));

      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create prescription');
      }

      const result = await response.json() as { id: string; pdfUrl: string };

      // Refresh the prescriptions list
      await dispatch(fetchPrescriptionsAction());

      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create prescription';
      dispatch(setPrescriptionError(message));
      throw error;
    } finally {
      dispatch(setPrescriptionLoading(false));
    }
  };
