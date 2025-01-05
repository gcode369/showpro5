import React from 'react';
import { Check } from 'lucide-react';

type PricingCardProps = {
  title: string;
  price: number;
  features: string[];
  onSelect: () => void;
  recommended?: boolean;
};

export function PricingCard({ title, price, features, onSelect, recommended }: PricingCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${recommended ? 'ring-2 ring-blue-500' : ''}`}>
      {recommended && (
        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          Recommended
        </span>
      )}
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <div className="mt-4">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-gray-600">/month</span>
      </div>
      <ul className="mt-6 space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        className={`w-full mt-8 py-2 px-4 rounded-lg font-medium ${
          recommended
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Select Plan
      </button>
    </div>
  );
}