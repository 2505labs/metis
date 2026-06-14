---
name: Metis
colors:
  surface: '#0e1513'
  surface-dim: '#0e1513'
  surface-bright: '#333b39'
  surface-container-lowest: '#09100e'
  surface-container-low: '#161d1b'
  surface-container: '#1a211f'
  surface-container-high: '#242b2a'
  surface-container-highest: '#2f3634'
  on-surface: '#dde4e1'
  on-surface-variant: '#bacac5'
  inverse-surface: '#dde4e1'
  inverse-on-surface: '#2b3230'
  outline: '#859490'
  outline-variant: '#3c4a46'
  surface-tint: '#3cddc7'
  primary: '#57f1db'
  on-primary: '#003731'
  primary-container: '#2dd4bf'
  on-primary-container: '#00574d'
  inverse-primary: '#006b5f'
  secondary: '#9cd1c6'
  on-secondary: '#003731'
  secondary-container: '#1a4f47'
  on-secondary-container: '#8bbfb5'
  tertiary: '#ffd1aa'
  on-tertiary: '#4b2800'
  tertiary-container: '#ffac5a'
  on-tertiary-container: '#744000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3cddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#b8ede2'
  secondary-fixed-dim: '#9cd1c6'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#1a4f47'
  tertiary-fixed: '#ffdcc0'
  tertiary-fixed-dim: '#ffb875'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6b3b00'
  background: '#0e1513'
  on-background: '#dde4e1'
  surface-variant: '#2f3634'
typography:
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  mono-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '450'
    lineHeight: 20px
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
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
  unit: 4px
  container-padding: 12px
  gutter: 8px
  component-gap: 4px
---

## Brand & Style

The design system is engineered for high-performance, local-first computing environments. The brand personality is clinical, reliable, and invisible—prioritizing the flow of data over decorative elements. It targets power users and developers who require a high-density "operator console" aesthetic where utility is the primary driver of beauty.

The design style is **Modern Minimalist with a Technical Edge**. It utilizes a dark-mode-first approach to reduce eye strain during long sessions. Instead of expressive shadows or depth, the system relies on structured grids, subtle 1px borders, and clear typographic hierarchy to organize information. There is no marketing fluff; every pixel serves a functional purpose, evoking a sense of calm authority and precision.

## Colors

The palette is strictly functional, rooted in deep Zinc and Slate neutrals to create a low-light environment that emphasizes content.

- **Primary Canvas**: `#09090b` (Deepest neutral for background).
- **Surface Level**: `#18181b` (Used for containers, sidebars, and panels).
- **Stroke/Border**: `#27272a` (The primary tool for defining hierarchy and separation).
- **Accent (Teal)**: `#2dd4bf` (Reserved for primary actions and active state indicators).
- **Functional Accents**: 
    - **Amber**: Used for "Confirm" or human-in-the-loop requirements.
    - **Red**: Reserved for high-risk operations or terminal errors.
    - **Muted**: Low-contrast neutrals for read-only or background metadata.

## Typography

This design system uses a dual-type approach to distinguish between UI controls and machine data. 

**Inter** serves as the interface anchor, providing maximum legibility at small sizes. **JetBrains Mono** is utilized for all system-generated data, including IDs, hashes, timestamps, and log outputs, creating a clear visual distinction between user interface elements and the data being processed. 

To maintain density, font sizes rarely exceed 18px. Information hierarchy is established through font weight and color (e.g., Dimmed Zinc for secondary labels) rather than significant size variations.

## Layout & Spacing

The layout philosophy follows a **Strict Grid Model** based on 4px increments. It is designed for density, minimizing whitespace to ensure the maximum amount of information is visible without overwhelming the user.

- **Desktop Layout**: A multi-pane approach with fixed-width sidebars (collapsible) and a fluid main workspace.
- **Grids**: Use a 12-column grid for complex dashboards, but prefer flexbox-based stacks for data lists and logs.
- **Density**: Components use tight internal padding (typically 4px to 8px) to maintain the "console" feel.
- **Separation**: Use 1px solid borders (`#27272a`) instead of margins to define zones.

## Elevation & Depth

This system intentionally avoids depth. There are no ambient shadows or blurs. 

- **Tonal Layering**: Depth is achieved through color alone. The base background is `#09090b`, while elevated "containers" or "panels" use `#18181b`.
- **Outlines**: Every functional group (cards, input fields, panels) must be enclosed in a 1px border. 
- **Active State**: Elevated focus is indicated by changing the border color from the default Zinc to the Teal accent or a brighter Zinc-400.

## Shapes

The shape language is "Soft-Industrial." While the grid is rigid, a slight corner radius (4px) prevents the UI from feeling aggressive or dated. 

- **Standard Elements**: 4px radius (Inputs, Panels, Cards).
- **Interactive Badges**: Full pill-shaped radius (used specifically for status markers and tags).
- **Selection Indicators**: 2px radius for tight nested items like list selection highlights.

## Components

### Buttons
- **Primary**: Solid Teal background, black text, 13px bold Inter.
- **Secondary**: Transparent background, 1px Zinc border, Teal or White text.
- **Ghost**: No border/background until hover. Used for window controls and secondary actions.

### Tier Badges (Pill-shaped)
- **Read-only**: Background `#27272a`, text `#a1a1aa` (Zinc 400).
- **Confirm**: Background `#fbbf24` (Amber), text black. Used for actions requiring human validation.
- **High-risk**: Background `#ef4444` (Red), text white. Used for destructive or high-resource tasks.

### Operator Console Lists
Data rows should be compact (28-32px height) with 1px bottom borders. Use JetBrains Mono for the first column (IDs/Timestamps) to ensure vertical alignment of characters.

### Input Fields
Strict rectangular fields with 1px borders. Background should be slightly darker than the panel background to create a "recessed" feel.

### Status Indicators
Small 6px circles (Teal for active, Zinc for idle, Red for error) placed next to process labels to provide instant visual telemetry.