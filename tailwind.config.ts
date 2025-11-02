import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        blue: {
          primary: "#0D6EFD",
        },
        orange: {
          background: "#FD384F",
          hover: "#e23246",
          primary: "#FA6338",
          seconadry: "#d3031c",
          border: "#ffe6e7",
        },
        main: {
          primary: "#191919",
          secondary: "#757575",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        home: "url(/public/assets/images/home-wallpaper.webp)",
      },
      transitionTimingFunction: {
        "bezier-1": "cubic-bezier(.645,.045,.355,1)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
