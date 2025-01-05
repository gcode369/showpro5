import { Check } from 'lucide-react';
import { Button } from '../common/Button';
import type { SubscriptionPlan } from '../../types/subscription';

type PlanCardProps = {
  plan: SubscriptionPlan;
  planType: 'monthly' | 'yearly';
  onSubscribe: () => void;
};

export function PlanCard({ plan, planType, onSubscribe }: PlanCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-transparent hover:border-blue-500 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{plan.title}</h3>
        {planType === 'yearly' && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Save $150
          </span>
        )}
      </div>

      <div className="flex items-end gap-2 mb-6">
        <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
        <span className="text-gray-600 mb-2">/{plan.interval}</span>
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Button onClick={onSubscribe} className="w-full">
        Subscribe Now
      </Button>
    </div>
  );
}