import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();

    // Mock Stripe subscription (replace with real Stripe key)
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });

    // Price IDs for different plans
    const priceIds: Record<string, string> = {
      monthly: 'price_monthly_placeholder',
      yearly: 'price_yearly_placeholder',
      lifetime: 'price_lifetime_placeholder',
    };

    // Real Stripe implementation:
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   line_items: [{ price: priceIds[plan], quantity: 1 }],
    //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/revenue`
    // });

    // Mock response
    const mockSession = {
      url: `/dashboard?subscribed=${plan}&session=mock_${Date.now()}`,
      id: 'mock_sub_' + Date.now(),
    };

    return NextResponse.json({ url: mockSession.url, id: mockSession.id });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error instanceof Error
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Unknown error'
        : 'Subscription failed';
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

