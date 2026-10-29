/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0f9fa',
          100: '#d9f2f5',
          200: '#b5e5eb',
          300: '#83d1db',
          400: '#43b3c2',
          500: '#1b93a3',
          600: '#157583',
          700: '#135c67',
          800: '#0f4851',
          900: '#0a343b',
          950: '#052025',
        },
        sand: {
          50: '#fdfbf7',
          100: '#f7f2e8',
          200: '#eee3cd',
          300: '#e1cea9',
          400: '#cfb17d',
          500: '#b99256',
          600: '#a17844',
          700: '#7e5a35',
          800: '#5c4129',
          900: '#3e2c1d',
          950: '#23170e',
        },
        rift: {
          water: '#167684',
          deep: '#0a333a',
          sandstone: '#d7ab76',
          amber: '#c07228',
          acacia: '#2b5e48',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(10, 51, 58, 0.12)',
        'glow-teal': '0 0 25px rgba(27, 147, 163, 0.3)',
        'glow-sand': '0 0 25px rgba(215, 171, 118, 0.35)',
      }
    },
  },
  plugins: [],
}

