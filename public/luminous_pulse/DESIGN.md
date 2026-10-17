---
name: Luminous Pulse
colors:
  surface: '#fff8f6'
  surface-dim: '#efd5ca'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#ffeae1'
  surface-container-high: '#fee3d8'
  surface-container-highest: '#f8ddd2'
  on-surface: '#261812'
  on-surface-variant: '#5a4136'
  inverse-surface: '#3d2d26'
  inverse-on-surface: '#ffede6'
  outline: '#8e7164'
  outline-variant: '#e2bfb0'
  surface-tint: '#a04100'
  primary: '#a04100'
  on-primary: '#ffffff'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#ffb693'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
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
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#9ccaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497b'
  background: '#fff8f6'
  on-background: '#261812'
  surface-variant: '#f8ddd2'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
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
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is centered on a "Glassmorphic Premium" aesthetic, blending the high-energy vitality of a performance brand with the sophisticated clarity of a luxury editorial. The target audience values exclusivity, speed, and modern aesthetics. 

The visual narrative relies on depth created through light and transparency rather than heavy shadows. It utilizes multi-layered glass surfaces, vibrant accent colors, and substantial negative space to evoke an emotional response of clarity and optimism. The style is characterized by its frosted textures, ethereal background gradients, and high-precision typography.

## Colors

The palette is anchored by **Energetic Orange**, used sparingly but powerfully for primary calls to action and critical interactive states. The core surface is **Pure White**, but it is rarely used as a flat solid; instead, it manifests as semi-transparent "glass" layers. 

**Dark Navy** serves as the primary ink color to ensure high-contrast readability against light backgrounds. The background of the application should consist of soft, sweeping gradients that transition between white, ultra-light grey (#F8FAFC), and very faint orange tints (#FFF7ED) to provide a dynamic canvas for the glass components to sit upon.

## Typography

The design system leverages **Inter** for its systematic precision and modern neutrality. Hierarchy is established through aggressive weight scaling—headlines use Bold and ExtraBold weights to command attention, while body text remains clean and legible in Regular weight.

Headlines should primarily use the Dark Navy color, except for high-impact marketing moments where Energetic Orange is applied. Letter spacing is slightly tightened on larger display type to enhance the "premium" feel.

## Layout & Spacing

This design system uses a **Fluid Grid** model with generous margins to reinforce the feeling of luxury and openness. The internal rhythm is based on an 8px linear scale.

On desktop, the layout utilizes a 12-column grid with a maximum container width of 1280px. On mobile devices, the grid collapses to a single column with 20px side margins. Spacing between glass "cards" should be substantial (minimum 32px) to allow the background gradients and blurs to remain visible, maintaining the sense of depth and translucency.

## Elevation & Depth

Depth is achieved through the **Glassmorphism** technique. Components do not "float" via heavy black shadows, but rather through multi-layered ambient shadows and refractive effects.

1.  **Backdrop Blur:** Every glass surface must have a backdrop-blur between 12px and 20px.
2.  **Stroke:** A 1px solid white border at 50% opacity acts as a "highlight" on the edge of components to define their boundaries.
3.  **Shadows:** Use a "Soft Multi-Layer" approach: a very subtle, large-spread shadow (0px 20px 40px rgba(0,0,0,0.04)) combined with a tighter, more opaque inner glow or drop shadow to ground the element.
4.  **Tonal Stacking:** Higher elevation levels are represented by increasing the opacity of the white background slightly (e.g., from 0.7 to 0.8) and increasing the blur radius.

## Shapes

The design system employs a very soft, organic shape language. The standard border radius is set to **24px** (rounded-xl equivalent) for all primary containers and cards. This extreme roundedness contrasts with the sharp, technical nature of the Inter typeface, creating a balanced, modern appearance. Small components like tags or buttons may use the "Pill" (fully rounded) style to differentiate them from structural containers.

## Components

### Buttons
Primary buttons are solid **Energetic Orange** with white text, using a pill-shape for maximum "action" intent. Secondary buttons use the glass style: `rgba(255, 255, 255, 0.7)` background, 16px blur, and a white border.

### Input Fields
Inputs should be treated as "wells" in the glass. Use a slightly darker or more translucent background than the parent card to create a recessed feel, with the same 24px corner radius.

### Cards
Cards are the primary expression of the glassmorphic style. They must always feature the 1px white border and the 12px-20px backdrop blur. Content inside cards should have generous padding (minimum 24px).

### Chips & Tags
Small, highly-rounded elements. Use Energetic Orange for active states and a semi-transparent Dark Navy for neutral or secondary tags.

### Lists
List items are separated by thin, low-opacity lines or subtle shifts in background translucency. Avoid heavy dividers; use whitespace and alignment to imply structure.