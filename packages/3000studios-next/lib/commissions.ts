export async function trackCommission(data: {
  vendorId: string;
  productId: string;
  price: number;
}) {
  console.log('💰 COMMISSION EVENT', data);

  // Later:
  // - Save to DB
  // - Send to analytics
  // - Trigger payout logic
}

