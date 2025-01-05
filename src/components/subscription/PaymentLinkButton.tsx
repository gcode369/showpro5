import React from 'react';
import { Button } from '../common/Button';
import { stripePaymentService } from '../../services/payment/StripePaymentService';

type PaymentLinkButtonProps = {
  tier: 'basic' | 'premium';
  className?: string;
};

export function PaymentLinkButton({ tier, className }: PaymentLinkButtonProps) {
  const handleClick = () => {
    const paymentUrl = stripePaymentService.getPaymentLink(tier);
    window.location.href = paymentUrl;
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
    >
      Subscribe Now
    </Button>
  );
}