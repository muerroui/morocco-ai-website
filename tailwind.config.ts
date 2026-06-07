import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1F2A5C',
          50:      '#EEF0F7',
          900:     '#141B3D',
        },
        red: {
          DEFAULT: '#C8202F',
          50:      '#FBEAEC',
          900:     '#7A1219',
        },
        ink:  '#0A0A0B',
        bone: '#F5F1EA',
        mist: '#E8E5DE',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans:    ['var(--font-inter)',    'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic:  ['var(--font-arabic)',   'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'marquee':    'marquee 32s linear infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
