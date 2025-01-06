import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/authStore';
import type { Property } from '../types/property';

export function useProperties(agentId?: string) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user, agentId]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let query = supabase.from('properties').select(`
        *,
        property_showings (
          id,
          showing_time_slots (*)
        )
      `);
      
      const filterAgentId = agentId || user?.id;
      if (filterAgentId) {
        query = query.eq('agent_id', filterAgentId);
      }

      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: insertError } = await supabase
        .from('properties')
        .insert([{ ...propertyData, agent_id: user.id }])
        .select(`
          *,
          property_showings (
            id,
            showing_time_slots (*)
          )
        `)
        .single();

      if (insertError) throw insertError;
      setProperties(prev => [...prev, data]);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Error adding property:', err);
      setError(err instanceof Error ? err.message : 'Failed to add property');
      setLoading(false);
      throw err;
    }
  };

  return {
    properties,
    loading,
    error,
    addProperty,
    refreshProperties: fetchProperties
  };
}