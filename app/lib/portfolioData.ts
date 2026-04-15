/**
 * Portfolio and Case Studies Data
 * Showcase of completed projects with detailed case studies
 */

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  featured: boolean;
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'project-ecommerce-revolution',
    title: 'E-Commerce Revolution',
    client: 'StyleHub Fashion',
    category: 'E-Commerce',
    year: '2024',
    description:
      'Complete e-commerce platform redesign that transformed an outdated shopping experience into a modern, conversion-optimized powerhouse.',
    challenge:
      'StyleHub was losing customers to competitors due to a slow, confusing checkout process and poor mobile experience. Cart abandonment rate was 78%.',
    solution:
      'We rebuilt the entire platform using Next.js and headless commerce architecture. Implemented one-click checkout, AI-powered product recommendations, and real-time inventory management.',
    results: [
      '312% increase in online sales',
      '65% reduction in cart abandonment',
      '4.2x faster page load times',
      '89% mobile conversion improvement',
      '$2.4M additional annual revenue',
    ],
    technologies: ['Next.js', 'Shopify', 'Stripe', 'Tailwind CSS', 'Vercel'],
    featured: true,
    testimonial: {
      quote:
        "3000 Studios didn't just build us a website—they transformed our entire business. The results speak for themselves.",
      author: 'Sarah Chen',
      position: 'CEO, StyleHub Fashion',
    },
    metrics: [
      { label: 'Revenue Increase', value: '+312%' },
      { label: 'Page Speed', value: '4.2x' },
      { label: 'Conversion Rate', value: '+89%' },
    ],
  },
  {
    id: 'project-fintech-dashboard',
    title: 'FinTech Analytics Dashboard',
    client: 'CapitalFlow',
    category: 'SaaS',
    year: '2024',
    description:
      'Enterprise-grade analytics dashboard for real-time financial data visualization and reporting.',
    challenge:
      'CapitalFlow needed to process and visualize millions of financial transactions in real-time while maintaining security and compliance.',
    solution:
      'Built a scalable dashboard using React and D3.js with WebSocket connections for real-time updates. Implemented role-based access control and comprehensive audit logging.',
    results: [
      '10M+ daily transactions processed',
      '99.99% uptime achieved',
      '45% increase in user engagement',
      'SOC 2 Type II compliance certified',
      '200+ enterprise clients onboarded',
    ],
    technologies: ['React', 'TypeScript', 'D3.js', 'Node.js', 'PostgreSQL', 'AWS'],
    featured: true,
    testimonial: {
      quote:
        "The dashboard 3000 Studios built handles our most critical data with ease. It's both powerful and intuitive.",
      author: 'Michael Rodriguez',
      position: 'CTO, CapitalFlow',
    },
    metrics: [
      { label: 'Uptime', value: '99.99%' },
      { label: 'Daily Transactions', value: '10M+' },
      { label: 'User Growth', value: '+45%' },
    ],
  },
  {
    id: 'project-health-app',
    title: 'FitLife Mobile App',
    client: 'FitLife Health',
    category: 'Mobile App',
    year: '2024',
    description:
      'Comprehensive fitness and wellness app with AI-powered workout plans and nutrition tracking.',
    challenge:
      'FitLife wanted to stand out in a crowded fitness app market and provide truly personalized experiences at scale.',
    solution:
      'Developed native iOS and Android apps with machine learning algorithms for personalized recommendations. Integrated with wearables and created a social community feature.',
    results: [
      '500K+ downloads in first 3 months',
      '4.8-star average rating',
      '70% daily active user rate',
      '30K paid subscribers',
      'Featured by Apple & Google',
    ],
    technologies: ['React Native', 'Firebase', 'TensorFlow', 'HealthKit', 'Google Fit'],
    featured: true,
    testimonial: {
      quote:
        'The team at 3000 Studios brought our vision to life and then some. Our users love the app!',
      author: 'Jennifer Martinez',
      position: 'Founder, FitLife Health',
    },
    metrics: [
      { label: 'Downloads', value: '500K+' },
      { label: 'App Rating', value: '4.8★' },
      { label: 'DAU Rate', value: '70%' },
    ],
  },
  {
    id: 'project-real-estate',
    title: 'LuxuryHomes Platform',
    client: 'LuxuryHomes Realty',
    category: 'Real Estate',
    year: '2024',
    description:
      'Premium real estate platform with virtual tours, AI-powered property matching, and integrated CRM.',
    challenge:
      'LuxuryHomes needed to digitize their high-end property sales process without losing the personalized, luxury touch.',
    solution:
      'Created an immersive platform with 3D virtual tours, AI property recommendations, and seamless agent-client communication tools.',
    results: [
      '156% increase in qualified leads',
      '$127M in properties sold via platform',
      '92% client satisfaction score',
      '40% reduction in time-to-sale',
      'Expanded to 5 new markets',
    ],
    technologies: ['Next.js', 'Three.js', 'MongoDB', 'OpenAI', 'Twilio'],
    featured: true,
    testimonial: {
      quote:
        'This platform revolutionized how we sell luxury properties. Our agents and clients both love it.',
      author: 'David Thompson',
      position: 'Managing Director, LuxuryHomes Realty',
    },
    metrics: [
      { label: 'Lead Increase', value: '+156%' },
      { label: 'Sales Volume', value: '$127M' },
      { label: 'Client Satisfaction', value: '92%' },
    ],
  },
  {
    id: 'project-restaurant-ordering',
    title: 'TableReserve & Order',
    client: 'Gourmet Restaurant Group',
    category: 'Restaurant Tech',
    year: '2023',
    description:
      'Integrated reservation and online ordering system for multi-location restaurant group.',
    challenge:
      'Managing reservations and orders across 15 locations with inconsistent systems and poor customer experience.',
    solution:
      'Built unified platform with table management, online ordering, kitchen display systems, and customer loyalty program.',
    results: [
      '87% increase in online orders',
      '34% boost in table turnover',
      '$890K additional annual revenue',
      '15K loyalty program members',
      '4.6★ average customer rating',
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Socket.io'],
    featured: false,
    testimonial: {
      quote:
        'Operations are smoother, customers are happier, and revenue is up significantly. Best investment we made.',
      author: 'Chef Antoine Dubois',
      position: 'Owner, Gourmet Restaurant Group',
    },
    metrics: [
      { label: 'Order Growth', value: '+87%' },
      { label: 'Revenue Impact', value: '$890K' },
      { label: 'Customer Rating', value: '4.6★' },
    ],
  },
  {
    id: 'project-education-platform',
    title: 'LearnPro LMS',
    client: 'LearnPro Education',
    category: 'EdTech',
    year: '2023',
    description:
      'Modern learning management system with video streaming, interactive quizzes, and progress tracking.',
    challenge:
      "LearnPro's outdated LMS couldn't handle video streaming or provide engaging interactive experiences.",
    solution:
      'Developed scalable video platform with adaptive streaming, gamified learning paths, and real-time collaboration tools.',
    results: [
      '250K students enrolled',
      '94% course completion rate',
      '78% student satisfaction increase',
      '$3.2M ARR achieved',
      'Expanded to 12 countries',
    ],
    technologies: ['Next.js', 'AWS', 'WebRTC', 'MongoDB', 'Redis'],
    featured: false,
    testimonial: {
      quote:
        'The platform is incredible. Our students are more engaged than ever, and completion rates have skyrocketed.',
      author: 'Dr. Emily Watson',
      position: 'CEO, LearnPro Education',
    },
    metrics: [
      { label: 'Students', value: '250K' },
      { label: 'Completion Rate', value: '94%' },
      { label: 'ARR', value: '$3.2M' },
    ],
  },
  {
    id: 'project-nonprofit-portal',
    title: 'GiveHope Donation Portal',
    client: 'GiveHope Foundation',
    category: 'Non-Profit',
    year: '2023',
    description: 'Transparent donation platform with impact tracking and donor engagement tools.',
    challenge:
      'GiveHope needed to increase donations while providing complete transparency on fund usage.',
    solution:
      'Created donation platform with real-time impact tracking, recurring giving options, and detailed fund allocation reports.',
    results: [
      '423% increase in donations',
      '$5.8M raised in first year',
      '8,900 new monthly donors',
      '97% donor retention rate',
      'Featured in Forbes & TechCrunch',
    ],
    technologies: ['React', 'Stripe', 'Node.js', 'PostgreSQL', 'SendGrid'],
    featured: false,
    testimonial: {
      quote:
        'This platform has transformed our fundraising. Donors love seeing exactly where their money goes.',
      author: 'Rebecca Johnson',
      position: 'Executive Director, GiveHope Foundation',
    },
    metrics: [
      { label: 'Donation Growth', value: '+423%' },
      { label: 'Total Raised', value: '$5.8M' },
      { label: 'Retention Rate', value: '97%' },
    ],
  },
  {
    id: 'project-startup-mvp',
    title: 'TechStart MVP Launch',
    client: 'TechStart Ventures',
    category: 'Startup',
    year: '2023',
    description: 'Rapid MVP development for innovative B2B SaaS platform in just 6 weeks.',
    challenge:
      'TechStart needed to validate their idea quickly with a functional MVP before their funding round.',
    solution:
      'Agile development process with weekly iterations, core feature prioritization, and user testing throughout.',
    results: [
      'MVP launched in 6 weeks',
      '1,200 beta users acquired',
      '$2M seed funding secured',
      '85% feature satisfaction rate',
      'Product-market fit validated',
    ],
    technologies: ['Next.js', 'Supabase', 'Tailwind CSS', 'Vercel', 'PostHog'],
    featured: false,
    testimonial: {
      quote:
        'They moved at startup speed without cutting corners. Helped us secure funding and launch successfully.',
      author: 'Alex Kim',
      position: 'Co-Founder, TechStart Ventures',
    },
    metrics: [
      { label: 'Launch Time', value: '6 weeks' },
      { label: 'Beta Users', value: '1,200' },
      { label: 'Funding Raised', value: '$2M' },
    ],
  },
];

export function getFeaturedPortfolio(): PortfolioItem[] {
  return portfolioItems.filter((item) => item.featured);
}

export function getPortfolioByCategory(category: string): PortfolioItem[] {
  return portfolioItems.filter((item) => item.category === category);
}

export function getPortfolioById(id: string): PortfolioItem | undefined {
  return portfolioItems.find((item) => item.id === id);
}

export function getAllPortfolioCategories(): string[] {
  return Array.from(new Set(portfolioItems.map((item) => item.category)));
}

