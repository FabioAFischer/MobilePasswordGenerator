/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.js",
    "./screens/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        surface: "#232323",
        surfaceAlt: "#1E1E1E",
        surfaceMuted: "#2A2A2A",
        border: "#2C2C2C",
        borderStrong: "#3A3A3A",
        muted: "#B3B3B3",
        primary: "#FF7A00",
        danger: "#FF6B6B",
      },
    },
  },
  plugins: [],
};
