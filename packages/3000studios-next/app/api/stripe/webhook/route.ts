import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/services/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is missing');
    }
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error: unknown) {
    console.error(`Webhook Error: ${(error as Error).message}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // 1. Create Order
      const amount = session.amount_total ? session.amount_total / 100 : 0;
      const userId = session.metadata?.userId || null;

      await prisma.order.create({
        data: {
          total: amount,
          status: 'paid',
          provider: 'stripe',
          providerOrderId: session.id,
          userId: userId,
          // We would ideally link items here too if we had line items expanded
        },
      });

      // 2. Update Revenue Stats
      // Find 'Revenue' stat or create/update it
      const revenueStat = await prisma.stats.findFirst({
        where: { title: 'Total Revenue' },
      });

      if (revenueStat) {
        // Parse current value, remove symbols
        const currentRevenue = parseFloat(revenueStat.value.replace(/[^0-9.-]+/g, '')) || 0;
        const newRevenue = currentRevenue + amount;
        await prisma.stats.update({
          where: { id: revenueStat.id },
          data: {
            value: `$${newRevenue.toLocaleString()}`,
            change: '+2.5%', // Mock trend update
            trend: 'up',
          },
        });
      } else {
        // Initialize if not exists
        await prisma.stats.create({
          data: {
            title: 'Total Revenue',
            value: `$${amount.toLocaleString()}`,
            change: '+100%',
            trend: 'up',
            iconName: 'DollarSign',
            color: 'text-green-500',
          },
        });
      }

      // Payment processed
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook Handler Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

