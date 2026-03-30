# TLC Landing Page — Claude Instructions

## Critical Rules

- **ALWAYS use `npm run deploy`** — runs `node sync-landing.js` then `wrangler deploy`
- **NEVER edit HTML inside `src/index.js`** — always edit `landing.html`
- **After every deploy:** commit changed files and push to git
- NO emojis — SVG icons only. NO AI mentions. NO em dashes in UI copy.
- **QA IN BROWSER BEFORE USER TESTS** — use the preview server (port 8794) to verify every change

## Deployment Workflow

```bash
npm run deploy    # sync landing.html into src/index.js then wrangler deploy — ALWAYS use this
```

Never run `npx wrangler deploy` directly after editing `landing.html` — it skips the sync step.

## Project Structure

```
C:\Users\cwils\TLC\Landing\
├── package.json          ← "deploy": "node sync-landing.js && wrangler deploy"
├── wrangler.toml         ← name = "tlc-landing", main = "src/index.js"
├── sync-landing.js       ← injects landing.html between LANDING_HTML_START/END markers
├── landing.html          ← EDIT HERE (all CSS + JS inline)
└── src/
    └── index.js          ← Worker (never edit HTML block here)
```

## Live URLs

- Production: `https://tlc-landing.chris-ec5.workers.dev`
- Preview: `http://localhost:8794` (via launch.json "landing" config)

## CTAs — Correct Destinations

| CTA | Destination |
|-----|-------------|
| "Start Free" (TLC Lite) | `https://tlc-express-onboarding.chris-ec5.workers.dev` |
| "Start Your Journey" (TLC $9.99) | `https://tlc-tier2-onboarding.chris-ec5.workers.dev` |
| "Join Waitlist" (TLC Pro) | `mailto:chris@thelongevitychef.com` |
| "Take Your Free Assessment" (CTA banner) | `https://tlc-express-onboarding.chris-ec5.workers.dev` |

## Design System

See the root `CLAUDE.md` and brand memory docs for full details. Key landing-specific tokens:

| Token | Value | Notes |
|-------|-------|-------|
| `--green` | `#2ea84a` | Landing green (different from app `#39BA76`) |
| `--ink` | `#1a1a1a` | Body text + dark sections |
| `--white` | `#ffffff` | Body background — ALWAYS light |
| `--surface` | `#f5f4f0` | Stats bar background |
| `--nutrition` | `#39BA76` | Nutrition pillar |
| `--body-blue` | `#398CBA` | Body pillar |
| `--mind` | `#E8B84B` | Mind pillar |

Fonts: **Bebas Neue** (headlines), **Figtree** (body) — Google Fonts.

## Sections (top to bottom)

1. Sticky primary nav (logo + links + CTA)
2. Hero — split grid, food photo right, text + CTAs left
3. Ticker strip (dark)
4. Three Pillars (Nutrition / Body / Mind cards)
5. Stats bar (3 pillars, 25+ devices, 5 min, 8 tools)
6. The Daily Loop (dark section, 4-step flow)
7. Feature blocks — alternating (Dynamic Insights, Longevity Coach, Meal Matchmaker, Pantry Pal)
8. Pricing — 3 tiers (Lite free / TLC $9.99 featured / Pro coming soon)
9. FAQ accordion
10. Final CTA banner (dark)
11. Footer (dark, white logo)
12. Mobile sticky CTA bar

## Brand Hard Rules

- NO dark theme on the overall page — only How It Works, Difference, Final CTA, and Footer sections use dark backgrounds
- NO emojis — SVG icons only (Lucide/Feather style, 2px stroke)
- NO "AI", "GPT", "machine learning" mentions anywhere
- NO em dashes in UI copy
- Every layout must be responsive: mobile (375px), tablet (768px), desktop (1200px+)

## Git

- Repo: github.com/cwilsonjbh/tlc-landing (branch: master)
- Identity: Chris Wilson / chris@thelongevitychef.com
- Stage specific files — never `git add -A`
