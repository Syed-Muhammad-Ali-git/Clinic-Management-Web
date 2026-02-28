// Patient-related TypeScript types

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  bloodGroup?: string;
  medicalHistory?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreatePatientData = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdatePatientData = Partial<CreatePatientData>;

export interface PatientState {
  patients: Patient[];
  currentPatient: Patient | null;
  loading: boolean;
  error: string | null;
}
