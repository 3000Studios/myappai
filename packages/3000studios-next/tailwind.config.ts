import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-italiana)', 'serif'],
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
      },
      colors: {
        hologram: '#8B5CF6',
        mercury: '#E5E5E5',
        platinum: '#E5E4E2',
        void: '#030303',
        obsidian: '#020202',
        accent: '#a5f3fc',
      },
      backgroundImage: {
        'glass-gradient':
          'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 100%)',
        'metallic-gradient':
          'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.01) 100%)',
      },
      animation: {
        grain: 'grain 8s steps(10) infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 25s linear infinite',
        'neon-flash': 'neon-flash 1s ease-in-out infinite',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'neon-flash': {
          '0%, 100%': { color: '#39FF14', textShadow: '0 0 20px #39FF14, 0 0 40px #39FF14' },
          '50%': { color: '#FFFF00', textShadow: '0 0 20px #FFFF00, 0 0 40px #FFFF00' },
        },
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
    function ({ addUtilities }: { addUtilities: (utilities: any) => void }) {
      addUtilities({
        '.hyper-glass': {
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          background: 'rgba(0, 0, 0, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      });
    },
  ],
};

export default config;

