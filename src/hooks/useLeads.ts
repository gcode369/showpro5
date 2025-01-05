import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { Lead } from '../types/lead';

export function useLeads(openHouseId: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [openHouseId]);

  const fetchLeads = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('open_house_leads')
        .select('*')
        .eq('open_house_id', openHouseId)
        .order('registration_date', { ascending: false });

      if (fetchError) throw fetchError;
      setLeads(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: Lead['followUpStatus']) => {
    try {
      const { error: updateError } = await supabase
        .from('open_house_leads')
        .update({ follow_up_status: status })
        .eq('id', leadId);

      if (updateError) throw updateError;
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, followUpStatus: status } : lead
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead status');
      throw err;
    }
  };

  return {
    leads,
    loading,
    error,
    updateLeadStatus,
    refreshLeads: fetchLeads
  };
}