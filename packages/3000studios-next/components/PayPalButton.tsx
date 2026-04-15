'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useState } from 'react';

interface PayPalButtonProps {
  amount: number;
  onSuccess?: (details: any) => void;
}

export default function PayPalButton({ amount, onSuccess }: PayPalButtonProps) {
  const [error, setError] = useState<string | null>(null);

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    intent: 'capture',
  };

  return (
    <div className="w-full">
      {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}

      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: 'USD',
                  },
                },
              ],
              intent: 'CAPTURE',
            });
          }}
          onApprove={(data, actions) => {
            if (!actions.order) return Promise.resolve();
            return actions.order.capture().then((details) => {
              console.log('PayPal Payment Success:', details);
              if (onSuccess) onSuccess(details);
            });
          }}
          onError={(err) => {
            console.error("", err);
            setError('PayPal encountered exists. Please try again.');
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}

