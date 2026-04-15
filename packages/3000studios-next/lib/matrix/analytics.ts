/**
 * Matrix Analytics Engine
 * Real-time event broadcasting system
 */

type AnalyticsEvent = {
  type: string;
  timestamp?: number;
  [key: string]: string | number | boolean | undefined;
};

// In-memory event store (replace with Redis/KV in production)
const eventListeners: Set<(event: AnalyticsEvent) => void> = new Set();
let recentEvents: AnalyticsEvent[] = [];
const MAX_EVENTS = 500;

export function pushAnalytics(event: AnalyticsEvent) {
  const fullEvent = {
    ...event,
    timestamp: event.timestamp || Date.now(),
  };

  // Add to recent events
  recentEvents.unshift(fullEvent);
  if (recentEvents.length > MAX_EVENTS) {
    recentEvents = recentEvents.slice(0, MAX_EVENTS);
  }

  // Broadcast to all listeners
  eventListeners.forEach((listener) => {
    try {
      listener(fullEvent);
    } catch (error: unknown) {
      console.error("", error);
    }
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics:', fullEvent);
  }
}

export function subscribeToAnalytics(listener: (event: AnalyticsEvent) => void) {
  eventListeners.add(listener);
  return () => eventListeners.delete(listener);
}

export function getRecentEvents(limit: number = 100): AnalyticsEvent[] {
  return recentEvents.slice(0, limit);
}

export function getEventsByType(type: string, limit: number = 50): AnalyticsEvent[] {
  return recentEvents.filter((event) => event.type === type).slice(0, limit);
}

export function clearEvents() {
  recentEvents = [];
}

