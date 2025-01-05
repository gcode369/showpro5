import { supabase } from '../supabase';
import type { AutomatedFollowup } from '../../types/lead';

export class AutomatedFollowupService {
  async getFollowups(agentId: string) {
    const { data, error } = await supabase
      .from('automated_followups')
      .select('*')
      .eq('agent_id', agentId)
      .eq('status', 'pending')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  async completeFollowup(followupId: string) {
    const { error } = await supabase
      .from('automated_followups')
      .update({ status: 'completed' })
      .eq('id', followupId);

    if (error) throw error;
  }
}

export const automatedFollowupService = new AutomatedFollowupService();