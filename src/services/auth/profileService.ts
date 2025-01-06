import { supabase } from '../supabase';
import type { UserRole } from '../../types/auth';
import type { AgentProfile, ClientProfile } from './types';

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

    // Ensure all required fields exist
    const updatedProfile = await ensureProfileFields(profile, userId, role);
    return updatedProfile;
  } catch (err) {
    console.error('Profile fetch error:', err);
    throw err;
  }
}

async function createDefaultProfile(userId: string, role: UserRole) {
  const profileData = {
    user_id: userId,
    name: '',
    areas: [],
    ...(role === 'agent' && {
      languages: [],
      certifications: [],
      subscription_status: 'trial' as const,
      subscription_tier: 'basic' as const
    })
  };

  const { data, error } = await supabase
    .from(role === 'agent' ? 'agent_profiles' : 'client_profiles')
    .insert(profileData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function ensureProfileFields(profile: any, userId: string, role: UserRole) {
  if (role === 'agent' && (!profile.areas || !profile.languages || !profile.certifications)) {
    const { data, error } = await supabase
      .from('agent_profiles')
      .update({
        areas: profile.areas || [],
        languages: profile.languages || [],
        certifications: profile.certifications || []
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  return profile;
}