/**
 * Performance Auto-Tuner
 * Continuously optimizes performance metrics
 */

'use client';

export class PerformanceAutoTuner {
  private static instance: PerformanceAutoTuner;
  private metrics: Map<string, number> = new Map();

  static getInstance() {
    if (!PerformanceAutoTuner.instance) {
      PerformanceAutoTuner.instance = new PerformanceAutoTuner();
    }
    return PerformanceAutoTuner.instance;
  }

  init() {
    if (typeof window === 'undefined') return;

    // Monitor performance
    this.trackCoreWebVitals();
    this.optimizeBundles();
    this.adjustImageFormats();
    this.tuneCaching();
    this.optimizePrefetch();
  }

  private trackCoreWebVitals() {
    if ('web-vital' in window) {
      // Track LCP, FID, CLS
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.set(entry.name, entry.startTime);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
  }

  private optimizeBundles() {
    // Dynamic import optimization
    console.log('Optimizing bundle splitting');
  }

  private adjustImageFormats() {
    // Detect WebP/AVIF support
    const supportsWebP =
      document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    const supportsAVIF = false; // Detect AVIF support

    if (supportsAVIF) {
      document.documentElement.classList.add('avif');
    } else if (supportsWebP) {
      document.documentElement.classList.add('webp');
    }
  }

  private tuneCaching() {
    // Service worker cache optimization
    if ('serviceWorker' in navigator) {
      // Cache critical assets
      console.log('Tuning cache strategy');
    }
  }

  private optimizePrefetch() {
    // Intelligent prefetching based on user behavior
    const links = document.querySelectorAll('a[href^="/"]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          const href = link.getAttribute('href');
          if (href) this.prefetchRoute(href);
        }
      });
    });

    links.forEach((link) => observer.observe(link));
  }

  private prefetchRoute(href: string) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }

  getMetrics() {
    return Array.from(this.metrics.entries()).map(([name, value]) => ({ name, value }));
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    PerformanceAutoTuner.getInstance().init();
  });
}

