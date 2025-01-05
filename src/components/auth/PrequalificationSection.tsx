import React from 'react';
import { DollarSign } from 'lucide-react';

type PrequalificationSectionProps = {
  prequalified: boolean;
  details: {
    amount: string;
    lender: string;
    expiryDate: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function PrequalificationSection({ prequalified, details, onChange }: PrequalificationSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="prequalified"
          name="prequalified"
          checked={prequalified}
          onChange={onChange}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="prequalified" className="text-sm font-medium text-gray-700">
          I am pre-qualified for a mortgage
        </label>
      </div>

      {prequalified && (
        <div className="space-y-4 pl-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pre-qualification Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="prequalificationDetails.amount"
                value={details.amount}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
                required={prequalified}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lender Name
            </label>
            <input
              type="text"
              name="prequalificationDetails.lender"
              value={details.lender}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter lender name"
              required={prequalified}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              name="prequalificationDetails.expiryDate"
              value={details.expiryDate}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={prequalified}
            />
          </div>
        </div>
      )}
    </div>
  );
}