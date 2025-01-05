import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const RATE_LIMITS = {
  'auth': { window: 3600, max: 5 }, // 5 requests per hour
  'api': { window: 60, max: 100 }, // 100 requests per minute
};

async function checkRateLimit(
  key: string,
  type: keyof typeof RATE_LIMITS
): Promise<boolean> {
  const { window, max } = RATE_LIMITS[type];
  const now = Math.floor(Date.now() / 1000);

  const { count } = await supabase.rpc('increment_rate_limit', {
    p_key: key,
    p_window: window,
    p_max: max,
    p_timestamp: now
  });

  return count <= max;
}

serve(async (req) => {
  try {
    const { key, type } = await req.json();
    const allowed = await checkRateLimit(key, type as keyof typeof RATE_LIMITS);

    return new Response(
      JSON.stringify({ allowed }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});