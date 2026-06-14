/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{svelte,ts,js}"],
  theme: {
    extend: {
      // Step 7a: port the full palette + type scale from
      // stitch-exports/metis/DESIGN.md here.
    },
  },
  plugins: [],
};
