// Appointment-related TypeScript types

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  scheduledAt: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateAppointmentData = Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

export type UpdateAppointmentData = Partial<Omit<Appointment, 'id' | 'createdAt'>>;

export interface AppointmentFilter {
  doctorId?: string;
  patientId?: string;
  status?: AppointmentStatus;
}

export interface AppointmentState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
}
