import { supabase } from '../../services/supabase';

export async function migrateExistingUsers() {
  try {
    const { data: agents, error: agentError } = await supabase
      .from('agent_profiles')
      .select('user_id, subscription_status')
      .is('subscription_status', null);

    if (agentError) throw agentError;

    // Update agents without subscription status
    for (const agent of agents || []) {
      await supabase
        .from('agent_profiles')
        .update({
          subscription_status: 'trial',
          subscription_tier: 'basic'
        })
        .eq('user_id', agent.user_id);
    }

    return { success: true };
  } catch (err) {
    console.error('Migration error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Migration failed' };
  }
}