/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradientShift: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        glow: {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(99, 102, 241, 0.3)' },
          '50%': { 'box-shadow': '0 0 30px rgba(99, 102, 241, 0.6)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        premium: {
          primary: '#6366f1',
          secondary: '#8b5cf6', 
          accent: '#06b6d4',
          dark: '#1e293b',
          light: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}