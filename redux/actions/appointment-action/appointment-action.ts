import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FETCH_APPOINTMENTS, SET_CURRENT_APPOINTMENT, CLEAR_CURRENT_APPOINTMENT } from '@/redux/reducers/appointment-reducer/appointment-reducer';

const fetchAppointments = (filter: any = {}) => {
  return async (dispatch: any) => {
    let q = collection(db, 'appointments');
    // simple support for doctorId or patientId filter
    if (filter.doctorId) q = query(collection(db,'appointments'), where('doctorId','==',filter.doctorId), orderBy('scheduledAt','desc')) as any;
    if (filter.patientId) q = query(collection(db,'appointments'), where('patientId','==',filter.patientId), orderBy('scheduledAt','desc')) as any;
    const snap = await getDocs(q as any);
    const arr: any[] = [];
    snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
    dispatch({ type: FETCH_APPOINTMENTS.type, payload: arr });
  };
};

const getAppointment = (id: string) => {
  return async (dispatch: any) => {
    const snap = await getDoc(doc(db, 'appointments', id));
    if (snap.exists()) dispatch({ type: SET_CURRENT_APPOINTMENT.type, payload: { id: snap.id, ...snap.data() } });
    else dispatch({ type: CLEAR_CURRENT_APPOINTMENT.type });
  };
};

const createAppointment = (payload: any) => {
  return async (dispatch: any) => {
    await addDoc(collection(db, 'appointments'), { ...payload, status: 'pending', createdAt: new Date() });
    dispatch(fetchAppointments() as any);
  };
};

const updateAppointment = (id: string, payload: any) => {
  return async (dispatch: any) => {
    await updateDoc(doc(db, 'appointments', id), { ...payload, updatedAt: new Date() });
    dispatch(fetchAppointments() as any);
  };
};

const deleteAppointment = (id: string) => {
  return async (dispatch: any) => {
    await deleteDoc(doc(db, 'appointments', id));
    dispatch(fetchAppointments() as any);
  };
};

export { fetchAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment };
