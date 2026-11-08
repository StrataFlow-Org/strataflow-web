import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0E17",
        foreground: "#F8FAFC",
        brand: {
          primary: "#6366F1",
          secondary: "#4338CA",
          accent: "#14B8A6",
          warning: "#F59E0B",
          surface: "#111827",
          border: "#1E293B",
        },
      },
    },
  },
  plugins: [],
};
export default config;

