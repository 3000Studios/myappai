// 3000 Studios - Voice Payload Handler (Phase 32 & 63)
// Routes voice commands to specific system registries without reload.

import { styleRegistry } from '@/lib/styleRegistry';
import { uiRegistry } from '@/lib/uiRegistry';

type VoicePayload = {
  target: 'ui' | 'style' | 'nav' | 'monetization';
  path: string;
  value: unknown;
};

export function handleVoicePayload(payload: VoicePayload) {
  if (process.env.NODE_ENV === 'development') {
    console.log('🎤 Voice Command Received:', payload);
  }

  if (payload.target === 'style') {
    // Phase 63: Style Control
    const { path, value } = payload;

    // Update Registry (Mutable) with type safety
    if (path in styleRegistry && typeof value === 'string') {
      (styleRegistry as unknown as Record<string, string>)[path] = value;
    }

    // Direct DOM Injection for Instant Feedback (No React Render Cycle needed for basic styles)
    if (path === 'accent' && typeof value === 'string') {
      document.body.setAttribute('data-accent', value);

      // Also force CSS variable update if needed
      if (value === 'gold')
        document.documentElement.style.setProperty('--accent-base', '212 175 55');
      if (value === 'platinum')
        document.documentElement.style.setProperty('--accent-base', '229 228 226');
      if (value === 'sapphire')
        document.documentElement.style.setProperty('--accent-base', '15 82 186');
    }
  }

  if (payload.target === 'ui') {
    // Phase 31: UI Registry Update
    const { path, value } = payload;
    const parts = path.split('.');

    // Traverse and update Mutable Registry
    let current: Record<string, unknown> = uiRegistry as Record<string, unknown>;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;

    // Trigger Custom Event for React Components to re-render if they subscribe
    window.dispatchEvent(new CustomEvent('ui-registry-update', { detail: { path, value } }));
  }

  if (payload.target === 'monetization') {
    // Phase 34-60: Monetization Automation
    import('@/lib/monetization/engine').then(({ amortizationEngine }) => {
      if (payload.path === 'inject') {
        amortizationEngine.injectLiveProduct(String(payload.value));
      }
      if (payload.path === 'scarcity') {
        amortizationEngine.triggerScarcity(Number(payload.value));
      }
    });
  }
}

