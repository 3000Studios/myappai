// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

// WordPress API Types
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>[];
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: unknown[];
    author?: unknown[];
  };
}

// Crypto API Types
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
}

// Shadow Console Types
export interface LogEntry {
  type: 'command' | 'response' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export interface CommandResponse {
  success: boolean;
  output: string;
  timestamp?: string;
}

// Music Player Types
export interface Song {
  title: string;
  artist: string;
  src: string;
  duration?: number;
}

// Component Props Types
export interface NavBarProps {
  className?: string;
}

export interface HeroProps {
  title?: string;
  subtitle?: string;
}

export interface CryptoTickerProps {
  updateInterval?: number;
  maxCoins?: number;
}

export interface ShadowConsoleProps {
  initialLogs?: LogEntry[];
  enableVoice?: boolean;
}

// Collaborator Types
export type CollaboratorRole = 'admin' | 'editor' | 'viewer';

export interface Collaborator {
  id: number;
  name: string;
  email: string;
  role: CollaboratorRole;
  avatar?: string;
  addedAt: string;
}

