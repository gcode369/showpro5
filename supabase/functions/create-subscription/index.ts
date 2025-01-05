import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'stripe'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16'
})

serve(async (req) => {
  try {
    const { priceId } = await req.json()
    const { user } = await supabase.auth.getUser(req.headers.get('Authorization')!)

    if (!user) {
      throw new Error('Not authenticated')
    }

    // Create or get customer
    let customer
    const { data: profile } = await supabase
      .from('agent_profiles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (profile?.stripe_customer_id) {
      customer = await stripe.customers.retrieve(profile.stripe_customer_id)
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id }
      })

      await supabase
        .from('agent_profiles')
        .update({ stripe_customer_id: customer.id })
        .eq('user_id', user.id)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/payment/success`,
      cancel_url: `${req.headers.get('origin')}/payment/cancel`
    })

    return new Response(JSON.stringify({ sessionUrl: session.url }), {
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