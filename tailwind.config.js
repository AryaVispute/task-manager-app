/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base
        black: "#000000",
        white: "#ffffff",
        
        // New SaaS Palette
        "brand-blue": "#77BEF0",
        "brand-yellow": "#FFCB61",
        "brand-orange": "#FF894F",
        "brand-red": "#EA5B6F",
        
        // Legacy/Semantic mapping updates to keep components working
        blue: "#77BEF0",
        pink: "#EA5B6F",
        "pink-light": "#FFCB6133", // Using yellow tint for light pink logic
        cream: "#f9fafb",
        sky: "#77BEF088",
        yellow: "#FFCB61",
        "pink-bold": "#EA5B6F",
      },
    },
  },
  plugins: [],
}
