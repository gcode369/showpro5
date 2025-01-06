import { supabase } from '../supabase';

export async function syncExistingProfile(userId: string) {
  try {
    // Get user metadata
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const role = user?.user_metadata?.role || 'client';
    const table = role === 'agent' ? 'agent_profiles' : 'client_profiles';

    // Update profile with missing fields
    const { error: updateError } = await supabase
      .from(table)
      .upsert({
        user_id: userId,
        areas: [],
        languages: [],
        certifications: [],
        subscription_status: 'trial',
        subscription_tier: 'basic'
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      });

    if (updateError) throw updateError;

    return true;
  } catch (err) {
    console.error('Profile sync error:', err);
    return false;
  }
}