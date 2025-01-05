export type ShowingTimeSlot = {
  id: string;
  propertyId: string;
  agentId: string;
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
  property?: {
    id: string;
    title: string;
    address: string;
  };
  timeSlots: ShowingTimeSlot[];
  notes?: string;
};