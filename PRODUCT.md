# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Owners of desk hardware (Corsair Xeneon Edge, Elgato Stream Deck) looking for widgets and plugins to install or buy.
- Obsidian users looking at the Keep family (Agent Keep, Pixel Keep, Task Pet).


## Product Purpose
A product library: every project with a live preview, what it does, what you need and how to set it up, and a way to get it (Elgato Marketplace, Obsidian's directory) or support development (GitHub Sponsors, Ko-fi). Success: installs, Marketplace sales and donations.

## Positioning
Plug and play: each project page is a complete setup guide, and every preview shows the real widget or plugin running.

## Operating Context
- Visitors arrive from Elgato Marketplace listings, the GitHub profile (Badeifer) and Obsidian's community directory.
- Static site on GitHub Pages; content in `src/site.mjs`, built with `node build.mjs`.

## Capabilities and Constraints
- Projects have a status: free, for sale, coming soon, or in the workshop. Statuses must stay honest.
- Link only public repos; private repo links are dead for visitors.
- Store and donation links stay "opening soon" until the pages exist.
- Product names must not lean on other companies' trademarks (Elgato Marketplace guidelines).
- Previews use demo data only; no real personal data in any media.
- Elgato rules: no donation links inside plugin settings; they belong on product pages and this site.

## Brand Commitments
- Name everywhere: Badeifer (site, GitHub, Maker Console organization, handle badeifer); no tagline after the name.
- Product voice, not personal: copy says what a project does for the user and how to set it up. Nothing about the maker's own life, desk or hardware. (Decided 2026-10-24.)
- Voice: plain and direct; no em dashes, no emojis, no filler.
- Game-styled, fun UI, but no pixel fonts for text (hard to read). Pixel art stays in imagery.
- Profile picture: `assets/avatar.svg` (keep tower under the moon), PNGs in `media/avatar-*.png`.

## Evidence on Hand
- Widget renders from demo data: `media/claude-*.png`, `media/nvdeck-*.png`, `media/needsyou-840.png`, `media/agenthome-1688.png`.
- Agent Keep and Pixel Keep screenshots and GIFs from their repos in `media/`.
- None yet: Task Pet and Session HQ screenshots, testimonials, download counts, prices. Do not invent them.

## Product Principles
1. Show the real thing working before describing it.
2. Honest status over hype: a project marked ready must be ready for a stranger.
3. Every project page answers: what it does, what you need, how to set it up.
4. Reading comes first: comfortable type, strong contrast in both day and night.
