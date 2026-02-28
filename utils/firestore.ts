import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';

// --- Patients ---
export const addPatient = async (patientData: any) => {
  return await addDoc(collection(db, 'patients'), {
    ...patientData,
    createdAt: Timestamp.now()
  });
};

export const getPatients = async () => {
  const snapshot = await getDocs(collection(db, 'patients'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPatientById = async (id: string) => {
  const docRef = doc(db, 'patients', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updatePatient = async (id: string, data: any) => {
  const docRef = doc(db, 'patients', id);
  return await updateDoc(docRef, data);
};

// --- Appointments ---
export const addAppointment = async (appointmentData: any) => {
  return await addDoc(collection(db, 'appointments'), {
    ...appointmentData,
    createdAt: Timestamp.now(),
    status: appointmentData.status || 'scheduled'
  });
};

export const getAppointments = async () => {
  const snapshot = await getDocs(collection(db, 'appointments'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateAppointmentStatus = async (id: string, status: string) => {
  const docRef = doc(db, 'appointments', id);
  return await updateDoc(docRef, { status });
};

// --- Prescriptions ---
export const addPrescription = async (prescriptionData: any) => {
  return await addDoc(collection(db, 'prescriptions'), {
    ...prescriptionData,
    createdAt: Timestamp.now()
  });
};

export const getPrescriptionsByPatient = async (patientId: string) => {
  const q = query(collection(db, 'prescriptions'), where('patientId', '==', patientId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Users ---
export const getUserByUid = async (uid: string) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getUsersByRole = async (role: string) => {
  const q = query(collection(db, 'users'), where('role', '==', role));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createUserProfile = async (uid: string, profileData: any) => {
  const docRef = doc(db, 'users', uid);
  return await updateDoc(docRef, profileData); // Assuming document already exists from Auth creation, or use setDoc
};
