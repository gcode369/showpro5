import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'stripe'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16'
})

serve(async (req) => {
  try {
    const { sessionId } = await req.json()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed')
    }

    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    // Update user subscription status
    const { error: updateError } = await supabaseAdmin
      .from('agent_profiles')
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: 'active',
        subscription_end_date: new Date(session.expires_at! * 1000)
      })
      .eq('user_id', session.metadata?.userId)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    })
  }
})