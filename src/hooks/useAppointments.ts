import { useState } from 'react';
import type { Appointment } from '../types/appointment';

export function useAppointments(agentId: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'agentId' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Math.random().toString(36).substr(2, 9),
      agentId,
      status: 'scheduled'
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status }
          : appointment
      )
    );
  };

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(appointment => appointment.date === date);
  };

  const isTimeSlotAvailable = (date: string, startTime: string, endTime: string) => {
    const dateAppointments = getAppointmentsForDate(date);
    return !dateAppointments.some(
      appointment =>
        appointment.status === 'scheduled' &&
        ((startTime >= appointment.startTime && startTime < appointment.endTime) ||
         (endTime > appointment.startTime && endTime <= appointment.endTime))
    );
  };

  return {
    appointments,
    addAppointment,
    updateAppointmentStatus,
    getAppointmentsForDate,
    isTimeSlotAvailable
  };
}