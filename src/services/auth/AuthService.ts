import { supabase } from '../supabase';
import { getUserProfile } from './profileService';
import type { AuthUser } from '../../types/auth';

export class AuthService {
  async login(email: string, password: string): Promise<{ user: AuthUser }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data.session?.user) throw new Error('Login failed - no session created');

    const userRole = data.session.user.user_metadata.role || 'client';
    const profile = await getUserProfile(data.session.user.id, userRole);

    const user: AuthUser = {
      id: data.session.user.id,
      email: data.session.user.email!,
      name: profile.name,
      role: userRole,
      subscriptionStatus: 'subscription_status' in profile ? profile.subscription_status : undefined,
      subscriptionTier: 'subscription_tier' in profile ? profile.subscription_tier : undefined
    };

    return { user };
  }
}

export const authService = new AuthService();