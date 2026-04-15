import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Fetch top news (limiting to 5 for the feed)
    // World News API endpoint for searching/top-news
    const url = `https://api.worldnewsapi.com/search-news?number=5&language=en&api-key=${apiKey}`;

    // Note: World News API expects api-key in query or header 'x-api-key'
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`News API responded with ${response.status}`);
    }

    const data = await response.json();

    // Transform to our app's format
    const news = data.news.map((item: any, index: number) => ({
      id: item.id || index,
      title: item.title,
      category: 'GLOBAL', // World News API might not give categories easily in search-news
      image:
        item.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&q=80',
      timestamp: new Date(item.publish_date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    return NextResponse.json(news);
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

