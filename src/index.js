// TLC Landing Page - Cloudflare Worker
// Routes:
//   GET /        -> serve landing page
//   GET /health  -> health check
//   OPTIONS *    -> CORS preflight

// LANDING_HTML_START
const LANDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Longevity Chef | Food for Life</title>
<meta name="description" content="TLC connects what you eat, how your body responds, and how you feel into one insight system that gets sharper every day.">
<meta property="og:title" content="The Longevity Chef | Food for Life">
<meta property="og:description" content="See the patterns your body is trying to show you. Nutrition, body, and mind - connected.">
<meta property="og:image" content="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

:root {
  --black: #0d0d0d;
  --ink: #1a1a1a;
  --ink-2: #2e2e2e;
  --surface: #f5f4f0;
  --surface-2: #eeecea;
  --white: #ffffff;
  --green: #2ea84a;
  --green-dark: #1a5c28;
  --green-mid: #3d7a30;
  --green-light: #ebf7ee;
  --green-accent: #46c461;
  --nutrition: #39BA76;
  --body-blue: #398CBA;
  --mind: #E8B84B;
  --muted: rgba(26,26,26,0.42);
  --muted-2: rgba(26,26,26,0.65);
  --border: rgba(26,26,26,0.08);
  --border-mid: rgba(26,26,26,0.14);
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'Figtree', sans-serif;
  --section-pad: clamp(100px, 12vw, 160px);
  --gutter: clamp(24px, 5vw, 72px);
  --content-max: 1180px;
}

body { background: var(--white); color: var(--ink); font-family: var(--font-body); font-size: 16px; line-height: 1.65; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

/* ── ANIMATIONS ── */
@keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }

.container { max-width: var(--content-max); margin: 0 auto; padding: 0 var(--gutter); }
.label { display: inline-flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--green); }
.label::before { content: ''; width: 18px; height: 1.5px; background: var(--green); }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: var(--font-body); font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; border: none; cursor: pointer; border-radius: 2px; transition: all 0.25s cubic-bezier(0.4,0,0.2,1); white-space: nowrap; }
.btn:hover { transform: translateY(-2px); }
.btn-black { background: var(--ink); color: var(--white); padding: 16px 40px; }
.btn-black:hover { background: #333; box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.btn-green { background: var(--green); color: var(--white); padding: 16px 40px; box-shadow: 0 4px 16px rgba(46,168,74,0.2); }
.btn-green:hover { background: var(--green-mid); box-shadow: 0 8px 28px rgba(46,168,74,0.3); }
.btn-outline { background: transparent; color: var(--ink); padding: 15px 38px; border: 1.5px solid var(--border-mid); }
.btn-outline:hover { border-color: var(--ink); }
.btn-outline-white { background: transparent; color: var(--white); padding: 15px 38px; border: 1.5px solid rgba(255,255,255,0.25); }
.btn-outline-white:hover { border-color: rgba(255,255,255,0.6); }

/* ── REVEAL (Apple-style: slower, more travel, staggered) ── */
.reveal { opacity: 0; transform: translateY(40px); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-scale { opacity: 0; transform: scale(0.94); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal-scale.visible { opacity: 1; transform: scale(1); }
.d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; } .d3 { transition-delay: 0.3s; } .d4 { transition-delay: 0.4s; }
.d5 { transition-delay: 0.5s; } .d6 { transition-delay: 0.6s; } .d7 { transition-delay: 0.7s; }

#nebulaCanvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.45; }

/* ── PRIMARY NAV ── */
nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 18px var(--gutter); background: rgba(255,255,255,0); border-bottom: 1px solid transparent; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
nav.scrolled { background: rgba(255,255,255,0.92); backdrop-filter: blur(20px) saturate(1.4); border-bottom-color: var(--border); }
.nav-logo { display: flex; align-items: center; text-decoration: none; }
.nav-logo img { height: 56px; width: auto; display: block; }
.nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
.nav-links a { color: var(--muted-2); text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; transition: color 0.2s; }
.nav-links a:hover { color: var(--ink); }
.nav-cta { background: var(--ink); color: var(--white); padding: 10px 24px; border-radius: 2px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.25s; text-decoration: none; }
.nav-cta:hover { background: #333; transform: translateY(-1px); }

/* ── STICKY SUB-NAV (Apple-style, appears on scroll) ── */
.sub-nav { position: fixed; top: -50px; left: 0; right: 0; z-index: 190; background: rgba(255,255,255,0.92); backdrop-filter: blur(20px) saturate(1.4); border-bottom: 1px solid var(--border); padding: 0; transition: top 0.35s cubic-bezier(0.4,0,0.2,1); }
.sub-nav.show { top: 0; }
.sub-nav-inner { max-width: var(--content-max); margin: 0 auto; padding: 0 var(--gutter); display: flex; align-items: center; justify-content: space-between; height: 44px; }
.sub-nav-title { font-family: var(--font-display); font-size: 18px; letter-spacing: 0.04em; color: var(--ink); }
.sub-nav-links { display: flex; gap: 24px; list-style: none; }
.sub-nav-links a { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s; padding: 12px 0; border-bottom: 2px solid transparent; }
.sub-nav-links a:hover, .sub-nav-links a.active { color: var(--ink); border-bottom-color: var(--green); }

/* ── HERO (split, light, Apple-generous whitespace) ── */
.hero { position: relative; min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; align-items: stretch; overflow: hidden; z-index: 1; }
.hero-left { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; padding: 100px var(--gutter) 80px; background: var(--white); }
.hero-left::after { content: ''; position: absolute; top: 15%; right: -1px; bottom: 15%; width: 1px; background: var(--border-mid); }
.hero-eyebrow { margin-bottom: 28px; opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s forwards; }
.hero-headline { font-family: var(--font-display); font-size: clamp(80px, 10vw, 148px); line-height: 0.86; letter-spacing: 0.01em; color: var(--ink); margin-bottom: 8px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.35s forwards; }
.hero-headline-green { font-family: var(--font-body); font-style: italic; font-weight: 300; font-size: clamp(32px, 4vw, 56px); color: var(--green); letter-spacing: 0.02em; display: block; margin-bottom: 32px; line-height: 1.3; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.5s forwards; }
.hero-body { font-size: clamp(15px, 1.5vw, 18px); font-weight: 300; color: var(--muted-2); max-width: 440px; line-height: 1.85; margin-bottom: 48px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.65s forwards; }
.hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.8s forwards; }
.hero-right { position: relative; overflow: hidden; z-index: 1; }
.hero-photo { position: absolute; inset: 0; background-image: url(https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80); background-size: cover; background-position: center; opacity: 0; animation: fadeIn 1.4s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s forwards; will-change: transform; }
.hero-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 28%, rgba(255,255,255,0) 50%); }
.hero-photo::before { content: ''; position: absolute; inset: 0; z-index: 1; background: linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, transparent 15%, transparent 85%, rgba(255,255,255,0.6) 100%); }
.hero-scroll { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 3; opacity: 0; animation: fadeIn 1s ease 2s forwards; }
.hero-scroll svg { width: 28px; height: 28px; stroke: var(--muted); animation: float 2.5s ease-in-out infinite; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

/* ── TICKER ── */
.ticker { background: var(--ink); padding: 15px 0; overflow: hidden; position: relative; z-index: 2; }
.ticker-track { display: inline-flex; white-space: nowrap; animation: ticker 40s linear infinite; }
.ticker-item { display: inline-flex; align-items: center; gap: 14px; padding: 0 40px; font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
.ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--green-accent); flex-shrink: 0; }

