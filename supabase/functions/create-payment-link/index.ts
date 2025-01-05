import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'stripe'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16'
})

serve(async (req) => {
  try {
    const { priceId, userId } = await req.json()

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: priceId, quantity: 1 }],
      after_completion: { type: 'redirect', redirect: { url: `${req.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}` }},
      metadata: { userId }
    });

    return new Response(JSON.stringify({ paymentUrl: paymentLink.url }), {
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