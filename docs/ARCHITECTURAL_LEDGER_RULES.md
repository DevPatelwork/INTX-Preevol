# Architectural Ledger Design Rules

## North Star
- Style direction: **Precision Elegance** under the theme **Digital Curator**.
- Prioritize whitespace and calm scanning over dense visual separation.

## Color System
- Base canvas: `surface` `#f7f9fb`
- Sidebar/background sectioning: `surface_container_low` `#f2f4f6`
- Secondary content: `surface_container` `#eceef0`
- Card/elevated content: `surface_container_lowest` `#ffffff`
- Inset/highest tonal layer: `surface_container_highest` `#e0e3e5`
- Primary: `#004ac6`
- Primary container: `#2563eb`
- Primary text on actions: `#ffffff`
- Outline variant: `#c3c6d7`

## No-Line Rule
- Do not use strong 1px separators to divide major UI areas.
- Use tonal shifts + spacing (`6`, `8`, `20`, `24`) for hierarchy.
- If border is mandatory, use ghost border: `outline_variant` at 15% opacity.

## Typography
- Headlines/display: **Manrope**
- Body/UI/data labels: **Inter**
- Financial emphasis: display scale for totals where possible.
- Technical labels: compact uppercase/letter-spaced style.

## Components

### Buttons
- Primary: gradient `#004ac6 -> #2563eb`, `rounded-md (12px)`.
- Secondary: transparent with ghost border and primary text.
- Tertiary: no container, subtle tonal hover.

### Inputs
- Background: `surface_container_highest`.
- Focus border: `primary`.
- Focus ring/glow: `surface_tint` (`#0053db`) at low opacity.

### Tables
- No row dividers/grid lines.
- Alternate rows between `surface` and `surface_container_low`.
- Use wider row padding for editorial readability.

### Sidebar
- Background: `surface_container_low`.
- Active state uses left vertical pill indicator in `primary`.
- Active text: `#003ea8`.

### Overlays
- Use glassmorphism for floating overlays:
  - 70% opaque surface
  - blur 12-20px (24px in night mode)

## Night Mode
- Canvas: `inverse_surface` `#2d3133`
- Text: `inverse_on_surface` `#eff1f3`
- Accent: `inverse_primary` `#b4c5ff`

## Do / Don’t
- Do use generous whitespace and rounded-md containers.
- Do rely on tonal depth rather than hard lines.
- Don’t use `<hr>` as primary separation.
- Don’t use heavy dark shadows.
- Don’t use unrelated success green for core positive actions; keep blue-led system.
