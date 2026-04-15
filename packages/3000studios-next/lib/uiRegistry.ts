// 3000 Studios - UI Registry (Phase 31)
// Real-time UI updates without rebuilds.

export const uiRegistry: Record<string, unknown> = {
  theme: {
    accent: 'gold',
    motion: true,
    density: 'luxury',
  },
  home: {
    heroText: '3000 Studios Premium',
    heroSub: 'Luxury AI Systems',
  },
};

// Update a specific key in the registry and dispatch event for listeners
export function updateRegistry<K extends keyof typeof uiRegistry>(
  key: K,
  value: Partial<(typeof uiRegistry)[K]> | unknown
): void {
  if (
    typeof uiRegistry[key] === 'object' &&
    uiRegistry[key] !== null &&
    typeof value === 'object'
  ) {
    uiRegistry[key] = { ...uiRegistry[key], ...value };
  } else {
    uiRegistry[key] = value;
  }

  // Dispatch update event for React components to re-render
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('ui-registry-update', {
        detail: { key, value: uiRegistry[key] },
      })
    );
  }
}

export type UIRegistry = typeof uiRegistry;

