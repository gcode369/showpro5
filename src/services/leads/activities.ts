import { supabase } from '../supabase';
import type { LeadActivity } from '../../types/lead';

export async function trackActivity(activity: Omit<LeadActivity, 'id' | 'created_at'>) {
  try {
    const { error } = await supabase
      .from('lead_activities')
      .insert(activity);

    if (error) throw error;
  } catch (err) {
    console.error('Track activity error:', err);
    throw err instanceof Error ? err : new Error('Failed to track activity');
  }
}

export async function getRecentActivities(agentId: string): Promise<LeadActivity[]> {
  try {
    const { data, error } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Get activities error:', err);
    throw err instanceof Error ? err : new Error('Failed to get activities');
  }
}