---
name: Badeifer
description: Plug-and-play widgets, plugins and themes, with setup guides, in the Pixel Keep palette.
colors:
  keep-gold: "#e8b64c"
  midnight-indigo: "#141833"
  dusk-indigo: "#1c2148"
  parchment-ink: "#ede6d3"
  moonlit-lavender: "#a9aecf"
  rampart-line: "#353d75"
  frame-indigo: "#5c66b3"
  ember-ink: "#1a1530"
  lantern-teal: "#74d6bb"
  day-sandstone: "#ecdcb9"
  day-sandstone-deep: "#e2cea4"
  day-ink: "#2a2140"
  day-umber: "#5b4630"
  day-amber: "#7a4405"
  day-on-amber: "#fff7e6"
  day-rampart: "#cdb582"
  day-frame: "#8f6f3a"
  day-lantern-teal: "#1d6b55"
typography:
  display:
    fontFamily: "Chakra Petch, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 5.25rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Chakra Petch, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.5vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.08
  title:
    fontFamily: "Chakra Petch, Segoe UI, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.08
  body:
    fontFamily: "Atkinson Hyperlegible Next, Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  nav:
    fontFamily: "Atkinson Hyperlegible Next, Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
  label:
    fontFamily: "Atkinson Hyperlegible Next, Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
rounded:
  none: "0px"
  edge-bezel: "12px"
  edge-screen: "3px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  shelf-gap: "clamp(56px, 9vw, 112px)"
  item-gap: "48px"
  pixel: "4px"
components:
  button-primary:
    backgroundColor: "{colors.keep-gold}"
    textColor: "{colors.ember-ink}"
    rounded: "{rounded.none}"
    padding: "10px 18px"
  button-ghost:
    textColor: "{colors.keep-gold}"
    rounded: "{rounded.none}"
    padding: "10px 18px"
  button-off:
    textColor: "{colors.moonlit-lavender}"
    rounded: "{rounded.none}"
    padding: "10px 18px"
  badge-soon:
    textColor: "{colors.keep-gold}"
    typography: "{typography.label}"
    padding: "1px 8px"
---

# Design System: Badeifer

## Overview

**Creative North Star: "The Moonlit Keep"**

The site is a night watch over a small castle workshop: deep indigo, lantern gold and parchment, the palette the Pixel Keep theme
already uses. The real work is the hero: product renders sit in pixel frames, and the Xeneon Edge in the hero is drawn as a device,
not a screenshot on a card. Everything around the work stays quiet so the work reads first.

Game flavour comes from colour, the notched pixel frame and pixel art in the imagery. Text never uses a pixel font: pixel type is
hard to read. Night is the default; a sandstone day palette follows the system or the toggle.

**Key Characteristics:**
- Indigo night ground with gold as the single accent.
- Notched pixel frames around media, buttons and badges; no rounded cards.
- Readable display type (Chakra Petch) over a highly legible body face.
- Shelves of projects separated by space and a 4px rule, not by boxes.

## Colors

A two-time-of-day palette: moonlit indigo by night, sandstone and amber by day, gold carrying every accent.

### Primary
- **Keep Gold** (keep-gold; day: Day Amber): links underlines, primary buttons, focus ring, step numbers, selected tab, support heading.

### Secondary
- **Lantern Teal** (lantern-teal): only the "Free" status badge.

### Neutral
- **Midnight Indigo** (midnight-indigo; day: Day Sandstone): page ground.
- **Dusk Indigo** (dusk-indigo; day: Day Sandstone Deep): the support band and placeholder art.
- **Parchment Ink** (parchment-ink; day: Day Ink): body text and headings.
- **Moonlit Lavender** (moonlit-lavender; day: Day Umber): secondary text. On day sandstone it is tinted warm, never gray.
- **Rampart Line** (rampart-line): rules under shelf headings, list dividers.
- **Frame Indigo** (frame-indigo): the pixel frame around media.

### Named Rules
**The One Lantern Rule.** Gold is the only accent. Teal marks "Free" and nothing else.
**The Warm Day Rule.** On sandstone, secondary text is umber; gray text on a coloured ground is refused.

