import { supabase } from '../supabase';
import { mapSessionToAuthSession } from './sessionMapper';
import type { AuthSession } from '../../types/auth';

export async function refreshSession(): Promise<AuthSession | null> {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session ? mapSessionToAuthSession(session) : null;
  } catch (err) {
    console.error('Session refresh error:', err);
    return null;
  }
}