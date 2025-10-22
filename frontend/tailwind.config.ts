import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EEFF',
          100: '#B3CCFF',
          200: '#80AAFF',
          300: '#4D88FF',
          400: '#1A66FF',
          500: '#0047E6',
          600: '#0038B3',
          700: '#002980',
          800: '#001A4D',
          900: '#0A1628',
          950: '#050B14',
        },
        accent: {
          50: '#E6F4FF',
          100: '#B3DFFF',
          200: '#80CAFF',
          300: '#4DB5FF',
          400: '#1AA0FF',
          500: '#007ACC',
          600: '#005F99',
          700: '#004466',
          800: '#002933',
          900: '#001419',
        },
        dark: {
          bg: '#0A1628',
          surface: '#1E3A8A',
          card: '#1e293b',
          border: '#334155',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #0A1628 0%, #1E3A8A 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(26, 102, 255, 0.5)',
        'glow-lg': '0 0 40px rgba(26, 102, 255, 0.6)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

export default config
