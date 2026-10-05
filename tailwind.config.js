/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        figtree: ['Figtree', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      screens: {
        // min-width breakpoints (mobile-first approach)
        // sm  = 640px  (default)
        // md  = 768px  (default)
        // lg  = 1024px (default)
        // xl  = 1280px (default)
        // Custom named variants using raw media queries
        'mobile': { raw: '(max-width: 809.98px)' },
        'md-tablet': { raw: '(min-width: 810px) and (max-width: 1199.98px)' },
      },
      colors: {
        accent: '#F598F2',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
