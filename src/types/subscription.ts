export type SubscriptionPlan = {
  title: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  paymentLink: string;
};

export type SubscriptionPlans = {
  monthly: SubscriptionPlan;
  yearly: SubscriptionPlan;
};

export type PlanType = keyof SubscriptionPlans;