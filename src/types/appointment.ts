export type AppointmentType = 'showing' | 'meeting' | 'open-house';

export type Appointment = {
  id: string;
  agentId: string;
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  type: AppointmentType;
  date: string;
  startTime: string;
  endTime: string;
  propertyAddress?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
};