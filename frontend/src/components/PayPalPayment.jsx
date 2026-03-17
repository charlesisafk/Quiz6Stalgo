import React from 'react';
import { Button } from 'react-bootstrap';

export default function PayPalPayment({ serviceId, amount, onSuccess, onError }) {
  const handlePayment = async () => {
    try {
      onSuccess?.({ transaction_id: 'TXN_' + Date.now() });
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <Button
      variant="warning"
      size="lg"
      onClick={handlePayment}
      className="w-100 paypal-button"
    >
      <i className="fab fa-paypal me-2" />
      Pay with PayPal - ${amount}
    </Button>
  );
}
