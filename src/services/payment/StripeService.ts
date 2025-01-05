import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export class StripeService {
  async createSubscription(priceId: string) {
    const { data: { sessionUrl }, error } = await supabase.functions.invoke('create-subscription', {
      body: { priceId }
    });

    if (error) throw error;
    return sessionUrl;
  }

  async handlePayment(sessionUrl: string) {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionUrl
    });

    if (error) throw error;
  }

  async updateSubscription(subscriptionId: string, newPriceId: string) {
    const { error } = await supabase.functions.invoke('update-subscription', {
      body: { subscriptionId, newPriceId }
    });

    if (error) throw error;
  }

  async cancelSubscription(subscriptionId: string) {
    const { error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId }
    });

    if (error) throw error;
  }
}

export const stripeService = new StripeService();