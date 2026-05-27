import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        "sans": ["Atkinson", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        bean: {
          50: "#FAF7F0",
          100: "#F5F1E8",
          200: "#E8E0D0",
        },
        olive: {
          300: "#A3B18A",
          500: "#588157",
          700: "#3A5A40",
          900: "#2D4A2B",
        },
        ink: {
          700: "#5C5C4F",
          900: "#2D2D2D",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "full",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
