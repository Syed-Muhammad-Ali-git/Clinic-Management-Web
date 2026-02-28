// Prescription-related TypeScript types

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  diagnosis: string;
  medications: Medication[];
  notes?: string;
  pdfUrl?: string;
  storagePath?: string;
  createdAt?: string;
}

export type CreatePrescriptionData = Omit<Prescription, 'id' | 'pdfUrl' | 'storagePath' | 'createdAt'>;

export interface PrescriptionState {
  prescriptions: Prescription[];
  currentPrescription: Prescription | null;
  loading: boolean;
  error: string | null;
}
