import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stripeService } from '../../services/payment/StripeService';
import { Button } from '../common/Button';
import { useAuthStore } from '../../store/authStore';

type PaymentFormProps = {
  priceId: string;
};

export function PaymentForm({ priceId }: PaymentFormProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const sessionUrl = await stripeService.createPaymentSession(priceId, user.id);
      await stripeService.redirectToCheckout(sessionUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Subscribe Now'}
      </Button>
    </form>
  );
}