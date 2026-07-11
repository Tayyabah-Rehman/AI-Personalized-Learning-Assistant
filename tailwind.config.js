/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2b6bf0",
        "primary-dark": "#1a3d7c",
        "primary-light": "#e8f0fe",
        accent: "#f59e0b",
        navy: "#1a3d7c",
        blue: {
          50: "#e8f0fe",
          100: "#c5d8fd",
          500: "#2b6bf0",
          600: "#1e5ce0",
          700: "#1a4fc0",
          800: "#1a3d7c",
          900: "#122860",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #1a3d7c 0%, #2b6bf0 100%)",
        "brand-gradient-light": "linear-gradient(135deg, #1e5ce0 0%, #4f8ef7 100%)",
      },
      boxShadow: {
        "blue-sm": "0 2px 8px rgba(43,107,240,0.15)",
        "blue-md": "0 4px 20px rgba(43,107,240,0.25)",
        "blue-lg": "0 8px 40px rgba(43,107,240,0.3)",
      },
    },
  },
  plugins: [],
};
