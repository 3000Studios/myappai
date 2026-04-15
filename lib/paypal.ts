export async function getPayPalClient() {
  return {
    env: process.env.PAYPAL_ENV || 'sandbox',
  };
}

