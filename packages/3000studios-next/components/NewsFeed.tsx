'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  image: string;
  timestamp: string;
}

const NEWS_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&q=80',
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&q=80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=80',
];

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setNews(data);
      } else {
        throw new Error('No data');
      }
    } catch (error: unknown) {
      console.warn('News API failed, using fallback data', error);
      // Fallback with high-quality tech imagery
      const topics = [
        '3Kai Neural Engine Version 2.0 Deployment Successful',
        'Autonomous Control Layer Integrated into 3000 Studios Stack',
        'Market Intelligence: AI Ad-Tech Outperforms Traditional Benchmarks',
        'Future of Command: Voice-to-Code Pipeline Latency Reduced to <10ms',
        'Global Revenue Injection: Autonomous Optimization Experiment Results',
      ];
      const categories = ['BREAKING', 'CORE', 'DATA', 'PERF', 'REVENUE'];
      const now = new Date();
      const items = topics.map((topic, i) => ({
        id: i,
        title: topic,
        category: categories[i],
        image: NEWS_IMAGES[i % NEWS_IMAGES.length],
        timestamp: new Date(
          now.getTime() - i * (3600000 + Math.random() * 600000)
        ).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setNews(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 flex-1 shadow-2xl overflow-hidden relative group h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-white tracking-tight">Intelligence Feed</h3>
          <p className="text-xs text-slate-400 font-mono">3KAI_CORE_READY</p>
        </div>
        <span className="flex items-center gap-3 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] text-red-500 font-black tracking-widest leading-none">
            SYSTEM_LIVE
          </span>
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          news.map((item, i) => (
            <motion.div
              key={`${item.id}-${i}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group/item"
            >
              <div className="w-20 h-20 bg-slate-800 rounded-xl shrink-0 overflow-hidden relative border border-white/10">
                <Image
                  src={item.image || NEWS_IMAGES[0]}
                  alt="News"
                  fill
                  className="object-cover group-hover/item:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-cyan-400 font-black tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded uppercase">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                </div>
                <div className="text-sm text-slate-200 line-clamp-2 font-semibold leading-tight group-hover/item:text-[#D4AF37] transition-colors">
                  {item.title}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

