import { supabase } from '../supabase';
import type { LeadScore, LeadActivity } from '../../types/lead';

export class LeadScoringService {
  async trackActivity(data: Omit<LeadActivity, 'id' | 'created_at'>) {
    const { data: activity, error } = await supabase
      .from('lead_activities')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return activity;
  }

  async getLeadScore(clientId: string, agentId: string) {
    const { data, error } = await supabase
      .from('lead_scores')
      .select('*')
      .eq('client_id', clientId)
      .eq('agent_id', agentId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async trackPropertyView(propertyId: string, clientId: string) {
    const { data: existing } = await supabase
      .from('property_views')
      .select()
      .eq('property_id', propertyId)
      .eq('client_id', clientId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('property_views')
        .update({
          view_count: existing.view_count + 1,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('property_views')
        .insert({
          property_id: propertyId,
          client_id: clientId
        });

      if (error) throw error;
    }
  }
}

export const leadScoringService = new LeadScoringService();