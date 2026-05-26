---
name: Executive Intelligent Nexus
colors:
  surface: '#faf9fc'
  surface-dim: '#dbd9dd'
  surface-bright: '#faf9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f6'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e5'
  on-surface: '#1b1b1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#303033'
  inverse-on-surface: '#f2f0f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#4a5f85'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#011b3e'
  on-primary-container: '#6f84ad'
  inverse-primary: '#b2c7f3'
  secondary: '#0058bc'
  on-secondary: '#ffffff'
  secondary-container: '#0070eb'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#351000'
  on-tertiary-container: '#b37559'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#b2c7f3'
  on-primary-fixed: '#011b3e'
  on-primary-fixed-variant: '#32476c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004493'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#feb696'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#6b3a22'
  background: '#faf9fc'
  on-background: '#1b1b1e'
  surface-variant: '#e3e2e5'
  electric-blue: '#00F0FF'
  executive-gray: '#64748B'
  glass-stroke: rgba(255, 255, 255, 0.4)
  status-success: '#10B981'
  status-critical: '#EF4444'
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for the highest tier of corporate decision-makers. It balances the analytical rigor of Palantir with the refined, fluid aesthetics of Stripe. The personality is **authoritative, predictive, and frictionless**.

The design style is a sophisticated blend of **Corporate Minimalism** and **Glassmorphism**. It utilizes a "Deep-Depth" philosophy where information is layered using translucent materials and subtle light leaks, rather than heavy shadows. This creates a futuristic, "head-up display" (HUD) feeling that feels intelligent and premium without appearing overly gamified.

**Core Principles:**
- **Signal over Noise:** Every pixel must justify its existence. High information density is managed through impeccable white space and visual hierarchy.
- **Kinetic Intelligence:** Use subtle motion and "intelligent" glows to draw attention to critical data changes.
- **Tactile Precision:** Buttons and interactive elements should feel like high-end physical hardware—responsive, crisp, and high-quality.

## Colors

The palette is anchored by **Deep Navy Blue**, representing stability and institutional trust. 

- **Primary (Deep Navy):** Used for structural navigation, primary backgrounds, and high-level headers.
- **Secondary (Active Blue):** Used for primary actions and focused states.
- **Electric Blue (Accent):** Reserved for "intelligent" moments—data insights, AI-driven suggestions, and glowing status indicators.
- **Neutrals:** A range of cool, sophisticated grays ensure the interface remains clean. Backgrounds use a "Soft White" (#F8FAFC) to reduce eye strain compared to pure white.

The color system relies heavily on **opacity-based layering**. Instead of solid fills, surfaces often use semi-transparent whites and navies to allow background blurs to peak through, creating the "Glassmorphism" effect.

## Typography

This design system uses a triple-font approach to categorize information types:

1.  **Hanken Grotesk (Headers):** Chosen for its sharp, modern geometric profile. It communicates precision and forward-thinking leadership.
2.  **Inter (Body):** The industry standard for SaaS legibility. It handles dense data tables and long-form executive summaries with ease.
3.  **JetBrains Mono (Data/Labels):** Used for technical metadata, status labels, and numerical data points. This adds a "high-tech/intelligence" feel, signaling that the data is live and accurate.

**Scaling Rules:** Headlines should use tighter letter-spacing as they grow in size to maintain a premium "editorial" look. Labels are always tracked out (letter-spacing) for maximum readability at small sizes.

## Layout & Spacing

The layout utilizes a **Fixed-Fluid Hybrid Grid**. Content is housed in a centered container (max 1440px) to ensure executives with ultra-wide monitors don't experience "interface sprawl," while internal components within panels use fluid percentage-based widths.

- **Grid:** 12-column system for desktop, 8-column for tablet, and 4-column for mobile.
- **Rhythm:** An 8px linear scale (with a 4px half-step for micro-adjustments) governs all margins and paddings.
- **Density:** High density in data-heavy views (tables/dashboards) and comfortable density in strategic overview pages.

**Adaptive Reflow:** On mobile, complex charts collapse into simplified summary cards, and sidebars transition into bottom-sheet navigation to maintain one-handed executive use.

## Elevation & Depth

Elevation is achieved through **Material Logic** rather than traditional drop shadows.

1.  **Base Layer:** Soft White (#F8FAFC) or deep navy for dark mode.
2.  **Floating Panels:** Elevated 16px from the base using a "Cinematic Shadow"—a very large blur (40px+) with extremely low opacity (4%) tinted with the Primary Navy color.
3.  **Glassmorphism Surfaces:** For overlays and modals, use `backdrop-filter: blur(12px)` and a 1px white border at 20% opacity. This creates a "frosted lens" effect.
4.  **Intelligent Glow:** Use a soft outer glow (`box-shadow: 0 0 15px rgba(0, 240, 255, 0.3)`) for active status indicators or AI-recommended insights to signify "liveness."

## Shapes

The shape language is **"Soft-Tech."** We avoid aggressive "startup" roundness in favor of professional, disciplined corners.

- **Standard Elements:** Buttons and input fields use a 4px (Soft) radius to maintain a sense of structural integrity.
- **Cards & Panels:** Use 8px (Large) for a slightly more modern, approachable feel for the main content containers.
- **Interactive States:** Soft Neumorphic accents are used sparingly on toggle switches and depressed button states, creating a tactile "instrument panel" feel.

## Components

### Buttons
- **Primary:** Solid Deep Navy or Electric Blue with white text. High-contrast, sharp corners.
- **Secondary:** Glass-style. Transparent background with a `1px` subtle stroke and backdrop blur.
- **Tertiary:** Text-only with a JetBrains Mono label for "utility" actions.

### Modern Cards
Cards are the primary container. They feature a `1px` stroke (White at 10% opacity), a very subtle white-to-transparent linear gradient from the top-left corner, and a 12px backdrop blur.

### Floating Panels
Used for navigation and filters. These should appear to "hover" over the main content, using the Cinematic Shadow and a higher backdrop-blur value.

### Animated Status Indicators
Instead of static dots, use "Pulse" indicators. A small dot with a concentric, expanding ring that fades out, signaling real-time data streaming.

### Input Fields
Ultra-minimalist. Bottom border only in the default state, expanding to a full-frame blue border on focus. Use JetBrains Mono for placeholder text to emphasize the "data entry" nature.

### Chips
Small, pill-shaped indicators with low-saturation backgrounds and high-saturation text. Used for tagging "Priority," "Department," or "Risk Level."