/* ── THREE PILLARS (Apple-style generous spacing) ── */
.section-pillars { padding: var(--section-pad) 0; position: relative; z-index: 2; background: var(--white); }
.section-header { text-align: center; margin-bottom: 72px; }
.section-header h2 { font-family: var(--font-display); font-size: clamp(48px, 5.5vw, 76px); line-height: 0.95; letter-spacing: 0.02em; color: var(--ink); margin-bottom: 20px; }
.section-header h2 em { font-style: normal; color: var(--green); }
.section-header > p { font-size: 18px; color: var(--muted-2); max-width: 540px; margin: 0 auto; line-height: 1.75; font-weight: 300; }
.pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 56px; }
.pillar-card { background: var(--white); border: 1.5px solid var(--border-mid); border-radius: 12px; padding: 40px 30px; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); position: relative; overflow: hidden; }
.pillar-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; }
.pillar-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.06); }
.pillar-card.nutrition::before { background: var(--nutrition); }
.pillar-card.body-pillar::before { background: var(--body-blue); }
.pillar-card.mind::before { background: var(--mind); }
.pillar-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 22px; }
.pillar-icon.nutrition { background: rgba(57,186,118,0.1); }
.pillar-icon.body-pillar { background: rgba(57,140,186,0.1); }
.pillar-icon.mind { background: rgba(232,184,75,0.1); }
.pillar-icon svg { width: 26px; height: 26px; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; fill: none; }
.pillar-card h3 { font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 12px; }
.pillar-card p { font-size: 15px; color: var(--muted-2); line-height: 1.75; }
.pillars-tagline { text-align: center; font-size: 20px; color: var(--ink); font-weight: 500; letter-spacing: -0.01em; }

/* ── STATS (Apple-style bold numbers) ── */
.stats-bar { background: var(--surface); padding: 64px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); position: relative; z-index: 2; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.stat-num { font-family: var(--font-display); font-size: clamp(48px, 5vw, 68px); color: var(--ink); line-height: 1; }
.stat-num span { color: var(--green); }
.stat-label { font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }

/* ── FEATURE SHOWCASE (WHOOP-style alternating image-text pairs) ── */
.section-features { position: relative; z-index: 2; background: var(--white); }
.feature-block { padding: var(--section-pad) 0; border-bottom: 1px solid var(--border); }
.feature-block:last-child { border-bottom: none; }
.feature-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.feature-block:nth-child(even) .feature-inner { direction: rtl; }
.feature-block:nth-child(even) .feature-inner > * { direction: ltr; }
.feature-visual { position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 4/3; background: var(--surface); display: flex; align-items: center; justify-content: center; }
.feature-visual-icon { width: 80px; height: 80px; border-radius: 24px; display: flex; align-items: center; justify-content: center; }
.feature-visual-icon svg { width: 40px; height: 40px; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; fill: none; }
.feature-visual-icon.green { background: rgba(57,186,118,0.12); }
.feature-visual-icon.green svg { stroke: var(--nutrition); }
.feature-copy .label { margin-bottom: 20px; display: inline-flex; }
.feature-copy h3 { font-family: var(--font-display); font-size: clamp(36px, 4vw, 52px); line-height: 1; letter-spacing: 0.02em; color: var(--ink); margin-bottom: 20px; }
.feature-copy > p { font-size: 16px; color: var(--muted-2); line-height: 1.8; margin-bottom: 16px; font-weight: 300; }
.feature-copy .feature-highlights { list-style: none; margin-top: 24px; }
.feature-copy .feature-highlights li { font-size: 14px; color: var(--ink); padding: 8px 0; display: flex; align-items: center; gap: 12px; font-weight: 500; }
.feature-copy .feature-highlights li::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; }

