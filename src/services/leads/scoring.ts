import { supabase } from '../supabase';
import type { LeadScore } from '../../types/lead';

export async function calculateLeadScore(clientId: string, agentId: string): Promise<Partial<LeadScore>> {
  try {
    // Get client activities
    const { data: activities, error: activitiesError } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('client_id', clientId)
      .eq('agent_id', agentId);

    if (activitiesError) throw activitiesError;

    // Calculate engagement score
    const engagementScore = calculateEngagementScore(activities || []);

    // Get client profile for prequalification
    const { data: profile, error: profileError } = await supabase
      .from('client_profiles')
      .select('prequalified, prequalification_details')
      .eq('user_id', clientId)
      .single();

    if (profileError) throw profileError;

    // Calculate prequalification score
    const prequalificationScore = calculatePrequalificationScore(profile);

    return {
      total_score: engagementScore + prequalificationScore,
      engagement_score: engagementScore,
      prequalification_score: prequalificationScore,
      property_match_score: 0, // Calculated separately
      last_calculated_at: new Date().toISOString()
    };
  } catch (err) {
    console.error('Calculate lead score error:', err);
    throw err instanceof Error ? err : new Error('Failed to calculate lead score');
  }
}

function calculateEngagementScore(activities: any[]): number {
  const scores = {
    property_view: 5,
    booking_request: 15,
    open_house_registration: 10,
    return_visit: 8,
    contact_agent: 12
  };

  return activities.reduce((total, activity) => {
    return total + (scores[activity.activity_type as keyof typeof scores] || 0);
  }, 0);
}

function calculatePrequalificationScore(profile: any): number {
  if (!profile?.prequalified) return 0;
  return profile.prequalification_details?.verified ? 30 : 20;
}