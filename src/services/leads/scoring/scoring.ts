import { supabase } from '../../supabase';
import { calculateEngagementScore, calculatePrequalificationScore } from './calculators';
import type { LeadScore } from '../../../types/lead';

export async function calculateLeadScore(clientId: string, agentId: string): Promise<Partial<LeadScore>> {
  try {
    const [activities, profile] = await Promise.all([
      getClientActivities(clientId, agentId),
      getClientProfile(clientId)
    ]);

    const engagementScore = calculateEngagementScore(activities || []);
    const prequalificationScore = calculatePrequalificationScore(profile);

    return {
      client_id: clientId,
      agent_id: agentId,
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

async function getClientActivities(clientId: string, agentId: string) {
  const { data, error } = await supabase
    .from('lead_activities')
    .select('*')
    .eq('client_id', clientId)
    .eq('agent_id', agentId);

  if (error) throw error;
  return data;
}

async function getClientProfile(clientId: string) {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('prequalified, prequalification_details')
    .eq('user_id', clientId)
    .single();

  if (error) throw error;
  return data;
}