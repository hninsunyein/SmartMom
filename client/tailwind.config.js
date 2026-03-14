/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#FAF5FF',
          200: '#E9D5FF',
          500: '#A855F7',
          600: '#9333EA',
        },
        pink: {
          50: '#FDF2F8',
          200: '#FBCFE8',
          500: '#EC4899',
          600: '#DB2777',
        },
        gray: {
          50: '#F9FAFB',
          200: '#E5E7EB',
          500: '#6B7280',
          600: '#4B5563',
          900: '#111827',
        }
      },
      backgroundImage: {
        'gradient-purple-pink': 'linear-gradient(to right, #A855F7, #EC4899)',
      }
    },
  },
  plugins: [],
}