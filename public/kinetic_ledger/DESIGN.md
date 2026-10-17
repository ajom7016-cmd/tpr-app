---
name: Kinetic Ledger
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5a4136'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8e7164'
  outline-variant: '#e2bfb0'
  surface-tint: '#a04100'
  primary: '#a04100'
  on-primary: '#ffffff'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#ffb693'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#0062a1'
  on-tertiary: '#ffffff'
  tertiary-container: '#059eff'
  on-tertiary-container: '#003357'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#9ccaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497b'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-currency:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-currency-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  bengali-support:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 24px
  gutter: 16px
  section-gap: 40px
  card-padding: 24px
---

## Brand & Style
The design system is engineered to evoke a sense of prestigious wealth management and high-velocity earnings. It targets a modern Bangladeshi demographic that values both international luxury standards and local financial growth. 

The aesthetic is a refined **Glassmorphism**, characterized by hyper-premium translucent surfaces that suggest transparency and clarity in financial dealings. By layering high-fidelity frosted surfaces over a vibrant secondary environment, the UI feels deep, immersive, and high-energy. The emotional response is one of "Secure Prosperity"—where the solid reliability of pure white meets the kinetic energy of deep orange.

## Colors
The palette is intentionally restricted to amplify the impact of the primary accent. 

- **Primary Orange (#FF6B00):** Represents kinetic energy, growth, and the "earn" aspect of the platform. Use this for primary calls to action, active states, and critical financial indicators.
- **Pure White (#FFFFFF):** Used as the base for all glass surfaces and primary text on dark backgrounds.
- **Neutral Deep (#1A1A1A):** Reserved for high-contrast typography and subtle secondary backgrounds to ensure legibility against the glass layers.
- **Glass Logic:** Surfaces should use a 70% to 40% opacity range of white. Backgrounds should feature a subtle radial gradient of the primary orange (at low 5-10% opacity) to provide color bleeding through the glass layers.

## Typography
This design system utilizes **Inter** for its mathematical precision and neutral character, allowing the glass effects to remain the focus. 

- **Currency Treatment:** Large balance displays must use `display-currency`. The Taka symbol (৳) should be slightly thinner than the digits to keep the focus on the value.
- **Bengali Integration:** When using Bengali script, increase the line height by 10-15% compared to English text to accommodate the script's vertical anatomy. 
- **Hierarchy:** Use `label-caps` for secondary data points like "Current Yield" or "Transaction ID" to create a structured, professional ledger feel.

## Layout & Spacing
The layout follows a **fluid grid** model with generous safe areas to maintain a premium, "breathable" feel. 

- **Desktop:** 12-column grid with a max-width of 1280px. 
- **Mobile:** Single column with 24px side margins. 
- **Rhythm:** Use a strict 8px base unit. Component internal padding should default to 24px for large glass cards to ensure content doesn't feel cramped near the rounded edges. 
- **Floating Elements:** Key actions (like "Quick Earn") should be positioned in a floating bottom-bar container to emphasize the depth of the glass layers.

## Elevation & Depth
Depth is the core differentiator of this design system. It is achieved through three specific layers:

1.  **The Background Layer:** A soft, neutral-light base with high-saturation orange "glows" (blobs) that move or sit behind the content.
2.  **The Glass Layer (Backdrop Blur):** Every card and modal must have a `backdrop-filter: blur(30px)`. Surfaces are filled with a linear gradient of `white/80` to `white/40`.
3.  **The Stroke & Shadow:** A 1px solid border of `white/50` defines the edge. Beneath the card, use a multi-layered "Ambient Shadow": 
    - Shadow 1: 0px 4px 6px rgba(0,0,0,0.02)
    - Shadow 2: 0px 20px 40px rgba(0,0,0,0.08)

## Shapes
The shape language is sophisticated and overly rounded to feel approachable and modern.

- **Primary Cards:** Use `rounded-xl` (24px to 32px) to create a soft, organic feel for large containers.
- **Interactive Elements:** Buttons and input fields use `rounded-lg` (16px) to distinguish them from the containers they sit within.
- **Icons:** Use 2px thin-stroke line icons. Where possible, use a dual-tone approach where the primary stroke is `Neutral Deep` and a small accent element within the icon is `Primary Orange`.

## Components
- **Glass Cards:** The foundational component. Always includes the 1px white border and 30px blur. No solid backgrounds allowed.
- **Primary Buttons:** High-energy Orange (#FF6B00) fill with white text. Use a subtle inner-glow (white/20) at the top edge to simulate a physical, tactile surface.
- **Input Fields:** Semi-transparent white (20% opacity) with a 1px white border. On focus, the border transitions to Primary Orange.
- **Status Chips:** Small, pill-shaped glass elements. Use a small solid orange dot to indicate "Live" earning status.
- **Lists:** Transaction items should be separated by thin, 1px lines of `white/30`. Each list item should have a hover state that slightly increases the backdrop-blur intensity.
- **The "Earning" Graph:** Use a vector line in Primary Orange with a soft orange glow (drop shadow) underneath the line to make the "ledger" feel alive.