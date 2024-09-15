/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minHeight: {
        8080: "80vh",
      },
      height: {
        "3/5": "60%", // Custom 60% height
        128: "32rem", // Örneğin, 32rem (512px)
        144: "36rem", // Örneğin, 36rem (576px)
        160: "40rem",
        7676: "76vh",
        "table":"588px",
        "usertable":"360px"
      },
      maxHeight: {
        128: "32rem", // Örneğin, 32rem (512px)
        144: "36rem", // Örneğin, 36rem (576px)
        128: "32rem", // Örneğin, 32rem (512px)
        144: "36rem", // Örneğin, 36rem (576px)
        160: "40rem",
        7676: "76vh",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dracula", "retro", "cmyk"], // DaisyUI temalarını burada tanımla
  },
  darkMode: ["class", '[data-theme="retro"]'],
};
