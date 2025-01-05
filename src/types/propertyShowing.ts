export type ShowingTimeSlot = {
  id: string;
  propertyId: string;
  agentId: string;  // Add this field
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  maxAttendees: number;
  currentAttendees: number;
};

export type PropertyShowing = {
  id: string;
  propertyId: string;
  timeSlots: ShowingTimeSlot[];
  notes?: string;
};