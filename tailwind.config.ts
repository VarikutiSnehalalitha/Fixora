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
        // Sophisticated Teal Primary Brand Palette
        brand: {
          50: "#EAF5F2",  // Light teal background
          100: "#D3ECE5",
          200: "#A7D9CD",
          300: "#70BFB0",
          400: "#3DA394",
          500: "#14877E",
          600: "#0F766E", // Primary brand color
          700: "#0D645E", // Hover darkening
          800: "#0A4F4B",
          900: "#083B38",
          950: "#042321",
        },
        // Deep Charcoal Text System
        charcoal: {
          50: "#F5F6F6",
          100: "#E6E8E8",
          200: "#C7CBCC",
          300: "#9DA4A5",
          400: "#687474", // Muted grey secondary text
          500: "#525D5D",
          600: "#3E4646",
          700: "#2F3636",
          800: "#252B2B", // Main text deep charcoal
          900: "#1B2020",
          950: "#111414",
        },
        // Soft Sage Green Accent
        sage: {
          50: "#F4F8F6",
          100: "#EAF4EE",
          200: "#DDEFE7", // Secondary accent soft sage
          300: "#B8DEC9",
          400: "#86C4A4",
          500: "#4DA57B",
          600: "#21845B", // Muted green success state
          700: "#1B6E4B",
          800: "#15583C",
          900: "#10432E",
        },
        // Soft Sand Accent
        sand: {
          50: "#FCFBF8",
          100: "#F3EBDD", // Secondary accent for highlights
          200: "#E8DAC2",
          300: "#D9C29D",
          400: "#C8A676",
          500: "#B38951",
        },
        // Warm Grey Borders & Surfaces
        warmgrey: {
          50: "#FAF9F6", // Primary background warm off-white
          100: "#F4F3F0",
          200: "#E6E8E5", // Borders subtle warm grey
          300: "#D5D8D3",
          400: "#A8ADA5",
          500: "#7B8078",
        },
        // Emergency Warning: Warm Amber
        amber: {
          50: "#FEF9EE",
          100: "#FDF1D6",
          200: "#FBE2AC",
          300: "#F7CE78",
          400: "#EDB541",
          500: "#D99119", // Warm amber emergency warning
          600: "#BA730F",
          700: "#94540E",
          800: "#753E0A",
        },
        // Critical Danger: Restrained Dark Red (only genuine critical situations)
        danger: {
          50: "#FDF2F4",
          100: "#FBE4E7",
          200: "#F7CCD3",
          300: "#F0A3AF",
          400: "#E46E82",
          500: "#D23B55",
          600: "#B91C35", // Restrained dark red
          700: "#97152B",
        },
        // Graceful mapping for emergency tokens to use teal & amber instead of harsh neon red
        emergency: {
          50: "#FEF9EE",
          100: "#FDF1D6",
          200: "#FBE2AC",
          300: "#F7CE78",
          400: "#EDB541",
          500: "#D99119", // Amber
          600: "#0F766E", // Teal action button
          700: "#0D645E",
          800: "#0A4F4B",
          900: "#083B38",
        },
        navy: {
          800: "#2F3636",
          900: "#252B2B",
          950: "#1B2020",
        },
      },
    },
  },
  plugins: [],
};
export default config;
