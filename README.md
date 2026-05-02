# TLC Landing Page — thelongevitychef.io

> **THIS IS THE LIVE PRODUCTION LANDING PAGE.**
> Last deployed: 2026-05-03

`thelongevitychef.io` and `www.thelongevitychef.io` are served exclusively from this repo.

---

## ⚠️ WARNING — There is an archived copy elsewhere

`cwilsonjbh/tlc-engine-master` contains a folder called `landing-live/` and `landing/`. Both share the Cloudflare worker name `tlc-landing`. **Deploying from either of those will silently overwrite this production site.** This caused a production incident on 2026-04-28.

**Always make landing page changes here.**

---

## How to edit

1. Edit the relevant HTML source file:
   - Homepage → `homepage.html`
   - Pricing page → `pricing.html`
   - Features → `features.html`
   - How It Works → `how-it-works.html`
   - Why TLC → `why-tlc.html`
   - Start / onboarding entry → `start.html`
   - Privacy / Terms → `privacy.html` / `terms.html`

2. Run the sync script to rebuild the worker bundle:
   ```bash
   node sync-pages.js
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```
   *(This runs sync then wrangler deploy — always use this, never `npx wrangler deploy` alone.)*

4. Commit and push:
   ```bash
   git add homepage.html src/index.js
   git commit -m "your change description"
   git push
   ```

---

## File structure

```
tlc-landing/
├── homepage.html       ← Main landing page (edit here for homepage changes)
├── pricing.html        ← /pricing page
├── features.html       ← /features page
├── how-it-works.html   ← /how-it-works page
├── why-tlc.html        ← /why-tlc page
├── start.html          ← /start page (tier chooser)
├── privacy.html        ← /privacy
├── terms.html          ← /terms
├── sync-pages.js       ← Bundles all HTML into src/index.js
├── wrangler.toml       ← Cloudflare Worker config (routes to custom domains)
├── package.json
└── src/
    └── index.js        ← Compiled worker — DO NOT edit HTML blocks here directly
```

---

## Live URLs

| URL | Status |
|-----|--------|
| `https://thelongevitychef.io` | ✅ Production |
| `https://www.thelongevitychef.io` | ✅ Production |

## Changelog

| Date | Change |
|------|--------|
| 2026-05-03 | Removed guarantee/card text from TLC card; "Always free" on Lite; fixed Mona Lisa (Wikimedia permanent source) |
| 2026-04-28 | Restored after accidental overwrite from landing-live/ |
