---
name: Obsidian Silk
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#bacac5'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#859490'
  outline-variant: '#3c4a46'
  surface-tint: '#3cddc7'
  primary: '#57f1db'
  on-primary: '#003731'
  primary-container: '#2dd4bf'
  on-primary-container: '#00574d'
  inverse-primary: '#006b5f'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#cadbf5'
  on-tertiary: '#213145'
  tertiary-container: '#afbfd9'
  on-tertiary-container: '#3e4e63'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3cddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#111317'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-page: 40px
  container-padding: 16px
  stack-gap: 12px
---

## Brand & Style

The design system establishes a premium, "Pro-grade" environment by blending high-end hardware aesthetics with sophisticated software fluidity. The personality is quiet but powerful—think high-performance aluminum, sandblasted glass, and the precision of professional studio equipment. It targets power users who value technical depth but demand a refined, distraction-free interface.

The style is **Elevated Glassmorphism**. It utilizes multi-layered depth, using soft background blurs and tonal shifts to separate concerns rather than rigid lines. The aesthetic is smooth and tactile, evoking a sense of "physicality" in a digital space.

## Colors

The palette centers on a "Softer Dark" philosophy. The base canvas is a deep charcoal (`#0F1115`), avoiding pure black to preserve detail in shadows and gradients. 

- **Primary:** A refined, desaturated teal. It is "cool" and professional, used sparingly for critical actions and active states.
- **Surface Tiers:** Three distinct levels of gray define the hierarchy. Surface layers use subtle blue-tinted grays to maintain a premium "space gray" feel.
- **Accents:** Use soft, low-opacity versions of the primary teal for hover states and subtle indicators to ensure the "neon" effect is completely avoided.

## Typography

The system relies on **Inter** for all functional and editorial text, leveraging its variable weight axis to create a clear hierarchy. 

- **Weight Strategy:** Use Semibold (`600`) for headers and Medium (`500`) for primary UI labels. This provides a "weighted" feel that matches the premium geometry.
- **Technical Soul:** **JetBrains Mono** is reserved for data, code snippets, and metadata labels. It should always be set slightly smaller than the surrounding body text to maintain visual balance.
- **Spacing:** Tighten letter-spacing on display sizes to mimic high-end editorial layouts.

## Layout & Spacing

The layout follows a **Fluid-Responsive** model with generous safe areas. 

- **Rhythm:** A 4px baseline grid ensures consistent vertical rhythm. Standard components utilize 16px (`4 * 4`) internal padding.
- **Structure:** Use a 12-column grid for desktop with 24px gutters. Sidebars should be fixed-width (e.g., 280px) and utilize backdrop-blur filters to let background content "bleed" through subtly.
- **Mobile:** Transition to a single-column layout with 20px side margins. Large headings should scale down to `headline-lg-mobile` roles to prevent awkward line breaks.

## Elevation & Depth

Depth is conveyed through **Physical Layering** and light physics rather than harsh contrast.

- **Glassmorphism:** Navigation sidebars and top headers must use a 20px-30px backdrop blur with a semi-transparent surface fill (`rgba(26, 29, 35, 0.7)`).
- **Shadows:** Use "Ambient Occlusion" style shadows—very large blur radii (30px-40px) with very low opacity (15-20%). Shadows should have a slight downward Y-offset to simulate a top-down light source.
- **Inner Borders:** Instead of standard borders, use a 1px "inner glow" or "hairline stroke" (`white` at 5-8% opacity) on the top and left edges of cards to simulate a beveled glass edge.

## Shapes

The geometry is highly approachable and "soft-tech."

- **Base Radius:** 12px for standard cards and containers.
- **Large Radius:** 24px for parent containers or main dashboard modules.
- **Interactive Elements:** Buttons and inputs follow a 12px radius to match cards, creating a unified nested appearance.
- **Continuous Corners:** Where possible, use "squircle" math (smooth corner transitions) to mimic hardware industrial design.

## Components

### Buttons
- **Primary:** Gradient fill (Teal-600 to Teal-500) with a subtle 1px white top-border at 10% opacity.
- **Secondary:** Surface-level background with a thin stroke.
- **Behavior:** On hover, buttons should subtly scale up (102%) and increase shadow depth.

### Cards
- **Style:** Background blur + 12px corner radius. No harsh borders. Use a soft background color change on hover to indicate interactivity.

### Input Fields
- **Appearance:** Inset appearance with a 12px radius. The background should be slightly darker than the surface it sits on. Use the primary teal for the cursor and the active focus ring (with a 4px blur).

### Chips & Tags
- **Design:** Pill-shaped (fully rounded) with JetBrains Mono text. Use low-contrast background tints of the category color.

### Sidebars
- **Style:** 100% height, fixed width, with a 40px backdrop blur. Ensure the "active" navigation state is a recessed "well" rather than a protruding highlight.