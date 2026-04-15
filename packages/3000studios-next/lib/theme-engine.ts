/**
 * Live Theme Engine
 * Dynamic theming system with voice control
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName = 'marble' | 'obsidian' | 'platinum' | 'gold';

export interface Theme {
  name: ThemeName;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  gradients: {
    hero: string;
    card: string;
    button: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

const themes: Record<ThemeName, Theme> = {
  marble: {
    name: 'marble',
    colors: {
      primary: '#f5f5f5',
      secondary: '#1a1a1a',
      accent: '#d4af37',
      background: '#0a0a0a',
      text: '#f5f5f5',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #c9a24d, #fff1b8, #b88a2e)',
      card: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      button: 'linear-gradient(135deg, #c9a24d, #b88a2e)',
    },
    fonts: {
      heading: 'var(--font-inter)',
      body: 'var(--font-inter)',
    },
  },
  obsidian: {
    name: 'obsidian',
    colors: {
      primary: '#0f0f0f',
      secondary: '#1a1a1a',
      accent: '#8b5cf6',
      background: '#000000',
      text: '#e5e5e5',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      card: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(109,40,217,0.05))',
      button: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    },
    fonts: {
      heading: 'var(--font-inter)',
      body: 'var(--font-inter)',
    },
  },
  platinum: {
    name: 'platinum',
    colors: {
      primary: '#e5e4e2',
      secondary: '#bfc1c2',
      accent: '#ffffff',
      background: '#0a0a0a',
      text: '#ffffff',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #e5e4e2, #ffffff, #bfc1c2)',
      card: 'linear-gradient(135deg, rgba(229,228,226,0.1), rgba(191,193,194,0.05))',
      button: 'linear-gradient(135deg, #e5e4e2, #bfc1c2)',
    },
    fonts: {
      heading: 'var(--font-inter)',
      body: 'var(--font-inter)',
    },
  },
  gold: {
    name: 'gold',
    colors: {
      primary: '#ffd700',
      secondary: '#b8860b',
      accent: '#ffed4e',
      background: '#0a0a0a',
      text: '#f5f5f5',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #ffd700, #ffed4e, #b8860b)',
      card: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(184,134,11,0.05))',
      button: 'linear-gradient(135deg, #ffd700, #b8860b)',
    },
    fonts: {
      heading: 'var(--font-inter)',
      body: 'var(--font-inter)',
    },
  },
};

interface ThemeState {
  currentTheme: ThemeName;
  pageThemes: Record<string, ThemeName>;
  setTheme: (theme: ThemeName) => void;
  setPageTheme: (route: string, theme: ThemeName) => void;
  getTheme: () => Theme;
  getPageTheme: (route: string) => Theme;
  applyTheme: () => void;
}

export const useThemeEngine = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'marble',
      pageThemes: {},

      setTheme: (theme) => {
        set({ currentTheme: theme });
        get().applyTheme();
      },

      setPageTheme: (route, theme) => {
        set((state) => ({
          pageThemes: { ...state.pageThemes, [route]: theme },
        }));
      },

      getTheme: () => {
        return themes[get().currentTheme];
      },

      getPageTheme: (route) => {
        const pageTheme = get().pageThemes[route];
        return themes[pageTheme] || themes[get().currentTheme];
      },

      applyTheme: () => {
        if (typeof document === 'undefined') return;
        const theme = get().getTheme();
        const root = document.documentElement;

        Object.entries(theme.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value);
        });

        Object.entries(theme.gradients).forEach(([key, value]) => {
          root.style.setProperty(`--gradient-${key}`, value);
        });
      },
    }),
    { name: 'theme-engine' }
  )
);

