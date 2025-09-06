/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 자리매 브랜드 컬러 시스템
        hazelnut: {
          DEFAULT: '#b1967b',
          50: '#f7f5f3',
          100: '#f0eae6',
          200: '#e0d4cc',
          300: '#d1bfb3',
          400: '#c1a999',
          500: '#b1967b', // 메인 컬러
          600: '#9d7f5f',
          700: '#7d6047',
          800: '#5c4431',
          900: '#3d2d21'
        },
        'muted-blue': {
          DEFAULT: '#557c9f',
          50: '#f2f5f8',
          100: '#e6ecf1',
          200: '#ccd9e3',
          300: '#b3c5d5',
          400: '#99b2c7',
          500: '#557c9f', // 포인트 컬러
          600: '#446382',
          700: '#334a66',
          800: '#223149',
          900: '#11182d'
        },
        brown: {
          50: '#faf8f7',
          100: '#f5f1ef',
          200: '#ebe3de',
          300: '#e0d5ce',
          400: '#d6c7bd',
          500: '#a68a78',
          600: '#8b6f5d',
          700: '#705442',
          800: '#553a28',
          900: '#4A2C20' // 폰트 컬러
        },
        'warm-gray': {
          DEFAULT: '#f3f2f1',
          50: '#fafaf9',
          100: '#f3f2f1', // 배경색
          200: '#e8e6e4',
          300: '#ddd9d6',
          400: '#d1cdc9',
          500: '#b8b2ac',
          600: '#9c948d',
          700: '#7d746c',
          800: '#5e544b',
          900: '#3f342a'
        },
        'muted-gray': {
          DEFAULT: '#64748b',
          50: '#f1f5f9',
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b', // 웨이팅 컬러
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617'
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        'login-card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'hard': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -5px rgba(0, 0, 0, 0.04)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'flow': 'flow 20s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '70%': { transform: 'scale(0.9)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        flow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      screens: {
        'xs': '375px',
        '3xl': '1680px'
      }
    }
  },
  plugins: []
}