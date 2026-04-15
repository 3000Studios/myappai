import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.MARKETSTACK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // MarketStack EOD endpoint
    // Symbols: SPY (S&P 500), AAPL, TSLA, NVDA, BTC-USD (if supported, else standard stocks)
    // MarketStack free tier mostly supports major exchanges.
    const symbols = 'AAPL,MSFT,GOOGL,AMZN,TSLA';
    const url = `http://api.marketstack.com/v1/eod/latest?access_key=${apiKey}&symbols=${symbols}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`MarketStack API responded with ${response.status}`);
    }

    const data = await response.json();

    const stocks = data.data.map((item: any) => ({
      symbol: item.symbol,
      price: item.close,
      change: 0, // MarketStack 'latest' often just gives the close. Calculating change requires previous day.
      // For simplicity in this marquee, we'll just show the price or randomize the change if real-time diff isn't easy
      // reliably on free tier without multiple calls.
      // Actually, let's just send the price.
    }));

    return NextResponse.json(stocks);
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}