/* ── HOW IT WORKS (dark, WHOOP-style) ── */
.section-loop { padding: var(--section-pad) 0; background: var(--ink); position: relative; z-index: 2; overflow: hidden; }
.section-loop::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 900px; height: 900px; border-radius: 50%; background: radial-gradient(circle, rgba(46,168,74,0.04) 0%, transparent 60%); pointer-events: none; }
.section-header-dark { text-align: center; margin-bottom: 72px; }
.section-header-dark h2 { font-family: var(--font-display); font-size: clamp(48px, 5.5vw, 76px); line-height: 0.95; letter-spacing: 0.02em; color: var(--white); margin-bottom: 20px; }
.section-header-dark h2 em { font-style: normal; color: var(--green-accent); }
.section-header-dark > p { font-size: 18px; color: rgba(255,255,255,0.5); max-width: 460px; margin: 0 auto; line-height: 1.75; font-weight: 300; }
.loop-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; position: relative; }
.loop-steps::before { content: ''; position: absolute; top: 54px; left: 12%; right: 12%; height: 2px; background: linear-gradient(90deg, transparent, rgba(46,168,74,0.15), rgba(46,168,74,0.15), transparent); }
.loop-step { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 32px 24px; text-align: center; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); position: relative; z-index: 1; }
.loop-step:hover { background: rgba(255,255,255,0.06); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(46,168,74,0.06); }
.loop-step-num { width: 40px; height: 40px; border-radius: 50%; background: var(--green); color: var(--white); font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 4px 16px rgba(46,168,74,0.25); }
.loop-step-icon { width: 52px; height: 52px; border-radius: 50%; background: rgba(46,168,74,0.08); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.loop-step-icon svg { width: 24px; height: 24px; stroke: var(--green-accent); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.loop-step h4 { font-size: 18px; font-weight: 700; color: var(--white); margin-bottom: 10px; }
.loop-step p { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; }
.loop-engine { text-align: center; margin-top: 44px; }
.loop-engine-pill { display: inline-flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 50px; padding: 12px 32px; box-shadow: 0 0 0 6px rgba(46,168,74,0.03); }
.loop-engine-pill svg { width: 18px; height: 18px; stroke: var(--green-accent); fill: none; stroke-width: 2; stroke-linecap: round; }
.loop-engine-pill strong { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--white); }
.loop-engine-pill span { font-size: 11px; color: rgba(255,255,255,0.35); }

/* ── THE DIFFERENCE (dark + food photo) ── */
.section-difference { padding: var(--section-pad) 0; background: var(--ink); position: relative; z-index: 2; overflow: hidden; }
.section-difference::before { content: ''; position: absolute; inset: 0; background-image: url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=60); background-size: cover; background-position: center; opacity: 0.1; }
.difference-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; }
.difference-quote { text-align: center; }
.quote-mark { font-family: var(--font-display); font-size: 140px; color: var(--green); line-height: 0.5; margin-bottom: 20px; }
.quote-pre { font-size: 14px; color: rgba(255,255,255,0.4); margin-bottom: 10px; letter-spacing: 0.04em; }
.quote-text { font-size: clamp(24px, 2.8vw, 34px); color: var(--white); font-weight: 400; line-height: 1.4; }
.quote-text em { color: var(--green-accent); font-style: italic; }
.difference-answer h2 { font-family: var(--font-display); font-size: clamp(40px, 4.5vw, 60px); line-height: 0.95; letter-spacing: 0.02em; color: var(--white); margin-bottom: 24px; }
.difference-answer p { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.8; margin-bottom: 16px; font-weight: 300; }
.highlight-pill { background: rgba(46,168,74,0.12); border: 1px solid rgba(46,168,74,0.2); padding: 2px 12px; border-radius: 3px; color: var(--green-accent); font-weight: 600; }

/* ── WEARABLES ── */
.section-wearables { padding: 56px 0; background: var(--surface); position: relative; z-index: 2; border-top: 1px solid var(--border); }
.wearables-inner { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }
.wearable-label { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }
.wearable-tag { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink); background: var(--white); border: 1px solid var(--border-mid); border-radius: 50px; padding: 9px 20px; transition: all 0.25s; }
.wearable-tag:hover { border-color: var(--green); box-shadow: 0 4px 12px rgba(46,168,74,0.08); }
.wearable-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }
.wearable-tag-muted { color: var(--muted); border-color: var(--border); }

/* ── PRICING (Apple-style clean, WHOOP-style tiers) ── */
.section-pricing { padding: var(--section-pad) 0; position: relative; z-index: 2; background: var(--white); }
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: start; }
.pricing-card { border: 1.5px solid var(--border-mid); border-radius: 14px; padding: 44px 30px; text-align: center; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); position: relative; background: var(--white); }
.pricing-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.06); }
.pricing-card.featured { border-color: var(--green); box-shadow: 0 0 0 1px var(--green), 0 16px 48px rgba(46,168,74,0.1); transform: scale(1.04); }
.pricing-card.featured:hover { transform: scale(1.04) translateY(-6px); }
.pricing-badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--green); color: var(--white); font-size: 10px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; padding: 6px 18px; border-radius: 50px; }
.pricing-soon { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--surface-2); color: var(--muted-2); font-size: 10px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; padding: 6px 18px; border-radius: 50px; }
.pricing-tier { font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted-2); margin-bottom: 10px; }
.pricing-price { font-family: var(--font-display); font-size: 56px; color: var(--ink); line-height: 1; margin-bottom: 4px; }
.pricing-period { font-size: 13px; color: var(--muted); margin-bottom: 28px; }
.pricing-features { list-style: none; text-align: left; margin-bottom: 32px; }
.pricing-features li { font-size: 14px; color: var(--ink-2); padding: 9px 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
.pricing-features li:last-child { border-bottom: none; }
.pricing-check { width: 16px; height: 16px; flex-shrink: 0; }
.pricing-check path { stroke: var(--green); }
.pricing-card.muted { opacity: 0.65; }
.pricing-card.muted .pricing-price { color: var(--muted-2); }

/* ── FAQ ── */
.faq-section { padding: 0 0 var(--section-pad); position: relative; z-index: 2; background: var(--white); }
.faq-list { max-width: 700px; margin: 0 auto; }
.faq-item { border-bottom: 1px solid var(--border); }
.faq-q { display: flex; align-items: center; justify-content: space-between; padding: 22px 0; cursor: pointer; font-size: 16px; font-weight: 600; color: var(--ink); background: none; border: none; width: 100%; text-align: left; font-family: var(--font-body); transition: color 0.2s; }
.faq-q:hover { color: var(--green); }
.faq-chevron { width: 20px; height: 20px; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); stroke: var(--muted); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.faq-item.open .faq-chevron { transform: rotate(180deg); }
.faq-a { max-height: 0; overflow: hidden; transition: max-height 0.5s cubic-bezier(0.4,0,0.2,1); }
.faq-a-inner { padding: 0 0 22px; font-size: 15px; color: var(--muted-2); line-height: 1.75; }
.faq-item.open .faq-a { max-height: 200px; }

/* ── FINAL CTA ── */
.section-cta { padding: var(--section-pad) 0; background: var(--ink); position: relative; overflow: hidden; z-index: 2; }
.section-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(46,168,74,0.05) 0%, transparent 60%); }
.cta-inner { text-align: center; position: relative; max-width: 640px; margin: 0 auto; }
.cta-inner h2 { font-family: var(--font-display); font-size: clamp(52px, 7vw, 88px); line-height: 0.92; color: var(--white); margin-bottom: 24px; }
.cta-inner h2 span { color: var(--green-accent); }
.cta-inner > p { font-size: 18px; color: rgba(255,255,255,0.5); line-height: 1.75; margin-bottom: 44px; font-weight: 300; }
.cta-actions { display: flex; flex-direction: column; align-items: center; gap: 18px; }
.cta-note { font-size: 12px; color: rgba(255,255,255,0.28); letter-spacing: 0.06em; }

