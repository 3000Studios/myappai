import type { Config } from 'tailwindcss';

export default {
  content: ['./apps/**/*.{ts,tsx}', './packages/**/*.{ts,tsx}'],
  theme: {
    extend: {
      animation: {
        warp: 'warp 0.8s ease-in-out',
        glow: 'glow 2s infinite alternate',
      },
      keyframes: {
        warp: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(25)', opacity: '0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px gold' },
          '100%': { boxShadow: '0 0 30px gold' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

