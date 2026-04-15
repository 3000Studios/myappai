import { brand } from '@/design/brand';
import { prisma } from '@/lib/prisma';

export interface StatItem {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: unknown; // We'll return the name or handle the component instantiation in the UI
  color: string;
  iconName: 'DollarSign' | 'Users' | 'Calendar' | 'BarChart2';
}

// Mock database fetch
export async function getMatrixStats(): Promise<StatItem[]> {
  // Fetch from DB
  let stats = await prisma.stats.findMany();

  // Seed if empty (for demo purposes)
  if (stats.length === 0) {
    await prisma.stats.createMany({
      data: [
        {
          title: 'Total Revenue',
          value: '$12,450.00',
          change: '+15.3%',
          trend: 'up',
          iconName: 'DollarSign',
          color: brand.colors.action.primary,
        },
        {
          title: 'Active Visitors',
          value: '1,240',
          change: '+8.1%',
          trend: 'up',
          iconName: 'Users',
          color: '#22d3ee',
        },
        {
          title: 'Avg. Session',
          value: '4m 32s',
          change: '-1.2%',
          trend: 'down',
          iconName: 'Calendar',
          color: '#f472b6',
        },
        {
          title: 'Conversion Rate',
          value: '3.2%',
          change: '+0.4%',
          trend: 'up',
          iconName: 'BarChart2',
          color: '#a78bfa',
        },
      ],
    });
    stats = await prisma.stats.findMany();
  }

  return stats.map(
    (s: {
      id: number;
      title: string;
      value: string;
      change: string;
      trend: string;
      iconName: string;
      color: string;
      updatedAt: Date;
    }) => ({
      ...s,
      icon: null, // UI handles icon rendering logic
      trend: s.trend as 'up' | 'down',
      iconName: s.iconName as 'DollarSign' | 'Users' | 'Calendar' | 'BarChart2',
    })
  ) as StatItem[];
}

