/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        warm: '#F5EDE3',
        sand: '#D4C5B2',
        charcoal: '#2C2C2C',
        espresso: '#5C4033',
        gold: '#C9A96E',
        sage: '#8B9E7E',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Noto Serif KR', 'serif'],
        ui: ['Pretendard', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-in-out',
        'slide-up': 'slideUp 300ms ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
