import { supabase } from '../supabase';
import type { UserRole } from '../../types/auth';
import type { AgentProfile, ClientProfile } from './types';

export async function getUserProfile(userId: string, role: UserRole): Promise<AgentProfile | ClientProfile> {
  const profileTable = role === 'agent' ? 'agent_profiles' : 'client_profiles';
  
  try {
    // First try to get existing profile
    const { data: profile, error } = await supabase
      .from(profileTable)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!profile) {
      // Create default profile if none exists
      const defaultProfile = await createDefaultProfile(userId, role);
      return defaultProfile;
    }

    // Update existing profile with any missing fields
    const updatedProfile = await ensureProfileFields(profile, role);
    return updatedProfile;
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
      subscription_tier: 'basic' as const,
      areas: [],
      languages: [],
      certifications: []
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

async function ensureProfileFields(profile: any, role: UserRole) {
  const updates: any = {};
  
  if (role === 'agent') {
    // Ensure agent-specific fields exist
    if (!profile.areas) updates.areas = [];
    if (!profile.languages) updates.languages = [];
    if (!profile.certifications) updates.certifications = [];
    if (!profile.subscription_status) updates.subscription_status = 'trial';
    if (!profile.subscription_tier) updates.subscription_tier = 'basic';
  } else {
    // Ensure client-specific fields exist
    if (!profile.preferred_areas) updates.preferred_areas = [];
    if (!profile.preferred_contact) updates.preferred_contact = 'email';
  }

  // Only update if there are missing fields
  if (Object.keys(updates).length > 0) {
    const { data: updatedProfile, error } = await supabase
      .from(role === 'agent' ? 'agent_profiles' : 'client_profiles')
      .update(updates)
      .eq('user_id', profile.user_id)
      .select()
      .single();

    if (error) throw error;
    return updatedProfile;
  }

  return profile;
}