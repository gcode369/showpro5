import { supabase } from '../supabase';
import type { UserRole } from '../../types/auth';
import type { AgentProfile, ClientProfile, ProfileData } from './types';

export async function getUserProfile(userId: string, role: UserRole): Promise<AgentProfile | ClientProfile> {
  const profileTable = role === 'agent' ? 'agent_profiles' : 'client_profiles';
  
  try {
    const { data: profile, error } = await supabase
      .from(profileTable)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!profile) {
      return createDefaultProfile(userId, role);
    }

    return profile;
  } catch (err) {
    console.error('Profile fetch error:', err);
    throw err;
  }
}

async function createDefaultProfile(userId: string, role: UserRole): Promise<AgentProfile | ClientProfile> {
  const profileData = {
    user_id: userId,
    name: role === 'agent' ? 'New Agent' : 'New Client',
    ...(role === 'agent' && {
      subscription_status: 'trial' as const,
      subscription_tier: 'basic' as const
    })
  };

  const { data: profile, error } = await supabase
    .from(role === 'agent' ? 'agent_profiles' : 'client_profiles')
    .insert(profileData)
    .select()
    .single();

  if (error) throw error;
  return profile;
}