'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function StockMarquee() {
  const [stocks, setStocks] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        // Fetch top 100 coins to find biggest movers
        const res = await axios.get<CoinData[]>(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false'
        );

        // Sort by biggest percentage change (descending)
        const sorted = res.data.sort(
          (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
        );

        // Take top 20 movers
        setStocks(sorted.slice(0, 20));
        setLoading(false);
      } catch (e: unknown) {
        console.warn('Crypto API failed, retrying...', e);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 60000); // 1 min update
    return () => clearInterval(interval);
  }, []);

  if (loading && stocks.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-white/10 h-10 flex items-center overflow-hidden">
      <motion.div
        className="flex gap-12 items-center whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: 40,
          ease: 'linear',
        }}
        style={{ width: 'max-content' }}
      >
        {/* Repeat list to create infinite loop effect */}
        {[...stocks, ...stocks, ...stocks].map((stock, i) => (
          <div key={`${stock.id}-${i}`} className="flex items-center gap-2">
            <span className="font-bold text-[#D4AF37]">{stock.symbol.toUpperCase()}</span>
            <span className="text-white">${stock.current_price.toLocaleString()}</span>
            <span
              className={`text-xs ${stock.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {stock.price_change_percentage_24h >= 0 ? '▲' : '▼'}{' '}
              {Math.abs(stock.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

