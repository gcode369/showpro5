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
      let query = supabase.from('properties').select('*');
      
      if (agentId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(agentId)) {
        query = query.eq('agent_id', agentId);
      }

      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      setProperties(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: insertError } = await supabase
        .from('properties')
        .insert([{ ...propertyData, agent_id: user.id }])
        .select()
        .single();

      if (insertError) throw insertError;
      setProperties(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add property');
      throw err;
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: updateError } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setProperties(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property');
      throw err;
    }
  };

  return {
    properties,
    loading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    refreshProperties: fetchProperties
  };
}