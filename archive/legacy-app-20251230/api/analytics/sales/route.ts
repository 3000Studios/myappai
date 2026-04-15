// Copyright (c) 2025 NAME.
// All rights reserved.

import { NextResponse } from "next/server";

// Track sales in memory (production should use a database)
const salesLog: Array<{
  timestamp: number;
  product: string;
  amount: number;
  paymentId?: string;
  customer?: string;
}> = [];

export async function POST(req: Request) {
  try {
    const { product, amount, paymentId, customer } = await req.json();

    salesLog.push({
      timestamp: Date.now(),
      product,
      amount,
      paymentId,
      customer,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error") : "An error occurred" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;
    const last7d = now - 7 * 24 * 60 * 60 * 1000;
    const last30d = now - 30 * 24 * 60 * 60 * 1000;

    const sales24h = salesLog.filter((s) => s.timestamp > last24h);
    const sales7d = salesLog.filter((s) => s.timestamp > last7d);
    const sales30d = salesLog.filter((s) => s.timestamp > last30d);

    const revenue24h = sales24h.reduce((sum, s) => sum + s.amount, 0);
    const revenue7d = sales7d.reduce((sum, s) => sum + s.amount, 0);
    const revenue30d = sales30d.reduce((sum, s) => sum + s.amount, 0);
    const revenueTotal = salesLog.reduce((sum, s) => sum + s.amount, 0);

    // Top products
    const productSales: Record<string, { count: number; revenue: number }> = {};
    salesLog.forEach((s) => {
      if (!productSales[s.product]) {
        productSales[s.product] = { count: 0, revenue: 0 };
      }
      productSales[s.product].count++;
      productSales[s.product].revenue += s.amount;
    });

    const topProducts = Object.entries(productSales)
      .map(([product, data]) => ({ product, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      totalSales: salesLog.length,
      sales24h: sales24h.length,
      sales7d: sales7d.length,
      sales30d: sales30d.length,
      revenue24h,
      revenue7d,
      revenue30d,
      revenueTotal,
      topProducts,
      recentSales: salesLog.slice(-10).reverse(),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error") : "An error occurred" },
      { status: 500 },
    );
  }
}

