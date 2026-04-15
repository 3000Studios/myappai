import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { priceId } = (await req.json()) as { priceId?: string };

    // Mock Stripe checkout (replace with real Stripe key)
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });

    // For now, return mock session
    const mockSession = {
      url: `/success?session=mock_${Date.now()}${priceId ? `&priceId=${encodeURIComponent(priceId)}` : ''}`,
      id: 'mock_session_id',
    };

    // Real Stripe implementation:
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'payment',
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   success_url: `${ process.env.NEXT_PUBLIC_BASE_URL } /success`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`
    // });

    return NextResponse.json({ url: mockSession.url, id: mockSession.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

