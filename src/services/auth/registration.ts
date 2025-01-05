import { supabase } from '../supabase';
import { createUserProfile } from './profileService';
import type { AuthUser, UserRegistrationData } from '../../types/auth';

export async function registerUser(data: UserRegistrationData): Promise<{ user: AuthUser; session: any }> {
  try {
    // Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: data.role
        }
      }
    });

    if (signUpError) {
      console.error('Auth signup error:', signUpError);
      if (signUpError.message.includes('already registered')) {
        throw new Error('An account with this email already exists');
      }
      throw signUpError;
    }

    if (!authData.user) {
      throw new Error('Registration failed - no user created');
    }

    // Create profile
    try {
      await createUserProfile(authData.user.id, data.role, {
        user_id: authData.user.id,
        name: data.name,
        ...data.role === 'agent' && {
          subscription_status: 'trial',
          subscription_tier: 'basic'
        }
      });

      // Return user object
      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: data.name,
        role: data.role,
        subscriptionStatus: data.role === 'agent' ? 'trial' : undefined,
        subscriptionTier: data.role === 'agent' ? 'basic' : undefined
      };

      return { user, session: authData.session };
    } catch (profileError) {
      console.error('Profile creation error:', profileError);
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error('Failed to create user profile');
    }
  } catch (err) {
    console.error('Registration error:', err);
    throw err;
  }
}