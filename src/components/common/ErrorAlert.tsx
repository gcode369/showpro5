import React from 'react';
import { AlertTriangle } from 'lucide-react';

type ErrorAlertProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="p-4 bg-red-50 rounded-lg flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}