import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. You can try again when you're ready.
        </p>
        <div className="space-y-4">
          <Button onClick={() => navigate('/subscription')} className="w-full">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="w-full">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}