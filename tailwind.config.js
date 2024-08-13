/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: { 
    extend: {
      colors: {
        'primary': '#6db64c',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true, preferredStrategy: 'pseudoelements' })],
}