/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // 'class' (en vez de 'media') deja inertes las variantes dark:* porque nunca
  // añadimos la clase .dark — la app es siempre tema claro.
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'SF Pro Display',
          'Inter',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        accent: {
          DEFAULT: '#0071e3',
          soft: '#e8f1fd',
        },
      },
      borderRadius: {
        apple: '1.25rem',
      },
      boxShadow: {
        apple: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
