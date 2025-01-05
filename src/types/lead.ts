export type ActivityType = 'property_view' | 'booking_request' | 'open_house_registration' | 'return_visit' | 'contact_agent';

export type Lead = {
  id: string;
  openHouseId: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  interestedInSimilar: boolean;
  prequalified: boolean;
  followUpStatus: 'pending' | 'contacted' | 'not-interested';
  registrationDate: string;
};

export type LeadActivity = {
  id: string;
  client_id: string;
  agent_id: string;
  activity_type: ActivityType;
  property_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
};

export type LeadScore = {
  id: string;
  client_id: string;
  agent_id: string;
  total_score: number;
  prequalification_score: number;
  property_match_score: number;
  engagement_score: number;
  last_calculated_at: string;
};