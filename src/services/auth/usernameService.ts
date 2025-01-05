import { supabase } from '../supabase';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    if (!username?.trim()) {
      throw new Error('Username is required');
    }

    const { data, error } = await supabase
      .from('agent_profiles')
      .select('username')
      .eq('username', username.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('Username check error:', error);
      throw new Error('Failed to check username availability');
    }

    // If no data found, username is available
    return !data;
  } catch (err) {
    console.error('Username check error:', err);
    throw err instanceof Error ? err : new Error('Failed to check username availability');
  }
}

export async function searchAgentsByUsername(query: string) {
  try {
    const { data, error } = await supabase
      .from('agent_profiles')
      .select(`
        user_id,
        username,
        name,
        photo_url,
        areas,
        subscription_status
      `)
      .ilike('username', `%${query.toLowerCase()}%`)
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Agent search error:', err);
    throw new Error('Failed to search agents');
  }
}