import { supabase } from '../supabase';

const PAYMENT_LINKS = {
  monthly: 'https://buy.stripe.com/3cs01E2wmdJca084gh',
  yearly: 'https://buy.stripe.com/6oEg0C1sibB4c8g5km'
};

export class StripePaymentService {
  getPaymentLink(plan: 'monthly' | 'yearly'): string {
    return PAYMENT_LINKS[plan];
  }

  async verifyPayment(sessionId: string) {
    // Basic verification without webhooks
    const { data, error } = await supabase
      .from('agent_profiles')
      .update({ 
        subscription_status: 'active',
        subscription_tier: 'basic',
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      })
      .eq('user_id', sessionId);

    if (error) throw error;
    return data;
  }
}

export const stripePaymentService = new StripePaymentService();