export type ClientStatus = 'active' | 'inactive' | 'lead';
export type PreferredContact = 'email' | 'phone' | 'both';

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
  preferredContact: PreferredContact;
  areasOfInterest: string[];
  notes?: string;
  lastContact?: string;
  source: 'booking' | 'open-house' | 'manual';
  createdAt: string;
  viewings: {
    date: string;
    propertyAddress: string;
    status: 'upcoming' | 'completed' | 'cancelled';
  }[];
};