/* ── FOOTER ── */
footer { background: var(--black); padding: 60px 0 0; position: relative; z-index: 2; }
.footer-inner { max-width: var(--content-max); margin: 0 auto; padding: 0 var(--gutter); display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
.footer-logo img { height: 40px; width: auto; margin-bottom: 14px; filter: brightness(0) invert(1); }
.footer-brand p { font-size: 13px; color: rgba(255,255,255,0.35); line-height: 1.7; max-width: 280px; }
.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 10px; }
.footer-col a { font-size: 13px; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; }
.footer-col a:hover { color: var(--white); }
.footer-bottom { max-width: var(--content-max); margin: 0 auto; padding: 24px var(--gutter); border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; margin-top: 44px; }
.footer-copy { font-size: 12px; color: rgba(255,255,255,0.25); }

/* ── MOBILE STICKY CTA ── */
.mobile-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.96); backdrop-filter: blur(12px); border-top: 1px solid var(--border); padding: 12px var(--gutter); z-index: 190; text-align: center; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.mobile-cta.show { transform: translateY(0); }
.mobile-cta .btn { width: 100%; justify-content: center; }

/* ── RESPONSIVE ── */
@media (max-width: 960px) {
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .hero-right { height: 50vh; }
  .hero-left { padding-top: 120px; padding-bottom: 56px; }
  .hero-left::after { display: none; }
  .pillars-grid { grid-template-columns: 1fr; gap: 16px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
  .loop-steps { grid-template-columns: repeat(2, 1fr); }
  .loop-steps::before { display: none; }
  .feature-inner { grid-template-columns: 1fr; gap: 40px; }
  .feature-block:nth-child(even) .feature-inner { direction: ltr; }
  .difference-inner { grid-template-columns: 1fr; gap: 48px; }
  .pricing-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
  .pricing-card.featured { transform: none; }
  .pricing-card.featured:hover { transform: translateY(-6px); }
  .footer-inner { grid-template-columns: 1fr 1fr; }
  .nav-links { display: none; }
  .sub-nav-links { display: none; }
  .mobile-cta { display: block; }
}
@media (max-width: 640px) {
  :root { --section-pad: clamp(72px, 10vw, 100px); }
  .hero-right { height: 40vh; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .loop-steps { grid-template-columns: 1fr; }
  .footer-inner { grid-template-columns: 1fr; gap: 28px; }
  .footer-bottom { flex-direction: column; gap: 8px; }
  .hero-headline { font-size: clamp(64px, 16vw, 100px); }
}
</style>
</head>
<body>

<canvas id="nebulaCanvas"></canvas>

<!-- NAV -->
<nav id="mainNav">
  <a href="/" class="nav-logo"><img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef"></a>
  <ul class="nav-links">
    <li><a href="#pillars">Pillars</a></li>
    <li><a href="#how-it-works">How It Works</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#pricing">Pricing</a></li>
    <li><a href="https://tlc-tier2-onboarding.chris-ec5.workers.dev" class="nav-cta">Start Free</a></li>
  </ul>
</nav>

<!-- STICKY SUB-NAV (Apple-style) -->
<div class="sub-nav" id="subNav">
  <div class="sub-nav-inner">
    <span class="sub-nav-title">The Longevity Chef</span>
    <ul class="sub-nav-links">
      <li><a href="#pillars">Pillars</a></li>
      <li><a href="#how-it-works">How It Works</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#pricing">Pricing</a></li>
    </ul>
  </div>
</div>

<!-- HERO -->
<section class="hero" id="hero">
  <div class="hero-left">
    <div class="hero-eyebrow"><span class="label">The wellbeing system that learns who you are</span></div>
    <h1 class="hero-headline">FOOD<br>FOR</h1>
    <span class="hero-headline-green">Life.</span>
    <p class="hero-body">TLC joins the dots between what you eat, how your body responds, and how you feel. Three pillars. One system. Hidden patterns revealed. It gets sharper every single day.</p>
    <div class="hero-actions">
      <a href="https://tlc-express-onboarding.chris-ec5.workers.dev" class="btn btn-black">Start Free</a>
      <a href="#how-it-works" class="btn btn-outline">See How It Works</a>
    </div>
  </div>
  <div class="hero-right"><div class="hero-photo" id="heroPhoto"></div></div>
  <div class="hero-scroll"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
</section>

<!-- TICKER -->
<div class="ticker"><div class="ticker-track">
  <span class="ticker-item"><span class="ticker-dot"></span>Dynamic Insights</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Longevity Coach</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Meal Matchmaker</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Menu Scanner</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Pantry Pal</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Meal Analyser</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Wearable Sync</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Weekly Strategy</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Dynamic Insights</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Longevity Coach</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Meal Matchmaker</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Menu Scanner</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Pantry Pal</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Meal Analyser</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Wearable Sync</span>
  <span class="ticker-item"><span class="ticker-dot"></span>Weekly Strategy</span>
</div></div>

<!-- THREE PILLARS -->
<section class="section-pillars" id="pillars">
  <div class="container">
    <div class="section-header reveal">
      <span class="label" style="margin-bottom:20px;display:inline-flex;justify-content:center;">The Foundation</span>
      <h2>THREE PILLARS.<br><em>ONE PICTURE.</em></h2>
      <p>Your food. Your body. Your mind. Tracked separately, they're just numbers. Connected, they reveal the patterns that unlock lasting wellbeing and longevity.</p>
    </div>
    <div class="pillars-grid">
      <div class="pillar-card nutrition reveal-scale d1"><div class="pillar-icon nutrition"><svg viewBox="0 0 24 24" stroke="#39BA76"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg></div><h3>Nutrition</h3><p>What you eat shapes everything. TLC tracks meals, macros, and patterns so you see exactly how your food drives your energy, recovery, and long-term health.</p></div>
      <div class="pillar-card body-pillar reveal-scale d2"><div class="pillar-icon body-pillar"><svg viewBox="0 0 24 24" stroke="#398CBA"><path d="M19.5 12.572l-7.5 7.428l-7.5-7.428a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572"/><path d="M12 6l-1 4h2l-1 4"/></svg></div><h3>Body</h3><p>Sleep, recovery, heart rate, strain. Real biometric data feeds directly into your insights. Your plan adapts to what your body is doing today, not what a formula assumed last month.</p></div>
      <div class="pillar-card mind reveal-scale d3"><div class="pillar-icon mind"><svg viewBox="0 0 24 24" stroke="#E8B84B"><path d="M12 2a8 8 0 0 1 8 8c0 2.5-1 4.8-2.6 6.4L12 22l-5.4-5.6A8 8 0 0 1 12 2z"/><circle cx="12" cy="10" r="3"/></svg></div><h3>Mind</h3><p>Mood, stress, focus, energy. A 60-second daily reflection captures what wearables can't. TLC spots the link between how you feel today and what you ate, did, or skipped yesterday.</p></div>
    </div>
    <p class="pillars-tagline reveal d4">Nobody else connects all three. That's where the hidden insights live.</p>
  </div>
</section>

<!-- STATS -->
<div class="stats-bar"><div class="container"><div class="stats-grid">
  <div class="stat-item reveal d1"><span class="stat-num" data-count="3">0</span><span class="stat-label">Pillars Connected</span></div>
  <div class="stat-item reveal d2"><span class="stat-num" data-count="25">0</span><span class="stat-label">Wearable Devices</span></div>
  <div class="stat-item reveal d3"><span class="stat-num" data-count="5">0</span><span class="stat-label">Daily Commitment</span></div>
  <div class="stat-item reveal d4"><span class="stat-num" data-count="8">0</span><span class="stat-label">Tools In Your Kit</span></div>
</div></div></div>

<!-- HOW IT WORKS -->
<section class="section-loop" id="how-it-works"><div class="container">
  <div class="section-header-dark reveal">
    <span class="label" style="margin-bottom:20px;display:inline-flex;justify-content:center;color:var(--green-accent);">Your Journey</span>
    <h2>THE <em>DAILY LOOP</em></h2>
    <p>Two minutes a day. TLC does the heavy lifting. It learns, adapts, and gets sharper with every cycle.</p>
  </div>
  <div class="loop-steps">
    <div class="loop-step reveal d1"><div class="loop-step-num">1</div><div class="loop-step-icon"><svg viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg></div><h4>Log</h4><p>Snap a photo, jot a note, or find a restaurant. However you eat, TLC captures it.</p></div>
    <div class="loop-step reveal d2"><div class="loop-step-num">2</div><div class="loop-step-icon"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div><h4>Reflect</h4><p>60 seconds each evening. Rate your energy, sleep, mood. The patterns start here.</p></div>
    <div class="loop-step reveal d3"><div class="loop-step-num">3</div><div class="loop-step-icon"><svg viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg></div><h4>Insight</h4><p>Your daily Dynamic Insight connects meals, biometrics, and reflections. Every day builds on the last.</p></div>
    <div class="loop-step reveal d4"><div class="loop-step-num">4</div><div class="loop-step-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div><h4>Strategy</h4><p>Each week, a fresh strategy adapts to what's working and what isn't. Your next week always builds on the last.</p></div>
  </div>
  <div class="loop-engine reveal d5"><div class="loop-engine-pill"><svg viewBox="0 0 24 24"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8"/><path d="M7 21.9l-4-4 4-4"/><path d="M21 11.8v2a4 4 0 0 1-4 4H4.2"/></svg><strong>TLC Engine</strong><span>Always adapting</span></div></div>
</div></section>

<!-- FEATURE SHOWCASE (WHOOP-style alternating sections) -->
<section class="section-features" id="features">
  <div class="feature-block"><div class="container"><div class="feature-inner">
    <div class="feature-visual reveal-scale"><div class="feature-visual-icon green"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div></div>
    <div class="feature-copy reveal d2">
      <span class="label">Always learning</span>
      <h3>DYNAMIC INSIGHTS</h3>
      <p>Each day, TLC analyses your meals, biometrics, and reflections together. Not in isolation. Together. That's where the hidden patterns live.</p>
      <p>Weekly reviews go deeper, recalibrating your targets as your body adapts. The system never stops learning. Your next insight is always smarter than the last.</p>
      <ul class="feature-highlights"><li>Daily cross-pillar pattern detection</li><li>Weekly deep-dive with Longevity Score</li><li>Targets that evolve as you do</li></ul>
    </div>
  </div></div></div>
  <div class="feature-block"><div class="container"><div class="feature-inner">
    <div class="feature-visual reveal-scale"><div class="feature-visual-icon green"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div></div>
    <div class="feature-copy reveal d2">
      <span class="label">With you wherever, whenever</span>
      <h3>LONGEVITY COACH</h3>
      <p>Your personal coach knows your 7-day history, your active goals, today's biometrics, and what you ate for lunch. It meets you where you are and gives guidance grounded in your real data.</p>
      <p>Every conversation builds on the last. The longer you use it, the deeper the coaching becomes. Always available. Always learning.</p>
      <ul class="feature-highlights"><li>Full context from day one</li><li>Grounded in your actual data</li><li>Conversations that compound over time</li></ul>
    </div>
  </div></div></div>
  <div class="feature-block"><div class="container"><div class="feature-inner">
    <div class="feature-visual reveal-scale"><div class="feature-visual-icon green"><svg viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg></div></div>
    <div class="feature-copy reveal d2">
      <span class="label">Entirely flexible</span>
      <h3>MEAL MATCHMAKER</h3>
      <p>Eating out? TLC finds restaurant dishes near you that hit your macros, respect your allergies, and match your goals. At a restaurant with a paper menu? Snap a photo and TLC finds the best dish in seconds.</p>
      <p>No rigid meal plans. No guilt. TLC meets you where you are, whether that's a business lunch, a family dinner, or a quick bite between meetings.</p>
      <ul class="feature-highlights"><li>Restaurant discovery across any cuisine</li><li>Macro-matched dish recommendations</li><li>Menu Scanner for physical menus</li><li>Allergy and restriction compliance</li></ul>
    </div>
  </div></div></div>
  <div class="feature-block"><div class="container"><div class="feature-inner">
    <div class="feature-visual reveal-scale"><div class="feature-visual-icon green"><svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div></div>
    <div class="feature-copy reveal d2">
      <span class="label">Doing the heavy lifting</span>
      <h3>PANTRY PAL + RECIPES</h3>
      <p>Photograph your fridge. TLC identifies what you have and generates recipes matched to your macros and goals. No meal prep stress. No waste.</p>
      <p>Need a recipe right now? Recipes on Demand delivers instant suggestions tuned to your preferences. Already eaten? Snap your plate and the Meal Analyser breaks it down in seconds.</p>
      <ul class="feature-highlights"><li>Photo-based pantry scanning</li><li>Goal-matched recipe generation</li><li>Instant macro breakdown from any meal photo</li></ul>
    </div>
  </div></div></div>
</section>

<!-- THE DIFFERENCE -->
<section class="section-difference"><div class="container"><div class="difference-inner">
  <div class="difference-quote reveal"><div class="quote-mark">"</div><div class="quote-pre">You might be asking</div><p class="quote-text">Can't I just ask a search engine<br><em>"What should I eat?"</em></p></div>
  <div class="difference-answer reveal d2">
    <span class="label" style="margin-bottom:22px;display:inline-flex;color:var(--green-accent);">The Difference</span>
    <h2>SHORTCUTS DON'T BUILD LASTING HEALTH</h2>
    <p>A one-off question doesn't know your sleep score, your recovery trends, or how your body responded last Tuesday. It can't connect the dots.</p>
    <p>TLC remembers <span class="highlight-pill">everything about you</span> - not just what you asked today. It connects nutrition, biometrics, and how you actually feel into one system that learns, adapts, and does the heavy lifting for you.</p>
    <p>Built from years of real chef and nutrition expertise, cross-referenced with your body's actual data. That depth cannot be replicated by a single question.</p>
    <a href="https://tlc-express-onboarding.chris-ec5.workers.dev" class="btn btn-green" style="margin-top:28px;">Get Your Free Longevity Blueprint</a>
  </div>
</div></div></section>

<!-- WEARABLES -->
<section class="section-wearables"><div class="container"><div class="wearables-inner">
  <span class="wearable-label">Integrates with:</span>
  <span class="wearable-tag"><span class="wearable-dot"></span>WHOOP</span>
  <span class="wearable-tag"><span class="wearable-dot"></span>OURA</span>
  <span class="wearable-tag"><span class="wearable-dot"></span>FITBIT</span>
  <span class="wearable-tag"><span class="wearable-dot"></span>GARMIN</span>
  <span class="wearable-tag"><span class="wearable-dot"></span>ULTRAHUMAN</span>
  <span class="wearable-tag wearable-tag-muted">+ many more</span>
</div></div></section>

<!-- PRICING -->
<section class="section-pricing" id="pricing"><div class="container">
  <div class="section-header reveal" style="margin-bottom:72px;">
    <span class="label" style="margin-bottom:20px;display:inline-flex;justify-content:center;">Plans</span>
    <h2>CHOOSE YOUR <em>PATH</em></h2>
    <p>TLC Lite gets you started. TLC unlocks the deep insights that connect all three pillars and drive lasting change.</p>
  </div>
  <div class="pricing-grid">
    <div class="pricing-card reveal-scale d1"><div class="pricing-tier">TLC Lite</div><div class="pricing-price">Free</div><div class="pricing-period">forever</div><ul class="pricing-features"><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Meal Matchmaker</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Basic meal logging</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Restaurant discovery</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Nutrition blueprint</li></ul><a href="https://tlc-express-onboarding.chris-ec5.workers.dev" class="btn btn-outline" style="width:100%;justify-content:center;">Start Free</a></div>
    <div class="pricing-card featured reveal-scale d2"><div class="pricing-badge">Most Popular</div><div class="pricing-tier">TLC</div><div class="pricing-price">$9.99</div><div class="pricing-period">per month</div><ul class="pricing-features"><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Everything in Lite</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Dynamic Insights (daily + weekly)</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Longevity Coach</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Menu Scanner + Meal Analyser</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Pantry Pal + Recipes on Demand</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Weekly Strategy + Goals</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Wearable integration (25+ devices)</li></ul><a href="https://tlc-tier2-onboarding.chris-ec5.workers.dev" class="btn btn-green" style="width:100%;justify-content:center;">Start Your Journey</a></div>
    <div class="pricing-card muted reveal-scale d3"><div class="pricing-soon">Coming Soon</div><div class="pricing-tier">TLC Pro</div><div class="pricing-price">$19.99</div><div class="pricing-period">per month</div><ul class="pricing-features"><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Everything in TLC</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Personalised meal planning</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Advanced analytics</li><li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Priority support</li></ul><a href="mailto:chris@thelongevitychef.com?subject=TLC%20Pro%20Waitlist" class="btn btn-outline" style="width:100%;justify-content:center;">Join Waitlist</a></div>
  </div>
</div></section>

<!-- FAQ -->
<section class="faq-section"><div class="container"><div class="faq-list">
  <div class="faq-item"><button class="faq-q" onclick="this.parentElement.classList.toggle('open')">Do I need a wearable to use TLC?<svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></button><div class="faq-a"><div class="faq-a-inner">No. TLC works with or without a wearable. If you have one, your biometric data flows in automatically and enriches your insights. If you don't, you can enter baseline data manually and TLC will still deliver personalised guidance.</div></div></div>
  <div class="faq-item"><button class="faq-q" onclick="this.parentElement.classList.toggle('open')">Can I cancel anytime?<svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></button><div class="faq-a"><div class="faq-a-inner">Yes. No lock-in contracts, no cancellation fees. Cancel any time from your profile settings.</div></div></div>
  <div class="faq-item"><button class="faq-q" onclick="this.parentElement.classList.toggle('open')">What happens to my data if I cancel?<svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></button><div class="faq-a"><div class="faq-a-inner">Your data remains stored securely and is available if you choose to return. We never sell or share your personal health data with third parties.</div></div></div>
  <div class="faq-item"><button class="faq-q" onclick="this.parentElement.classList.toggle('open')">How long does it take to set up?<svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></button><div class="faq-a"><div class="faq-a-inner">About 5 minutes. The onboarding assessment takes you through your goals, dietary preferences, health conditions, and lifestyle. TLC generates your personal longevity blueprint immediately after.</div></div></div>
</div></div></section>

<!-- FINAL CTA -->
<section class="section-cta"><div class="container"><div class="cta-inner">
  <span class="label" style="justify-content:center;margin-bottom:28px;display:inline-flex;color:var(--green-accent);">This Is Where Longevity Begins</span>
  <h2 class="reveal">YOUR HEALTH,<br><span>CONNECTED.</span></h2>
  <p class="reveal d1">TLC adapts to you, not the other way around. Start free. Upgrade when you're ready. It's with you wherever you go, whenever you need it.</p>
  <div class="cta-actions reveal d2">
    <a href="https://tlc-express-onboarding.chris-ec5.workers.dev" class="btn btn-green" style="font-size:13px;padding:18px 52px;">Take Your Free Assessment</a>
    <span class="cta-note">Cancel anytime . No lock-in . No fees</span>
  </div>
</div></div></section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-brand"><div class="footer-logo"><img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef"></div><p>Connecting the dots between nutrition, body, and mind. Eat smarter, feel better, live longer.</p></div>
    <div class="footer-col"><ul><li><a href="https://www.instagram.com/thelongevitychef_">Instagram</a></li></ul></div>
    <div class="footer-col"><ul><li><a href="https://docs.google.com/document/d/1ZXE0c5gG4ep34tESNVOQF0SWg7lPpPb4KaQ7fkIcPFg/edit?usp=sharing">FAQs</a></li><li><a href="https://tally.so/r/D4k8eZ">Contact</a></li></ul></div>
    <div class="footer-col"><ul><li><a href="https://docs.google.com/document/d/11IzYrOfZytm4r-7FN0oNnuch-_ViIhAdLSYgSO4v-oE/edit?usp=sharing">Privacy Policy</a></li><li><a href="https://docs.google.com/document/d/1gp9xA3yyTfraTdyJCT4uTM33jaDDf_Vg6Z8Dt4gMkzQ/edit?usp=sharing">Terms &amp; Conditions</a></li></ul></div>
  </div>
  <div class="footer-bottom"><span class="footer-copy">&copy; 2026 The Longevity Chef. All rights reserved.</span><span class="footer-copy">Food for Life</span></div>
</footer>

<div class="mobile-cta" id="mobileCta"><a href="https://tlc-express-onboarding.chris-ec5.workers.dev" class="btn btn-green">Start Free</a></div>

<script>
// ── Nav + sub-nav scroll ──
const nav = document.getElementById('mainNav');
const subNav = document.getElementById('subNav');
const mobileCta = document.getElementById('mobileCta');
const heroSection = document.querySelector('.hero');
const heroPhoto = document.getElementById('heroPhoto');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  nav.classList.toggle('scrolled', sy > 50);
  // Sub-nav appears after hero
  const heroH = heroSection ? heroSection.offsetHeight : 700;
  if (subNav) subNav.classList.toggle('show', sy > heroH);
  if (subNav && sy > heroH) nav.style.top = '-80px'; else nav.style.top = '0';
  // Mobile CTA
  if (mobileCta) mobileCta.classList.toggle('show', sy > heroH);
  // Parallax hero photo (subtle)
  if (heroPhoto) heroPhoto.style.transform = 'translateY(' + (sy * 0.15) + 'px) scale(' + (1 + sy * 0.0001) + ')';
  // Nebula fade
  const canvas = document.getElementById('nebulaCanvas');
  if (canvas) canvas.style.opacity = Math.max(0.1, 0.45 - sy / window.innerHeight * 0.4);
});

