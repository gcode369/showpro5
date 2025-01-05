import { supabase } from '../supabase';
import type { LeadScore } from '../../types/lead';

export async function getLeadScores(agentId: string): Promise<LeadScore[]> {
  try {
    const { data, error } = await supabase
      .from('lead_scores')
      .select('*')
      .eq('agent_id', agentId);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Get lead scores error:', err);
    throw err instanceof Error ? err : new Error('Failed to get lead scores');
  }
}

export async function updateLeadScore(clientId: string, updates: Partial<LeadScore>) {
  try {
    const { error } = await supabase
      .from('lead_scores')
      .upsert({
        client_id: clientId,
        ...updates
      });

    if (error) throw error;
  } catch (err) {
    console.error('Update lead score error:', err);
    throw err instanceof Error ? err : new Error('Failed to update lead score');
  }
}