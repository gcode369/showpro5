export type OpenHouse = {
  id: string;
  propertyId: string;
  date: string;
  startTime: string;
  endTime: string;
  agentId: string;
  agentName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  attendees: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  maxAttendees?: number;
};

export type Area = {
  city: string;
  province: string;
};