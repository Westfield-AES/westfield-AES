module.exports = {
  content: ["./*.html", "./assets/*.js"],
  theme: {
    extend: {
      colors: {
        "on-primary-container": "#7b7c82",
        "surface-container-highest": "#323536",
        primary: "#c6c6cc",
        "on-primary": "#2f3035",
        background: "#111415",
        "on-primary-fixed-variant": "#45474b",
        "surface-tint": "#c6c6cc",
        "surface-container-low": "#191c1d",
        "secondary-container": "#00e3fd",
        "on-surface-variant": "#c6c6cb",
        surface: "#111415",
        "primary-container": "#0f1115",
        "inverse-surface": "#e1e3e4",
        "gray-muted": "#6b7280",
        "surface-variant": "#323536",
        "off-white": "#f8f9fa",
        "on-primary-fixed": "#1a1c20",
        "on-background": "#e1e3e4",
        "secondary-fixed": "#9cf0ff",
        "inverse-on-surface": "#2e3132",
        "electric-cyan": "#00e5ff",
        "outline-variant": "#45474b",
        "on-secondary-container": "#00616d",
        "surface-dim": "#111415",
        "surface-deep": "#0f1115",
        "surface-bright": "#373a3b",
        "surface-container": "#1d2021",
        "on-secondary-fixed": "#001f24",
        "on-surface": "#e1e3e4",
        "primary-fixed": "#e2e2e8",
        secondary: "#bdf4ff",
        "on-secondary": "#00363d",
        outline: "#909095",
        "surface-container-lowest": "#0c0f10",
        "surface-elevated": "#1a1d23",
        "surface-container-high": "#282a2b"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "9999px"
      },
      spacing: {
        "margin-desktop": "80px",
        "margin-mobile": "24px",
        gutter: "32px",
        unit: "8px",
        "container-max": "1440px"
      },
      maxWidth: {
        "container-max": "1440px"
      },
      fontFamily: {
        "label-sm": ["Martian Mono Variable", "ui-monospace", "SFMono-Regular", "monospace"],
        "headline-lg": ["Mona Sans Variable", "Geist Variable", "sans-serif"],
        "display-xl": ["Mona Sans Variable", "Geist Variable", "sans-serif"],
        "body-md": ["Geist Variable", "Arial", "sans-serif"],
        "headline-md": ["Mona Sans Variable", "Geist Variable", "sans-serif"],
        "display-xl-mobile": ["Mona Sans Variable", "Geist Variable", "sans-serif"],
        "body-lg": ["Geist Variable", "Arial", "sans-serif"],
        display: ["Mona Sans Variable", "Geist Variable", "sans-serif"],
        body: ["Geist Variable", "Arial", "sans-serif"],
        mono: ["Martian Mono Variable", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Geist Variable", "Arial", "sans-serif"]
      },
      fontSize: {
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.08em", fontWeight: "600" }],
        "headline-lg": ["48px", { lineHeight: "54px", letterSpacing: "-0.035em", fontWeight: "650" }],
        "headline-lg-mobile": ["36px", { lineHeight: "40px", letterSpacing: "-0.03em", fontWeight: "650" }],
        "display-xl": ["80px", { lineHeight: "84px", letterSpacing: "-0.055em", fontWeight: "680" }],
        "display-xl-mobile": ["48px", { lineHeight: "50px", letterSpacing: "-0.045em", fontWeight: "680" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-md": ["32px", { lineHeight: "38px", letterSpacing: "-0.025em", fontWeight: "630" }],
        "body-lg": ["20px", { lineHeight: "31px", letterSpacing: "-0.01em", fontWeight: "400" }]
      }
    }
  },
  plugins: []
};
