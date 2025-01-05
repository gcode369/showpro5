import type { Session } from '@supabase/supabase-js';
import type { AuthSession, UserRole } from '../../types/auth';

export function mapSessionToAuthSession(session: Session): AuthSession {
  if (!session.user?.email) {
    throw new Error('Invalid session: missing user email');
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      user_metadata: {
        name: session.user.user_metadata?.name || '',
        role: (session.user.user_metadata?.role as UserRole) || 'client'
      }
    }
  };
}