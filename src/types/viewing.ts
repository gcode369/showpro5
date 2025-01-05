export type Viewing = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  agentName: string;
};