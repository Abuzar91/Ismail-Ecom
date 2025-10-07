/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0A0A0A',
          charcoal: '#1A1A1A',
          darkgray: '#2A2A2A',
          gold: '#D4AF37',
          cream: '#F5F5DC',
          pearl: '#F8F8F8',
        },
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #0A0A0A 0%, #2A2A2A 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F4E5C3 100%)',
      },
    },
  },
  plugins: [],
};
