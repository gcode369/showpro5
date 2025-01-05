import React from 'react';
import { Check } from 'lucide-react';

type PlanSelectionProps = {
  selectedPlan: 'basic' | 'premium';
  onSelect: (plan: 'basic' | 'premium') => void;
};

export function PlanSelection({ selectedPlan, onSelect }: PlanSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select your plan
      </label>
      <div className="space-y-4">
        <div
          onClick={() => onSelect('basic')}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedPlan === 'basic' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Basic Plan</h3>
              <p className="text-gray-600">$50/month</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  Unlimited property listings
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  Smart scheduling system
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  Basic analytics
                </li>
              </ul>
            </div>
            <input
              type="radio"
              name="plan"
              checked={selectedPlan === 'basic'}
              onChange={() => onSelect('basic')}
              className="h-4 w-4 text-blue-600"
            />
          </div>
        </div>

        <div
          onClick={() => onSelect('premium')}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedPlan === 'premium' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Premium Plan</h3>
              <p className="text-gray-600">$75/month</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  Everything in Basic
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  Open house management
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  Advanced analytics
                </li>
              </ul>
            </div>
            <input
              type="radio"
              name="plan"
              checked={selectedPlan === 'premium'}
              onChange={() => onSelect('premium')}
              className="h-4 w-4 text-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}