// ── Active sub-nav link ──
const sections = document.querySelectorAll('section[id]');
const subLinks = document.querySelectorAll('.sub-nav-links a');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      subLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector('.sub-nav-links a[href="#' + e.target.id + '"]');
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
sections.forEach(s => sectionObs.observe(s));

// ── Reveal on scroll (Apple-style threshold) ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.reveal, .reveal-scale').forEach(el => revealObs.observe(el));

// ── Counter animation ──
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count);
    const suffix = target === 25 ? '+' : target === 5 ? ' min' : '';
    let current = 0;
    const step = Math.max(1, Math.floor(target / 20));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current + suffix;
    }, 40);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

// ── Nebula ──
(function() {
  const canvas = document.getElementById('nebulaCanvas');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  function resize() { canvas.width = window.innerWidth * dpr; canvas.height = window.innerHeight * dpr; canvas.style.width = window.innerWidth + 'px'; canvas.style.height = window.innerHeight + 'px'; }
  resize(); window.addEventListener('resize', resize);
  const ctx = canvas.getContext('2d');
  const rgba = (r,g,b,a) => 'rgba('+r+','+g+','+b+','+a+')';
  const G = [46, 168, 74];
  const nodes = [{a:0,rx:0.32,ry:0.28,spd:0.004,dot:2.0,bright:0.18},{a:1.05,rx:0.24,ry:0.20,spd:-0.005,dot:1.8,bright:0.14},{a:2.09,rx:0.38,ry:0.32,spd:0.003,dot:2.2,bright:0.20},{a:3.14,rx:0.18,ry:0.22,spd:-0.006,dot:1.5,bright:0.12},{a:4.19,rx:0.30,ry:0.25,spd:0.0045,dot:1.8,bright:0.16},{a:5.24,rx:0.35,ry:0.18,spd:-0.0035,dot:1.6,bright:0.14},{a:0.52,rx:0.15,ry:0.30,spd:0.007,dot:1.5,bright:0.10},{a:2.62,rx:0.40,ry:0.15,spd:-0.003,dot:1.8,bright:0.14}];
  const rings = [], pulses = [];
  let t = 0, ringT = 0, pulseT = 0, paused = false;
  const heroObs2 = new IntersectionObserver(entries => { paused = !entries[0].isIntersecting; }, { threshold: 0 });
  if (heroSection) heroObs2.observe(heroSection);
  function draw() {
    if (paused) { requestAnimationFrame(draw); return; }
    const W = canvas.width / dpr, H = canvas.height / dpr, cx = W * 0.5, cy = H * 0.42;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); t++;
    for (const n of nodes) { n.a += n.spd; n.x = cx + Math.cos(n.a) * n.rx * W; n.y = cy + Math.sin(n.a) * n.ry * H; }
    ringT++; if (ringT > 90) { ringT = 0; rings.push({r:0,a:0.2}); }
    for (let i = rings.length-1; i >= 0; i--) { const rn = rings[i]; rn.r += 0.5; rn.a *= 0.975; if (rn.a < 0.01) { rings.splice(i,1); continue; } ctx.beginPath(); ctx.arc(cx,cy,rn.r,0,Math.PI*2); ctx.strokeStyle = rgba(...G, rn.a*0.2); ctx.lineWidth = 0.8; ctx.stroke(); }
    for (const n of nodes) { ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(n.x,n.y); ctx.strokeStyle = rgba(...G, 0.06 + 0.03*Math.sin(t*0.02+n.a)); ctx.lineWidth = 0.7; ctx.stroke(); }
    for (let i = 0; i < nodes.length; i++) { for (let j = i+1; j < nodes.length; j++) { const d = Math.hypot(nodes[i].x-nodes[j].x,nodes[i].y-nodes[j].y); const maxD = Math.min(W,H)*0.35; if (d < maxD) { ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.strokeStyle = rgba(...G,(1-d/maxD)*0.08); ctx.lineWidth = 0.6; ctx.stroke(); } } }
    pulseT++; if (pulseT > 35) { pulseT = 0; const n = nodes[Math.floor(Math.random()*nodes.length)]; if (Math.random()<0.5) { pulses.push({fx:cx,fy:cy,tx:n.x,ty:n.y,p:0}); } else { const n2 = nodes[Math.floor(Math.random()*nodes.length)]; if (n!==n2) pulses.push({fx:n.x,fy:n.y,tx:n2.x,ty:n2.y,p:0}); } }
    for (let i = pulses.length-1; i >= 0; i--) { const pl = pulses[i]; pl.p += 0.025; if (pl.p > 1) { pulses.splice(i,1); continue; } const px = pl.fx+(pl.tx-pl.fx)*pl.p, py = pl.fy+(pl.ty-pl.fy)*pl.p; const alpha = Math.sin(pl.p*Math.PI); const pg = ctx.createRadialGradient(px,py,0,px,py,5); pg.addColorStop(0,rgba(...G,alpha*0.3)); pg.addColorStop(1,rgba(...G,0)); ctx.beginPath(); ctx.arc(px,py,5,0,Math.PI*2); ctx.fillStyle = pg; ctx.fill(); ctx.beginPath(); ctx.arc(px,py,1.5,0,Math.PI*2); ctx.fillStyle = rgba(29,96,64,alpha*0.5); ctx.fill(); }
    for (const n of nodes) { const grd = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.dot*4); grd.addColorStop(0,rgba(...G,n.bright*0.15)); grd.addColorStop(1,rgba(...G,0)); ctx.beginPath(); ctx.arc(n.x,n.y,n.dot*4,0,Math.PI*2); ctx.fillStyle = grd; ctx.fill(); ctx.beginPath(); ctx.arc(n.x,n.y,n.dot,0,Math.PI*2); ctx.fillStyle = rgba(...G,n.bright); ctx.fill(); }
    const cg = ctx.createRadialGradient(cx,cy,0,cx,cy,18); cg.addColorStop(0,rgba(...G,0.12)); cg.addColorStop(0.4,rgba(...G,0.04)); cg.addColorStop(1,rgba(...G,0)); ctx.beginPath(); ctx.arc(cx,cy,18,0,Math.PI*2); ctx.fillStyle = cg; ctx.fill(); ctx.beginPath(); ctx.arc(cx,cy,3,0,Math.PI*2); ctx.fillStyle = rgba(29,96,64,0.3); ctx.fill();
    requestAnimationFrame(draw);
  }
  draw();
})();
</script>
</body>
</html>
`;
// LANDING_HTML_END

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'tlc-landing',
        version: '1.0.0'
      }), {
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }

    // Serve landing page for all other GET requests
    if (request.method === 'GET') {
      return new Response(LANDING_HTML, {
        headers: {
          ...cors,
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'public, max-age=300',
        }
      });
    }

    return new Response('Not Found', { status: 404, headers: cors });
  }
};
