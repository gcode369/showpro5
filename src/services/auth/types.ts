import type { Session } from '@supabase/supabase-js';
import type { AuthSession, UserRole } from '../../types/auth';

export type ProfileData = {
  user_id: string;
  name: string;
  subscription_status?: 'trial' | 'active' | 'inactive';
  subscription_tier?: 'basic' | 'premium';
};

export type AgentProfile = ProfileData & {
  subscription_status: 'trial' | 'active' | 'inactive';
  subscription_tier: 'basic' | 'premium';
};

export type ClientProfile = ProfileData;

export function mapSessionToAuthSession(session: Session): AuthSession {
  return {
    user: {
      id: session.user.id,
      email: session.user.email || '',
      user_metadata: {
        name: session.user.user_metadata?.name || '',
        role: (session.user.user_metadata?.role as UserRole) || 'client'
      }
    }
  };
}