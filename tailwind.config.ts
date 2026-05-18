import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // A3 brand palette
        brand: {
          DEFAULT: "#1DB954",
          50: "#E8F8EE",
          100: "#C5EFD2",
          200: "#9EE5B4",
          300: "#74DA95",
          400: "#4DD076",
          500: "#1DB954",
          600: "#17A348",
          700: "#118338",
          800: "#0B6128",
          900: "#063D19",
        },
        ink: {
          DEFAULT: "#0B0D0F",
          50: "#F2F3F4",
          100: "#D9DBDD",
          200: "#B5B8BB",
          300: "#888C92",
          400: "#5C6068",
          500: "#3D414A",
          600: "#2C3038",
          700: "#1C1F25",
          800: "#111214",
          900: "#0B0D0F",
          950: "#050510",
        },
        charcoal: {
          DEFAULT: "#2C3038",
          soft: "#3D414A",
        },
        stone: {
          DEFAULT: "#5A6170",
          400: "#8A919C",
          200: "#E5E7EB",
          100: "#F0F1F3",
          50: "#F8F9FA",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "50px",
      },
      fontFamily: {
        sans: [
          "var(--font-sora)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "var(--font-sora)",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["Courier New", "monospace"],
      },
      boxShadow: {
        flat: "none",
        subtle: "rgba(0, 0, 0, 0.08) 0px 4px 16px 0px",
        raised: "rgba(0, 0, 0, 0.12) 0px 8px 24px 0px",
        elevated: "rgba(0, 0, 0, 0.3) 0px 4px 30px 0px",
        floating: "rgba(29, 185, 84, 0.3) 0px 4px 24px 0px",
        "floating-hover": "rgba(29, 185, 84, 0.4) 0px 6px 28px 0px",
        "floating-active": "rgba(29, 185, 84, 0.25) 0px 2px 12px 0px",
        "card-hover": "rgba(29, 185, 84, 0.15) 0px 8px 24px 0px",
        deep:
          "rgba(0, 0, 0, 0.12) 0px 30px 80px 0px, rgba(0, 0, 0, 0.06) 0px 8px 24px 0px",
        "input-focus": "0px 0px 0px 3px rgba(29, 185, 84, 0.15)",
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
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.75" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out",
        shimmer: "shimmer 2.4s linear infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
