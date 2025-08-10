/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ✅ dark mode enabled like before
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f6fa',
          100: '#dceaf4',
          200: '#bed7e9',
          300: '#93bdd9',
          400: '#619bc4',
          500: '#3e7dae',
          600: '#0F3460', // Primary navy blue
          700: '#284c74',
          800: '#254361',
          900: '#223b53',
          950: '#15253a',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#16A34A', // Emerald green accent
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#F59E0B', // Warm gold highlight
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#16A34A',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            p: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            ul: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
