
import { ProjectTask, ShoppingItem } from './types';

export const COLORS = {
  purple: {
    light: '#a855f7',
    DEFAULT: '#9333ea',
    dark: '#7e22ce',
  },
  green: {
    light: '#4ade80',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
  },
  gold: {
    light: '#fbbf24',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  }
};

// No initial dummy tasks to avoid confusion
export const INITIAL_TASKS: ProjectTask[] = [];

// Research-based National Average Benchmarks for high-quality implementations.
// Labels added to description for absolute clarity.
export const SHOPPING_LIST_ITEMS: ShoppingItem[] = [
  { 
    id: 's1', 
    title: 'Online Ordering Integration', 
    description: '[NATIONAL AVERAGE BENCHMARK] Professional setup usually ranges $2,000 - $5,000. This is NOT a final quote.', 
    cost: 3500, 
    category: 'Feature', 
    isChecked: false 
  },
  { 
    id: 's2', 
    title: 'Reservation Booking System', 
    description: '[NATIONAL AVERAGE BENCHMARK] Professional setup usually ranges $800 - $2,500. This is NOT a final quote.', 
    cost: 1200, 
    category: 'Feature', 
    isChecked: false 
  },
  { 
    id: 's3', 
    title: 'Advanced SEO & Analytics', 
    description: '[NATIONAL AVERAGE BENCHMARK] Initial audit and setup usually ranges $1,500 - $4,000. This is NOT a final quote.', 
    cost: 2500, 
    category: 'Marketing', 
    isChecked: false 
  },
  { 
    id: 's4', 
    title: 'Mobile App Store Deployment', 
    description: '[NATIONAL AVERAGE BENCHMARK] Custom PWA/Store presence usually ranges $3,000 - $7,000. This is NOT a final quote.', 
    cost: 4500, 
    category: 'Technical', 
    isChecked: false 
  },
  { 
    id: 's5', 
    title: 'Visual Identity Refresh', 
    description: '[NATIONAL AVERAGE BENCHMARK] Full brand alignment usually ranges $2,000 - $6,000. This is NOT a final quote.', 
    cost: 3000, 
    category: 'Design', 
    isChecked: false 
  },
  { 
    id: 's6', 
    title: 'Accessibility Compliance (WCAG)', 
    description: '[NATIONAL AVERAGE BENCHMARK] Enterprise-level audit and fix usually ranges $1,000 - $3,500. This is NOT a final quote.', 
    cost: 1800, 
    category: 'Design', 
    isChecked: false 
  }
];
