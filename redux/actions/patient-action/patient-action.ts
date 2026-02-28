import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FETCH_PATIENTS, SET_CURRENT_PATIENT, CLEAR_CURRENT_PATIENT } from '@/redux/reducers/patient-reducer/patient-reducer';

const fetchPatients = () => {
  return async (dispatch: any) => {
    const snap = await getDocs(collection(db, 'patients'));
    const arr: any[] = [];
    snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
    dispatch({ type: FETCH_PATIENTS.type, payload: arr });
  };
};

const getPatient = (id: string) => {
  return async (dispatch: any) => {
    const snap = await getDoc(doc(db, 'patients', id));
    if (snap.exists()) dispatch({ type: SET_CURRENT_PATIENT.type, payload: { id: snap.id, ...snap.data() } });
    else dispatch({ type: CLEAR_CURRENT_PATIENT.type });
  };
};

const createPatient = (payload: any) => {
  return async (dispatch: any) => {
    await addDoc(collection(db, 'patients'), { ...payload, createdAt: new Date() });
    dispatch(fetchPatients() as any);
  };
};

const updatePatient = (id: string, payload: any) => {
  return async (dispatch: any) => {
    await updateDoc(doc(db, 'patients', id), { ...payload, updatedAt: new Date() });
    dispatch(fetchPatients() as any);
  };
};

const deletePatient = (id: string) => {
  return async (dispatch: any) => {
    await deleteDoc(doc(db, 'patients', id));
    dispatch(fetchPatients() as any);
  };
};

export { fetchPatients, getPatient, createPatient, updatePatient, deletePatient };
