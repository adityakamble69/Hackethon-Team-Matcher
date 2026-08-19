/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        text: '#ffffff',
        muted: '#8e8e8e',
        'nav-text': '#2e2e2e',
        'pill-dark': '#28282a',
        'sign-in-text': '#c8c8c8',
        surface: '#111111',
        'surface-alt': '#1a1a1a'
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['BubbledotICG-FinePos', 'Geist Pixel Circle', 'monospace']
      }
    }
  },
  plugins: []
};
