import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'stripe'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient()
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
        const { customer, status } = subscription

        // Update user subscription status
        const { data: user, error: userError } = await supabaseAdmin
          .from('agent_profiles')
          .update({ 
            subscription_status: status === 'active' ? 'active' : 'inactive',
            stripe_subscription_id: subscription.id,
            subscription_end_date: new Date(subscription.current_period_end * 1000)
          })
          .eq('stripe_customer_id', customer)

        if (userError) throw userError
        break
    }

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