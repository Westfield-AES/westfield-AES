---
name: Kinetic Precision
colors:
  surface: '#111415'
  surface-dim: '#111415'
  surface-bright: '#373a3b'
  surface-container-lowest: '#0c0f10'
  surface-container-low: '#191c1d'
  surface-container: '#1d2021'
  surface-container-high: '#282a2b'
  surface-container-highest: '#323536'
  on-surface: '#e1e3e4'
  on-surface-variant: '#c6c6cb'
  inverse-surface: '#e1e3e4'
  inverse-on-surface: '#2e3132'
  outline: '#909095'
  outline-variant: '#45474b'
  surface-tint: '#c6c6cc'
  primary: '#c6c6cc'
  on-primary: '#2f3035'
  primary-container: '#0f1115'
  on-primary-container: '#7b7c82'
  inverse-primary: '#5d5e63'
  secondary: '#bdf4ff'
  on-secondary: '#00363d'
  secondary-container: '#00e3fd'
  on-secondary-container: '#00616d'
  tertiary: '#d1c4bb'
  on-tertiary: '#372f29'
  tertiary-container: '#16100b'
  on-tertiary-container: '#857b73'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e8'
  primary-fixed-dim: '#c6c6cc'
  on-primary-fixed: '#1a1c20'
  on-primary-fixed-variant: '#45474b'
  secondary-fixed: '#9cf0ff'
  secondary-fixed-dim: '#00daf3'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004f58'
  tertiary-fixed: '#eee0d7'
  tertiary-fixed-dim: '#d1c4bb'
  on-tertiary-fixed: '#211a15'
  on-tertiary-fixed-variant: '#4e453f'
  background: '#111415'
  on-background: '#e1e3e4'
  surface-variant: '#323536'
  surface-deep: '#0F1115'
  surface-elevated: '#1A1D23'
  electric-cyan: '#00E5FF'
  off-white: '#F8F9FA'
  gray-muted: '#6B7280'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 80px
    fontWeight: '700'
    lineHeight: 88px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 24px
  container-max: 1440px
---

## Brand & Style

The design system embodies a premium, editorial aesthetic tailored for high-stakes technology. It draws inspiration from **Minimalism** and **High-Contrast Modernism**, prioritizing "built-not-bought" sophistication. The brand personality is intelligent and innovative, emphasizing "Built from Africa, Designed for the world" through a visual language that feels both grounded and visionary.

The interface avoids typical SaaS tropes, opting for a "Technical Atelier" feel: sparse chrome, intentional whitespace, and a focus on high-fidelity content. Expect an Apple-like polish where every pixel serves a structural or communicative purpose. The emotional response is one of confidence and technical mastery.

## Colors

The palette is anchored in **Deep Charcoal (#0F1115)** to provide an infinite, immersive backdrop. **Electric Cyan (#00E5FF)** is the surgical instrument of the palette, used only for critical actions, data highlights, or high-impact brand moments. 

**Pure White** and **Soft Off-White (#F8F9FA)** are reserved for primary typography and essential interface elements to maintain a high-contrast, legible environment. Grays are used strictly for secondary information and structural borders to keep the UI from feeling "muddy."

## Typography

The typography system utilizes **Inter** for its modern, neutral, and highly legible characteristics. To emphasize the "Technically Sophisticated" aspect of the brand, **JetBrains Mono** is introduced for labels and technical metadata, providing a precise, engineered feel.

Headlines use tight tracking and significant weight to create an editorial impact. Body text maintains generous line height to ensure readability against the dark background. Hierarchy is strictly enforced: large display type for narrative sections, and clear, functional type for utility.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain editorial control, transitioning to a fluid model for mobile. A 12-column grid is used with generous 32px gutters to prevent visual clutter.

**Spacing Rhythm:**
- **Desktop:** 80px side margins provide a premium "frame" for content.
- **Section Vertical Padding:** Large 160px or 200px blocks to separate distinct narratives.
- **Mobile:** Margins reduce to 24px, and column stacks become singular. 

Whitespace is treated as a functional element, not a void. It is used to group related technical concepts and drive the user's eye toward the Electric Cyan call-to-actions.

## Elevation & Depth

This system avoids traditional shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**. 

- **Depth:** Surfaces are differentiated by slight shifts in charcoal values (#0F1115 vs #1A1D23). 
- **Borders:** Use 1px solid borders in a low-opacity white (e.g., `rgba(255, 255, 255, 0.1)`) to define containers without breaking the dark immersion.
- **Glassmorphism:** Reserved strictly for navigation bars or floating overlays, using a heavy backdrop blur (20px+) and a subtle inner glow to simulate high-end hardware finishes.

## Shapes

The shape language is "Soft-Technical." Elements use a subtle **0.25rem (4px)** radius, providing just enough approachability without losing the precision of a sharp-edged industrial design. 

Large editorial cards may use the `rounded-lg` (8px) value for a more "contained" feel, but pill-shaped buttons and overly rounded corners are strictly prohibited to avoid a generic "consumer app" appearance.

## Components

### Buttons
Primary buttons are rectangular with 4px rounded corners. They feature a high-contrast white background with charcoal text, or an Electric Cyan background for high-priority conversion. No gradients or heavy drop shadows; use a subtle hover state that increases opacity or shifts the background color slightly.

### Editorial Cards
Cards should be immersive, often featuring full-bleed technical imagery or data visualizations. Use the surface-elevated color (#1A1D23) for the background and thin 1px borders. Typography inside cards should follow the strict hierarchy defined in Section 3.

### Input Fields
Inputs are minimalist: a bottom-border only or a very subtle ghost-border outline. Focus states are indicated by a 1px Electric Cyan border. Labels use the JetBrains Mono "label-sm" style.

### Navigation
A minimal, fixed-top navigation bar with high-blur glassmorphism. Links are all-caps JetBrains Mono with a simple underline or cyan dot for active states.

### Immersive Sections
Full-width sections that use "Electric Cyan" as a background with "Deep Charcoal" text for high-impact announcements or "Built from Africa" brand storytelling.
