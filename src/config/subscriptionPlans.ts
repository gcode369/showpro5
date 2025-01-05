import type { SubscriptionPlans } from '../types/subscription';

export const SUBSCRIPTION_PLANS: SubscriptionPlans = {
  monthly: {
    title: 'Monthly Plan',
    price: 75,
    interval: 'month',
    features: [
      'Unlimited property listings',
      'Smart scheduling system',
      'Advanced analytics',
      'Open house management',
      'Lead capture & scoring',
      'Client management tools',
      'Email notifications',
      'Priority support',
      'Custom branding'
    ],
    paymentLink: 'https://buy.stripe.com/3cs01E2wmdJca084gh'
  },
  yearly: {
    title: 'Yearly Plan',
    price: 750,
    interval: 'year',
    features: [
      'All Monthly Plan features',
      'Save $150 annually',
      'Extended analytics history',
      'Priority customer support',
      'Advanced reporting tools',
      'Custom integrations',
      'Dedicated account manager',
      'Early access to new features',
      'Bulk import tools'
    ],
    paymentLink: 'https://buy.stripe.com/6oEg0C1sibB4c8g5km'
  }
};

export type { PlanType } from '../types/subscription';