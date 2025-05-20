/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#228B22",
        bark: "#8B5E3C",
        sky: "#38BDF8",
        beige: "#F3F4F6",
      },
    },
  },
  plugins: [],
};
// This configuration file is used to set up Tailwind CSS in a React application
// It specifies the paths to all of the files that Tailwind should scan for class names