## Typography

**Display Font:** Chakra Petch (with Segoe UI, system-ui)
**Body Font:** Atkinson Hyperlegible Next (with Atkinson Hyperlegible, system-ui)

**Character:** a squared, HUD-like display face for the game feel, over a body face built for legibility.

### Hierarchy
- **Display** (600, clamp 2.5 to 5.25rem, 1.08): the page h1 only.
- **Headline** (600, clamp 2 to 3rem, 1.08): shelf and section headings.
- **Title** (600, 1.75rem): project names in shelves; 2rem for project-page section heads.
- **Body** (400, 1.125rem, 1.6): all running text; ledes at 1.25rem in the secondary colour, max 58 to 62ch.
- **Label** (600, 0.8 to 0.875rem): the project kind and status badges.

### Named Rules
**The Readable Type Rule.** No pixel fonts for text, headings included. Pixel art lives in images only.
**The Title First Rule.** A project's name comes first; its kind and status sit under it, never above as an eyebrow.

## Layout

One centred column at 1440px max with a fluid gutter (16 to 56px); the Edge hero breaks out of it, up to 1760px wide. Shelves are separated by 56 to 112px. A shelf head puts the
headline left and the blurb right on wide screens, stacked below 860px. Project items sit in an auto-fill grid (min 340px); the
Edge shelf uses two columns to fit the wide widget renders. Project pages: gallery, then a 2:1 split of "What it does" and "You
need", then numbered setup steps. Below 860px the top nav becomes a scrolling second row; below 640px the Edge hero shows only its
large slot.

## Elevation & Depth

Flat. Depth comes from tonal layers (indigo to dusk) and the Edge bezel, which alone carries a soft drop shadow
(0 30px 60px -30px) because it is a physical object. The notched pixel frame is a border drawn with four zero-blur shadows, not
elevation.

### Named Rules
**The Only Object Rule.** Only the hardware drawing casts a shadow.
**The Readable Frame Rule.** Pixel frames and the off button hold 3:1 against the page in both themes.

## Shapes

Square corners everywhere, with a 4px notched pixel frame (2px on badges) around media, buttons and badges, the way sprites draw
boxes. The one rounded shape is the Edge device (12px bezel; widget slots use the Edge's own corner, 0.86 of the screen width).

## Components

### Buttons
- **Shape:** square, notched pixel frame (4px).
- **Primary:** gold fill, ember ink text, 10px 18px, bold.
- **Ghost:** gold frame and gold text.
- **Off ("opening soon"):** frame-indigo frame (3:1 or better), lavender text; never a dead link. When nothing is live, the support band collapses to one line instead.
- **Hover / Active:** primary brightens slightly; all press down 2px on active.

### Status badges
- **Style:** 2px notched frame, label type. Free is teal, Coming soon is gold outline, For sale is gold fill, In the workshop is a
  muted frame.

### Project items
- Pixel-framed media on black, then title, kind (status shown once in the shelf heading when the whole shelf shares it), one-line tagline, and a link named for the action: "Set up {name}", or "See how {name} works" while in development. No card box. Hover turns the frame gold and lifts it 2px. Items without media are text-only with a 4px frame-colored rule on top.

### Edge hero (signature)
- A Xeneon Edge drawing (2560:720 screen in a black bezel on a small stand) with three pages of real widget renders. Tabs below
  switch pages; arrow keys and a horizontal swipe do too. The new page slides in 3 percent from the swipe side.

### Navigation
- Sticky top bar (72px): 40px avatar and the name Badeifer at 2rem left, section links (1.0625rem, 600) right, day/night toggle. Links in lavender, ink on hover.

## Do's and Don'ts

### Do:
- **Do** put every project's real render or screenshot in a pixel frame before any description.
- **Do** keep store and donation buttons in the Off state until the page exists.
- **Do** check both night and day palettes for 4.5:1 text contrast.

### Don't:
- **Don't** use pixel fonts for any text.
- **Don't** put a label above a heading.
- **Don't** add a second accent colour or gray secondary text on sandstone.
- **Don't** wrap projects in rounded, shadowed cards.
