import { SUBSCRIPTION_PLANS } from '../../config/subscriptionPlans';
import { PlanCard } from '../../components/subscription/PlanCard';
import { useSubscription } from '../../hooks/useSubscription';
import type { PlanType } from '../../types/subscription';

export default function SubscriptionPage() {
  const { canAccessSubscription, handleSubscribe } = useSubscription();

  // Don't render anything if user shouldn't access this page
  if (!canAccessSubscription) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">Select the plan that best fits your needs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {(Object.keys(SUBSCRIPTION_PLANS) as PlanType[]).map((planType) => (
            <PlanCard
              key={planType}
              plan={SUBSCRIPTION_PLANS[planType]}
              planType={planType}
              onSubscribe={() => handleSubscribe(planType)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}