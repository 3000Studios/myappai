// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function CryptoTicker() {
  const [data, setData] = useState<CoinData[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = () => {
      axios
        .get<CoinData[]>(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false'
        )
        .then((res) => {
          // Sort by biggest percentage change (descending)
          const sorted = res.data.sort(
            (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
          );
          // Take top 20 movers
          setData(sorted.slice(0, 20));
          setError(false);
        })
        .catch(() => {
          setError(true);
          setData([]);
        });
    };

    load();
    const interval = setInterval(load, 60000); // Update every minute to keep fresh, though user asked for "market ticker show cryptos biggest percentage chagers" which usually implies 24h change.
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="w-full p-4 text-center text-red-400">Unable to load crypto data</div>;
  }

  if (data.length === 0) {
    return <div className="w-full p-4 text-center text-gray-400">Loading crypto prices...</div>;
  }

  // Duplicate the data for seamless infinite scroll
  const duplicatedData = [...data, ...data];

  return (
    <div className="w-full overflow-hidden bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 py-4">
      <div className="relative flex">
        <div className="animate-marquee flex gap-8 whitespace-nowrap">
          {duplicatedData.map((coin, index) => (
            <div key={`${coin.id}-${index}`} className="flex items-center gap-3 px-4">
              <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
              <span className="text-lg font-bold text-white">{coin.symbol.toUpperCase()}</span>
              <span className="text-lg font-semibold text-green-400">
                $
                {coin.current_price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span
                className={`text-sm font-medium ${
                  coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

