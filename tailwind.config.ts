/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
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
        sand: {
          DEFAULT: "#D4C5B3",
          light: "#E5DED3",
          dark: "#C4B5A3",
        },
        olive: {
          DEFAULT: "#4A5D4C",
          light: "#5A6D5C",
          dark: "#3A4D3C",
        },
        bronze: {
          DEFAULT: "#B3935C",
          light: "#C3A36C",
          dark: "#A3834C",
        },
        cream: "#F5F0E8",
        coral: "#FFB5B5",
        collectionsDetails: {
          primary: "#D4C5B3",
          secondary: "#4A5D4C",
          accent: "#B3935C",
          background: "#F5F0E8",
          text: "#2C1810",
        },
        collectionPage: {
          primary: "#E5DED3",
          secondary: "#5A6D5C",
          accent: "#C3A36C",
          background: "#FFFFFF",
          text: "#2C1810",
        },
        productDetails: {
          primary: "#C4B5A3",
          secondary: "#3A4D3C",
          accent: "#A3834C",
          background: "#F5F0E8",
          text: "#2C1810",
        },
        productPage: {
          primary: "#D4C5B3",
          secondary: "#3F4C3D",
          accent: "#FFB5B5",
          background: "#FFFFFF",
          text: "#2C1810",
        },
        ordersPage: {
          primary: "#F5F0E8",
          secondary: "#4A5D4C",
          accent: "#B3935C",
          background: "#FFFFFF",
          text: "#2C1810",
        },
        wishlistPage: {
          primary: "#D4C5B3",
          secondary: "#FFB5B5",
          accent: "#4A5D4C",
          background: "#F5F0E8",
          text: "#2C1810",
        },
        cartPage: {
          primary: "#F5F0E8",
          secondary: "#D4C5B3",
          accent: "#B3935C",
          background: "#FFFFFF",
          text: "#2C1810",
        },
        aboutPage: {
          primary: "#4A5D4C",
          secondary: "#D4C5B3",
          accent: "#B3935C",
          background: "#F5F0E8",
          text: "#FFFFFF",
        },
        contactUsPage: {
          primary: "#D4C5B3",
          secondary: "#B3935C",
          accent: "#4A5D4C",
          background: "#F5F0E8",
          text: "#2C1810",
        },
        privacyPolicy: {
          primary: "#F5F0E8",
          secondary: "#D4C5B3",
          accent: "#4A5D4C",
          background: "#FFFFFF",
          text: "#2C1810",
        },
        navbar: {
          background: "#4A5D4C",
          text: "#FFFFFF",
          hover: "#B3935C",
          textHover: "#F5F0E8",
        },
        footer: {
          background: "#2C1810",
          text: "#F5F0E8",
          hover: "#B3935C",
          textHover: "#FFFFFF",
        },
        ctaButton: {
          background: "#B3935C",
          text: "#FFFFFF",
          hover: "#A3834C",
          textHover: "#FFFFFF",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F7F9FC",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
