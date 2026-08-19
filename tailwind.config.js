/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#FAF7F2",
          sidebar: "#F5EFEB",
          card: "#FFFFFF",
          border: "#E5DFD5",
          "text-dark": "#2C2520",
          "text-muted": "#5C544E",
          forest: "#1A3D2F",
          gold: "#C6944A",
        },
        base: {
          950: "#38271B",
          900: "#493424",
          850: "#5A412E",
          800: "#6B4E38",
          700: "#856349",
          600: "#A37D5F",
          500: "#C49E7E",
        },
        stone: {
          50: "#FAF5EC",
          100: "#F0E6D6",
          200: "#DECBAE",
          400: "#B39C82",
          600: "#8A7460",
        },
        ivory: {
          50: "#FBF8F1",
          100: "#F3EEE1",
        },
        forest: {
          400: "#4E8C6E",
          500: "#2F6B4F",
          600: "#1F4C38",
          900: "#122A20",
        },
        sandstone: {
          300: "#E4C08F",
          400: "#D2A06E",
          500: "#B8804A",
          600: "#96683B",
        },
        gold: {
          300: "#F1D28C",
          400: "#E3B25C",
          500: "#C99A3A",
          600: "#A67C28",
        },
        verdigris: {
          400: "#6FA79A",
          500: "#4E8479",
          600: "#3B6459",
        },
        ochre: {
          400: "#E0B75C",
          500: "#C99A3A",
          600: "#A67C28",
        },
        terracotta: {
          400: "#D07E58",
          500: "#B5482F",
          600: "#8C2F26",
        },
        rust: {
          400: "#CC6A4C",
          500: "#B5482F",
          600: "#8C2F26",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 rgba(239,234,224,0.06), 0 8px 24px -12px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px rgba(227,178,92,0.25), 0 12px 32px -14px rgba(227,178,92,0.35)",
        lift: "0 20px 45px -18px rgba(0,0,0,0.55)",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "10px",
        lg: "14px",
        xl: "20px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-4%)" },
          "50%": { transform: "translateY(104%)" },
          "100%": { transform: "translateY(-4%)" },
        },
        drift: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "120px 120px" },
        },
        ringDash: {
          "0%": { strokeDashoffset: "var(--ring-circumference)" },
          "100%": { strokeDashoffset: "var(--ring-offset)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fadeIn 0.5s ease-out both",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-glow": "pulseGlow 3.2s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        scanline: "scanline 3.4s ease-in-out infinite",
        drift: "drift 14s linear infinite",
        "ring-dash": "ringDash 1.2s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
