// TLC Landing Page - Cloudflare Worker
// Routes:
//   GET /             -> homepage
//   GET /features     -> features page
//   GET /how-it-works -> how it works page
//   GET /why-tlc      -> why tlc page
//   GET /pricing      -> pricing page
//   GET /start        -> goal selection / tier chooser
//   GET /privacy      -> privacy policy
//   GET /terms        -> terms of service
//   GET /health       -> health check
//   OPTIONS *         -> CORS preflight

// LANDING_HTML_START
const LANDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Longevity Chef | Food for Life</title>
<meta name="description" content="TLC connects what you eat, how your body responds, and how you feel into one insight system that gets sharper every day.">
<meta property="og:title" content="The Longevity Chef | Food for Life">
<meta property="og:description" content="See the patterns your body is trying to show you. Nutrition, body, and mind. Connected for the first time.">
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

@keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes livePulse { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(46,168,74,0.4); } 50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(46,168,74,0); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

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

.reveal { opacity: 0; transform: translateY(40px); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-scale { opacity: 0; transform: scale(0.94); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal-scale.visible { opacity: 1; transform: scale(1); }
.d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; } .d3 { transition-delay: 0.3s; } .d4 { transition-delay: 0.4s; }

#nebulaCanvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.45; }

/* ── NAV ── */
nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 18px var(--gutter); background: rgba(255,255,255,0); border-bottom: 1px solid transparent; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
nav.scrolled { background: rgba(255,255,255,0.92); backdrop-filter: blur(20px) saturate(1.4); border-bottom-color: var(--border); }
.nav-logo { display: flex; align-items: center; text-decoration: none; }
.nav-logo img { height: 56px; width: auto; display: block; }
.nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
.nav-links a { color: var(--muted-2); text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; transition: color 0.2s; }
.nav-links a:hover, .nav-links a.active-page { color: var(--ink); }
.nav-cta { background: var(--ink); color: var(--white) !important; padding: 10px 24px; border-radius: 2px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.25s; text-decoration: none; }
.nav-cta:hover { background: #333; transform: translateY(-1px); }
.nav-login { color: var(--muted-2) !important; }
.nav-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 4px; color: var(--ink); }
.nav-hamburger svg { width: 24px; height: 24px; display: block; }

/* ── MOBILE NAV ── */
.mobile-nav { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); z-index: 199; flex-direction: column; align-items: center; justify-content: center; gap: 32px; }
.mobile-nav.open { display: flex; }
.mobile-nav a { font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink); text-decoration: none; font-family: var(--font-display); }
.mobile-nav a:hover { color: var(--green); }
.mobile-nav-close { position: absolute; top: 20px; right: var(--gutter); background: none; border: none; cursor: pointer; color: var(--muted-2); }
.mobile-nav-close svg { width: 28px; height: 28px; }
.mobile-nav .btn { margin-top: 8px; }

/* ── LOGIN MODAL ── */
.login-overlay { display: none; position: fixed; inset: 0; background: rgba(26,26,26,0.55); backdrop-filter: blur(4px); z-index: 9000; align-items: center; justify-content: center; padding: 24px; }
.login-overlay.open { display: flex; }
.login-modal { background: #fff; border-radius: 16px; padding: 40px 36px; max-width: 420px; width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,0.18); position: relative; }
.login-modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; color: var(--muted-2); padding: 4px; }
.login-modal h3 { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--ink); margin: 0 0 6px; letter-spacing: 0.03em; }
.login-modal p { font-size: 14px; color: var(--muted-2); margin: 0 0 24px; line-height: 1.5; }
.login-modal input[type="email"] { width: 100%; border: 1.5px solid var(--border); border-radius: 8px; padding: 13px 16px; font-size: 15px; font-family: 'Figtree', sans-serif; color: var(--ink); outline: none; transition: border-color 0.2s; margin-bottom: 14px; }
.login-modal input[type="email"]:focus { border-color: var(--green); }
.login-modal .btn-login-submit { width: 100%; background: var(--green); color: #fff; border: none; border-radius: 8px; padding: 14px; font-size: 14px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: background 0.2s, transform 0.15s; font-family: 'Figtree', sans-serif; }
.login-modal .btn-login-submit:hover { background: #259940; transform: translateY(-1px); }
.login-modal .btn-login-submit:disabled { background: var(--muted); cursor: not-allowed; transform: none; }
.login-modal-success { display: none; text-align: center; padding: 8px 0; }
.login-modal-success h4 { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--ink); margin: 8px 0; }
.login-modal-success p { font-size: 14px; color: var(--muted-2); margin: 0; }
.login-modal-error { display: none; background: #fff3f3; border: 1px solid #fca5a5; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #b91c1c; margin-bottom: 12px; }

/* ── STICKY SUB-NAV ── */
.sub-nav { position: fixed; top: -50px; left: 0; right: 0; z-index: 190; background: rgba(255,255,255,0.92); backdrop-filter: blur(20px) saturate(1.4); border-bottom: 1px solid var(--border); padding: 0; transition: top 0.35s cubic-bezier(0.4,0,0.2,1); }
.sub-nav.show { top: 0; }
.sub-nav-inner { max-width: var(--content-max); margin: 0 auto; padding: 0 var(--gutter); display: flex; align-items: center; justify-content: space-between; height: 44px; }
.sub-nav-title { font-family: var(--font-display); font-size: 18px; letter-spacing: 0.04em; color: var(--ink); }
.sub-nav-links { display: flex; gap: 24px; list-style: none; }
.sub-nav-links a { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s; padding: 12px 0; border-bottom: 2px solid transparent; }
.sub-nav-links a:hover, .sub-nav-links a.active { color: var(--ink); border-bottom-color: var(--green); }

/* ── HERO ── */
.hero { position: relative; min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; align-items: stretch; overflow: hidden; z-index: 1; }
.hero-left { position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: center; padding: 100px var(--gutter) 80px; background: var(--white); }
.hero-left::after { content: ''; position: absolute; top: 15%; right: -1px; bottom: 15%; width: 1px; background: var(--border-mid); }
.hero-eyebrow { margin-bottom: 28px; opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s forwards; }
.hero-headline { font-family: var(--font-display); font-size: clamp(36px, 4.2vw, 56px); line-height: 0.90; letter-spacing: 0.01em; color: var(--ink); margin-bottom: 16px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.35s forwards; }
.hero-headline-green { font-family: var(--font-body); font-style: italic; font-weight: 300; font-size: clamp(18px, 2.2vw, 28px); color: var(--green); letter-spacing: 0.02em; display: block; margin-bottom: 32px; line-height: 1.3; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.5s forwards; }
.hero-body { font-size: clamp(15px, 1.5vw, 18px); font-weight: 300; color: var(--muted-2); max-width: 440px; line-height: 1.85; margin-bottom: 48px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.65s forwards; }
.hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.8s forwards; }
.hero-trust { font-size: 12px; color: var(--muted); margin-top: 14px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.95s forwards; letter-spacing: 0.02em; }
.hero-right { position: relative; overflow: hidden; z-index: 1; background: #1a2018; }
.hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-video-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(to right, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.6) 22%, rgba(255,255,255,0.1) 42%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.32) 100%); pointer-events: none; }

/* ── FLOATING INSIGHT CARD ── */
.hero-insight-card { position: absolute; bottom: 18%; left: 7%; z-index: 3; width: 232px; background: rgba(255,255,255,0.93); backdrop-filter: blur(24px) saturate(1.5); border-radius: 16px; padding: 18px 20px; box-shadow: 0 24px 64px rgba(0,0,0,0.20), 0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.55); opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.6s forwards; }
.hic-label { font-size: 9px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--green); margin-bottom: 12px; display: flex; align-items: center; gap: 7px; }
.hic-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: livePulse 2s ease-in-out infinite; flex-shrink: 0; }
.hic-speedo-wrap { text-align: center; margin: 4px -4px 2px; }
.hic-speedo-svg { width: 100%; display: block; overflow: visible; }
.hic-speedo-label { font-size: 11.5px; font-weight: 700; color: var(--ink); margin-top: -6px; margin-bottom: 1px; }
.hic-speedo-sub { font-size: 10px; color: var(--muted); font-weight: 500; margin-bottom: 11px; }
.hic-rings { display: flex; justify-content: space-between; gap: 4px; margin-bottom: 13px; }
.hic-ring-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
.hic-ring-outer { position: relative; width: 48px; height: 48px; }
.hic-ring-svg { width: 48px; height: 48px; transform: rotate(-90deg); overflow: visible; }
.hic-ring-track { fill: none; stroke: rgba(26,26,26,0.07); stroke-width: 4; }
.hic-ring-fill { fill: none; stroke-width: 4; stroke-linecap: round; }
.hic-ring-center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.hic-ring-val { font-size: 11px; font-weight: 800; color: var(--ink); line-height: 1; }
.hic-ring-name { font-size: 7px; color: var(--muted); letter-spacing: 0.07em; text-transform: uppercase; font-weight: 700; }
.hic-quote { font-size: 10px; color: var(--muted-2); font-style: italic; line-height: 1.55; border-top: 1px solid rgba(26,26,26,0.07); padding-top: 11px; margin: 0; }
.hero-scroll { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 3; opacity: 0; animation: fadeIn 1s ease 2s forwards; }
.hero-scroll svg { width: 28px; height: 28px; stroke: var(--muted); animation: float 2.5s ease-in-out infinite; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
@media (max-width: 960px) {
  .hero-insight-card { width: 200px; padding: 13px 15px; bottom: 14px; right: 50%; transform: translateX(50%); }
}

/* ── TICKER ── */
.ticker { background: var(--ink); padding: 15px 0; overflow: hidden; position: relative; z-index: 2; }
.ticker-track { display: inline-flex; white-space: nowrap; animation: ticker 40s linear infinite; }
.ticker-item { display: inline-flex; align-items: center; gap: 14px; padding: 0 40px; font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
.ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--green-accent); flex-shrink: 0; }

/* ── STATS ── */
.stats-bar { background: var(--surface); padding: 64px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); position: relative; z-index: 2; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.stat-num { font-family: var(--font-display); font-size: clamp(48px, 5vw, 68px); color: var(--ink); line-height: 1; }
.stat-num span { color: var(--green); }
.stat-label { font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
.stat-sub { font-size: 13px; color: var(--ink-2); line-height: 1.45; max-width: 160px; text-align: center; font-weight: 500; margin-top: 2px; }

/* ── THREE PILLARS ── */
.section-pillars { padding: var(--section-pad) 0; position: relative; z-index: 2; background: var(--white); }
.section-header { text-align: center; margin-bottom: 72px; }
.section-header h2 { font-family: var(--font-display); font-size: clamp(48px, 5.5vw, 76px); line-height: 0.95; letter-spacing: 0.02em; color: var(--ink); margin-bottom: 20px; }
.section-header h2 em { font-style: normal; color: var(--green); }
.section-header > p { font-size: 18px; color: var(--muted-2); max-width: 540px; margin: 0 auto; line-height: 1.75; font-weight: 300; }
.pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; }
.pillar-card { background: var(--white); border: 1.5px solid var(--border-mid); border-radius: 16px; padding: 40px 30px 32px; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); position: relative; overflow: hidden; }
.pillar-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; border-radius: 16px 16px 0 0; }
.pillar-card:hover { transform: translateY(-6px); box-shadow: 0 20px 56px rgba(0,0,0,0.08); }
.pillar-card.nutrition { background: linear-gradient(160deg, rgba(57,186,118,0.05) 0%, rgba(255,255,255,0) 55%); }
.pillar-card.body-pillar { background: linear-gradient(160deg, rgba(57,140,186,0.05) 0%, rgba(255,255,255,0) 55%); }
.pillar-card.mind { background: linear-gradient(160deg, rgba(232,184,75,0.05) 0%, rgba(255,255,255,0) 55%); }
.pillar-card.nutrition::before { background: var(--nutrition); }
.pillar-card.body-pillar::before { background: var(--body-blue); }
.pillar-card.mind::before { background: var(--mind); }
.pillar-visual { margin-bottom: 22px; display: flex; align-items: center; justify-content: center; }
.pillar-icon-wrap { width: 68px; height: 68px; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
.pillar-card.nutrition .pillar-icon-wrap { background: rgba(57,186,118,0.12); }
.pillar-card.body-pillar .pillar-icon-wrap { background: rgba(57,140,186,0.12); }
.pillar-card.mind .pillar-icon-wrap { background: rgba(232,184,75,0.12); }
.pillar-card h3 { font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 6px; text-align: center; }
.pillar-hook { font-size: 15px; font-weight: 600; color: var(--ink); text-align: center; margin-bottom: 12px; }
.pillar-card p.pillar-body { font-size: 14.5px; color: var(--muted-2); line-height: 1.72; text-align: center; }
.pillar-data-tags { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 20px; }
.pillar-data-tag { font-size: 10px; font-weight: 700; padding: 4px 11px; border-radius: 5px; letter-spacing: 0.01em; }
.pillar-card.nutrition .pillar-data-tag { background: rgba(57,186,118,0.09); color: #2a9148; }
.pillar-card.body-pillar .pillar-data-tag { background: rgba(57,140,186,0.09); color: #2b6e93; }
.pillar-card.mind .pillar-data-tag { background: rgba(232,184,75,0.09); color: #927010; }
.pillars-link { text-align: center; }
.pillars-link a { font-size: 13px; font-weight: 700; color: var(--green); text-decoration: none; letter-spacing: 0.04em; border-bottom: 1.5px solid rgba(46,168,74,0.25); padding-bottom: 2px; transition: all 0.2s; }
.pillars-link a:hover { color: var(--green-dark); border-bottom-color: var(--green); }

/* ── FEATURE TEASERS ── */
.section-teasers { padding: var(--section-pad) 0; background: var(--surface); position: relative; z-index: 2; border-top: 1px solid var(--border); }
.teasers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
.teaser-card { background: var(--white); border: 1.5px solid var(--border-mid); border-radius: 16px; padding: 40px 28px 32px; display: flex; flex-direction: column; position: relative; overflow: hidden; transition: all 0.35s cubic-bezier(0.4,0,0.2,1); text-decoration: none; color: inherit; }
.teaser-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 16px 16px 0 0; }
.teaser-card.tc-di::before { background: linear-gradient(90deg, var(--nutrition), var(--green)); }
.teaser-card.tc-mm::before { background: linear-gradient(90deg, var(--green), var(--green-mid)); }
.teaser-card.tc-coach::before { background: linear-gradient(90deg, var(--body-blue), #2b6e93); }
.teaser-card:hover { transform: translateY(-6px); box-shadow: 0 20px 56px rgba(0,0,0,0.08); border-color: transparent; }
.teaser-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
.teaser-card.tc-di .teaser-icon { background: rgba(57,186,118,0.10); }
.teaser-card.tc-mm .teaser-icon { background: rgba(46,168,74,0.10); }
.teaser-card.tc-coach .teaser-icon { background: rgba(57,140,186,0.10); }
.teaser-icon svg { width: 28px; height: 28px; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.teaser-card.tc-di .teaser-icon svg { stroke: var(--nutrition); }
.teaser-card.tc-mm .teaser-icon svg { stroke: var(--green); }
.teaser-card.tc-coach .teaser-icon svg { stroke: var(--body-blue); }
.teaser-h { font-family: var(--font-display); font-size: clamp(26px, 2.5vw, 34px); line-height: 1; letter-spacing: 0.02em; color: var(--ink); margin-bottom: 8px; }
.teaser-sub { font-size: 13px; font-style: italic; color: var(--muted); margin-bottom: 16px; font-weight: 400; }
.teaser-body { font-size: 14.5px; color: var(--muted-2); line-height: 1.72; flex: 1; }
.teaser-cta { display: inline-flex; align-items: center; gap: 6px; margin-top: 24px; font-size: 12px; font-weight: 700; color: var(--green); letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1.5px solid rgba(46,168,74,0.25); padding-bottom: 2px; width: fit-content; transition: all 0.2s; }
.teaser-card:hover .teaser-cta { border-bottom-color: var(--green); }
.teasers-more { text-align: center; }
.teasers-more p { font-size: 15px; color: var(--muted-2); margin-bottom: 8px; }
.teasers-more a { font-size: 13px; font-weight: 700; color: var(--green); text-decoration: none; letter-spacing: 0.04em; border-bottom: 1.5px solid rgba(46,168,74,0.25); padding-bottom: 2px; transition: all 0.2s; }
.teasers-more a:hover { color: var(--green-dark); border-bottom-color: var(--green); }

/* ── TESTIMONIALS ── */
.section-testimonials { padding: var(--section-pad) 0; background: linear-gradient(135deg, #154D33 0%, #1D6040 50%, #39BA76 100%); position: relative; z-index: 2; overflow: hidden; }
#testimonialNebula { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
.section-testimonials .container { position: relative; z-index: 1; }
.testimonials-header { text-align: center; margin-bottom: 60px; }
.testimonials-header h2 { font-family: var(--font-display); font-size: clamp(40px, 5vw, 64px); line-height: 1; letter-spacing: 0.02em; color: var(--white); margin-bottom: 14px; }
.testimonials-header h2 em { color: rgba(255,255,255,0.85); font-style: normal; }
.testimonials-header > p { font-size: 17px; color: rgba(255,255,255,0.60); max-width: 480px; margin: 0 auto; line-height: 1.75; }
.testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.testimonial-card { background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.18); border-radius: 16px; padding: 36px 30px; backdrop-filter: blur(12px); transition: all 0.35s; display: flex; flex-direction: column; }
.testimonial-card:hover { border-color: rgba(255,255,255,0.30); background: rgba(255,255,255,0.16); transform: translateY(-4px); }
.t-stars { display: flex; gap: 4px; margin-bottom: 22px; }
.t-star { width: 14px; height: 14px; fill: var(--mind); }
.t-quote { font-size: 15.5px; color: rgba(255,255,255,0.82); line-height: 1.75; margin-bottom: 28px; font-weight: 300; flex: 1; }
.t-quote strong { color: var(--white); font-weight: 700; }
.t-author { display: flex; align-items: center; gap: 14px; margin-top: auto; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.10); }
.t-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.14); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.22); }
.t-avatar-letter { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.5); font-family: var(--font-display); }
.t-name { font-size: 14px; font-weight: 700; color: var(--white); margin-bottom: 3px; }
.t-device { font-size: 11px; color: rgba(255,255,255,0.52); font-weight: 500; letter-spacing: 0.04em; }

/* ── PRICING SUMMARY ── */
.section-pricing { padding: var(--section-pad) 0; position: relative; z-index: 2; background: var(--white); }
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: start; }
.pricing-card { border: 1.5px solid var(--border-mid); border-radius: 14px; padding: 44px 30px; text-align: center; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); position: relative; background: var(--white); }
.pricing-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.06); }
.pricing-card.featured { border-color: var(--green); box-shadow: 0 0 0 1px var(--green), 0 16px 48px rgba(46,168,74,0.1); transform: scale(1.04); }
.pricing-card.featured:hover { transform: scale(1.04) translateY(-6px); }
.pricing-badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--green); color: var(--white); font-size: 10px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; padding: 6px 18px; border-radius: 50px; }
.pricing-tier { font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted-2); margin-bottom: 10px; }
.pricing-price { font-family: var(--font-display); font-size: 56px; color: var(--ink); line-height: 1; margin-bottom: 4px; }
.pricing-period { font-size: 13px; color: var(--muted); margin-bottom: 20px; }
.pricing-desc { font-size: 14px; color: var(--muted-2); line-height: 1.65; margin-bottom: 24px; min-height: 64px; }
.pricing-features { list-style: none; text-align: left; margin-bottom: 32px; }
.pricing-features li { font-size: 13.5px; color: var(--ink-2); padding: 7px 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
.pricing-features li:last-child { border-bottom: none; }
.pricing-check { width: 16px; height: 16px; flex-shrink: 0; }
.pricing-check path { stroke: var(--green); }
.pricing-trial { font-size: 12px; color: var(--muted); margin-top: 12px; }
.pricing-compare { text-align: center; margin-top: 40px; }
.pricing-compare a { font-size: 13px; font-weight: 700; color: var(--green); text-decoration: none; letter-spacing: 0.04em; border-bottom: 1.5px solid rgba(46,168,74,0.25); padding-bottom: 2px; transition: all 0.2s; }
.pricing-compare a:hover { color: var(--green-dark); border-bottom-color: var(--green); }

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
.footer-bottom { max-width: var(--content-max); margin: 44px auto 0; padding: 24px var(--gutter); border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; }
.footer-copy { font-size: 12px; color: rgba(255,255,255,0.25); }

/* ── MOBILE STICKY CTA ── */
.mobile-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.97); backdrop-filter: blur(12px); border-top: 1px solid var(--border); padding: 12px var(--gutter); padding-bottom: max(12px, calc(8px + env(safe-area-inset-bottom, 0px))); z-index: 300; text-align: center; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.mobile-cta.show { transform: translateY(0); }
.mobile-cta .btn { width: 100%; justify-content: center; }

/* ── RESPONSIVE ── */
@media (max-width: 960px) {
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .hero-right { height: 50vh; }
  .hero-left { padding-top: 120px; padding-bottom: 56px; }
  .hero-left::after { display: none; }
  .pillars-grid { grid-template-columns: 1fr; gap: 16px; }
  .teasers-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
  .testimonials-grid { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; }
  .pricing-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
  .pricing-card.featured { transform: none; }
  .footer-inner { grid-template-columns: 1fr 1fr; }
  .nav-links { display: none; }
  .nav-hamburger { display: block; }
  .sub-nav-links { display: none; }
  .sub-nav { display: none; }
  .mobile-cta { display: block; }
  body { padding-bottom: 72px; }
}
@media (max-width: 640px) {
  :root { --section-pad: clamp(72px, 10vw, 100px); }
  .hero-right { height: 40vh; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
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
    <li><a href="/features">Features</a></li>
    <li><a href="/how-it-works">How It Works</a></li>
    <li><a href="/why-tlc">Why TLC</a></li>
    <li><a href="/pricing">Pricing</a></li>
    <li><a href="#" class="nav-login" onclick="openLoginModal();return false;">Log in</a></li>
    <li><a href="/start" class="nav-cta">Start Free</a></li>
  </ul>
  <button class="nav-hamburger" id="navHamburger" onclick="toggleMobileNav()" aria-label="Open menu">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
</nav>

<!-- MOBILE NAV OVERLAY -->
<div class="mobile-nav" id="mobileNav">
  <button class="mobile-nav-close" onclick="toggleMobileNav()" aria-label="Close menu">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <a href="/features" onclick="toggleMobileNav()">Features</a>
  <a href="/how-it-works" onclick="toggleMobileNav()">How It Works</a>
  <a href="/why-tlc" onclick="toggleMobileNav()">Why TLC</a>
  <a href="/pricing" onclick="toggleMobileNav()">Pricing</a>
  <a href="#" onclick="toggleMobileNav();openLoginModal();return false;">Log in</a>
  <a href="/start" class="btn btn-green">Start Free</a>
</div>

<!-- STICKY SUB-NAV -->
<div class="sub-nav" id="subNav">
  <div class="sub-nav-inner">
    <span class="sub-nav-title">The Longevity Chef</span>
    <ul class="sub-nav-links">
      <li><a href="#pillars">The System</a></li>
      <li><a href="#teasers">Features</a></li>
      <li><a href="#pricing">Plans</a></li>
    </ul>
  </div>
</div>

<!-- HERO -->
<section class="hero" id="hero">
  <div class="hero-left">
    <div class="hero-eyebrow"><span class="label">The Data &middot; The Body &middot; The Mind</span></div>
    <h1 class="hero-headline">YOUR MIND KNEW.<br>YOUR BODY KNEW.<br>YOUR WEARABLE KNEW.</h1>
    <span class="hero-headline-green">Nobody connected them. Until now.</span>
    <p class="hero-body">TLC reads your meals, your sleep, your stress, and the way you felt on Tuesday. It finds the thread running through all of them. One insight, every evening, that finally makes sense of you.</p>
    <div class="hero-actions">
      <a href="/start" class="btn btn-black">See What You've Been Missing</a>
      <a href="/how-it-works" class="btn btn-outline">How It Works</a>
    </div>
    <p class="hero-trust">Your data is yours. Never sold, never shared. &nbsp;&middot;&nbsp; Encrypted in transit and at rest. &nbsp;&middot;&nbsp; No wearable required.</p>
  </div>
  <div class="hero-right">
    <video class="hero-video" autoplay muted loop playsinline poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80">
      <source src="https://videos.pexels.com/video-files/3310491/3310491-hd_1920_1080_25fps.mp4" type="video/mp4">
    </video>
    <div class="hero-video-overlay"></div>
    <div class="hero-insight-card">
      <div class="hic-label"><span class="hic-live-dot"></span>Live Insight</div>
      <div class="hic-speedo-wrap">
        <svg class="hic-speedo-svg" viewBox="0 0 200 110">
          <defs><linearGradient id="hicGrad" gradientUnits="userSpaceOnUse" x1="18" y1="100" x2="182" y2="100"><stop offset="0%" stop-color="#E8B84B"/><stop offset="55%" stop-color="#39BA76"/><stop offset="100%" stop-color="#2ea84a"/></linearGradient></defs>
          <path d="M 18,100 A 82,82 0 0,1 182,100" stroke="rgba(26,26,26,0.08)" stroke-width="12" fill="none" stroke-linecap="round"/>
          <path id="hic-speedo-fill" d="M 18,100 A 82,82 0 0,1 182,100" stroke="url(#hicGrad)" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="257.6" stroke-dashoffset="257.6" style="transition:stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1) 0.1s;"/>
          <text id="hic-speedo-num" x="100" y="86" text-anchor="middle" font-family="'Bebas Neue',sans-serif" font-size="36" fill="#1a1a1a">0</text>
          <text x="100" y="100" text-anchor="middle" font-family="'Figtree',sans-serif" font-size="9" fill="rgba(26,26,26,0.38)" font-weight="600">/ 1000</text>
        </svg>
        <div class="hic-speedo-label">Longevity Score</div>
        <div class="hic-speedo-sub">Strong day &middot; Insight ready</div>
      </div>
      <div class="hic-rings">
        <div class="hic-ring-wrap">
          <div class="hic-ring-outer">
            <svg class="hic-ring-svg" viewBox="0 0 36 36"><circle class="hic-ring-track" cx="18" cy="18" r="14"/><circle class="hic-ring-fill" cx="18" cy="18" r="14" stroke="var(--nutrition)" stroke-dasharray="87.96" stroke-dashoffset="87.96" id="hic-ring-n" style="transition:stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1);"/></svg>
            <div class="hic-ring-center"><span class="hic-ring-val">78</span></div>
          </div>
          <span class="hic-ring-name">Nutrition</span>
        </div>
        <div class="hic-ring-wrap">
          <div class="hic-ring-outer">
            <svg class="hic-ring-svg" viewBox="0 0 36 36"><circle class="hic-ring-track" cx="18" cy="18" r="14"/><circle class="hic-ring-fill" cx="18" cy="18" r="14" stroke="var(--body-blue)" stroke-dasharray="87.96" stroke-dashoffset="87.96" id="hic-ring-b" style="transition:stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1) 0.15s;"/></svg>
            <div class="hic-ring-center"><span class="hic-ring-val">65</span></div>
          </div>
          <span class="hic-ring-name">Body</span>
        </div>
        <div class="hic-ring-wrap">
          <div class="hic-ring-outer">
            <svg class="hic-ring-svg" viewBox="0 0 36 36"><circle class="hic-ring-track" cx="18" cy="18" r="14"/><circle class="hic-ring-fill" cx="18" cy="18" r="14" stroke="var(--mind)" stroke-dasharray="87.96" stroke-dashoffset="87.96" id="hic-ring-m" style="transition:stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1) 0.3s;"/></svg>
            <div class="hic-ring-center"><span class="hic-ring-val">84</span></div>
          </div>
          <span class="hic-ring-name">Mind</span>
        </div>
      </div>
      <p class="hic-quote">Your Tuesday salmon and 7.4h sleep drove today's energy peak. Pattern confirmed.</p>
    </div>
    <div class="hero-scroll"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>
  </div>
</section>

<!-- TICKER -->
<div class="ticker" aria-hidden="true">
  <div class="ticker-track">
    <span class="ticker-item"><span class="ticker-dot"></span>Nutrition</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Body</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Mind</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Connected</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Daily Insights</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Longevity Coach</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Meal Matchmaker</span>
    <span class="ticker-item"><span class="ticker-dot"></span>25+ Wearables</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Pantry Pal</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Longevity Score</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Nutrition</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Body</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Mind</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Connected</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Daily Insights</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Longevity Coach</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Meal Matchmaker</span>
    <span class="ticker-item"><span class="ticker-dot"></span>25+ Wearables</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Pantry Pal</span>
    <span class="ticker-item"><span class="ticker-dot"></span>Longevity Score</span>
  </div>
</div>

<!-- STATS -->
<div class="stats-bar"><div class="container"><div class="stats-grid">
  <div class="stat-item reveal d1"><span class="stat-num" data-count="3">0</span><span class="stat-label">Pillars Connected</span><span class="stat-sub">No other system joins food, body, and mind.</span></div>
  <div class="stat-item reveal d2"><span class="stat-num" data-count="25" data-suffix="+">0</span><span class="stat-label">Wearables Synced</span><span class="stat-sub">Real biometric data in every insight.</span></div>
  <div class="stat-item reveal d3"><span class="stat-num" data-count="7">0</span><span class="stat-label">Days in Context</span><span class="stat-sub">Every coaching response knows your full week.</span></div>
  <div class="stat-item reveal d4"><span class="stat-num" data-count="52">0</span><span class="stat-label">Strategies a Year</span><span class="stat-sub">A new game plan every week, built on your patterns.</span></div>
</div></div></div>

<!-- THREE SIGNALS SECTION -->
<section style="padding:clamp(72px,9vw,120px) 0;background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);position:relative;z-index:2;">
<style>
@keyframes gaugeNerve{0%{transform:rotate(-55deg)}15%{transform:rotate(-25deg)}30%{transform:rotate(-72deg)}45%{transform:rotate(-18deg)}62%{transform:rotate(-60deg)}78%{transform:rotate(-38deg)}90%{transform:rotate(-68deg)}100%{transform:rotate(-55deg)}}
@keyframes fuelRise{0%,100%{transform:translateY(4px);opacity:.22}50%{transform:translateY(-5px);opacity:.42}}
@keyframes mindPulse{0%,100%{stroke-opacity:.25;transform:scale(1)}50%{stroke-opacity:.65;transform:scale(1.1)}}
@keyframes tlcGlow{0%,100%{box-shadow:0 4px 32px rgba(46,168,74,0.06)}50%{box-shadow:0 8px 48px rgba(46,168,74,0.16)}}
@keyframes compassSettle{0%{transform:rotate(55deg)}18%{transform:rotate(-40deg)}36%{transform:rotate(22deg)}51%{transform:rotate(-9deg)}62%{transform:rotate(4deg)}72%,100%{transform:rotate(0deg)}}
.signals-top-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:880px;margin:0 auto;}
.signals-tlc-wrap{max-width:500px;margin:0 auto;width:100%;}
.signals-conv{max-width:880px;margin:0 auto;height:72px;}
@media(max-width:640px){.signals-top-grid{grid-template-columns:1fr;gap:16px;}.signals-conv{display:none;}.signals-mobile-sep{display:flex !important;}}
</style>
  <div class="container">
    <div style="text-align:center;margin-bottom:52px;" class="reveal">
      <h2 style="font-family:var(--font-display);font-size:clamp(36px,4.5vw,60px);line-height:0.95;letter-spacing:0.02em;color:var(--ink);">THREE SIGNALS.<br><em style="font-style:normal;color:var(--green);">ONE CLEAR VIEW.</em></h2>
    </div>

    <!-- Three input cards -->
    <div class="signals-top-grid reveal d1">

      <!-- NUTRITION: THE FUEL LOAD -->
      <div style="background:var(--white);border:1.5px solid var(--border-mid);border-radius:16px;padding:28px 22px;text-align:center;">
        <div style="width:60px;height:60px;border-radius:16px;background:rgba(57,186,118,0.10);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;overflow:hidden;">
          <svg width="32" height="44" viewBox="0 0 32 44" fill="none">
            <path d="M16 2 C16 2 2 17 2 27 A14 14 0 0 0 30 27 C30 17 16 2 16 2z" stroke="#39BA76" stroke-width="2" fill="none" stroke-linejoin="round"/>
            <clipPath id="fdc1"><path d="M16 2 C16 2 2 17 2 27 A14 14 0 0 0 30 27 C30 17 16 2 16 2z"/></clipPath>
            <rect x="2" y="2" width="28" height="40" clip-path="url(#fdc1)" fill="rgba(57,186,118,0.3)" style="animation:fuelRise 3.5s ease-in-out infinite;"/>
          </svg>
        </div>
        <div style="font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--nutrition);margin-bottom:8px;">Nutrition</div>
        <div style="font-family:var(--font-display);font-size:clamp(17px,1.8vw,22px);line-height:1.05;letter-spacing:0.02em;color:var(--ink);margin-bottom:10px;">THE FUEL LOAD</div>
        <p style="font-size:13px;color:var(--muted-2);line-height:1.65;">What powers every hour of your day. Logged in isolation, food data tells you what went in, but not how the system responded once you were in motion.</p>
      </div>

      <!-- BODY: THE INSTRUMENT PANEL -->
      <div style="background:var(--white);border:1.5px solid var(--border-mid);border-radius:16px;padding:28px 22px;text-align:center;">
        <div style="width:60px;height:60px;border-radius:16px;background:rgba(57,140,186,0.10);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;overflow:visible;">
          <svg width="50" height="36" viewBox="0 0 50 36" fill="none">
            <path d="M2 33 A22 22 0 0 1 48 33" stroke="rgba(57,140,186,0.18)" stroke-width="4" stroke-linecap="round"/>
            <line x1="2.5" y1="32.5" x2="6" y2="26" stroke="rgba(57,140,186,0.35)" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="25" y1="11" x2="25" y2="16" stroke="rgba(57,140,186,0.35)" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="47.5" y1="32.5" x2="44" y2="26" stroke="rgba(57,140,186,0.35)" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="9" y1="17" x2="12" y2="21" stroke="rgba(57,140,186,0.2)" stroke-width="1" stroke-linecap="round"/>
            <line x1="41" y1="17" x2="38" y2="21" stroke="rgba(57,140,186,0.2)" stroke-width="1" stroke-linecap="round"/>
            <line x1="25" y1="33" x2="25" y2="14" stroke="#398CBA" stroke-width="2.5" stroke-linecap="round" style="transform-origin:25px 33px;animation:gaugeNerve 3.2s ease-in-out infinite;display:block;"/>
            <circle cx="25" cy="33" r="4" fill="#398CBA"/>
            <circle cx="25" cy="33" r="2" fill="white"/>
          </svg>
        </div>
        <div style="font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--body-blue);margin-bottom:8px;">Body</div>
        <div style="font-family:var(--font-display);font-size:clamp(17px,1.8vw,22px);line-height:1.05;letter-spacing:0.02em;color:var(--ink);margin-bottom:10px;">THE INSTRUMENT PANEL</div>
        <p style="font-size:13px;color:var(--muted-2);line-height:1.65;">Your wearable tracks sleep depth, HRV, and resting heart rate with precision. But instruments alone don't tell the story. They show readings, not meaning.</p>
      </div>

      <!-- MIND: CREW READINESS -->
      <div style="background:var(--white);border:1.5px solid var(--border-mid);border-radius:16px;padding:28px 22px;text-align:center;">
        <div style="width:60px;height:60px;border-radius:16px;background:rgba(232,184,75,0.10);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;overflow:visible;">
          <svg width="52" height="36" viewBox="0 0 52 36" fill="none">
            <line x1="2" y1="18" x2="50" y2="18" stroke="rgba(232,184,75,0.15)" stroke-width="1.5" stroke-linecap="round"/>
            <polyline points="2,18 10,18 13,4 16,32 19,10 22,26 26,18 30,18 33,4 36,32 39,10 42,26 50,18" stroke="#E8B84B" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="animation:mindPulse 2.8s ease-in-out infinite;transform-origin:26px 18px;"/>
            <circle cx="26" cy="18" r="3.5" fill="#E8B84B" style="animation:fuelRise 2.8s 0.4s ease-in-out infinite;"/>
          </svg>
        </div>
        <div style="font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--mind);margin-bottom:8px;">Mind</div>
        <div style="font-family:var(--font-display);font-size:clamp(17px,1.8vw,22px);line-height:1.05;letter-spacing:0.02em;color:var(--ink);margin-bottom:10px;">PILOT STATE</div>
        <p style="font-size:13px;color:var(--muted-2);line-height:1.65;">Energy, mood, and stress aren't soft signals. They're the human variable, the difference between turbulence and control, clarity and noise.</p>
      </div>

    </div>

    <!-- Animated convergence connector (desktop only) -->
    <div class="signals-conv">
      <svg width="100%" height="72" viewBox="0 0 100 72" preserveAspectRatio="none" fill="none" style="display:block;overflow:visible;">
        <defs>
          <path id="pN" d="M16.5 0 C16.5 36 50 36 50 72"/>
          <path id="pB" d="M50 0 L50 72"/>
          <path id="pM" d="M83.5 0 C83.5 36 50 36 50 72"/>
        </defs>
        <use href="#pN" stroke="rgba(57,186,118,0.22)" stroke-width="0.4"/>
        <use href="#pB" stroke="rgba(57,140,186,0.22)" stroke-width="0.4"/>
        <use href="#pM" stroke="rgba(232,184,75,0.22)" stroke-width="0.4"/>
        <!-- Nutrition dots -->
        <circle r="1.2" fill="rgba(57,186,118,0.75)"><animateMotion dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1"><mpath href="#pN"/></animateMotion></circle>
        <circle r="1.2" fill="rgba(57,186,118,0.55)"><animateMotion dur="2.2s" begin="-0.73s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1"><mpath href="#pN"/></animateMotion></circle>
        <circle r="1.2" fill="rgba(57,186,118,0.4)"><animateMotion dur="2.2s" begin="-1.46s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1"><mpath href="#pN"/></animateMotion></circle>
        <!-- Body dots -->
        <circle r="1.2" fill="rgba(57,140,186,0.75)"><animateMotion dur="2.2s" begin="-0.25s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1"><mpath href="#pB"/></animateMotion></circle>
        <circle r="1.2" fill="rgba(57,140,186,0.55)"><animateMotion dur="2.2s" begin="-0.98s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1"><mpath href="#pB"/></animateMotion></circle>
        <circle r="1.2" fill="rgba(57,140,186,0.4)"><animateMotion dur="2.2s" begin="-1.71s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1"><mpath href="#pB"/></animateMotion></circle>
        <!-- Mind dots -->
        <circle r="1.2" fill="rgba(232,184,75,0.75)"><animateMotion dur="2.2s" begin="-0.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1"><mpath href="#pM"/></animateMotion></circle>
        <circle r="1.2" fill="rgba(232,184,75,0.55)"><animateMotion dur="2.2s" begin="-1.23s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1"><mpath href="#pM"/></animateMotion></circle>
        <circle r="1.2" fill="rgba(232,184,75,0.4)"><animateMotion dur="2.2s" begin="-1.96s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1"><mpath href="#pM"/></animateMotion></circle>
        <!-- Convergence dot at bottom -->
        <circle cx="50" cy="72" r="3" fill="rgba(46,168,74,0.3)"><animate attributeName="r" values="2.5;4;2.5" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.2s" repeatCount="indefinite"/></circle>
      </svg>
    </div>

    <!-- Mobile separator (hidden on desktop) -->
    <div class="signals-mobile-sep" style="display:none;align-items:center;justify-content:center;padding:16px 0;gap:6px;">
      <div style="width:6px;height:6px;border-radius:50%;background:rgba(57,186,118,0.6);"></div>
      <div style="width:6px;height:6px;border-radius:50%;background:rgba(57,140,186,0.6);"></div>
      <div style="width:6px;height:6px;border-radius:50%;background:rgba(232,184,75,0.6);"></div>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(46,168,74,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </div>

    <!-- TLC synthesis card -->
    <div class="signals-tlc-wrap reveal d2">
      <div style="background:linear-gradient(160deg,rgba(46,168,74,0.07) 0%,rgba(255,255,255,0) 60%);border:1.5px solid rgba(46,168,74,0.25);border-radius:16px;padding:36px 32px;text-align:center;animation:tlcGlow 3s ease-in-out infinite;">
        <div style="width:64px;height:64px;border-radius:18px;background:rgba(46,168,74,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;overflow:visible;">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="rgba(46,168,74,0.22)" stroke-width="1.5"/>
            <circle cx="24" cy="24" r="13" stroke="rgba(46,168,74,0.15)" stroke-width="1" stroke-dasharray="4,3"/>
            <text x="24" y="8.5" text-anchor="middle" font-size="6.5" font-family="Figtree,sans-serif" font-weight="700" fill="rgba(46,168,74,0.7)">N</text>
            <text x="40.5" y="26.5" text-anchor="middle" font-size="5.5" font-family="Figtree,sans-serif" fill="rgba(46,168,74,0.4)">E</text>
            <text x="7.5" y="26.5" text-anchor="middle" font-size="5.5" font-family="Figtree,sans-serif" fill="rgba(46,168,74,0.4)">W</text>
            <g style="transform-origin:24px 24px;animation:compassSettle 5s ease-out infinite;">
              <polygon points="24,7 21.5,24 24,22 26.5,24" fill="#2ea84a"/>
              <polygon points="24,41 21.5,24 24,26 26.5,24" fill="rgba(46,168,74,0.28)"/>
            </g>
            <circle cx="24" cy="24" r="3" fill="#2ea84a"/>
            <circle cx="24" cy="24" r="1.5" fill="white"/>
          </svg>
        </div>
        <div style="font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--green);margin-bottom:8px;">TLC</div>
        <div style="font-family:var(--font-display);font-size:clamp(22px,2.8vw,32px);line-height:1.05;letter-spacing:0.02em;color:var(--ink);margin-bottom:14px;">THE FLIGHT MANAGEMENT SYSTEM</div>
        <p style="font-size:15px;color:var(--muted-2);line-height:1.75;max-width:380px;margin:0 auto;">No pilot flies on one instrument alone. TLC brings your nutrition, biometrics, and reflections together, reading how they interact, not just how they perform in isolation.</p>
      </div>
    </div>

    <p style="text-align:center;font-size:clamp(14px,1.4vw,17px);font-weight:300;color:var(--muted-2);max-width:560px;margin:40px auto 0;line-height:1.85;" class="reveal d3">Because once you break through the clouds, the picture sharpens.<br>Every signal aligns. Every decision becomes clearer.</p>

  </div>
</section>

<!-- THREE PILLARS -->
<section class="section-pillars" id="pillars">
  <div class="container">
    <div class="section-header reveal">
      <span class="label" style="justify-content:center;margin-bottom:20px;display:inline-flex;">The Three Pillars</span>
      <h2>EVERYTHING YOUR BODY<br><em>IS TRYING TO TELL YOU</em></h2>
      <p>Most health tools track one thing at a time. TLC tracks all three simultaneously and finds the connections between them. Those connections are the insight.</p>
    </div>
    <div class="pillars-grid">
      <div class="pillar-card nutrition reveal d1">
        <div class="pillar-visual"><div class="pillar-icon-wrap"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#39BA76" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11c0-2 1.5-2 1.5-4"/><path d="M12 11c0-2 1.5-2 1.5-4"/><path d="M15 11c0-2 1.5-2 1.5-4"/><path d="M5 11h14a7 7 0 01-14 0z"/><line x1="9" y1="18" x2="15" y2="18"/></svg></div></div>
        <h3>Nutrition</h3>
        <p class="pillar-hook">What you eat shapes everything else.</p>
        <p class="pillar-body">Every meal you log tells TLC something your wearable can't. The timing, the macros, the quality, the patterns across days. Nutrition is the lever most people underestimate.</p>
        <div class="pillar-data-tags">
          <span class="pillar-data-tag">Meal logging</span>
          <span class="pillar-data-tag">Macro targets</span>
          <span class="pillar-data-tag">Menu scanning</span>
          <span class="pillar-data-tag">Restaurant finder</span>
        </div>
      </div>
      <div class="pillar-card body-pillar reveal d2">
        <div class="pillar-visual"><div class="pillar-icon-wrap"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#398CBA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="16" rx="4"/><path d="M9 4V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V4"/><path d="M9 20v1.5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5V20"/><polyline points="7.5 13 9.5 13 11 10.5 12.5 15.5 14 12 15.5 13 16.5 13"/><circle cx="12" cy="7.5" r="1" fill="#398CBA" stroke="none"/></svg></div></div>
        <h3>Body</h3>
        <p class="pillar-hook">Your wearable has been waiting for context.</p>
        <p class="pillar-body">HRV, sleep stages, resting heart rate, strain, recovery. Your wearable collects all of it. TLC is the first system that connects these signals to what you ate and how you felt. That's where the patterns are.</p>
        <div class="pillar-data-tags">
          <span class="pillar-data-tag">HRV</span>
          <span class="pillar-data-tag">Sleep quality</span>
          <span class="pillar-data-tag">Recovery</span>
          <span class="pillar-data-tag">25+ devices</span>
        </div>
      </div>
      <div class="pillar-card mind reveal d3">
        <div class="pillar-visual"><div class="pillar-icon-wrap"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8B84B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg></div></div>
        <h3>Mind</h3>
        <p class="pillar-hook">The data your wearable can't collect.</p>
        <p class="pillar-body">Energy, focus, mood, motivation. A 60-second evening reflection tells TLC what no sensor can: how you actually feel. It is the missing variable that makes every other data point interpretable.</p>
        <div class="pillar-data-tags">
          <span class="pillar-data-tag">Evening reflection</span>
          <span class="pillar-data-tag">Mood tracking</span>
          <span class="pillar-data-tag">Energy levels</span>
          <span class="pillar-data-tag">Focus</span>
        </div>
      </div>
    </div>
    <div class="pillars-link reveal">
      <a href="/why-tlc">See why connecting all three changes everything &rarr;</a>
    </div>
  </div>
</section>

<!-- FEATURE TEASERS -->
<section class="section-teasers" id="teasers">
  <div class="container">
    <div class="section-header reveal">
      <span class="label" style="justify-content:center;margin-bottom:20px;display:inline-flex;">What TLC Gives You</span>
      <h2>FIVE TOOLS.<br><em>ONE SYSTEM.</em></h2>
      <p>Each tool is built to stand alone. Together, they share a single picture of you. The longer you use them, the more precisely the whole system understands what you need.</p>
    </div>
    <div class="teasers-grid">

      <a href="/features#dynamic-insights" class="teaser-card tc-di reveal d1">
        <div class="teaser-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="5" r="2" stroke="#39BA76" stroke-width="1.8"/><circle cx="19" cy="5" r="2" stroke="#39BA76" stroke-width="1.8"/><circle cx="12" cy="20" r="2" stroke="#39BA76" stroke-width="1.8"/><line x1="6.8" y1="6.2" x2="10.5" y2="11" stroke="#39BA76" stroke-width="1.6"/><line x1="17.2" y1="6.2" x2="13.5" y2="11" stroke="#39BA76" stroke-width="1.6"/><line x1="12" y1="18" x2="12" y2="14" stroke="#39BA76" stroke-width="1.6"/><circle cx="12" cy="12" r="2.5" stroke="#39BA76" stroke-width="1.8"/><circle cx="12" cy="12" r="1" fill="#39BA76" stroke="none"/></svg>
        </div>

        <h3 class="teaser-h">YOUR PATTERNS,<br>DECODED</h3>
        <p class="teaser-sub">Where data becomes understanding</p>
        <p class="teaser-body">Your sleep, your meals, your stress. Tracked separately, they're noise. Dynamic Insights connects them into a single daily narrative that tells you what's actually happening, and why. The breakthrough isn't in the numbers. It's in the connections between them.</p>
        <span class="teaser-cta">See how Insights work &rarr;</span>
      </a>

      <a href="/features#meal-matchmaker" class="teaser-card tc-mm reveal d2">
        <div class="teaser-icon">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>

        <h3 class="teaser-h">EAT WELL,<br>ANYWHERE</h3>
        <p class="teaser-sub">Exact dishes, not just places</p>
        <p class="teaser-body">Travelling, time-poor, nowhere near your usual spots. Meal Matchmaker finds the right dish at the right restaurant for your exact macros, in any city, in seconds. Macro-matched, allergy-verified, and goal-aligned. Free, forever.</p>
        <span class="teaser-cta">Find your next meal &rarr;</span>
      </a>

      <a href="/features#longevity-coach" class="teaser-card tc-coach reveal d3">
        <div class="teaser-icon">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><circle cx="9" cy="10" r="1" fill="#398CBA"/><circle cx="12" cy="10" r="1" fill="#398CBA"/><circle cx="15" cy="10" r="1" fill="#398CBA"/></svg>
        </div>

        <h3 class="teaser-h">IT ALREADY<br>KNOWS YOU</h3>
        <p class="teaser-sub">No briefing. No repeating yourself.</p>
        <p class="teaser-body">Before you ask your first question, the Coach holds your biometrics, your meals, your goals, and your restrictions. Five disciplines of expertise, combined into one expert who gets sharper the longer you use it.</p>
        <span class="teaser-cta">Meet your Coach &rarr;</span>
      </a>

    </div>
    <div class="teasers-more reveal">
      <p>Plus Pantry Pal, Menu Scanner, and Monthly Meal Planning for TLC Pro.</p>
      <a href="/features">Explore all five features &rarr;</a>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="section-testimonials">
  <canvas id="testimonialNebula"></canvas>
  <div class="container">
    <div class="testimonials-header reveal">
      <span class="label" style="margin-bottom:18px;display:inline-flex;justify-content:center;color:rgba(255,255,255,0.70);background:transparent;border:none;letter-spacing:0.18em;">Real Results</span>
      <h2>PEOPLE WHO <em>JOINED THE DOTS</em></h2>
      <p>What happens when food, body, and mind finally talk to each other.</p>
    </div>
    <div class="testimonials-grid">
      <div class="testimonial-card reveal d1">
        <div class="t-stars">
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <p class="t-quote">I tried every tracker going. They all showed me numbers but never explained <strong>why</strong> my energy crashed every Thursday. TLC spotted the pattern in week two: low sleep Tuesday plus high carbs Wednesday. Fixed it. Never looked back.</p>
        <div class="t-author"><div class="t-avatar"><span class="t-avatar-letter">S</span></div><div><div class="t-name">Sarah M.</div><div class="t-device">Oura Ring &bull; Fat loss goal</div></div></div>
      </div>
      <div class="testimonial-card reveal d2">
        <div class="t-stars">
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <p class="t-quote">I travel three weeks out of four for work. Meal Matchmaker is the only tool that actually handles this. <strong>Any city, any restaurant</strong>, it finds exactly what I need in 30 seconds. My nutrition hasn't slipped in six months.</p>
        <div class="t-author"><div class="t-avatar"><span class="t-avatar-letter">J</span></div><div><div class="t-name">James K.</div><div class="t-device">WHOOP 4.0 &bull; Longevity goal</div></div></div>
      </div>
      <div class="testimonial-card reveal d3">
        <div class="t-stars">
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <p class="t-quote">As someone managing gut health issues, the coach is extraordinary. It knows <strong>my exact sensitivities</strong>, cross-references everything I eat with how I felt the next day, and has never once suggested something that would trigger a flare.</p>
        <div class="t-author"><div class="t-avatar"><span class="t-avatar-letter">P</span></div><div><div class="t-name">Priya L.</div><div class="t-device">Garmin &bull; Gut health goal</div></div></div>
      </div>
    </div>
  </div>
</section>

<!-- COMPETITOR DIFFERENTIATION -->
<section class="section-diff-table" id="compare" style="padding:var(--section-pad) 0;background:var(--white);border-top:1px solid var(--border);position:relative;z-index:2;">
  <div class="container">
    <div class="section-header reveal" style="margin-bottom:64px;">
      <span class="label" style="justify-content:center;margin-bottom:20px;display:inline-flex;">Why TLC</span>
      <h2>NOT ANOTHER<br><em>CALORIE COUNTER</em></h2>
      <p>Every health app on the market tracks your day in isolation. TLC connects the dots between days, weeks, and months.</p>
    </div>
    <div style="overflow-x:auto;" class="reveal d1">
      <table style="width:100%;border-collapse:collapse;min-width:560px;">
        <thead>
          <tr>
            <th style="text-align:left;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted);padding:0 20px 18px 0;border-bottom:2px solid var(--border);width:36%;">Capability</th>
            <th style="text-align:center;font-size:12px;font-weight:800;color:var(--green);padding:0 16px 18px;border-bottom:2px solid var(--green);background:rgba(46,168,74,0.04);">TLC</th>
            <th style="text-align:center;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);padding:0 16px 18px;border-bottom:2px solid var(--border);">MyFitnessPal</th>
            <th style="text-align:center;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);padding:0 16px 18px;border-bottom:2px solid var(--border);">WHOOP/Oura</th>
            <th style="text-align:center;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);padding:0 16px 18px;border-bottom:2px solid var(--border);">ZOE</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:14px 20px 14px 0;font-size:13.5px;font-weight:500;color:var(--ink-2);">Connects food, sleep, and mood</td>
            <td style="text-align:center;padding:14px 16px;background:rgba(46,168,74,0.04);"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(46,168,74,0.12)"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
          </tr>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:14px 20px 14px 0;font-size:13.5px;font-weight:500;color:var(--ink-2);">Finds dishes at nearby restaurants</td>
            <td style="text-align:center;padding:14px 16px;background:rgba(46,168,74,0.04);"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(46,168,74,0.12)"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
          </tr>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:14px 20px 14px 0;font-size:13.5px;font-weight:500;color:var(--ink-2);">Wearable data (HRV, sleep, recovery)</td>
            <td style="text-align:center;padding:14px 16px;background:rgba(46,168,74,0.04);"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(46,168,74,0.12)"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(46,168,74,0.12)"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
          </tr>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:14px 20px 14px 0;font-size:13.5px;font-weight:500;color:var(--ink-2);">Daily insight connecting food, sleep and mood</td>
            <td style="text-align:center;padding:14px 16px;background:rgba(46,168,74,0.04);"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(46,168,74,0.12)"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
          </tr>
          <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:14px 20px 14px 0;font-size:13.5px;font-weight:500;color:var(--ink-2);">Weekly strategy built on your patterns</td>
            <td style="text-align:center;padding:14px 16px;background:rgba(46,168,74,0.04);"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(46,168,74,0.12)"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
          </tr>
          <tr>
            <td style="padding:14px 20px 14px 0;font-size:13.5px;font-weight:500;color:var(--ink-2);">Free tier (no card)</td>
            <td style="text-align:center;padding:14px 16px;background:rgba(46,168,74,0.04);"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(46,168,74,0.12)"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(46,168,74,0.12)"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
            <td style="text-align:center;padding:14px 16px;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(26,26,26,0.06)"/><path d="M6 12l6-6M12 12L6 6" stroke="rgba(26,26,26,0.32)" stroke-width="1.5" stroke-linecap="round"/></svg></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="reveal d2" style="text-align:center;margin-top:40px;">
      <a href="/why-tlc" style="font-size:13px;font-weight:700;color:var(--green);text-decoration:none;letter-spacing:0.04em;border-bottom:1.5px solid rgba(46,168,74,0.25);padding-bottom:2px;">See the full case for TLC &rarr;</a>
    </div>
  </div>
</section>

<!-- PRICING SUMMARY -->
<section class="section-pricing" id="pricing">
  <div class="container">
    <div class="section-header reveal" style="margin-bottom:64px;">
      <span class="label" style="margin-bottom:20px;display:inline-flex;justify-content:center;">Plans</span>
      <h2>CHOOSE YOUR <em>PATH</em></h2>
      <p>TLC Lite gives you Meal Matchmaker, free forever. To unlock the connections between nutrition, body, and mind, upgrade to TLC.</p>
    </div>
    <div class="pricing-grid">
      <div class="pricing-card reveal-scale d1">
        <div class="pricing-tier">TLC Lite</div>
        <div class="pricing-price">Free</div>
        <div class="pricing-period">forever</div>
        <p class="pricing-desc">The smartest free meal tool on the market. No card required, no expiry.</p>
        <ul class="pricing-features">
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Meal Matchmaker in every city</li>
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Goal, allergy, and macro-aware</li>
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Personal nutrition blueprint</li>
        </ul>
        <a href="https://tlc-onboarding-lite.chris-ec5.workers.dev" class="btn btn-outline" style="width:100%;justify-content:center;">Start Free</a>
        <p class="pricing-trial">Free forever. No card required.</p>
      </div>
      <div class="pricing-card featured reveal-scale d2">
        <div class="pricing-badge">Most Popular</div>
        <div class="pricing-tier">TLC</div>
        <div class="pricing-price">$9.99</div>
        <div class="pricing-period">per month</div>
        <p class="pricing-desc">The full system. Daily insights, your Coach, and every tool connected.</p>
        <ul class="pricing-features">
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Everything in Lite</li>
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Daily Dynamic Insights</li>
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Longevity Coach with full context</li>
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Pantry Pal and photo meal logging</li>
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>25+ wearables connected</li>
        </ul>
        <a href="https://tlc-onboarding.chris-ec5.workers.dev" class="btn btn-green" style="width:100%;justify-content:center;">Try 7 Days Free</a>
        <p class="pricing-trial">7-day free trial. No card required.</p>
      </div>
      <div class="pricing-card reveal-scale d3">
        <div class="pricing-tier">TLC Pro</div>
        <div class="pricing-price">$19.99</div>
        <div class="pricing-period">per month</div>
        <p class="pricing-desc">For those who are serious. Your entire month of meals, planned with zero compromise.</p>
        <ul class="pricing-features">
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Everything in TLC</li>
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Full monthly meal plan</li>
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Smart zero-waste shopping list</li>
          <li><svg class="pricing-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>10-15% average grocery savings</li>
        </ul>
        <a href="https://tlc-onboarding.chris-ec5.workers.dev" class="btn btn-outline" style="width:100%;justify-content:center;">Start Your First Month Free</a>
        <p class="pricing-trial">7-day free trial. No card required.</p>
      </div>
    </div>
    <div class="pricing-compare reveal">
      <a href="/pricing">Compare all plans in full &rarr;</a>
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="section-cta"><div class="container"><div class="cta-inner">
  <span class="label" style="justify-content:center;margin-bottom:28px;display:inline-flex;color:var(--green-accent);">This Is Where It Starts</span>
  <h2 class="reveal">THE SYSTEM THAT<br><span>KNOWS YOU.</span></h2>
  <p class="reveal d1">No rigid plans. No starting over. TLC meets you where you are, learns what works for your body, and gets sharper every single day. Start free. No card needed.</p>
  <div class="cta-actions reveal d2">
    <a href="/start" class="btn btn-green" style="font-size:13px;padding:18px 52px;">Take Your Free Assessment</a>
    <span class="cta-note">Cancel anytime &nbsp;&middot;&nbsp; No lock-in &nbsp;&middot;&nbsp; No fees</span>
  </div>
</div></div></section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="footer-logo"><img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef"></div>
      <p>Connecting the dots between what you eat, how your body responds, and how you feel.</p>
    </div>
    <div class="footer-col"><ul>
      <li><a href="/features">Features</a></li>
      <li><a href="/how-it-works">How It Works</a></li>
      <li><a href="/why-tlc">Why TLC</a></li>
      <li><a href="/pricing">Pricing</a></li>
    </ul></div>
    <div class="footer-col"><ul>
      <li><a href="https://www.instagram.com/thelongevitychef_">Instagram</a></li>
      <li><a href="/pricing#faq">FAQs</a></li>
      <li><a href="https://tally.so/r/D4k8eZ">Contact</a></li>
    </ul></div>
    <div class="footer-col"><ul>
      <li><a href="/privacy">Privacy Policy</a></li>
      <li><a href="/terms">Terms &amp; Conditions</a></li>
    </ul></div>
  </div>
  <div class="footer-bottom">
    <span class="footer-copy">&copy; 2026 The Longevity Chef. All rights reserved.</span>
    <span class="footer-copy">Food for Life</span>
  </div>
</footer>

<div class="mobile-cta" id="mobileCta"><a href="/start" class="btn btn-green">Start Free</a></div>

<!-- LOGIN MODAL -->
<div class="login-overlay" id="loginOverlay" onclick="handleOverlayClick(event)">
  <div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
    <button class="login-modal-close" onclick="closeLoginModal()" aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div id="loginForm">
      <h3 id="loginTitle">Welcome back</h3>
      <p>Enter your email and we will send you a login link. No password needed.</p>
      <div class="login-modal-error" id="loginError"></div>
      <input type="email" id="loginEmail" placeholder="your@email.com" autocomplete="email" onkeydown="if(event.key==='Enter')submitMagicLink()" />
      <button class="btn-login-submit" id="loginSubmitBtn" onclick="submitMagicLink()">Send login link</button>
    </div>
    <div class="login-modal-success" id="loginSuccess">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <h4>Check your inbox</h4>
      <p>A login link is on its way. It expires in 15 minutes.</p>
    </div>
  </div>
</div>

<script>
// ── Nav + sub-nav scroll ──
const nav = document.getElementById('mainNav');
const subNav = document.getElementById('subNav');
const mobileCta = document.getElementById('mobileCta');
const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  nav.classList.toggle('scrolled', sy > 50);
  const heroH = heroSection ? heroSection.offsetHeight : 700;
  if (subNav) subNav.classList.toggle('show', sy > heroH);
  if (subNav && sy > heroH) nav.style.top = '-80px'; else nav.style.top = '0';
  if (mobileCta) mobileCta.classList.toggle('show', sy > heroH);
  const nebulaEl = document.getElementById('nebulaCanvas');
  if (nebulaEl) nebulaEl.style.opacity = Math.max(0.1, 0.45 - sy / window.innerHeight * 0.4);
});

// ── Active sub-nav ──
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

// ── Reveal ──
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
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.max(1, Math.floor(target / 24));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current + suffix;
    }, 38);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

// ── Mobile nav ──
function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
  document.body.style.overflow = document.getElementById('mobileNav').classList.contains('open') ? 'hidden' : '';
}

// ── Login modal ──
function openLoginModal() { document.getElementById('loginOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeLoginModal() { document.getElementById('loginOverlay').classList.remove('open'); document.body.style.overflow = ''; }
function handleOverlayClick(e) { if (e.target === e.currentTarget) closeLoginModal(); }
async function submitMagicLink() {
  const email = document.getElementById('loginEmail').value.trim();
  const btn = document.getElementById('loginSubmitBtn');
  const errEl = document.getElementById('loginError');
  if (!email || !email.includes('@')) { errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; return; }
  errEl.style.display = 'none';
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const res = await fetch('https://tlc-engine.chris-ec5.workers.dev/api/magic-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    if (res.ok) { document.getElementById('loginForm').style.display = 'none'; document.getElementById('loginSuccess').style.display = 'block'; }
    else { errEl.textContent = 'Something went wrong. Please try again.'; errEl.style.display = 'block'; btn.disabled = false; btn.textContent = 'Send login link'; }
  } catch { errEl.textContent = 'Something went wrong. Please try again.'; errEl.style.display = 'block'; btn.disabled = false; btn.textContent = 'Send login link'; }
}
(function() {
  const params = new URLSearchParams(window.location.search);
  const loginStatus = params.get('login');
  if (loginStatus === 'expired' || loginStatus === 'invalid') {
    openLoginModal();
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = loginStatus === 'expired' ? 'That login link has expired. Please request a new one.' : 'That login link is not valid. Please request a new one.';
    errorEl.style.display = 'block';
  }
})();

// ── Hero insight card animation ──
setTimeout(function() {
  var numEl = document.getElementById('hic-speedo-num');
  if (numEl) { var s = 0; var t = setInterval(function() { s = Math.min(724, s + 18); numEl.textContent = s; if (s >= 724) clearInterval(t); }, 30); }
  var speedoFill = document.getElementById('hic-speedo-fill');
  if (speedoFill) speedoFill.style.strokeDashoffset = (257.6 * (1 - 0.724)).toFixed(1);
  var ringN = document.getElementById('hic-ring-n');
  var ringB = document.getElementById('hic-ring-b');
  var ringM = document.getElementById('hic-ring-m');
  if (ringN) ringN.style.strokeDashoffset = (87.96 * (1 - 0.78)).toFixed(2);
  if (ringB) ringB.style.strokeDashoffset = (87.96 * (1 - 0.65)).toFixed(2);
  if (ringM) ringM.style.strokeDashoffset = (87.96 * (1 - 0.84)).toFixed(2);
}, 800);

// ── Testimonial nebula ──
(function() {
  var canvas = document.getElementById('testimonialNebula');
  if (!canvas) return;
  var section = canvas.parentElement;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var W, H, cx, cy, t = 0, active = true;
  var nodes = [];
  function resize() {
    W = section.offsetWidth; H = section.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    cx = W * 0.5; cy = H * 0.5;
    nodes = [];
    for (var i = 0; i < 28; i++) {
      nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 1.5 + 0.5, a: Math.random() * 0.25 + 0.05 });
    }
  }
  function draw() {
    if (!active || !W) { requestAnimationFrame(draw); return; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    t++;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i]; n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      for (var j = i + 1; j < nodes.length; j++) {
        var n2 = nodes[j]; var d = Math.hypot(n.x - n2.x, n.y - n2.y);
        if (d < 160) { ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(n2.x, n2.y); ctx.strokeStyle = 'rgba(255,255,255,' + (1 - d / 160) * 0.12 + ')'; ctx.lineWidth = 0.6; ctx.stroke(); }
      }
      var pulse = n.a + 0.08 * Math.sin(t * 0.04 + i);
      var glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
      glow.addColorStop(0, 'rgba(255,255,255,' + pulse * 0.35 + ')');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,' + pulse + ')'; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  new IntersectionObserver(function(e) { active = e[0].isIntersecting; if (active) resize(); }, { threshold: 0.05 }).observe(section);
  if (window.ResizeObserver) new ResizeObserver(function() { resize(); }).observe(section);
  else window.addEventListener('resize', function() { setTimeout(resize, 100); });
  draw();
})();

// ── Main nebula ──
(function() {
  const canvas = document.getElementById('nebulaCanvas');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  function resize() { canvas.width = window.innerWidth * dpr; canvas.height = window.innerHeight * dpr; canvas.style.width = window.innerWidth + 'px'; canvas.style.height = window.innerHeight + 'px'; }
  resize(); window.addEventListener('resize', resize);
  const ctx = canvas.getContext('2d');
  const G = [46, 168, 74];
  const rgba = (r,g,b,a) => 'rgba('+r+','+g+','+b+','+a+')';
  const nodes = [{a:0,rx:0.32,ry:0.28,spd:0.004,dot:2.0,bright:0.18},{a:1.05,rx:0.24,ry:0.20,spd:-0.005,dot:1.8,bright:0.14},{a:2.09,rx:0.38,ry:0.32,spd:0.003,dot:2.2,bright:0.20},{a:3.14,rx:0.18,ry:0.22,spd:-0.006,dot:1.5,bright:0.12},{a:4.19,rx:0.30,ry:0.25,spd:0.0045,dot:1.8,bright:0.16},{a:5.24,rx:0.35,ry:0.18,spd:-0.0035,dot:1.6,bright:0.14},{a:0.52,rx:0.15,ry:0.30,spd:0.007,dot:1.5,bright:0.10},{a:2.62,rx:0.40,ry:0.15,spd:-0.003,dot:1.8,bright:0.14}];
  const rings = [], pulses = [];
  let t = 0, ringT = 0, pulseT = 0, paused = false;
  if (heroSection) { const obs = new IntersectionObserver(e => { paused = !e[0].isIntersecting; }, {threshold:0}); obs.observe(heroSection); }
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
    requestAnimationFrame(draw);
  }
  draw();
})();
</script>
</body>
</html>
`;
// LANDING_HTML_END

// FEATURES_HTML_START
const FEATURES_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Features | The Longevity Chef</title>
<meta name="description" content="Five tools built for one purpose: connecting the dots between what you eat, how your body responds, and how you feel. This is how lasting change happens.">
<meta property="og:title" content="Features | The Longevity Chef">
<meta property="og:description" content="Dynamic Insights, Longevity Coach, Meal Matchmaker, Pantry Pal, and TLC Pro Meal Planning. Tools that talk to each other.">
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

@keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes livePulse { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(46,168,74,0.4); } 50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(46,168,74,0); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes matchFill { to { width: 88%; } }
@keyframes waveBar { 0%,100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }

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

.reveal { opacity: 0; transform: translateY(40px); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-scale { opacity: 0; transform: scale(0.94); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal-scale.visible { opacity: 1; transform: scale(1); }
.d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; } .d3 { transition-delay: 0.3s; } .d4 { transition-delay: 0.4s; }

/* ── NAV ── */
nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 18px var(--gutter); background: rgba(255,255,255,0); border-bottom: 1px solid transparent; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
nav.scrolled { background: rgba(255,255,255,0.92); backdrop-filter: blur(20px) saturate(1.4); border-bottom-color: var(--border); }
.nav-logo { display: flex; align-items: center; text-decoration: none; }
.nav-logo img { height: 56px; width: auto; display: block; }
.nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
.nav-links a { color: var(--muted-2); text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; transition: color 0.2s; }
.nav-links a:hover, .nav-links a.active-page { color: var(--ink); }
.nav-cta { background: var(--ink); color: var(--white) !important; padding: 10px 24px; border-radius: 2px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.25s; text-decoration: none; }
.nav-cta:hover { background: #333; transform: translateY(-1px); }
.nav-login { color: var(--muted-2) !important; }
.nav-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 4px; color: var(--ink); }
.nav-hamburger svg { width: 24px; height: 24px; display: block; }

/* ── MOBILE NAV ── */
.mobile-nav { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); z-index: 199; flex-direction: column; align-items: center; justify-content: center; gap: 32px; }
.mobile-nav.open { display: flex; }
.mobile-nav a { font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink); text-decoration: none; font-family: var(--font-display); }
.mobile-nav a:hover { color: var(--green); }
.mobile-nav-close { position: absolute; top: 20px; right: var(--gutter); background: none; border: none; cursor: pointer; color: var(--muted-2); }
.mobile-nav-close svg { width: 28px; height: 28px; }
.mobile-nav .btn { margin-top: 8px; }

/* ── LOGIN MODAL ── */
.login-overlay { display: none; position: fixed; inset: 0; background: rgba(26,26,26,0.55); backdrop-filter: blur(4px); z-index: 9000; align-items: center; justify-content: center; padding: 24px; }
.login-overlay.open { display: flex; }
.login-modal { background: #fff; border-radius: 16px; padding: 40px 36px; max-width: 420px; width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,0.18); position: relative; }
.login-modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; color: var(--muted-2); padding: 4px; }
.login-modal h3 { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--ink); margin: 0 0 6px; letter-spacing: 0.03em; }
.login-modal p { font-size: 14px; color: var(--muted-2); margin: 0 0 24px; line-height: 1.5; }
.login-modal input[type="email"] { width: 100%; border: 1.5px solid var(--border); border-radius: 8px; padding: 13px 16px; font-size: 15px; font-family: 'Figtree', sans-serif; color: var(--ink); outline: none; transition: border-color 0.2s; margin-bottom: 14px; }
.login-modal input[type="email"]:focus { border-color: var(--green); }
.login-modal .btn-login-submit { width: 100%; background: var(--green); color: #fff; border: none; border-radius: 8px; padding: 14px; font-size: 14px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: background 0.2s, transform 0.15s; font-family: 'Figtree', sans-serif; }
.login-modal .btn-login-submit:hover { background: #259940; transform: translateY(-1px); }
.login-modal .btn-login-submit:disabled { background: var(--muted); cursor: not-allowed; transform: none; }
.login-modal-success { display: none; text-align: center; padding: 8px 0; }
.login-modal-success h4 { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--ink); margin: 8px 0; }
.login-modal-success p { font-size: 14px; color: var(--muted-2); margin: 0; }
.login-modal-error { display: none; background: #fff3f3; border: 1px solid #fca5a5; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #b91c1c; margin-bottom: 12px; }

/* ── STICKY FEATURE SUB-NAV ── */
.sub-nav { position: fixed; top: -50px; left: 0; right: 0; z-index: 190; background: rgba(255,255,255,0.95); backdrop-filter: blur(20px) saturate(1.4); border-bottom: 1px solid var(--border); transition: top 0.35s cubic-bezier(0.4,0,0.2,1); }
.sub-nav.show { top: 0; }
.sub-nav-inner { max-width: var(--content-max); margin: 0 auto; padding: 0 var(--gutter); display: flex; align-items: center; justify-content: space-between; height: 44px; }
.sub-nav-title { font-family: var(--font-display); font-size: 17px; letter-spacing: 0.04em; color: var(--ink); white-space: nowrap; }
.sub-nav-links { display: flex; gap: 4px; list-style: none; overflow-x: auto; }
.sub-nav-links a { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s; padding: 12px 12px; border-bottom: 2px solid transparent; white-space: nowrap; }
.sub-nav-links a:hover, .sub-nav-links a.active { color: var(--ink); border-bottom-color: var(--green); }

/* ── PAGE HERO ── */
.page-hero { padding: clamp(140px, 16vw, 200px) 0 clamp(80px, 10vw, 120px); text-align: center; position: relative; overflow: hidden; background: var(--white); border-bottom: 1px solid var(--border); }
.page-hero-eyebrow { margin-bottom: 28px; opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s forwards; }
.page-hero h1 { font-family: var(--font-display); font-size: clamp(64px, 9vw, 128px); line-height: 0.88; letter-spacing: 0.01em; color: var(--ink); margin-bottom: 12px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.35s forwards; }
.page-hero h1 em { font-style: normal; color: var(--green); }
.page-hero-sub { font-family: var(--font-body); font-style: italic; font-weight: 300; font-size: clamp(22px, 2.8vw, 36px); color: var(--muted-2); line-height: 1.4; margin-bottom: 32px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.5s forwards; }
.page-hero-body { font-size: clamp(15px, 1.5vw, 18px); font-weight: 300; color: var(--muted-2); max-width: 600px; margin: 0 auto 48px; line-height: 1.85; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.65s forwards; }
.page-hero-nav { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.8s forwards; }
.hero-feature-pill { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border: 1.5px solid var(--border-mid); border-radius: 50px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; color: var(--muted-2); transition: all 0.25s; background: var(--white); }
.hero-feature-pill:hover { border-color: var(--green); color: var(--green); background: var(--green-light); }
.hero-feature-pill .pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

/* ── FEATURE SHOWCASE ── */
.section-features { position: relative; z-index: 2; background: var(--white); }
.feature-block { padding: var(--section-pad) 0; border-bottom: 1px solid var(--border); }
.feature-block:last-child { border-bottom: none; }
.feature-block.alt-bg { background: var(--surface); }
.feature-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.feature-block:nth-child(even) .feature-inner { direction: rtl; }
.feature-block:nth-child(even) .feature-inner > * { direction: ltr; }
.feature-visual { position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 4/3; background: var(--surface); display: block; box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04); }
.feature-copy .label { margin-bottom: 20px; display: inline-flex; }
.feature-copy h3 { font-family: var(--font-display); font-size: clamp(36px, 4vw, 52px); line-height: 1; letter-spacing: 0.02em; color: var(--ink); margin-bottom: 20px; }
.feature-copy > p { font-size: 16px; color: var(--muted-2); line-height: 1.8; margin-bottom: 16px; font-weight: 300; }
.feature-copy .feature-highlights { list-style: none; margin-top: 24px; }
.feature-copy .feature-highlights li { font-size: 14px; color: var(--ink); padding: 8px 0; display: flex; align-items: flex-start; gap: 12px; font-weight: 500; border-bottom: 1px solid var(--border); }
.feature-copy .feature-highlights li:last-child { border-bottom: none; }
.feature-copy .feature-highlights li::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; margin-top: 6px; }
.feature-cta { display: inline-flex; align-items: center; gap: 6px; margin-top: 28px; font-size: 13px; font-weight: 700; color: var(--green); text-decoration: none; letter-spacing: 0.04em; border-bottom: 1.5px solid rgba(46,168,74,0.25); padding-bottom: 2px; transition: all 0.2s; }
.feature-cta:hover { color: var(--green-dark); border-bottom-color: var(--green); }
.feature-tier-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 50px; padding: 5px 14px; margin-bottom: 20px; }
.feature-tier-pill.lite { background: rgba(0,0,0,0.04); color: var(--muted-2); border: 1px solid var(--border-mid); }
.feature-tier-pill.tlc { background: rgba(46,168,74,0.08); color: var(--green); border: 1px solid rgba(46,168,74,0.22); }
.feature-tier-pill.pro { background: rgba(21,77,51,0.08); color: #154D33; border: 1px solid rgba(21,77,51,0.18); }

/* ── MOCK CARDS ── */
.mock-card { width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; font-family: var(--font-body); }

/* Dynamic Insights */
.mock-di { background: #0d1210; }
.mock-di-header { display: flex; align-items: center; justify-content: space-between; padding: 13px 15px 10px; border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
.mock-di-title { font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.35); }
.mock-di-badge { display: flex; align-items: center; gap: 5px; background: rgba(46,168,74,0.12); border: 1px solid rgba(46,168,74,0.2); border-radius: 50px; padding: 3px 9px; }
.mock-di-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green-accent); animation: livePulse 2s ease-in-out infinite; }
.mock-di-badge-text { font-size: 9px; font-weight: 700; color: var(--green-accent); letter-spacing: 0.08em; }
.mock-di-listen { display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.10); border-radius: 50px; padding: 3px 9px; cursor: pointer; }
.mock-di-listen svg { width: 9px; height: 9px; stroke: rgba(255,255,255,0.50); }
.mock-di-listen-text { font-size: 8.5px; font-weight: 600; color: rgba(255,255,255,0.50); letter-spacing: 0.06em; }
.mock-di-narrative { padding: 10px 14px 6px; flex-shrink: 0; }
.mock-di-narrative p { font-size: 9.5px; color: rgba(255,255,255,0.48); line-height: 1.60; }
.mock-di-narrative strong { color: var(--green-accent); font-weight: 700; }
.mock-wellbeing-section { padding: 6px 14px 4px; flex-shrink: 0; }
.mock-wb-header { font-size: 7.5px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.22); margin-bottom: 8px; }
.mock-wb-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.mock-wb-label { font-size: 8px; font-weight: 700; letter-spacing: 0.04em; width: 34px; flex-shrink: 0; text-align: right; }
.mock-wb-bars { display: flex; align-items: flex-end; gap: 2.5px; flex: 1; height: 28px; }
.mock-wb-bar { width: 100%; border-radius: 2px 2px 0 0; transform: scaleY(0); transform-origin: bottom; transition: transform 0.55s cubic-bezier(0.34,1.2,0.64,1); }
.mock-wb-score { font-size: 10px; font-weight: 700; width: 28px; text-align: right; flex-shrink: 0; }
.mock-di-tts-row { display: flex; align-items: center; gap: 9px; padding: 7px 14px; background: rgba(46,168,74,0.07); border-top: 1px solid rgba(46,168,74,0.15); flex-shrink: 0; }
.mock-tts-wave { display: flex; align-items: center; gap: 2px; }
.mock-tts-bar { width: 3px; height: 12px; background: var(--green-accent); border-radius: 2px; animation: waveBar 0.7s ease-in-out infinite; }
.mock-tts-bar:nth-child(2) { animation-delay: 0.1s; height: 18px; }
.mock-tts-bar:nth-child(3) { animation-delay: 0.2s; height: 14px; }
.mock-tts-bar:nth-child(4) { animation-delay: 0.15s; height: 20px; }
.mock-tts-bar:nth-child(5) { animation-delay: 0.05s; height: 10px; }
.mock-tts-label { font-size: 9px; font-weight: 600; color: rgba(255,255,255,0.45); letter-spacing: 0.05em; }

/* Longevity Coach */
.mock-coach { background: var(--white); border: 1.5px solid var(--border-mid); }
.mock-coach-context { display: flex; flex-wrap: wrap; gap: 5px; padding: 12px 14px 10px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.mock-chip { font-size: 8.5px; font-weight: 700; letter-spacing: 0.06em; padding: 3px 9px; border-radius: 50px; background: var(--surface); color: var(--muted-2); border: 1px solid var(--border-mid); }
.mock-chip.alert { background: rgba(234,88,12,0.07); color: #ea580c; border-color: rgba(234,88,12,0.18); }
.mock-chip.low { background: rgba(239,68,68,0.07); color: #ef4444; border-color: rgba(239,68,68,0.18); }
.mock-chat-area { flex: 1; overflow: hidden; display: flex; flex-direction: column; gap: 8px; padding: 11px 12px; min-height: 0; }
.mock-bubble { font-size: 9.5px; line-height: 1.55; padding: 8px 11px; border-radius: 10px; max-width: 85%; }
.mock-bubble.user { align-self: flex-end; background: var(--surface); color: var(--muted-2); border-radius: 10px 10px 2px 10px; font-style: italic; }
.mock-bubble.coach { align-self: flex-start; background: rgba(46,168,74,0.08); color: var(--ink); border-radius: 10px 10px 10px 2px; border: 1px solid rgba(46,168,74,0.15); }
.mock-coach-label { font-size: 7.5px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--green); margin-bottom: 4px; }
.mock-typing-row { display: flex; align-items: center; gap: 4px; padding: 6px 10px; background: rgba(46,168,74,0.06); border-radius: 10px 10px 10px 2px; border: 1px solid rgba(46,168,74,0.12); align-self: flex-start; }
.typing-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); animation: livePulse 1s ease-in-out infinite; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
.mock-input-row { display: flex; gap: 8px; align-items: center; padding: 10px 12px; border-top: 1px solid var(--border); flex-shrink: 0; }
.mock-input-bar { flex: 1; height: 30px; background: var(--surface); border-radius: 6px; border: 1px solid var(--border); }
.mock-send-btn { width: 30px; height: 30px; background: var(--green); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mock-send-btn svg { width: 13px; height: 13px; fill: none; stroke: white; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* Meal Matchmaker */
.mock-mm-skeleton { width: 100%; height: 100%; padding: 18px; display: flex; flex-direction: column; gap: 10px; background: var(--white); }
.skel { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
.skel-title { height: 18px; width: 65%; }
.skel-sub { height: 12px; width: 45%; }
.skel-gap { height: 8px; background: transparent !important; animation: none !important; }
.skel-full { height: 14px; width: 100%; }
.skel-macro { height: 10px; width: 100%; }
.mock-card.mock-mm-result { background: var(--white); }
.mock-mm-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px 8px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.mock-mm-restaurant { font-size: 12px; font-weight: 700; color: var(--ink); }
.mock-mm-score { font-size: 10px; font-weight: 800; color: var(--green); background: rgba(46,168,74,0.10); border: 1px solid rgba(46,168,74,0.22); border-radius: 50px; padding: 3px 10px; }
.mock-mm-meta { display: flex; align-items: center; gap: 8px; padding: 6px 14px 4px; flex-shrink: 0; }
.mock-mm-cuisine { font-size: 8.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-2); background: var(--surface); padding: 3px 8px; border-radius: 4px; }
.mock-mm-dist { font-size: 9px; color: var(--muted); }
.mock-mm-dish { padding: 8px 14px; flex-shrink: 0; }
.mock-mm-dish-name { font-size: 11.5px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
.mock-mm-kcal { font-size: 9px; font-weight: 700; color: var(--muted-2); margin-bottom: 8px; letter-spacing: 0.04em; }
.mock-macro-row { display: flex; align-items: center; gap: 7px; margin-bottom: 4px; }
.mock-macro-label { font-size: 7.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); width: 36px; flex-shrink: 0; }
.mock-macro-bar { flex: 1; height: 5px; background: rgba(26,26,26,0.06); border-radius: 3px; overflow: hidden; }
.mock-macro-fill { height: 100%; background: var(--nutrition); border-radius: 3px; transition: width 0.9s ease; }
.mock-macro-fill.carbs { background: var(--body-blue); }
.mock-macro-fill.fat { background: var(--mind); }
.mock-macro-val { font-size: 9px; font-weight: 700; color: var(--ink-2); width: 26px; text-align: right; flex-shrink: 0; }
.mock-mm-tags { display: flex; flex-wrap: wrap; gap: 5px; padding: 5px 14px; flex-shrink: 0; }
.mock-mm-tag { font-size: 8px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; }
.mock-mm-tag.safe { background: rgba(57,186,118,0.08); color: #2a9148; }
.mock-mm-tag.goal { background: rgba(57,140,186,0.08); color: #2b6e93; }
.mock-mm-why { margin: 0 14px; padding: 8px 10px; background: var(--green-light); border-radius: 6px; font-size: 9px; color: var(--green-dark); font-style: italic; line-height: 1.5; font-weight: 500; border: 1px solid rgba(46,168,74,0.15); flex-shrink: 0; }
.mock-mm-alts { padding: 7px 14px 10px; flex-shrink: 0; }
.mock-mm-alt { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid var(--border); }
.mock-mm-alt:last-child { border-bottom: none; }
.mock-mm-alt-name { font-size: 9.5px; color: var(--muted-2); font-weight: 500; }
.mock-mm-alt-pct { font-size: 9px; font-weight: 700; color: var(--nutrition); }

/* Pantry Pal */
.mock-pantry { background: var(--white); }
.mock-pantry-scan { padding: 14px 14px 10px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.mock-pantry-title { font-size: 8px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
.mock-ingredients-row { display: flex; flex-wrap: wrap; gap: 6px; }
.mock-ingredient { font-size: 9.5px; font-weight: 600; padding: 4px 10px; background: var(--surface); border: 1.5px solid var(--border-mid); border-radius: 50px; color: var(--ink-2); }
.mock-ingredient.more { background: rgba(46,168,74,0.08); color: var(--green); border-color: rgba(46,168,74,0.22); }
.mock-recipe-card-inner { padding: 10px 14px 12px; flex: 1; overflow: hidden; }
.mock-recipe-eyebrow { font-size: 7px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--green); margin-bottom: 4px; }
.mock-recipe-name { font-size: 13px; font-weight: 700; color: var(--ink); line-height: 1.2; }
.mock-recipe-sub { font-size: 9px; color: var(--muted); margin-top: 3px; margin-bottom: 7px; }
.mock-macro-pills { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 7px; }
.mock-macro-pill { font-size: 8px; font-weight: 700; padding: 2.5px 7px; border-radius: 4px; }
.mock-macro-pill.cal { background: rgba(26,26,26,0.06); color: var(--ink-2); }
.mock-macro-pill.pro { background: rgba(57,186,118,0.10); color: #2a9148; }
.mock-recipe-meta-row { display: flex; gap: 10px; margin-bottom: 6px; }
.mock-recipe-meta-item { display: flex; align-items: center; gap: 3px; font-size: 8px; color: var(--muted); font-weight: 600; letter-spacing: 0.04em; }
.mock-match-bar { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
.mock-match-bar-fill { height: 100%; width: 91%; background: linear-gradient(90deg, var(--nutrition), var(--green)); border-radius: 2px; }
.mock-match-label { font-size: 7.5px; font-weight: 700; color: var(--green); letter-spacing: 0.04em; }
.mock-recipe-divider { height: 1px; background: var(--border); margin: 6px 0; }
.mock-section-hdr { font-size: 7px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
.mock-ing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 10px; margin-bottom: 2px; }
.mock-ing-item { display: flex; align-items: center; gap: 4px; font-size: 8.5px; color: var(--ink-2); font-weight: 500; }
.mock-ing-chk { width: 12px; height: 12px; flex-shrink: 0; }
.mock-ing-chk path { fill: none; stroke: var(--green); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.mock-shop-grid { display: flex; flex-direction: column; gap: 2px; }
.mock-shop-item { display: flex; align-items: center; gap: 6px; font-size: 8.5px; color: var(--muted-2); }
.mock-shop-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border-mid); flex-shrink: 0; }

/* TLC Pro Meal Plan */
.mock-mealplan { background: var(--white); }
.mock-mp-header { background: var(--white); padding: 13px 16px 8px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); flex-shrink: 0; }
.mock-mp-pro-badge { font-size: 8px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; background: var(--green); color: white; padding: 3px 8px; border-radius: 4px; }
.mock-mp-hdr-right { text-align: right; }
.mock-mp-hdr-title { font-size: 11px; font-weight: 700; color: var(--ink); line-height: 1.2; }
.mock-mp-hdr-sub { font-size: 8.5px; color: var(--muted); font-weight: 500; }
.mock-mp-body { padding: 6px 14px 4px; flex-shrink: 0; }
.mock-mp-meal-row { display: flex; align-items: center; gap: 8px; padding: 5px 0; border-bottom: 1px solid var(--border); }
.mock-mp-meal-row:last-child { border-bottom: none; }
.mock-mp-type { font-size: 7.5px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: var(--muted); width: 52px; flex-shrink: 0; }
.mock-mp-name { font-size: 10.5px; font-weight: 600; color: var(--ink); flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0; transform: translateX(-4px); transition: opacity 0.45s ease, transform 0.45s ease; }
.mock-mp-name.mp-visible { opacity: 1; transform: translateX(0); }
.mock-mp-tag { font-size: 7.5px; font-weight: 700; padding: 2px 6px; border-radius: 3px; white-space: nowrap; }
.mock-mp-tag.omega { background: rgba(57,140,186,0.10); color: #2b6e93; }
.mock-mp-tag.pro { background: rgba(57,186,118,0.10); color: #2a9148; }
.mock-mp-tag.lean { background: rgba(232,184,75,0.12); color: #927010; }
.mock-mp-why { padding: 7px 14px 6px; background: var(--surface); border-top: 1px solid var(--border); flex-shrink: 0; }
.mock-mp-why-title { font-size: 7px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.mock-mp-why-row { display: flex; align-items: center; gap: 7px; padding: 2.5px 0; opacity: 0; transform: translateX(-5px); transition: opacity 0.4s ease, transform 0.4s ease; }
.mock-mp-why-row.mp-visible { opacity: 1; transform: translateX(0); }
.mock-mp-why-check { width: 14px; height: 14px; border-radius: 50%; background: rgba(46,168,74,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.mock-mp-why-label { font-size: 9px; color: var(--ink-2); font-weight: 600; }
.mock-mp-why-detail { font-size: 8.5px; color: var(--muted); font-weight: 400; margin-left: 2px; }
.mock-mp-shop { padding: 6px 14px 7px; border-top: 1px solid var(--border); flex-shrink: 0; }
.mock-mp-shop-title { font-size: 7px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.mock-mp-shop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 10px; }
.mock-mp-shop-item { display: flex; align-items: center; gap: 5px; font-size: 9px; color: var(--ink-2); font-weight: 500; opacity: 0; transform: translateY(4px); transition: opacity 0.35s ease, transform 0.35s ease; }
.mock-mp-shop-item.mp-visible { opacity: 1; transform: translateY(0); }
.mock-mp-shop-check { width: 13px; height: 13px; flex-shrink: 0; border-radius: 3px; background: rgba(57,186,118,0.14); display: flex; align-items: center; justify-content: center; }
.mock-mp-savings { padding: 7px 14px; background: rgba(46,168,74,0.07); border-radius: 0 0 8px 8px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(46,168,74,0.12); flex-shrink: 0; }
.mock-mp-savings-num { font-family: var(--font-display); font-size: 26px; color: var(--green); line-height: 1; }
.mock-mp-savings-label { font-size: 9.5px; font-weight: 700; color: var(--green-dark); display: block; text-align: right; }
.mock-mp-savings-sub { font-size: 8.5px; color: var(--muted); text-align: right; }

/* ── HIGHLIGHT PILL ── */
.highlight-pill { display: inline; background: rgba(46,168,74,0.10); color: var(--green-dark); border-radius: 4px; padding: 1px 7px; font-weight: 600; }

/* ── THE DIFFERENCE ── */
.section-difference { padding: var(--section-pad) 0; background: var(--ink); position: relative; overflow: hidden; }
.section-difference::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 50%, rgba(46,168,74,0.06) 0%, transparent 55%); }
.difference-inner { display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: center; position: relative; }
.difference-quote { border-left: 2px solid rgba(255,255,255,0.10); padding-left: 40px; }
.quote-pre { font-size: 12px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 12px; }
.quote-mark { font-family: var(--font-display); font-size: 120px; line-height: 0.7; color: rgba(255,255,255,0.05); margin-bottom: -20px; }
.quote-text { font-size: clamp(22px, 2.5vw, 30px); color: rgba(255,255,255,0.60); font-weight: 300; line-height: 1.5; font-style: italic; }
.quote-text em { font-style: normal; color: rgba(255,255,255,0.85); }
.difference-answer h2 { font-family: var(--font-display); font-size: clamp(36px, 4.5vw, 56px); line-height: 1; color: var(--white); margin-bottom: 28px; letter-spacing: 0.02em; }
.difference-answer > p { font-size: 16px; color: rgba(255,255,255,0.55); line-height: 1.8; margin-bottom: 16px; font-weight: 300; }
.difference-answer span.label { color: var(--green-accent); margin-bottom: 22px; display: inline-flex; }
.difference-answer span.label::before { background: var(--green-accent); }

/* ── WEARABLES ── */
.section-wearables { background: var(--surface); padding: 40px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.wearables-inner { display: flex; align-items: center; flex-wrap: wrap; gap: 20px; justify-content: center; }
.wearable-label { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
.wearable-tag { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-2); padding: 8px 18px; border: 1.5px solid var(--border-mid); border-radius: 50px; background: var(--white); }
.wearable-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
.wearable-tag-muted { color: var(--muted); border-style: dashed; }

/* ── FINAL CTA ── */
.section-cta { padding: var(--section-pad) 0; background: var(--ink); position: relative; overflow: hidden; }
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
.footer-brand p { font-size: 13px; color: rgba(255,255,255,0.35); line-height: 1.65; max-width: 280px; }
.footer-col ul { list-style: none; }
.footer-col ul li { margin-bottom: 12px; }
.footer-col ul li a { font-size: 13px; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; font-weight: 500; }
.footer-col ul li a:hover { color: rgba(255,255,255,0.80); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); margin-top: 48px; padding: 20px var(--gutter); max-width: var(--content-max); margin-left: auto; margin-right: auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.footer-copy { font-size: 12px; color: rgba(255,255,255,0.22); letter-spacing: 0.04em; }

/* ── MOBILE CTA ── */
.mobile-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; padding: 14px var(--gutter); background: rgba(255,255,255,0.96); backdrop-filter: blur(12px); border-top: 1px solid var(--border); z-index: 180; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); transform: translateY(100%); }
.mobile-cta.show { transform: translateY(0); }
.mobile-cta .btn { width: 100%; justify-content: center; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .feature-inner { gap: 48px; }
  .difference-inner { gap: 48px; }
}
@media (max-width: 900px) {
  .nav-links { display: none; }
  .nav-hamburger { display: block; }
  .feature-inner { grid-template-columns: 1fr; gap: 40px; direction: ltr !important; }
  .feature-block:nth-child(even) .feature-inner { direction: ltr; }
  .feature-visual { aspect-ratio: 16/10; max-width: 520px; margin: 0 auto; }
  .difference-inner { grid-template-columns: 1fr; }
  .difference-quote { border-left: none; padding-left: 0; border-top: 2px solid rgba(255,255,255,0.10); padding-top: 32px; }
  .mobile-cta { display: block; }
  .sub-nav-title { display: none; }
  .footer-inner { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .page-hero-nav { flex-direction: column; align-items: center; }
  .hero-feature-pill { width: 100%; justify-content: center; max-width: 280px; }
  .footer-inner { grid-template-columns: 1fr; }
  .sub-nav-links { gap: 0; }
  .sub-nav-links a { padding: 12px 8px; font-size: 10px; }
}
</style>
</head>
<body>

<!-- STICKY SUB-NAV -->
<nav id="subNav" class="sub-nav">
  <div class="sub-nav-inner">
    <span class="sub-nav-title">Features</span>
    <ul class="sub-nav-links">
      <li><a href="#dynamic-insights">Dynamic Insights</a></li>
      <li><a href="#longevity-coach">Coach</a></li>
      <li><a href="#meal-matchmaker">Meal Matchmaker</a></li>
      <li><a href="#pantry-pal">Pantry Pal</a></li>
      <li><a href="#meal-plan">Meal Plan</a></li>
    </ul>
  </div>
</nav>

<!-- MAIN NAV -->
<nav id="mainNav">
  <a href="/" class="nav-logo">
    <img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef">
  </a>
  <ul class="nav-links">
    <li><a href="/features" class="active-page">Features</a></li>
    <li><a href="/how-it-works">How It Works</a></li>
    <li><a href="/why-tlc">Why TLC</a></li>
    <li><a href="/pricing">Pricing</a></li>
    <li><a href="#" class="nav-login" onclick="openLoginModal();return false;">Log in</a></li>
    <li><a href="/start" class="nav-cta">Start Free</a></li>
  </ul>
  <button class="nav-hamburger" onclick="toggleMobileNav()" aria-label="Menu">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
</nav>

<!-- MOBILE NAV -->
<div class="mobile-nav" id="mobileNav">
  <button class="mobile-nav-close" onclick="toggleMobileNav()" aria-label="Close">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <a href="/" onclick="toggleMobileNav()">Home</a>
  <a href="/features" onclick="toggleMobileNav()">Features</a>
  <a href="/how-it-works" onclick="toggleMobileNav()">How It Works</a>
  <a href="/why-tlc" onclick="toggleMobileNav()">Why TLC</a>
  <a href="/pricing" onclick="toggleMobileNav()">Pricing</a>
  <a href="#" onclick="toggleMobileNav();openLoginModal();return false;">Log in</a>
  <a href="/start" class="btn btn-green">Start Free</a>
</div>

<!-- PAGE HERO -->
<section class="page-hero">
  <div class="container">
    <div class="page-hero-eyebrow"><span class="label">Five Tools. One System.</span></div>
    <h1>TOOLS THAT<br><em>TALK TO</em><br>EACH OTHER</h1>
    <p class="page-hero-sub">Each one sharpens the rest.</p>
    <p class="page-hero-body">Every other health app gives you a collection of features. TLC gives you a system. What you learn from your evening insight changes what your coach says tomorrow. What your coach says changes how you eat next week. What you eat changes what the insight reveals next month. The connections are what make it work.</p>
    <div class="page-hero-nav">
      <a href="#dynamic-insights" class="hero-feature-pill"><span class="pill-dot" style="background:var(--nutrition);"></span>Dynamic Insights</a>
      <a href="#longevity-coach" class="hero-feature-pill"><span class="pill-dot" style="background:var(--body-blue);"></span>Longevity Coach</a>
      <a href="#meal-matchmaker" class="hero-feature-pill"><span class="pill-dot" style="background:var(--green);"></span>Meal Matchmaker</a>
      <a href="#pantry-pal" class="hero-feature-pill"><span class="pill-dot" style="background:var(--mind);"></span>Pantry Pal</a>
      <a href="#meal-plan" class="hero-feature-pill"><span class="pill-dot" style="background:#154D33;"></span>Meal Plan</a>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section class="section-features">

  <!-- 1. Dynamic Insights -->
  <div class="feature-block" id="dynamic-insights">
    <div class="container">
      <div class="feature-inner">
        <div class="feature-visual reveal-scale">
          <div class="mock-card mock-di" id="demo-di">
            <div class="mock-di-header">
              <span class="mock-di-title">Dynamic Insight</span>
              <div style="display:flex;align-items:center;gap:7px;">
                <div class="mock-di-listen">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                  <span class="mock-di-listen-text">Listen</span>
                </div>
                <div class="mock-di-badge"><span class="mock-di-badge-dot"></span><span class="mock-di-badge-text">Tonight's Insight</span></div>
              </div>
            </div>
            <div class="mock-di-narrative">
              <p id="di-narrative-text" style="opacity:0;transition:opacity 0.8s ease;">Your omega-3 intake tracked <strong>31% above target</strong> this week. On every day you hit that threshold, your evening energy score was <strong>7.8 or higher</strong>. The pattern is consistent. Keep the salmon streak going.</p>
              <p id="di-narrative-p2" style="opacity:0;transition:opacity 0.8s ease;margin-top:6px;">HRV averaged <strong>58ms</strong> this week against your <strong>52ms</strong> baseline. Your sleep Tuesday and Wednesday drove most of that gain. Strength training on Thursday correlated with a <strong>+14% recovery uplift</strong> by Friday morning.</p>
              <p id="di-narrative-p3" style="opacity:0;transition:opacity 0.8s ease;margin-top:6px;">This week's Longevity Score: <strong>741/1000</strong>. Up 17 from last week. Your weekly strategy lands tomorrow morning. The patterns are compounding.</p>
            </div>
            <div class="mock-wellbeing-section">
              <div class="mock-wb-header">Wellbeing Journey / Week 4</div>
              <div class="mock-wb-row">
                <span class="mock-wb-label" style="color:var(--mind)">Mood</span>
                <div class="mock-wb-bars" id="wb-bars-mood"></div>
                <span class="mock-wb-score" id="wb-score-mood" style="color:var(--mind)">0.0</span>
              </div>
              <div class="mock-wb-row">
                <span class="mock-wb-label" style="color:var(--body-blue)">Focus</span>
                <div class="mock-wb-bars" id="wb-bars-focus"></div>
                <span class="mock-wb-score" id="wb-score-focus" style="color:var(--body-blue)">0.0</span>
              </div>
              <div class="mock-wb-row">
                <span class="mock-wb-label" style="color:var(--nutrition)">Energy</span>
                <div class="mock-wb-bars" id="wb-bars-energy"></div>
                <span class="mock-wb-score" id="wb-score-energy" style="color:var(--nutrition)">0.0</span>
              </div>
            </div>
            <div class="mock-di-tts-row" id="di-tts-row" style="opacity:0;transition:opacity 0.6s ease;">
              <div class="mock-tts-wave">
                <div class="mock-tts-bar"></div><div class="mock-tts-bar"></div><div class="mock-tts-bar"></div><div class="mock-tts-bar"></div><div class="mock-tts-bar"></div>
              </div>
              <span class="mock-tts-label">Reading your insight aloud...</span>
            </div>
          </div>
        </div>
        <div class="feature-copy reveal d2">
          <span class="label">The intelligence layer</span>
          <div class="feature-tier-pill tlc">TLC &middot; $9.99/mo</div>
          <h3>DYNAMIC INSIGHTS</h3>
          <p>Every evening at 8pm, TLC does something no other platform can. It takes what you ate, what your body measured, and how you felt, and draws specific, named connections across all three. Not a summary of your day. A revelation about the pattern behind it.</p>
          <p>Week by week, the picture deepens. Your Longevity Score tracks the trajectory your habits are building. After 30 days, TLC has seen your individual patterns across hundreds of data points. Every insight that follows is built on that foundation, not a template.</p>
          <ul class="feature-highlights">
            <li>Connects nutrition, biometrics, and reflection in one daily insight</li>
            <li>Longevity Score tracks your trajectory week over week</li>
            <li>Targets that evolve as your body adapts</li>
            <li>Listen mode reads your insight aloud. Hands-free, eyes-free.</li>
            <li>Never starts from scratch. Every week builds on the last.</li>
          </ul>
          <a href="https://tlc-onboarding.chris-ec5.workers.dev" class="feature-cta">Start your first insight free &rarr;</a>
        </div>
      </div>
    </div>
  </div>

  <!-- 2. Longevity Coach -->
  <div class="feature-block alt-bg" id="longevity-coach">
    <div class="container">
      <div class="feature-inner">
        <div class="feature-visual reveal-scale">
          <div class="mock-card mock-coach" id="demo-coach">
            <div class="mock-coach-context">
              <span class="mock-chip alert">HRV: 41ms</span>
              <span class="mock-chip alert">Sleep: 6.2h</span>
              <span class="mock-chip low">Recovery: Low</span>
              <span class="mock-chip">Goal: Longevity</span>
            </div>
            <div class="mock-chat-area" id="coach-chat"></div>
            <div class="mock-input-row">
              <div class="mock-input-bar"></div>
              <div class="mock-send-btn"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div>
            </div>
          </div>
        </div>
        <div class="feature-copy reveal d2">
          <span class="label">Always in context</span>
          <div class="feature-tier-pill tlc">TLC &middot; $9.99/mo</div>
          <h3>LONGEVITY COACH</h3>
          <p>Before you type a word, your coach already knows. Your biometrics from this morning. Every meal you logged this week. Your active goals, your health conditions, your dietary restrictions. The last seven insights and every pattern TLC has seen in your data. That context is loaded before the conversation starts.</p>
          <p>This is the difference between a generic chatbot and a coach who has been following your journey since day one. Ask it anything. It answers from your data. Come back six months later. It has not forgotten a single pattern. The longer you use TLC, the more precisely it guides you.</p>
          <ul class="feature-highlights">
            <li>Dietician, nutritionist, longevity specialist, and life coach in one</li>
            <li>Full context loaded before you say a word: biometrics, meals, goals, history</li>
            <li>References your actual data. Never a generic response.</li>
            <li>Gets sharper with every session as your patterns compound</li>
            <li>Opens Meal Matchmaker with your current context when you ask about food</li>
          </ul>
          <a href="https://tlc-onboarding.chris-ec5.workers.dev" class="feature-cta">Talk to your coach free &rarr;</a>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. Meal Matchmaker -->
  <div class="feature-block" id="meal-matchmaker">
    <div class="container">
      <div class="feature-inner">
        <div class="feature-visual reveal-scale" id="demo-mm" style="position:relative;">
          <div class="mock-mm-skeleton" id="mm-skeleton">
            <div class="skel skel-title"></div>
            <div class="skel skel-sub"></div>
            <div class="skel skel-gap"></div>
            <div class="skel skel-full" style="height:14px;"></div>
            <div class="skel skel-sub"></div>
            <div class="skel skel-gap"></div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <div class="skel skel-macro"></div>
              <div class="skel skel-macro"></div>
              <div class="skel skel-macro"></div>
            </div>
            <div class="skel skel-gap"></div>
            <div style="display:flex;gap:6px;">
              <div class="skel" style="width:70px;height:22px;border-radius:50px;"></div>
              <div class="skel" style="width:80px;height:22px;border-radius:50px;"></div>
            </div>
          </div>
          <div class="mock-card mock-mm mock-mm-result" id="mm-result" style="position:absolute;inset:0;opacity:0;transition:opacity 0.5s;">
            <div class="mock-mm-header">
              <span class="mock-mm-restaurant">Sushi Yoshi</span>
              <span class="mock-mm-score" id="mm-score-badge">0% Match</span>
            </div>
            <div class="mock-mm-meta">
              <span class="mock-mm-cuisine">Japanese</span>
              <span class="mock-mm-dist">0.8km away &bull; Open now</span>
            </div>
            <div class="mock-mm-dish">
              <div class="mock-mm-dish-name">Salmon Avocado Bowl</div>
              <div class="mock-mm-kcal">680 kcal</div>
              <div class="mock-macro-row"><span class="mock-macro-label">Protein</span><div class="mock-macro-bar"><div class="mock-macro-fill" id="mm-bar-p" style="width:0%;transition:width 0.9s ease;"></div></div><span class="mock-macro-val">44g</span></div>
              <div class="mock-macro-row"><span class="mock-macro-label">Carbs</span><div class="mock-macro-bar"><div class="mock-macro-fill carbs" id="mm-bar-c" style="width:0%;transition:width 0.9s ease;"></div></div><span class="mock-macro-val">28g</span></div>
              <div class="mock-macro-row"><span class="mock-macro-label">Fat</span><div class="mock-macro-bar"><div class="mock-macro-fill fat" id="mm-bar-f" style="width:0%;transition:width 0.9s ease;"></div></div><span class="mock-macro-val">18g</span></div>
            </div>
            <div class="mock-mm-tags">
              <span class="mock-mm-tag safe">Allergy-safe</span>
              <span class="mock-mm-tag goal">Goal-matched</span>
              <span class="mock-mm-tag goal">Anti-inflammatory</span>
            </div>
            <div class="mock-mm-why">"Omega-3 profile supports your recovery goal. Calorie distance: 12 kcal."</div>
            <div class="mock-mm-alts">
              <div class="mock-mm-alt"><span class="mock-mm-alt-name">Tuna Tataki</span><span class="mock-mm-alt-pct">87%</span></div>
              <div class="mock-mm-alt"><span class="mock-mm-alt-name">Edamame Ramen (miso broth)</span><span class="mock-mm-alt-pct">79%</span></div>
            </div>
          </div>
        </div>
        <div class="feature-copy reveal d2">
          <span class="label">Your goals travel with you</span>
          <div class="feature-tier-pill lite">TLC Lite &middot; Free</div>
          <h3>MEAL MATCHMAKER</h3>
          <p>You are in a city you do not know. A restaurant you have never heard of. A menu you are seeing for the first time. Meal Matchmaker already has your macros, your current goals, your allergies, and your calorie target. It browses the actual menu and finds the dish that fits. Not approximately. To within 12 calories.</p>
          <p>This works anywhere. Any city, any country, any cuisine. Menu Scanner extends it further: point your camera at any printed, digital, or overhead menu and TLC reads it instantly. Every meal an informed decision, wherever life takes you. Your plan never stays home, because TLC never stays home.</p>
          <ul class="feature-highlights">
            <li>Any city, any country. Works globally in any cuisine.</li>
            <li>Macro-matched, allergy-verified, and goal-aligned every time</li>
            <li>Menu Scanner reads any menu: printed, digital, or overhead board</li>
            <li>Synced live with your current goals, not last week's settings</li>
            <li>Free forever on TLC Lite. No subscription required.</li>
          </ul>
          <a href="https://tlc-onboarding-lite.chris-ec5.workers.dev" class="feature-cta">Find your next meal free &rarr;</a>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. Pantry Pal + Recipes -->
  <div class="feature-block alt-bg" id="pantry-pal">
    <div class="container">
      <div class="feature-inner">
        <div class="feature-visual reveal-scale">
          <div class="mock-card mock-pantry" id="demo-pantry">
            <div class="mock-pantry-scan">
              <div class="mock-pantry-title">Detected in your fridge</div>
              <div class="mock-ingredients-row" id="pantry-ings">
                <span class="mock-ingredient" style="opacity:0;">Salmon</span>
                <span class="mock-ingredient" style="opacity:0;">Lemon</span>
                <span class="mock-ingredient" style="opacity:0;">Dill</span>
                <span class="mock-ingredient" style="opacity:0;">Capers</span>
                <span class="mock-ingredient more" style="opacity:0;">+7 more</span>
              </div>
            </div>
            <div class="mock-recipe-card-inner" id="pantry-recipe" style="opacity:0;transition:opacity 0.7s ease;">
              <div class="mock-recipe-eyebrow">Generated for you</div>
              <div class="mock-recipe-name">Herb-Crusted Salmon</div>
              <div class="mock-recipe-sub">with Caper Butter &bull; 25 min</div>
              <div class="mock-macro-pills">
                <span class="mock-macro-pill cal">520 kcal</span>
                <span class="mock-macro-pill pro">38g protein</span>
                <span class="mock-macro-pill cal">12g fat</span>
              </div>
              <div class="mock-recipe-meta-row">
                <span class="mock-recipe-meta-item">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  25 min
                </span>
                <span class="mock-recipe-meta-item">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
                  7 ingredients
                </span>
                <span class="mock-recipe-meta-item">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  Anti-inflam.
                </span>
              </div>
              <div class="mock-match-bar"><div class="mock-match-bar-fill"></div></div>
              <span class="mock-match-label">Macro match: Excellent</span>
              <div class="mock-recipe-divider"></div>
              <div class="mock-section-hdr">In your fridge</div>
              <div class="mock-ing-grid">
                <div class="mock-ing-item"><svg class="mock-ing-chk" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5"/></svg>Salmon fillet</div>
                <div class="mock-ing-item"><svg class="mock-ing-chk" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5"/></svg>Fresh dill</div>
                <div class="mock-ing-item"><svg class="mock-ing-chk" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5"/></svg>Lemon</div>
                <div class="mock-ing-item"><svg class="mock-ing-chk" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5"/></svg>Capers</div>
                <div class="mock-ing-item"><svg class="mock-ing-chk" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5"/></svg>Olive oil</div>
                <div class="mock-ing-item"><svg class="mock-ing-chk" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5"/></svg>Black pepper</div>
              </div>
              <div class="mock-recipe-divider"></div>
              <div class="mock-section-hdr">Shopping list</div>
              <div class="mock-shop-grid">
                <div class="mock-shop-item"><span class="mock-shop-dot"></span>Dijon mustard</div>
                <div class="mock-shop-item"><span class="mock-shop-dot"></span>Panko crumbs</div>
              </div>
            </div>
          </div>
        </div>
        <div class="feature-copy reveal d2">
          <span class="label">At home, in your kitchen</span>
          <div class="feature-tier-pill tlc">TLC &middot; $9.99/mo</div>
          <h3>PANTRY PAL + RECIPES</h3>
          <p>Open your fridge. Point your camera. TLC identifies everything you have and generates a recipe that hits your macro targets, aligns with your active goal, and works with exactly what is already there. No shopping required. No compromise. Just precise, purposeful food from your own kitchen.</p>
          <p>Planning ahead instead? Start from scratch and TLC builds the recipe with a ready-to-go shopping list. Meal Analyser completes the loop: snap any finished plate and receive full macros in seconds. Cooking in, eating out, ordering ahead. TLC has a tool for every moment your nutrition needs you.</p>
          <ul class="feature-highlights">
            <li>Scan your fridge for instant recipes, or plan from scratch</li>
            <li>Every recipe tuned to your macros, goals, and dietary restrictions</li>
            <li>Shopping list generated in seconds when you plan from scratch</li>
            <li>Meal Analyser: snap any plate for full macros instantly</li>
            <li>Connects to your Daily Insight. Every meal logged automatically.</li>
          </ul>
          <a href="https://tlc-onboarding.chris-ec5.workers.dev" class="feature-cta">Scan your fridge free &rarr;</a>
        </div>
      </div>
    </div>
  </div>

  <!-- 5. TLC Pro Meal Plan -->
  <div class="feature-block" id="meal-plan">
    <div class="container">
      <div class="feature-inner">
        <div class="feature-visual reveal-scale">
          <div class="mock-card mock-mealplan" id="demo-mealplan">
            <div class="mock-mp-header">
              <span class="mock-mp-pro-badge">TLC Pro</span>
              <div class="mock-mp-hdr-right">
                <div class="mock-mp-hdr-title">Your April Meal Plan</div>
                <div class="mock-mp-hdr-sub">28 days &bull; tailored to your goals</div>
              </div>
            </div>
            <div class="mock-mp-body">
              <div class="mock-mp-meal-row">
                <span class="mock-mp-type">Breakfast</span>
                <span class="mock-mp-name" id="mp-meal-0">Smoked Salmon Scramble</span>
                <span class="mock-mp-tag omega">Omega-3</span>
              </div>
              <div class="mock-mp-meal-row">
                <span class="mock-mp-type">Lunch</span>
                <span class="mock-mp-name" id="mp-meal-1">Mediterranean Grain Bowl</span>
                <span class="mock-mp-tag pro">High fibre</span>
              </div>
              <div class="mock-mp-meal-row">
                <span class="mock-mp-type">Snack</span>
                <span class="mock-mp-name" id="mp-meal-2">Greek Yoghurt &amp; Walnuts</span>
                <span class="mock-mp-tag lean">Anti-inflam.</span>
              </div>
              <div class="mock-mp-meal-row">
                <span class="mock-mp-type">Dinner</span>
                <span class="mock-mp-name" id="mp-meal-3">Herb Sea Bass &amp; Asparagus</span>
                <span class="mock-mp-tag omega">Lean protein</span>
              </div>
            </div>
            <div class="mock-mp-why">
              <div class="mock-mp-why-title">Why we chose this for you</div>
              <div class="mock-mp-why-row" id="mp-why-0"><div class="mock-mp-why-check"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#2ea84a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5l2.5 2.5 3.5-4"/></svg></div><span class="mock-mp-why-label">Taste match</span><span class="mock-mp-why-detail">Mediterranean, low-spice</span></div>
              <div class="mock-mp-why-row" id="mp-why-1"><div class="mock-mp-why-check"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#2ea84a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5l2.5 2.5 3.5-4"/></svg></div><span class="mock-mp-why-label">Allergy safe</span><span class="mock-mp-why-detail">dairy-free, nut-free</span></div>
              <div class="mock-mp-why-row" id="mp-why-2"><div class="mock-mp-why-check"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#2ea84a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5l2.5 2.5 3.5-4"/></svg></div><span class="mock-mp-why-label">Macros</span><span class="mock-mp-why-detail">38g protein &bull; 420 kcal</span></div>
              <div class="mock-mp-why-row" id="mp-why-3"><div class="mock-mp-why-check"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#2ea84a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5l2.5 2.5 3.5-4"/></svg></div><span class="mock-mp-why-label">Kitchen fit</span><span class="mock-mp-why-detail">pan + oven, 20 min</span></div>
            </div>
            <div class="mock-mp-shop">
              <div class="mock-mp-shop-title">Smart Zero-Waste Shopping List</div>
              <div class="mock-mp-shop-grid">
                <div class="mock-mp-shop-item" id="mp-shop-0"><div class="mock-mp-shop-check"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#39BA76" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5l2.5 2.5 3.5-4"/></svg></div>Salmon fillet</div>
                <div class="mock-mp-shop-item" id="mp-shop-1"><div class="mock-mp-shop-check"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#39BA76" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5l2.5 2.5 3.5-4"/></svg></div>Sea bass (2 fillets)</div>
                <div class="mock-mp-shop-item" id="mp-shop-2"><div class="mock-mp-shop-check"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#39BA76" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5l2.5 2.5 3.5-4"/></svg></div>Quinoa (500g)</div>
                <div class="mock-mp-shop-item" id="mp-shop-3"><div class="mock-mp-shop-check"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#39BA76" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5l2.5 2.5 3.5-4"/></svg></div>Asparagus bunch</div>
                <div class="mock-mp-shop-item" id="mp-shop-4"><div class="mock-mp-shop-check"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#39BA76" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5l2.5 2.5 3.5-4"/></svg></div>Greek yoghurt</div>
                <div class="mock-mp-shop-item" id="mp-shop-5"><div class="mock-mp-shop-check"><svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#39BA76" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5l2.5 2.5 3.5-4"/></svg></div>Walnuts (150g)</div>
              </div>
            </div>
            <div class="mock-mp-savings">
              <span class="mock-mp-savings-num" id="mp-savings">&pound;0</span>
              <div>
                <span class="mock-mp-savings-label">saved this month</span>
                <span class="mock-mp-savings-sub">Zero waste &bull; 12% under budget</span>
              </div>
            </div>
          </div>
        </div>
        <div class="feature-copy reveal d2">
          <span class="label">The committed path</span>
          <div class="feature-tier-pill pro">TLC Pro &middot; $19.99/mo</div>
          <h3>YOUR ENTIRE MONTH. PLANNED.</h3>
          <p>TLC Pro is for those who are done with improvising. Every breakfast, lunch, dinner, and snack for 28 days, built around your macro targets, taste preferences, dietary restrictions, cooking ability, and kitchen. Not a rotation. Not a template. A completely unique plan built specifically for you.</p>
          <p>The Smart Shopping List consolidates every ingredient across all 28 days, eliminates duplicates, and sequences your shop around what gets used when. Members typically cut their grocery bill by 10 to 15 percent. And when life gets in the way, it does not unravel. Miss a meal, eat out, or raid the pantry and TLC recalibrates automatically. The plan works around real life.</p>
          <ul class="feature-highlights">
            <li>Full 28-day plan built in advance, laser-focused on your goals</li>
            <li>Matched to your cooking skill, budget, and kitchen equipment</li>
            <li>Smart zero-waste shopping list across every meal</li>
            <li>Optional batch prep instructions to get ahead on the week</li>
            <li>Recalibrates automatically when life disrupts the plan</li>
            <li>Mixes freely with Meal Matchmaker and Pantry Pal</li>
          </ul>
          <a href="https://tlc-onboarding.chris-ec5.workers.dev" class="feature-cta">Start your Pro journey &rarr;</a>
        </div>
      </div>
    </div>
  </div>

</section>

<!-- THE DIFFERENCE -->
<section class="section-difference">
  <div class="container">
    <div class="difference-inner">
      <div class="difference-quote reveal">
        <div class="quote-pre">The question we get</div>
        <div class="quote-mark">"</div>
        <p class="quote-text">Can't I just use<br><em>any health app?</em></p>
      </div>
      <div class="difference-answer reveal d2">
        <span class="label" style="margin-bottom:22px;display:inline-flex;color:var(--green-accent);">The Difference</span>
        <h2>IT ADAPTS TO YOU.<br>NOT THE OTHER WAY.</h2>
        <p>Most health tools hand you a plan and expect you to fit your life around it. Rigid. Generic. Built for a hypothetical average person who is not you.</p>
        <p>TLC starts with <span class="highlight-pill">who you actually are</span>: your wearable data, your food patterns, your goals, your restrictions, your daily reality. Then it meets you where you are. At the restaurant. At home. When you are exhausted and need the answer in 10 seconds.</p>
        <p>Five tools that talk to each other. Every insight built from your data. Every coaching response that knows your week. Every plan that reflects where you actually are, not where a formula assumed you would be.</p>
        <a href="https://tlc-onboarding.chris-ec5.workers.dev" class="btn btn-green" style="margin-top:28px;">Get Your Free Longevity Blueprint</a>
      </div>
    </div>
  </div>
</section>

<!-- WEARABLES -->
<section class="section-wearables">
  <div class="container">
    <div class="wearables-inner">
      <span class="wearable-label">Syncs with:</span>
      <span class="wearable-tag"><span class="wearable-dot"></span>WHOOP</span>
      <span class="wearable-tag"><span class="wearable-dot"></span>OURA</span>
      <span class="wearable-tag"><span class="wearable-dot"></span>FITBIT</span>
      <span class="wearable-tag"><span class="wearable-dot"></span>GARMIN</span>
      <span class="wearable-tag"><span class="wearable-dot"></span>ULTRAHUMAN</span>
      <span class="wearable-tag wearable-tag-muted">+ 20 more</span>
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="section-cta">
  <div class="container">
    <div class="cta-inner">
      <span class="label" style="justify-content:center;margin-bottom:28px;display:inline-flex;color:var(--green-accent);">Where It Starts</span>
      <h2 class="reveal">THE SYSTEM<br>THAT <span>GROWS</span><br>WITH YOU.</h2>
      <p class="reveal d1">Start free. No card needed. Meal Matchmaker is yours from day one. Unlock the full system when you are ready to see the connections that change everything.</p>
      <div class="cta-actions reveal d2">
        <a href="/start" class="btn btn-green" style="font-size:13px;padding:18px 52px;">Start Free Today</a>
        <a href="/pricing" class="btn btn-outline-white" style="font-size:12px;padding:17px 36px;">Compare all plans</a>
        <span class="cta-note">Cancel anytime &nbsp;&middot;&nbsp; No lock-in &nbsp;&middot;&nbsp; No fees</span>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="footer-logo"><img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef"></div>
      <p>Connecting the dots between nutrition, body, and mind. Eat smarter, feel better, live longer.</p>
    </div>
    <div class="footer-col"><ul>
      <li><a href="/features">Features</a></li>
      <li><a href="/how-it-works">How It Works</a></li>
      <li><a href="/why-tlc">Why TLC</a></li>
      <li><a href="/pricing">Pricing</a></li>
    </ul></div>
    <div class="footer-col"><ul>
      <li><a href="https://www.instagram.com/thelongevitychef_">Instagram</a></li>
      <li><a href="https://docs.google.com/document/d/1ZXE0c5gG4ep34tESNVOQF0SWg7lPpPb4KaQ7fkIcPFg/edit?usp=sharing">FAQs</a></li>
      <li><a href="https://tally.so/r/D4k8eZ">Contact</a></li>
    </ul></div>
    <div class="footer-col"><ul>
      <li><a href="/privacy">Privacy Policy</a></li>
      <li><a href="/terms">Terms &amp; Conditions</a></li>
    </ul></div>
  </div>
  <div class="footer-bottom">
    <span class="footer-copy">&copy; 2026 The Longevity Chef. All rights reserved.</span>
    <span class="footer-copy">Food for Life</span>
  </div>
</footer>

<div class="mobile-cta" id="mobileCta"><a href="/start" class="btn btn-green">Start Free</a></div>

<!-- LOGIN MODAL -->
<div class="login-overlay" id="loginOverlay" onclick="handleOverlayClick(event)">
  <div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
    <button class="login-modal-close" onclick="closeLoginModal()" aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div id="loginForm">
      <h3 id="loginTitle">Welcome back</h3>
      <p>Enter your email and we will send you a login link. No password needed.</p>
      <div class="login-modal-error" id="loginError"></div>
      <input type="email" id="loginEmail" placeholder="your@email.com" autocomplete="email" onkeydown="if(event.key==='Enter')submitMagicLink()" />
      <button class="btn-login-submit" id="loginSubmitBtn" onclick="submitMagicLink()">Send login link</button>
    </div>
    <div class="login-modal-success" id="loginSuccess">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <h4>Check your inbox</h4>
      <p>A login link is on its way. It expires in 15 minutes.</p>
    </div>
  </div>
</div>

<script>
// ── Nav scroll ──
const mainNav = document.getElementById('mainNav');
const subNav = document.getElementById('subNav');
const mobileCta = document.getElementById('mobileCta');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  mainNav.classList.toggle('scrolled', sy > 50);
  // Sub-nav: appears after hero (approx 600px)
  const heroEl = document.querySelector('.page-hero');
  const heroH = heroEl ? heroEl.offsetHeight : 600;
  if (subNav) subNav.classList.toggle('show', sy > heroH - 100);
  if (subNav && sy > heroH - 100) mainNav.style.top = '-80px'; else mainNav.style.top = '0';
  if (mobileCta) mobileCta.classList.toggle('show', sy > 400);
});

// ── Active sub-nav link ──
const featureSections = document.querySelectorAll('.feature-block[id]');
const subLinks = document.querySelectorAll('.sub-nav-links a');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      subLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector('.sub-nav-links a[href="#' + e.target.id + '"]');
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.1, rootMargin: '-80px 0px -20% 0px' });
featureSections.forEach(s => sectionObs.observe(s));

// ── Reveal on scroll ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.reveal, .reveal-scale').forEach(el => revealObs.observe(el));

// ── Mobile nav ──
function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
  document.body.style.overflow = document.getElementById('mobileNav').classList.contains('open') ? 'hidden' : '';
}

// ── Login modal ──
function openLoginModal() { document.getElementById('loginOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeLoginModal() { document.getElementById('loginOverlay').classList.remove('open'); document.body.style.overflow = ''; }
function handleOverlayClick(e) { if (e.target === e.currentTarget) closeLoginModal(); }
async function submitMagicLink() {
  const email = document.getElementById('loginEmail').value.trim();
  const btn = document.getElementById('loginSubmitBtn');
  const errEl = document.getElementById('loginError');
  if (!email || !email.includes('@')) { errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; return; }
  errEl.style.display = 'none';
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const res = await fetch('https://tlc-engine.chris-ec5.workers.dev/api/magic-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    if (res.ok) { document.getElementById('loginForm').style.display = 'none'; document.getElementById('loginSuccess').style.display = 'block'; }
    else { errEl.textContent = 'Something went wrong. Please try again.'; errEl.style.display = 'block'; btn.disabled = false; btn.textContent = 'Send login link'; }
  } catch { errEl.textContent = 'Something went wrong. Please try again.'; errEl.style.display = 'block'; btn.disabled = false; btn.textContent = 'Send login link'; }
}
(function() {
  const params = new URLSearchParams(window.location.search);
  const s = params.get('login');
  if (s === 'expired' || s === 'invalid') {
    openLoginModal();
    const e = document.getElementById('loginError');
    e.textContent = s === 'expired' ? 'That login link has expired. Please request a new one.' : 'That login link is not valid. Please request a new one.';
    e.style.display = 'block';
  }
})();

// ── FEATURE DEMO ANIMATIONS ──
(function() {
  'use strict';

  // ── DI DEMO ──
  function runDI() {
    var narrativeEl = document.getElementById('di-narrative-text');
    var ttsRow = document.getElementById('di-tts-row');
    if (!narrativeEl) return;
    var wbData = [
      {id:'mood',   col:'var(--mind)',     vals:[6.1,6.5,6.8,7.0,7.3,7.1,7.6]},
      {id:'focus',  col:'var(--body-blue)',vals:[6.4,6.8,7.2,7.5,7.7,8.0,8.3]},
      {id:'energy', col:'var(--nutrition)',vals:[5.8,6.2,6.5,7.0,7.2,7.5,7.8]}
    ];
    var narrativeP2 = document.getElementById('di-narrative-p2');
    var narrativeP3 = document.getElementById('di-narrative-p3');
    narrativeEl.style.opacity = '0';
    if (narrativeP2) narrativeP2.style.opacity = '0';
    if (narrativeP3) narrativeP3.style.opacity = '0';
    if (ttsRow) ttsRow.style.opacity = '0';
    wbData.forEach(function(d) {
      var barsEl = document.getElementById('wb-bars-' + d.id);
      var scoreEl = document.getElementById('wb-score-' + d.id);
      if (barsEl) {
        barsEl.innerHTML = '';
        var maxVal = Math.max.apply(null, d.vals);
        d.vals.forEach(function(v) {
          var bar = document.createElement('div');
          bar.className = 'mock-wb-bar';
          bar.style.height = ((v / 10) * 28) + 'px';
          bar.style.background = d.col;
          bar.style.opacity = (v === maxVal) ? '1' : '0.5';
          barsEl.appendChild(bar);
        });
      }
      if (scoreEl) scoreEl.textContent = '0.0';
    });
    setTimeout(function() { narrativeEl.style.opacity = '1'; }, 500);
    setTimeout(function() { if (narrativeP2) narrativeP2.style.opacity = '1'; }, 1100);
    setTimeout(function() { if (narrativeP3) narrativeP3.style.opacity = '1'; }, 1700);
    wbData.forEach(function(d, rowIdx) {
      var barsEl = document.getElementById('wb-bars-' + d.id);
      var scoreEl = document.getElementById('wb-score-' + d.id);
      var baseDelay = 1300 + rowIdx * 380;
      d.vals.forEach(function(v, barIdx) {
        setTimeout(function() {
          var bars = barsEl ? barsEl.querySelectorAll('.mock-wb-bar') : [];
          if (bars[barIdx]) bars[barIdx].style.transform = 'scaleY(1)';
          if (barIdx === d.vals.length - 1 && scoreEl) scoreEl.textContent = v.toFixed(1);
        }, baseDelay + barIdx * 85);
      });
    });
    setTimeout(function() { if (ttsRow) ttsRow.style.opacity = '1'; }, 4200);
  }

  // ── COACH DEMO ──
  function runCoach() {
    var chatEl = document.getElementById('coach-chat');
    if (!chatEl) return;
    chatEl.innerHTML = '';
    function addBubble(type, text, delay) {
      setTimeout(function() {
        var div = document.createElement('div');
        div.className = 'mock-bubble ' + type;
        if (type === 'coach') {
          div.innerHTML = '<div class="mock-coach-label">TLC Coach</div>' + text;
        } else {
          div.textContent = text;
        }
        div.style.opacity = '0';
        div.style.transform = 'translateY(10px)';
        div.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        chatEl.appendChild(div);
        requestAnimationFrame(function() { requestAnimationFrame(function() { div.style.opacity = '1'; div.style.transform = 'translateY(0)'; }); });
      }, delay);
    }
    function addTyping(delay) {
      setTimeout(function() {
        var div = document.createElement('div');
        div.className = 'mock-typing-row';
        div.id = 'typing-ind';
        div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        div.style.opacity = '0';
        div.style.transition = 'opacity 0.25s';
        chatEl.appendChild(div);
        requestAnimationFrame(function() { div.style.opacity = '1'; });
      }, delay);
    }
    function removeTyping(delay) {
      setTimeout(function() { var t = document.getElementById('typing-ind'); if (t) t.remove(); }, delay);
    }
    addBubble('user', '"I didn\\'t sleep well last night. What should I focus on today?"', 400);
    addTyping(1400);
    removeTyping(2900);
    addBubble('coach', 'Your HRV is at 41ms this morning and sleep was 6.2h. Lean anti-inflammatory today: the salmon dinner last Tuesday gave you your best recovery score this week. Leafy greens and walnuts will help too. Avoid caffeine after 1pm.', 2900);
    addBubble('user', '"Any restaurants nearby that fit that?"', 5200);
    addTyping(6000);
    removeTyping(7300);
    addBubble('coach', 'Opening Meal Matchmaker with your anti-inflammatory filter and current location. I\\'ll look for high omega-3 options first.', 7300);
  }

  // ── MM DEMO ──
  function runMM() {
    var skeleton = document.getElementById('mm-skeleton');
    var result = document.getElementById('mm-result');
    var badge = document.getElementById('mm-score-badge');
    var barP = document.getElementById('mm-bar-p');
    var barC = document.getElementById('mm-bar-c');
    var barF = document.getElementById('mm-bar-f');
    if (!skeleton) return;
    skeleton.style.opacity = '1';
    if (result) result.style.opacity = '0';
    if (badge) badge.textContent = '0% Match';
    if (barP) barP.style.width = '0%';
    if (barC) barC.style.width = '0%';
    if (barF) barF.style.width = '0%';
    setTimeout(function() {
      skeleton.style.transition = 'opacity 0.4s';
      skeleton.style.opacity = '0';
      if (result) {
        result.style.opacity = '1';
        var s = 0;
        var t = setInterval(function() {
          s = Math.min(94, s + 3);
          if (badge) badge.textContent = s + '% Match';
          if (s >= 94) clearInterval(t);
        }, 35);
        setTimeout(function() {
          if (barP) barP.style.width = '88%';
          if (barC) barC.style.width = '56%';
          if (barF) barF.style.width = '36%';
        }, 300);
      }
    }, 2500);
  }

  // ── PANTRY DEMO ──
  function runPantry() {
    var ingsEl = document.getElementById('pantry-ings');
    var recipeEl = document.getElementById('pantry-recipe');
    if (!ingsEl) return;
    var ings = ingsEl.querySelectorAll('.mock-ingredient');
    ings.forEach(function(i) { i.style.opacity = '0'; i.style.transform = 'scale(0.6)'; });
    if (recipeEl) recipeEl.style.opacity = '0';
    ings.forEach(function(ing, i) {
      setTimeout(function() {
        ing.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';
        ing.style.opacity = '1';
        ing.style.transform = 'scale(1)';
      }, 500 + i * 320);
    });
    var totalIngTime = 500 + ings.length * 320 + 500;
    setTimeout(function() { if (recipeEl) recipeEl.style.opacity = '1'; }, totalIngTime);
  }

  // ── MEAL PLAN DEMO ──
  function runMealPlan() {
    var meals = [0,1,2,3].map(function(i) { return document.getElementById('mp-meal-'+i); });
    var whys = [0,1,2,3].map(function(i) { return document.getElementById('mp-why-'+i); });
    var shops = [0,1,2,3,4,5].map(function(i) { return document.getElementById('mp-shop-'+i); });
    var savingsEl = document.getElementById('mp-savings');
    if (!meals[0]) return;
    meals.forEach(function(el) { if(el) el.classList.remove('mp-visible'); });
    whys.forEach(function(el) { if(el) el.classList.remove('mp-visible'); });
    shops.forEach(function(el) { if(el) el.classList.remove('mp-visible'); });
    if (savingsEl) savingsEl.textContent = '\\u00a30';
    meals.forEach(function(el, i) { if (!el) return; setTimeout(function() { el.classList.add('mp-visible'); }, 300 + i * 420); });
    var whyStart = 300 + 4 * 420 + 200;
    whys.forEach(function(el, i) { if (!el) return; setTimeout(function() { el.classList.add('mp-visible'); }, whyStart + i * 160); });
    var shopStart = whyStart + 4 * 160 + 200;
    shops.forEach(function(el, i) { if (!el) return; setTimeout(function() { el.classList.add('mp-visible'); }, shopStart + i * 130); });
    setTimeout(function() {
      if (!savingsEl) return;
      var v = 0, tgt = 43;
      var t = setInterval(function() { v = Math.min(tgt, v + 2); savingsEl.textContent = '\\u00a3' + v; if (v >= tgt) clearInterval(t); }, 40);
    }, shopStart + 6 * 130 + 200);
  }

  // ── INIT WITH INTERSECTION OBSERVER ──
  function startWhenVisible(containerId, runFn, loopMs) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var started = false;
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting && !started) {
          started = true;
          runFn();
          setInterval(runFn, loopMs);
          obs.disconnect();
        }
      });
    }, { threshold: 0.25 });
    obs.observe(el);
  }

  document.addEventListener('DOMContentLoaded', function() {
    startWhenVisible('demo-di', runDI, 9000);
    startWhenVisible('demo-coach', runCoach, 10000);
    startWhenVisible('demo-mm', runMM, 8500);
    startWhenVisible('demo-pantry', runPantry, 8000);
    startWhenVisible('demo-mealplan', runMealPlan, 9500);
  });
})();
</script>
</body>
</html>
`;
// FEATURES_HTML_END

// HOW_IT_WORKS_HTML_START
const HOW_IT_WORKS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>How It Works | The Longevity Chef</title>
<meta name="description" content="TLC runs quietly in the background of your day. Here is what it does from morning to evening, and how every day becomes more powerful than the last.">
<meta property="og:title" content="How It Works | The Longevity Chef">
<meta property="og:description" content="From your morning wearable sync to your evening insight, here is how TLC joins the dots every single day.">
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

@keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes livePulse { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(46,168,74,0.4); } 50% { opacity: 0.6; box-shadow: 0 0 0 6px rgba(46,168,74,0); } }
@keyframes trackPulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }

.container { max-width: var(--content-max); margin: 0 auto; padding: 0 var(--gutter); }
.label { display: inline-flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--green); }
.label::before { content: ''; width: 18px; height: 1.5px; background: var(--green); }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: var(--font-body); font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; border: none; cursor: pointer; border-radius: 2px; transition: all 0.25s cubic-bezier(0.4,0,0.2,1); white-space: nowrap; }
.btn:hover { transform: translateY(-2px); }
.btn-green { background: var(--green); color: var(--white); padding: 16px 40px; box-shadow: 0 4px 16px rgba(46,168,74,0.2); }
.btn-green:hover { background: var(--green-mid); box-shadow: 0 8px 28px rgba(46,168,74,0.3); }
.btn-outline { background: transparent; color: var(--ink); padding: 15px 38px; border: 1.5px solid var(--border-mid); }
.btn-outline:hover { border-color: var(--ink); }
.btn-outline-white { background: transparent; color: var(--white); padding: 15px 38px; border: 1.5px solid rgba(255,255,255,0.25); }
.btn-outline-white:hover { border-color: rgba(255,255,255,0.6); }

.reveal { opacity: 0; transform: translateY(40px); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-scale { opacity: 0; transform: scale(0.95); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal-scale.visible { opacity: 1; transform: scale(1); }
.d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; } .d3 { transition-delay: 0.3s; } .d4 { transition-delay: 0.4s; } .d5 { transition-delay: 0.5s; }

/* ── NAV ── */
nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 18px var(--gutter); background: rgba(255,255,255,0); border-bottom: 1px solid transparent; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
nav.scrolled { background: rgba(255,255,255,0.92); backdrop-filter: blur(20px) saturate(1.4); border-bottom-color: var(--border); }
.nav-logo { display: flex; align-items: center; text-decoration: none; }
.nav-logo img { height: 56px; width: auto; display: block; }
.nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
.nav-links a { color: var(--muted-2); text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; transition: color 0.2s; }
.nav-links a:hover, .nav-links a.active-page { color: var(--ink); }
.nav-cta { background: var(--ink); color: var(--white) !important; padding: 10px 24px; border-radius: 2px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.25s; text-decoration: none; }
.nav-cta:hover { background: #333; transform: translateY(-1px); }
.nav-login { color: var(--muted-2) !important; }
.nav-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 4px; color: var(--ink); }
.nav-hamburger svg { width: 24px; height: 24px; display: block; }

/* ── MOBILE NAV ── */
.mobile-nav { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); z-index: 199; flex-direction: column; align-items: center; justify-content: center; gap: 32px; }
.mobile-nav.open { display: flex; }
.mobile-nav a { font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink); text-decoration: none; font-family: var(--font-display); }
.mobile-nav a:hover { color: var(--green); }
.mobile-nav-close { position: absolute; top: 20px; right: var(--gutter); background: none; border: none; cursor: pointer; color: var(--muted-2); }
.mobile-nav-close svg { width: 28px; height: 28px; }
.mobile-nav .btn { margin-top: 8px; }

/* ── LOGIN MODAL ── */
.login-overlay { display: none; position: fixed; inset: 0; background: rgba(26,26,26,0.55); backdrop-filter: blur(4px); z-index: 9000; align-items: center; justify-content: center; padding: 24px; }
.login-overlay.open { display: flex; }
.login-modal { background: #fff; border-radius: 16px; padding: 40px 36px; max-width: 420px; width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,0.18); position: relative; }
.login-modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; color: var(--muted-2); padding: 4px; }
.login-modal h3 { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--ink); margin: 0 0 6px; letter-spacing: 0.03em; }
.login-modal p { font-size: 14px; color: var(--muted-2); margin: 0 0 24px; line-height: 1.5; }
.login-modal input[type="email"] { width: 100%; border: 1.5px solid var(--border); border-radius: 8px; padding: 13px 16px; font-size: 15px; font-family: 'Figtree', sans-serif; color: var(--ink); outline: none; transition: border-color 0.2s; margin-bottom: 14px; }
.login-modal input[type="email"]:focus { border-color: var(--green); }
.login-modal .btn-login-submit { width: 100%; background: var(--green); color: #fff; border: none; border-radius: 8px; padding: 14px; font-size: 14px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: background 0.2s, transform 0.15s; font-family: 'Figtree', sans-serif; }
.login-modal .btn-login-submit:hover { background: #259940; transform: translateY(-1px); }
.login-modal .btn-login-submit:disabled { background: var(--muted); cursor: not-allowed; transform: none; }
.login-modal-success { display: none; text-align: center; padding: 8px 0; }
.login-modal-success h4 { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--ink); margin: 8px 0; }
.login-modal-success p { font-size: 14px; color: var(--muted-2); margin: 0; }
.login-modal-error { display: none; background: #fff3f3; border: 1px solid #fca5a5; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #b91c1c; margin-bottom: 12px; }

/* ── PAGE HERO ── */
.page-hero { padding: clamp(140px, 16vw, 200px) 0 clamp(80px, 10vw, 120px); text-align: center; position: relative; overflow: hidden; background: var(--ink); }
.page-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 60%, rgba(46,168,74,0.07) 0%, transparent 65%); }
.page-hero-eyebrow { margin-bottom: 28px; opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s forwards; }
.page-hero h1 { font-family: var(--font-display); font-size: clamp(64px, 9vw, 128px); line-height: 0.88; letter-spacing: 0.01em; color: var(--white); margin-bottom: 12px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.35s forwards; position: relative; }
.page-hero h1 em { font-style: normal; color: var(--green-accent); }
.page-hero-sub { font-family: var(--font-body); font-style: italic; font-weight: 300; font-size: clamp(20px, 2.5vw, 30px); color: rgba(255,255,255,0.50); line-height: 1.5; margin-bottom: 32px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.5s forwards; }
.page-hero-body { font-size: clamp(15px, 1.5vw, 18px); font-weight: 300; color: rgba(255,255,255,0.48); max-width: 600px; margin: 0 auto; line-height: 1.85; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.65s forwards; }

/* ── 24-HOUR TIMELINE ── */
.section-timeline { padding: var(--section-pad) 0; background: var(--white); position: relative; }
.timeline-header { text-align: center; margin-bottom: 80px; }
.timeline-header h2 { font-family: var(--font-display); font-size: clamp(44px, 5.5vw, 68px); line-height: 0.95; letter-spacing: 0.02em; color: var(--ink); margin-bottom: 20px; }
.timeline-header h2 em { font-style: normal; color: var(--green); }
.timeline-header > p { font-size: 18px; color: var(--muted-2); max-width: 520px; margin: 0 auto; line-height: 1.75; font-weight: 300; }

/* The vertical timeline track */
.timeline { position: relative; max-width: 900px; margin: 0 auto; }
.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  bottom: 0;
  width: 1.5px;
  background: linear-gradient(to bottom, transparent, var(--border-mid) 8%, var(--border-mid) 92%, transparent);
}
.timeline-item { display: grid; grid-template-columns: 1fr 60px 1fr; align-items: start; gap: 0; margin-bottom: 80px; position: relative; }
.timeline-item:last-child { margin-bottom: 0; }
.timeline-item.right .timeline-content { grid-column: 3; grid-row: 1; }
.timeline-item.right .timeline-spacer { grid-column: 2; grid-row: 1; }
.timeline-item.right .timeline-placeholder { grid-column: 1; grid-row: 1; }
.timeline-item.left .timeline-content { grid-column: 1; grid-row: 1; text-align: right; }
.timeline-item.left .timeline-spacer { grid-column: 2; grid-row: 1; }
.timeline-item.left .timeline-placeholder { grid-column: 3; grid-row: 1; }
.timeline-spacer { display: flex; flex-direction: column; align-items: center; padding-top: 24px; }
.timeline-node { width: 14px; height: 14px; border-radius: 50%; background: var(--white); border: 2.5px solid var(--green); position: relative; flex-shrink: 0; }
.timeline-node.active { background: var(--green); box-shadow: 0 0 0 6px rgba(46,168,74,0.12); animation: livePulse 3s ease-in-out infinite; }
.timeline-time-chip { margin-top: 8px; font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: var(--green); background: var(--green-light); border: 1px solid rgba(46,168,74,0.20); border-radius: 50px; padding: 3px 10px; white-space: nowrap; }
.timeline-content { padding: 0 32px; }
.timeline-item.left .timeline-content { padding: 0 32px 0 0; }
.timeline-item.right .timeline-content { padding: 0 0 0 32px; }
.timeline-placeholder { padding: 24px 32px 0; }
.timeline-visual { background: var(--surface); border-radius: 14px; padding: 20px; border: 1px solid var(--border-mid); }
.t-tool-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 9px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 12px; border-radius: 50px; margin-bottom: 14px; }
.t-tool-badge.nutrition { background: rgba(57,186,118,0.10); color: #2a9148; border: 1px solid rgba(57,186,118,0.22); }
.t-tool-badge.body { background: rgba(57,140,186,0.10); color: #2b6e93; border: 1px solid rgba(57,140,186,0.22); }
.t-tool-badge.mind { background: rgba(232,184,75,0.10); color: #927010; border: 1px solid rgba(232,184,75,0.22); }
.t-tool-badge.green { background: rgba(46,168,74,0.08); color: var(--green-dark); border: 1px solid rgba(46,168,74,0.20); }
.timeline-content h3 { font-family: var(--font-display); font-size: clamp(28px, 3vw, 40px); line-height: 1; letter-spacing: 0.02em; color: var(--ink); margin-bottom: 14px; }
.timeline-content p { font-size: 15px; color: var(--muted-2); line-height: 1.8; font-weight: 300; }
.timeline-content p strong { color: var(--ink); font-weight: 600; }
.t-insight-card { background: #0d1210; border-radius: 10px; padding: 14px; }
.t-insight-label { font-size: 8px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.30); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.t-insight-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green-accent); animation: livePulse 2s infinite; flex-shrink: 0; }
.t-insight-text { font-size: 10px; color: rgba(255,255,255,0.60); line-height: 1.65; }
.t-insight-text strong { color: var(--green-accent); font-weight: 700; }
.t-score-row { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); }
.t-score-label { font-size: 8px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: rgba(255,255,255,0.28); }
.t-score-num { font-family: var(--font-display); font-size: 24px; color: var(--green-accent); line-height: 1; }
.t-wearable-row { display: flex; flex-wrap: wrap; gap: 8px; }
.t-metric-pill { display: flex; flex-direction: column; align-items: center; background: var(--white); border: 1px solid var(--border-mid); border-radius: 10px; padding: 10px 14px; min-width: 64px; }
.t-metric-val { font-family: var(--font-display); font-size: 22px; color: var(--ink); line-height: 1; }
.t-metric-label { font-size: 8px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: var(--muted); margin-top: 3px; }
.t-metric-pill.good .t-metric-val { color: var(--nutrition); }
.t-metric-pill.warn .t-metric-val { color: var(--mind); }
.t-chat-row { display: flex; flex-direction: column; gap: 7px; }
.t-chat-bubble { font-size: 10px; line-height: 1.55; padding: 8px 12px; border-radius: 10px; max-width: 90%; }
.t-chat-bubble.user { align-self: flex-end; background: var(--surface); color: var(--muted-2); font-style: italic; }
.t-chat-bubble.coach { align-self: flex-start; background: rgba(46,168,74,0.08); color: var(--ink); border: 1px solid rgba(46,168,74,0.15); }
.t-chat-coach-label { font-size: 7px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--green); margin-bottom: 3px; }
.t-meal-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 7px 0; border-bottom: 1px solid var(--border); }
.t-meal-row:last-child { border-bottom: none; }
.t-meal-name { font-size: 11px; font-weight: 600; color: var(--ink); }
.t-meal-macros { font-size: 9px; color: var(--muted); }
.t-meal-score { font-size: 9px; font-weight: 700; color: var(--nutrition); background: rgba(57,186,118,0.08); padding: 2px 7px; border-radius: 4px; }
.t-reflection-row { display: flex; flex-direction: column; gap: 8px; }
.t-reflect-item { display: flex; align-items: center; gap: 10px; }
.t-reflect-label { font-size: 9px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); width: 52px; flex-shrink: 0; }
.t-reflect-bar { flex: 1; height: 5px; background: var(--border); border-radius: 3px; overflow: hidden; }
.t-reflect-fill { height: 100%; border-radius: 3px; }
.t-reflect-val { font-size: 10px; font-weight: 700; width: 20px; text-align: right; }

/* ── NEXT DAY BANNER ── */
.section-next-day { padding: 80px 0; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.next-day-inner { text-align: center; }
.next-day-inner h3 { font-family: var(--font-display); font-size: clamp(36px, 5vw, 60px); line-height: 1; color: var(--ink); margin-bottom: 16px; }
.next-day-inner h3 em { font-style: normal; color: var(--green); }
.next-day-inner > p { font-size: 18px; color: var(--muted-2); max-width: 520px; margin: 0 auto 40px; line-height: 1.75; font-weight: 300; }
.next-day-loop { display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: wrap; }
.loop-step { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; padding: 0 24px; }
.loop-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
.loop-icon svg { width: 24px; height: 24px; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.loop-step-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink); }
.loop-step-sub { font-size: 12px; color: var(--muted); max-width: 100px; line-height: 1.4; }
.loop-arrow { color: var(--border-mid); font-size: 20px; padding: 0 4px; margin-top: -24px; }

/* ── THE LOOP SECTION ── */
.section-loop { padding: var(--section-pad) 0; background: var(--ink); position: relative; overflow: hidden; }
.section-loop::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 40%, rgba(46,168,74,0.05) 0%, transparent 55%); }
.loop-header { text-align: center; margin-bottom: 80px; position: relative; }
.loop-header h2 { font-family: var(--font-display); font-size: clamp(44px, 5.5vw, 68px); line-height: 0.95; color: var(--white); margin-bottom: 20px; }
.loop-header h2 em { font-style: normal; color: var(--green-accent); }
.loop-header > p { font-size: 17px; color: rgba(255,255,255,0.45); max-width: 540px; margin: 0 auto; line-height: 1.75; }
.loop-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; position: relative; }
.loop-step-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10); border-radius: 16px; padding: 36px 28px; transition: all 0.35s; }
.loop-step-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.18); transform: translateY(-4px); }
.loop-step-num { font-family: var(--font-display); font-size: 64px; line-height: 0.8; color: rgba(255,255,255,0.05); margin-bottom: 16px; letter-spacing: 0.02em; }
.loop-step-card h4 { font-family: var(--font-display); font-size: 28px; color: var(--white); letter-spacing: 0.02em; margin-bottom: 12px; line-height: 1; }
.loop-step-card p { font-size: 14px; color: rgba(255,255,255,0.50); line-height: 1.75; font-weight: 300; }
.loop-step-card .step-tag { display: inline-flex; margin-bottom: 16px; font-size: 9px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 12px; border-radius: 50px; }
.step-tag.daily { background: rgba(57,186,118,0.12); color: var(--nutrition); border: 1px solid rgba(57,186,118,0.22); }
.step-tag.weekly { background: rgba(57,140,186,0.12); color: #6ab8d8; border: 1px solid rgba(57,140,186,0.22); }
.step-tag.always { background: rgba(232,184,75,0.12); color: #e8c87b; border: 1px solid rgba(232,184,75,0.22); }
.loop-connecting { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 60px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.06); position: relative; }
.loop-connecting p { font-size: 15px; color: rgba(255,255,255,0.35); text-align: center; max-width: 560px; line-height: 1.75; }
.loop-connecting strong { color: rgba(255,255,255,0.65); font-weight: 600; }

/* ── WEARABLES ── */
.section-wearables { background: var(--surface); padding: 40px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.wearables-inner { display: flex; align-items: center; flex-wrap: wrap; gap: 20px; justify-content: center; }
.wearable-label { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
.wearable-tag { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-2); padding: 8px 18px; border: 1.5px solid var(--border-mid); border-radius: 50px; background: var(--white); }
.wearable-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
.wearable-tag-muted { color: var(--muted); border-style: dashed; }

/* ── SETUP STEPS ── */
.section-setup { padding: var(--section-pad) 0; background: var(--white); }
.setup-header { text-align: center; margin-bottom: 72px; }
.setup-header h2 { font-family: var(--font-display); font-size: clamp(44px, 5.5vw, 68px); line-height: 0.95; color: var(--ink); margin-bottom: 16px; }
.setup-header h2 em { font-style: normal; color: var(--green); }
.setup-header > p { font-size: 17px; color: var(--muted-2); max-width: 460px; margin: 0 auto; line-height: 1.75; font-weight: 300; }
.setup-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.setup-step { display: flex; flex-direction: column; gap: 16px; }
.setup-step-num { font-family: var(--font-display); font-size: 48px; line-height: 1; color: var(--border-mid); letter-spacing: 0.02em; }
.setup-step h4 { font-size: 16px; font-weight: 700; color: var(--ink); line-height: 1.3; }
.setup-step p { font-size: 14px; color: var(--muted-2); line-height: 1.7; font-weight: 300; }
.setup-step-time { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: var(--green); letter-spacing: 0.06em; margin-top: 4px; }

/* ── FINAL CTA ── */
.section-cta { padding: var(--section-pad) 0; background: var(--ink); position: relative; overflow: hidden; }
.section-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(46,168,74,0.05) 0%, transparent 60%); }
.cta-inner { text-align: center; position: relative; max-width: 640px; margin: 0 auto; }
.cta-inner h2 { font-family: var(--font-display); font-size: clamp(52px, 7vw, 88px); line-height: 0.92; color: var(--white); margin-bottom: 24px; }
.cta-inner h2 span { color: var(--green-accent); }
.cta-inner > p { font-size: 18px; color: rgba(255,255,255,0.5); line-height: 1.75; margin-bottom: 44px; font-weight: 300; }
.cta-actions { display: flex; flex-direction: column; align-items: center; gap: 18px; }
.cta-note { font-size: 12px; color: rgba(255,255,255,0.28); letter-spacing: 0.06em; }

/* ── FOOTER ── */
footer { background: var(--black); padding: 60px 0 0; }
.footer-inner { max-width: var(--content-max); margin: 0 auto; padding: 0 var(--gutter); display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
.footer-logo img { height: 40px; width: auto; margin-bottom: 14px; filter: brightness(0) invert(1); }
.footer-brand p { font-size: 13px; color: rgba(255,255,255,0.35); line-height: 1.65; max-width: 280px; }
.footer-col ul { list-style: none; }
.footer-col ul li { margin-bottom: 12px; }
.footer-col ul li a { font-size: 13px; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; font-weight: 500; }
.footer-col ul li a:hover { color: rgba(255,255,255,0.80); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); margin-top: 48px; padding: 20px var(--gutter); max-width: var(--content-max); margin-left: auto; margin-right: auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.footer-copy { font-size: 12px; color: rgba(255,255,255,0.22); letter-spacing: 0.04em; }

/* ── MOBILE CTA ── */
.mobile-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; padding: 14px var(--gutter); background: rgba(255,255,255,0.96); backdrop-filter: blur(12px); border-top: 1px solid var(--border); z-index: 180; transition: transform 0.35s; transform: translateY(100%); }
.mobile-cta.show { transform: translateY(0); }
.mobile-cta .btn { width: 100%; justify-content: center; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .nav-links { display: none; }
  .nav-hamburger { display: block; }
  .timeline::before { left: 28px; }
  .timeline-item { grid-template-columns: 56px 1fr; }
  .timeline-item.right .timeline-content,
  .timeline-item.left .timeline-content { grid-column: 2; grid-row: 1; text-align: left; padding: 0 0 0 20px; }
  .timeline-item.right .timeline-spacer,
  .timeline-item.left .timeline-spacer { grid-column: 1; grid-row: 1; }
  .timeline-item.right .timeline-placeholder,
  .timeline-item.left .timeline-placeholder { display: none; }
  .loop-steps { grid-template-columns: 1fr; }
  .setup-steps { grid-template-columns: 1fr 1fr; }
  .mobile-cta { display: block; }
  .footer-inner { grid-template-columns: 1fr 1fr; }
  .next-day-loop { gap: 0; }
}
@media (max-width: 640px) {
  .setup-steps { grid-template-columns: 1fr; }
  .footer-inner { grid-template-columns: 1fr; }
  .next-day-loop { flex-direction: column; gap: 16px; }
  .loop-arrow { transform: rotate(90deg); margin-top: 0; }
}
</style>
</head>
<body>

<!-- MAIN NAV -->
<nav id="mainNav">
  <a href="/" class="nav-logo">
    <img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef">
  </a>
  <ul class="nav-links">
    <li><a href="/features">Features</a></li>
    <li><a href="/how-it-works" class="active-page">How It Works</a></li>
    <li><a href="/why-tlc">Why TLC</a></li>
    <li><a href="/pricing">Pricing</a></li>
    <li><a href="#" class="nav-login" onclick="openLoginModal();return false;">Log in</a></li>
    <li><a href="/start" class="nav-cta">Start Free</a></li>
  </ul>
  <button class="nav-hamburger" onclick="toggleMobileNav()" aria-label="Menu">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
</nav>

<!-- MOBILE NAV -->
<div class="mobile-nav" id="mobileNav">
  <button class="mobile-nav-close" onclick="toggleMobileNav()" aria-label="Close">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <a href="/" onclick="toggleMobileNav()">Home</a>
  <a href="/features" onclick="toggleMobileNav()">Features</a>
  <a href="/how-it-works" onclick="toggleMobileNav()">How It Works</a>
  <a href="/why-tlc" onclick="toggleMobileNav()">Why TLC</a>
  <a href="/pricing" onclick="toggleMobileNav()">Pricing</a>
  <a href="#" onclick="toggleMobileNav();openLoginModal();return false;">Log in</a>
  <a href="/start" class="btn btn-green">Start Free</a>
</div>

<!-- PAGE HERO -->
<section class="page-hero">
  <div class="container" style="position:relative;">
    <div class="page-hero-eyebrow"><span class="label" style="color:var(--green-accent);">The TLC Day</span></div>
    <h1>YOUR DAY.<br><em>QUIETLY</em><br>WORKING.</h1>
    <p class="page-hero-sub">You live your life. TLC joins the dots.</p>
    <p class="page-hero-body">TLC does not need your constant attention. It runs in the background of a normal day, connecting data you already have, and delivers one clear, actionable insight every evening. Here is what that looks like from morning to night.</p>
  </div>
</section>

<!-- 24-HOUR TIMELINE -->
<section class="section-timeline">
  <div class="container">
    <div class="timeline-header reveal">
      <span class="label" style="justify-content:center;margin-bottom:20px;display:inline-flex;">A day in your life with TLC</span>
      <h2>FROM WAKE-UP<br>TO <em>INSIGHT</em></h2>
      <p>Five moments. One connected picture. This is what makes TLC different from every other health platform you have tried.</p>
    </div>

    <div class="timeline">

      <!-- 07:30 Wearable Sync -->
      <div class="timeline-item right reveal">
        <div class="timeline-spacer">
          <div class="timeline-node active"></div>
          <span class="timeline-time-chip">07:30</span>
        </div>
        <div class="timeline-content">
          <div class="t-tool-badge body">Body Pillar</div>
          <h3>YOUR BODY<br>REPORTS IN</h3>
          <p>Your wearable synced while you slept. <strong>HRV, sleep stages, resting heart rate, and recovery score</strong> are already in TLC before you open your eyes. No manual entry. No guessing. Your body's overnight story is already written.</p>
          <p style="margin-top:12px;">TLC reads it and quietly adjusts today's recommendations. Low HRV this morning? Your calorie targets and food suggestions shift toward recovery. High strain overnight? Your coach already knows before you ask.</p>
        </div>
        <div class="timeline-placeholder">
          <div class="timeline-visual">
            <div class="t-wearable-row">
              <div class="t-metric-pill good">
                <span class="t-metric-val">61</span>
                <span class="t-metric-label">HRV ms</span>
              </div>
              <div class="t-metric-pill">
                <span class="t-metric-val">7.4h</span>
                <span class="t-metric-label">Sleep</span>
              </div>
              <div class="t-metric-pill good">
                <span class="t-metric-val">84%</span>
                <span class="t-metric-label">Recovery</span>
              </div>
              <div class="t-metric-pill warn">
                <span class="t-metric-val">58</span>
                <span class="t-metric-label">RHR bpm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 12:30 Meal Matchmaker -->
      <div class="timeline-item left reveal d1">
        <div class="timeline-content">
          <div class="t-tool-badge nutrition">Nutrition Pillar</div>
          <h3>LUNCH.<br>ANYWHERE.</h3>
          <p>You are out. New restaurant. Menu you have never seen. You open Meal Matchmaker. TLC already knows your macros for today, your active goal, your allergies, and the calories you have left. It browses the actual menu and finds the dish that fits.</p>
          <p style="margin-top:12px;">Not a suggestion. A specific dish, from a real menu, with your actual macro targets checked. Every meal an informed decision, wherever you are. <strong>Meal logged automatically.</strong></p>
        </div>
        <div class="timeline-spacer">
          <div class="timeline-node"></div>
          <span class="timeline-time-chip">12:30</span>
        </div>
        <div class="timeline-placeholder">
          <div class="timeline-visual">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
              <span style="font-size:11px;font-weight:700;color:var(--ink);">Sushi Yoshi</span>
              <span style="font-size:10px;font-weight:800;color:var(--green);background:rgba(46,168,74,0.10);border:1px solid rgba(46,168,74,0.22);border-radius:50px;padding:3px 10px;">94% Match</span>
            </div>
            <div style="font-size:12px;font-weight:700;color:var(--ink);margin-bottom:4px;">Salmon Avocado Bowl</div>
            <div style="font-size:9px;color:var(--muted);margin-bottom:10px;">680 kcal &bull; 44g protein &bull; Omega-3 rich</div>
            <div style="font-size:9px;font-style:italic;color:var(--green-dark);background:var(--green-light);padding:8px 10px;border-radius:6px;border:1px solid rgba(46,168,74,0.15);">"Calorie distance: 12 kcal. Anti-inflammatory profile matches your goal."</div>
          </div>
        </div>
      </div>

      <!-- 17:00 Longevity Coach -->
      <div class="timeline-item right reveal d2">
        <div class="timeline-spacer">
          <div class="timeline-node"></div>
          <span class="timeline-time-chip">17:00</span>
        </div>
        <div class="timeline-content">
          <div class="t-tool-badge body">Coach</div>
          <h3>ASK ANYTHING.<br>IT ALREADY KNOWS.</h3>
          <p>You want to know if today's food choices will affect tomorrow's workout. Your coach already has today's meals, this morning's biometrics, your active goals, and the last seven insights. It answers from your actual data. Not a generic guideline.</p>
          <p style="margin-top:12px;"><strong>No context to give. No history to repeat.</strong> Ask, get a specific answer, done. Then get on with your evening.</p>
        </div>
        <div class="timeline-placeholder">
          <div class="timeline-visual">
            <div class="t-chat-row">
              <div class="t-chat-bubble user">"Will today's meals support my workout tomorrow?"</div>
              <div class="t-chat-bubble coach">
                <div class="t-chat-coach-label">TLC Coach</div>
                Yes. Your protein is at 141g against your 155g target, and the salmon bowl gave you a strong omega-3 base. Add a small protein snack before bed and you'll hit tomorrow's recovery targets.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 20:00 Evening Reflection -->
      <div class="timeline-item left reveal d1">
        <div class="timeline-content">
          <div class="t-tool-badge mind">Mind Pillar</div>
          <h3>60 SECONDS.<br>THAT CLOSE THE LOOP.</h3>
          <p>TLC sends a gentle reminder at your preferred time. You rate your mood, energy, focus, and stress. <strong>60 seconds.</strong> That is all. This is the data point that closes the triangle: nutrition plus body plus mind. The one that turns numbers into patterns.</p>
          <p style="margin-top:12px;">Without it, TLC has two of the three pillars. With it, TLC can spot the connections that change everything. "Every time your omega-3 intake was above target, your evening energy was 7.8 or higher." That insight only exists because you took 60 seconds.</p>
        </div>
        <div class="timeline-spacer">
          <div class="timeline-node"></div>
          <span class="timeline-time-chip">20:00</span>
        </div>
        <div class="timeline-placeholder">
          <div class="timeline-visual">
            <div style="font-size:8px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted);margin-bottom:12px;">Tonight's Reflection</div>
            <div class="t-reflection-row">
              <div class="t-reflect-item">
                <span class="t-reflect-label" style="color:var(--mind);">Mood</span>
                <div class="t-reflect-bar"><div class="t-reflect-fill" style="width:78%;background:var(--mind);"></div></div>
                <span class="t-reflect-val" style="color:var(--mind);">7.8</span>
              </div>
              <div class="t-reflect-item">
                <span class="t-reflect-label" style="color:var(--body-blue);">Energy</span>
                <div class="t-reflect-bar"><div class="t-reflect-fill" style="width:82%;background:var(--body-blue);"></div></div>
                <span class="t-reflect-val" style="color:var(--body-blue);">8.2</span>
              </div>
              <div class="t-reflect-item">
                <span class="t-reflect-label" style="color:var(--nutrition);">Focus</span>
                <div class="t-reflect-bar"><div class="t-reflect-fill" style="width:71%;background:var(--nutrition);"></div></div>
                <span class="t-reflect-val" style="color:var(--nutrition);">7.1</span>
              </div>
              <div class="t-reflect-item">
                <span class="t-reflect-label" style="color:var(--muted);">Stress</span>
                <div class="t-reflect-bar"><div class="t-reflect-fill" style="width:35%;background:var(--muted);"></div></div>
                <span class="t-reflect-val" style="color:var(--muted);">3.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 20:15 Dynamic Insight -->
      <div class="timeline-item right reveal d2">
        <div class="timeline-spacer">
          <div class="timeline-node active"></div>
          <span class="timeline-time-chip">20:15</span>
        </div>
        <div class="timeline-content">
          <div class="t-tool-badge green">Dynamic Insight</div>
          <h3>THE DOTS.<br>CONNECTED.</h3>
          <p>Your evening insight arrives. Not a summary of your numbers. A <strong>specific connection TLC found in the intersection of all three pillars</strong> today. The kind of pattern that takes years to notice on your own, delivered as one actionable observation you can act on tomorrow.</p>
          <p style="margin-top:12px;">Your Longevity Score updates. Your weekly strategy, delivered every Sunday, uses seven of these daily insights to build the plan for the week ahead.</p>
        </div>
        <div class="timeline-placeholder">
          <div class="t-insight-card">
            <div class="t-insight-label"><span class="t-insight-dot"></span>Dynamic Insight &bull; Tonight</div>
            <div class="t-insight-text">Your omega-3 intake was <strong>31% above target</strong> today. On every day this pattern holds, your evening energy scores a <strong>7.8 or higher</strong>. That correlation has appeared consistently across 4 weeks. Keep the salmon streak going.</div>
            <div class="t-score-row">
              <span class="t-score-label">Longevity Score</span>
              <span class="t-score-num">741</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- NEXT DAY — THE COMPOUNDING EFFECT -->
<section class="section-next-day">
  <div class="container">
    <div class="next-day-inner reveal">
      <span class="label" style="justify-content:center;margin-bottom:20px;display:inline-flex;">The Compounding Effect</span>
      <h3>TOMORROW IS<br><em>SMARTER THAN TODAY</em></h3>
      <p>Every day, TLC adds another layer. After 7 days, it knows your weekly patterns. After 30 days, it has seen your individual biology across dozens of variables. The insights do not repeat. They build.</p>
      <div class="next-day-loop">
        <div class="loop-step">
          <div class="loop-icon" style="background:rgba(57,186,118,0.10);">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--nutrition)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
          </div>
          <span class="loop-step-label">Eat</span>
          <span class="loop-step-sub">Meals logged</span>
        </div>
        <span class="loop-arrow">&rarr;</span>
        <div class="loop-step">
          <div class="loop-icon" style="background:rgba(57,140,186,0.10);">
            <svg viewBox="0 0 24 24" stroke="var(--body-blue)"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <span class="loop-step-label">Move</span>
          <span class="loop-step-sub">Wearable syncs</span>
        </div>
        <span class="loop-arrow">&rarr;</span>
        <div class="loop-step">
          <div class="loop-icon" style="background:rgba(232,184,75,0.10);">
            <svg viewBox="0 0 24 24" stroke="var(--mind)"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
          </div>
          <span class="loop-step-label">Reflect</span>
          <span class="loop-step-sub">60-second check-in</span>
        </div>
        <span class="loop-arrow">&rarr;</span>
        <div class="loop-step">
          <div class="loop-icon" style="background:rgba(46,168,74,0.10);">
            <svg viewBox="0 0 24 24" stroke="var(--green)"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </div>
          <span class="loop-step-label">Insight</span>
          <span class="loop-step-sub">8pm connection</span>
        </div>
        <span class="loop-arrow">&rarr;</span>
        <div class="loop-step">
          <div class="loop-icon" style="background:rgba(46,168,74,0.10);">
            <svg viewBox="0 0 24 24" stroke="var(--green)"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <span class="loop-step-label">Adapt</span>
          <span class="loop-step-sub">Next day sharper</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- THE TLC LOOP -->
<section class="section-loop">
  <div class="container">
    <div class="loop-header reveal">
      <span class="label" style="justify-content:center;margin-bottom:20px;display:inline-flex;color:var(--green-accent);">The Bigger Picture</span>
      <h2>DAILY BUILDS<br>INTO <em>WEEKLY.</em><br>WEEKLY BUILDS<br>INTO <em>MASTERY.</em></h2>
      <p>The daily loop is just the start. Every seven days, TLC goes deeper. Every week compounds into the next.</p>
    </div>
    <div class="loop-steps">
      <div class="loop-step-card reveal d1">
        <div class="loop-step-num">01</div>
        <span class="step-tag daily">Every day</span>
        <h4>DAILY INSIGHT</h4>
        <p>Your meals, biometrics, and evening reflection connect into one specific observation. A pattern. A number that changed because of something you did. Something you can act on tomorrow. Every night, without fail.</p>
      </div>
      <div class="loop-step-card reveal d2">
        <div class="loop-step-num">02</div>
        <span class="step-tag weekly">Every week</span>
        <h4>WEEKLY DEEP-DIVE</h4>
        <p>Seven days of data analysed together. Patterns across meals, sleep, biometrics, and mood. Your Longevity Score calculated. Your weekly strategy generated for the seven days ahead. Specific. Personal. Built on what actually happened.</p>
      </div>
      <div class="loop-step-card reveal d3">
        <div class="loop-step-num">03</div>
        <span class="step-tag always">Always on</span>
        <h4>LONGEVITY COACH</h4>
        <p>Between insights, your coach is there. Every conversation loaded with full context. Every answer specific to your data. The longer you use TLC, the richer the context, the more precise the guidance. It never forgets what it has learned about you.</p>
      </div>
    </div>
    <div class="loop-connecting reveal d4">
      <p>After 30 days, TLC has seen your unique biology across hundreds of variables. After 90 days, the patterns are undeniable. <strong>This is how lasting change happens</strong>, not from willpower or rigid plans, but from understanding the system that is already running inside you.</p>
    </div>
  </div>
</section>

<!-- WEARABLES -->
<section class="section-wearables">
  <div class="container">
    <div class="wearables-inner">
      <span class="wearable-label">Works with:</span>
      <span class="wearable-tag"><span class="wearable-dot"></span>WHOOP</span>
      <span class="wearable-tag"><span class="wearable-dot"></span>OURA</span>
      <span class="wearable-tag"><span class="wearable-dot"></span>FITBIT</span>
      <span class="wearable-tag"><span class="wearable-dot"></span>GARMIN</span>
      <span class="wearable-tag"><span class="wearable-dot"></span>ULTRAHUMAN</span>
      <span class="wearable-tag wearable-tag-muted">+ 20 more. Or no wearable at all.</span>
    </div>
  </div>
</section>

<!-- SETUP IN 5 MINUTES -->
<section class="section-setup">
  <div class="container">
    <div class="setup-header reveal">
      <span class="label" style="justify-content:center;margin-bottom:20px;display:inline-flex;">Getting started</span>
      <h2>RUNNING IN<br><em>5 MINUTES</em></h2>
      <p>Four steps. No technical setup. No configuration. Your first insight lands tonight.</p>
    </div>
    <div class="setup-steps">
      <div class="setup-step reveal d1">
        <div class="setup-step-num">01</div>
        <h4>Take the assessment</h4>
        <p>13 questions about your goals, body, dietary needs, and lifestyle. This is how TLC learns who you are before it generates a single insight.</p>
        <span class="setup-step-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          5 minutes
        </span>
      </div>
      <div class="setup-step reveal d2">
        <div class="setup-step-num">02</div>
        <h4>Connect your wearable</h4>
        <p>25+ devices supported including Fitbit, Garmin, Oura, and Whoop. No wearable? Enter your baseline manually. TLC works either way.</p>
        <span class="setup-step-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          2 minutes
        </span>
      </div>
      <div class="setup-step reveal d3">
        <div class="setup-step-num">03</div>
        <h4>Get your blueprint</h4>
        <p>Your personal longevity blueprint generates immediately. Calorie and macro targets tailored to your body and goal. Your first strategy for the week ahead.</p>
        <span class="setup-step-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Instant
        </span>
      </div>
      <div class="setup-step reveal d4">
        <div class="setup-step-num">04</div>
        <h4>Live your day</h4>
        <p>Use Meal Matchmaker when you eat out. Take 60 seconds for your reflection tonight. Your first Dynamic Insight lands at 8pm. The loop starts.</p>
        <span class="setup-step-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Day one
        </span>
      </div>
    </div>
  </div>
</section>

<!-- SOCIAL PROOF QUOTE -->
<section style="padding:clamp(80px,10vw,120px) 0;background:var(--surface);border-top:1px solid var(--border);position:relative;z-index:2;">
  <div class="container">
    <div style="max-width:720px;margin:0 auto;text-align:center;" class="reveal">
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none" style="margin-bottom:24px;opacity:0.18;"><path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 2.4C11.2 3.2 8.8 5.6 8 9.6H14.4V24H0zm17.6 0V14.4C17.6 6.4 22.4 1.6 32 0l1.6 2.4C28.8 3.2 26.4 5.6 25.6 9.6H32V24H17.6z" fill="var(--ink)"/></svg>
      <p style="font-family:var(--font-display);font-size:clamp(24px,3vw,40px);line-height:1.1;letter-spacing:0.02em;color:var(--ink);margin-bottom:20px;">TLC does not tell you what to eat. It shows you what your body is already trying to tell you.</p>
      <div style="display:flex;align-items:center;justify-content:center;gap:12px;">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:white;">M</div>
        <div style="text-align:left;">
          <div style="font-size:13px;font-weight:700;color:var(--ink);">Marcus T.</div>
          <div style="font-size:11px;color:var(--muted);">WHOOP 4.0 &bull; Muscle gain goal</div>
        </div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:64px;text-align:center;" class="reveal d1">
      <div>
        <div style="font-family:var(--font-display);font-size:clamp(36px,4vw,56px);color:var(--green);line-height:1;">7</div>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted);margin-top:4px;">Days to first pattern</div>
        <div style="font-size:13px;color:var(--muted-2);margin-top:6px;">Most members notice a connection they had never seen before within their first week.</div>
      </div>
      <div>
        <div style="font-family:var(--font-display);font-size:clamp(36px,4vw,56px);color:var(--green);line-height:1;">5<span style="font-size:0.5em;">min</span></div>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted);margin-top:4px;">To get started</div>
        <div style="font-size:13px;color:var(--muted-2);margin-top:6px;">Assessment, wearable connection, and personal blueprint. No lengthy setup, no waiting period.</div>
      </div>
      <div>
        <div style="font-family:var(--font-display);font-size:clamp(36px,4vw,56px);color:var(--green);line-height:1;">52</div>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted);margin-top:4px;">Strategies a year</div>
        <div style="font-size:13px;color:var(--muted-2);margin-top:6px;">A new game plan every week, built from what actually happened the week before. Not a template.</div>
      </div>
    </div>
    <div style="text-align:center;margin-top:40px;" class="reveal d2">
      <a href="/pricing" style="font-size:13px;font-weight:700;color:var(--green);text-decoration:none;letter-spacing:0.04em;border-bottom:1.5px solid rgba(46,168,74,0.25);padding-bottom:2px;">See all plans and pricing &rarr;</a>
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="section-cta">
  <div class="container">
    <div class="cta-inner">
      <span class="label" style="justify-content:center;margin-bottom:28px;display:inline-flex;color:var(--green-accent);">Start Tonight</span>
      <h2 class="reveal">YOUR FIRST<br><span>INSIGHT</span><br>TONIGHT.</h2>
      <p class="reveal d1">Five minutes to set up. Your personal longevity blueprint generated immediately. Your first Dynamic Insight delivered tonight. Start free with Meal Matchmaker, no card required.</p>
      <div class="cta-actions reveal d2">
        <a href="/start" class="btn btn-green" style="font-size:13px;padding:18px 52px;">Take the Free Assessment</a>
        <a href="/features" class="btn btn-outline-white" style="font-size:12px;padding:17px 36px;">Explore all features</a>
        <span class="cta-note">Cancel anytime &nbsp;&middot;&nbsp; No lock-in &nbsp;&middot;&nbsp; No fees</span>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="footer-logo"><img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef"></div>
      <p>Connecting the dots between nutrition, body, and mind. Eat smarter, feel better, live longer.</p>
    </div>
    <div class="footer-col"><ul>
      <li><a href="/features">Features</a></li>
      <li><a href="/how-it-works">How It Works</a></li>
      <li><a href="/why-tlc">Why TLC</a></li>
      <li><a href="/pricing">Pricing</a></li>
    </ul></div>
    <div class="footer-col"><ul>
      <li><a href="https://www.instagram.com/thelongevitychef_">Instagram</a></li>
      <li><a href="https://docs.google.com/document/d/1ZXE0c5gG4ep34tESNVOQF0SWg7lPpPb4KaQ7fkIcPFg/edit?usp=sharing">FAQs</a></li>
      <li><a href="https://tally.so/r/D4k8eZ">Contact</a></li>
    </ul></div>
    <div class="footer-col"><ul>
      <li><a href="/privacy">Privacy Policy</a></li>
      <li><a href="/terms">Terms &amp; Conditions</a></li>
    </ul></div>
  </div>
  <div class="footer-bottom">
    <span class="footer-copy">&copy; 2026 The Longevity Chef. All rights reserved.</span>
    <span class="footer-copy">Food for Life</span>
  </div>
</footer>

<div class="mobile-cta" id="mobileCta"><a href="/start" class="btn btn-green">Start Free</a></div>

<!-- LOGIN MODAL -->
<div class="login-overlay" id="loginOverlay" onclick="handleOverlayClick(event)">
  <div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
    <button class="login-modal-close" onclick="closeLoginModal()" aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div id="loginForm">
      <h3 id="loginTitle">Welcome back</h3>
      <p>Enter your email and we will send you a login link. No password needed.</p>
      <div class="login-modal-error" id="loginError"></div>
      <input type="email" id="loginEmail" placeholder="your@email.com" autocomplete="email" onkeydown="if(event.key==='Enter')submitMagicLink()" />
      <button class="btn-login-submit" id="loginSubmitBtn" onclick="submitMagicLink()">Send login link</button>
    </div>
    <div class="login-modal-success" id="loginSuccess">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <h4>Check your inbox</h4>
      <p>A login link is on its way. It expires in 15 minutes.</p>
    </div>
  </div>
</div>

<script>
// ── Nav scroll ──
const mainNav = document.getElementById('mainNav');
const mobileCta = document.getElementById('mobileCta');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  mainNav.classList.toggle('scrolled', sy > 50);
  if (mobileCta) mobileCta.classList.toggle('show', sy > 400);
});

// ── Reveal ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.reveal, .reveal-scale').forEach(el => revealObs.observe(el));

// ── Mobile nav ──
function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
  document.body.style.overflow = document.getElementById('mobileNav').classList.contains('open') ? 'hidden' : '';
}

// ── Login modal ──
function openLoginModal() { document.getElementById('loginOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeLoginModal() { document.getElementById('loginOverlay').classList.remove('open'); document.body.style.overflow = ''; }
function handleOverlayClick(e) { if (e.target === e.currentTarget) closeLoginModal(); }
async function submitMagicLink() {
  const email = document.getElementById('loginEmail').value.trim();
  const btn = document.getElementById('loginSubmitBtn');
  const errEl = document.getElementById('loginError');
  if (!email || !email.includes('@')) { errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; return; }
  errEl.style.display = 'none';
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const res = await fetch('https://tlc-engine.chris-ec5.workers.dev/api/magic-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    if (res.ok) { document.getElementById('loginForm').style.display = 'none'; document.getElementById('loginSuccess').style.display = 'block'; }
    else { errEl.textContent = 'Something went wrong. Please try again.'; errEl.style.display = 'block'; btn.disabled = false; btn.textContent = 'Send login link'; }
  } catch { errEl.textContent = 'Something went wrong. Please try again.'; errEl.style.display = 'block'; btn.disabled = false; btn.textContent = 'Send login link'; }
}
(function() {
  const params = new URLSearchParams(window.location.search);
  const s = params.get('login');
  if (s === 'expired' || s === 'invalid') {
    openLoginModal();
    const e = document.getElementById('loginError');
    e.textContent = s === 'expired' ? 'That login link has expired. Please request a new one.' : 'That login link is not valid. Please request a new one.';
    e.style.display = 'block';
  }
})();
</script>
</body>
</html>
`;
// HOW_IT_WORKS_HTML_END

// WHY_TLC_HTML_START
const WHY_TLC_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Why TLC | The Longevity Chef</title>
<meta name="description" content="The dots were always there. Nobody was connecting them. That is the problem TLC was built to solve. Three pillars. One picture. One system that gets sharper every day.">
<meta property="og:title" content="Why TLC | The Longevity Chef">
<meta property="og:description" content="Calorie trackers show you numbers. TLC shows you what those numbers mean. Three pillars connected: nutrition, body, and mind.">
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

@keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes livePulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

.container { max-width: var(--content-max); margin: 0 auto; padding: 0 var(--gutter); }
.label { display: inline-flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--green); }
.label::before { content: ''; width: 18px; height: 1.5px; background: var(--green); }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-family: var(--font-body); font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; border: none; cursor: pointer; border-radius: 2px; transition: all 0.25s; white-space: nowrap; }
.btn:hover { transform: translateY(-2px); }
.btn-green { background: var(--green); color: var(--white); padding: 16px 40px; box-shadow: 0 4px 16px rgba(46,168,74,0.2); }
.btn-green:hover { background: var(--green-mid); box-shadow: 0 8px 28px rgba(46,168,74,0.3); }
.btn-outline { background: transparent; color: var(--ink); padding: 15px 38px; border: 1.5px solid var(--border-mid); }
.btn-outline:hover { border-color: var(--ink); }
.btn-outline-white { background: transparent; color: var(--white); padding: 15px 38px; border: 1.5px solid rgba(255,255,255,0.25); }
.btn-outline-white:hover { border-color: rgba(255,255,255,0.6); }

.reveal { opacity: 0; transform: translateY(40px); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-scale { opacity: 0; transform: scale(0.95); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal-scale.visible { opacity: 1; transform: scale(1); }
.d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; } .d3 { transition-delay: 0.3s; } .d4 { transition-delay: 0.4s; }

/* ── NAV ── */
nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 18px var(--gutter); background: rgba(255,255,255,0); border-bottom: 1px solid transparent; transition: all 0.4s; }
nav.scrolled { background: rgba(255,255,255,0.92); backdrop-filter: blur(20px) saturate(1.4); border-bottom-color: var(--border); }
.nav-logo { display: flex; align-items: center; text-decoration: none; }
.nav-logo img { height: 56px; width: auto; display: block; }
.nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
.nav-links a { color: var(--muted-2); text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; transition: color 0.2s; }
.nav-links a:hover, .nav-links a.active-page { color: var(--ink); }
.nav-cta { background: var(--ink); color: var(--white) !important; padding: 10px 24px; border-radius: 2px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.25s; text-decoration: none; }
.nav-cta:hover { background: #333; transform: translateY(-1px); }
.nav-login { color: var(--muted-2) !important; }
.nav-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 4px; color: var(--ink); }
.nav-hamburger svg { width: 24px; height: 24px; display: block; }
.mobile-nav { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); z-index: 199; flex-direction: column; align-items: center; justify-content: center; gap: 32px; }
.mobile-nav.open { display: flex; }
.mobile-nav a { font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink); text-decoration: none; font-family: var(--font-display); }
.mobile-nav a:hover { color: var(--green); }
.mobile-nav-close { position: absolute; top: 20px; right: var(--gutter); background: none; border: none; cursor: pointer; color: var(--muted-2); }
.mobile-nav-close svg { width: 28px; height: 28px; }
.mobile-nav .btn { margin-top: 8px; }

/* ── LOGIN MODAL ── */
.login-overlay { display: none; position: fixed; inset: 0; background: rgba(26,26,26,0.55); backdrop-filter: blur(4px); z-index: 9000; align-items: center; justify-content: center; padding: 24px; }
.login-overlay.open { display: flex; }
.login-modal { background: #fff; border-radius: 16px; padding: 40px 36px; max-width: 420px; width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,0.18); position: relative; }
.login-modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; color: var(--muted-2); padding: 4px; }
.login-modal h3 { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--ink); margin: 0 0 6px; }
.login-modal p { font-size: 14px; color: var(--muted-2); margin: 0 0 24px; line-height: 1.5; }
.login-modal input[type="email"] { width: 100%; border: 1.5px solid var(--border); border-radius: 8px; padding: 13px 16px; font-size: 15px; font-family: 'Figtree', sans-serif; color: var(--ink); outline: none; transition: border-color 0.2s; margin-bottom: 14px; }
.login-modal input[type="email"]:focus { border-color: var(--green); }
.login-modal .btn-login-submit { width: 100%; background: var(--green); color: #fff; border: none; border-radius: 8px; padding: 14px; font-size: 14px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; font-family: 'Figtree', sans-serif; }
.login-modal .btn-login-submit:hover { background: #259940; }
.login-modal .btn-login-submit:disabled { background: var(--muted); cursor: not-allowed; }
.login-modal-success { display: none; text-align: center; padding: 8px 0; }
.login-modal-success h4 { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--ink); margin: 8px 0; }
.login-modal-success p { font-size: 14px; color: var(--muted-2); margin: 0; }
.login-modal-error { display: none; background: #fff3f3; border: 1px solid #fca5a5; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #b91c1c; margin-bottom: 12px; }

/* ── PAGE HERO ── */
.page-hero { padding: clamp(140px, 16vw, 200px) 0 clamp(80px, 10vw, 120px); position: relative; overflow: hidden; background: var(--white); border-bottom: 1px solid var(--border); }
.page-hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.page-hero-eyebrow { margin-bottom: 28px; opacity: 0; animation: fadeUp 0.8s 0.2s forwards; }
.page-hero h1 { font-family: var(--font-display); font-size: clamp(72px, 9vw, 132px); line-height: 0.86; letter-spacing: 0.01em; color: var(--ink); margin-bottom: 32px; opacity: 0; animation: fadeUp 1s 0.35s forwards; }
.page-hero h1 em { font-style: normal; color: var(--green); }
.page-hero-body { font-size: clamp(16px, 1.6vw, 20px); font-weight: 300; color: var(--muted-2); line-height: 1.85; margin-bottom: 40px; opacity: 0; animation: fadeUp 1s 0.55s forwards; }
.page-hero-body strong { color: var(--ink); font-weight: 600; }
.page-hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; opacity: 0; animation: fadeUp 1s 0.7s forwards; }
.page-hero-right { opacity: 0; animation: fadeIn 1.2s 0.8s forwards; }
.hero-manifesto { background: var(--surface); border-radius: 20px; padding: 40px 36px; border: 1.5px solid var(--border-mid); }
.manifesto-line { display: flex; align-items: flex-start; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); }
.manifesto-line:last-child { border-bottom: none; padding-bottom: 0; }
.manifesto-line:first-child { padding-top: 0; }
.manifesto-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
.manifesto-icon svg { width: 18px; height: 18px; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.manifesto-text strong { display: block; font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
.manifesto-text p { font-size: 13px; color: var(--muted-2); line-height: 1.6; }

/* ── THE PROBLEM ── */
.section-problem { padding: var(--section-pad) 0; background: var(--surface); border-top: 1px solid var(--border); }
.problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.problem-left h2 { font-family: var(--font-display); font-size: clamp(40px, 5vw, 64px); line-height: 0.95; color: var(--ink); margin-bottom: 28px; }
.problem-left h2 em { font-style: normal; color: var(--green); }
.problem-left p { font-size: 16px; color: var(--muted-2); line-height: 1.85; margin-bottom: 16px; font-weight: 300; }
.problem-left p strong { color: var(--ink); font-weight: 600; }
.problem-vs { display: flex; flex-direction: column; gap: 16px; }
.vs-row { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; }
.vs-col { background: var(--white); border-radius: 12px; padding: 16px 18px; border: 1.5px solid var(--border-mid); }
.vs-col.theirs { border-color: rgba(239,68,68,0.15); background: rgba(239,68,68,0.02); }
.vs-col.ours { border-color: rgba(46,168,74,0.25); background: rgba(46,168,74,0.03); }
.vs-label { font-size: 8.5px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px; }
.vs-col.theirs .vs-label { color: rgba(239,68,68,0.60); }
.vs-col.ours .vs-label { color: var(--green); }
.vs-text { font-size: 13px; font-weight: 600; color: var(--ink); line-height: 1.4; }
.vs-divider { font-size: 10px; font-weight: 800; letter-spacing: 0.10em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }

/* ── THREE PILLARS (full) ── */
.section-pillars { padding: var(--section-pad) 0; background: var(--white); }
.section-header { text-align: center; margin-bottom: 72px; }
.section-header h2 { font-family: var(--font-display); font-size: clamp(44px, 5.5vw, 72px); line-height: 0.95; letter-spacing: 0.02em; color: var(--ink); margin-bottom: 20px; }
.section-header h2 em { font-style: normal; color: var(--green); }
.section-header > p { font-size: 18px; color: var(--muted-2); max-width: 560px; margin: 0 auto; line-height: 1.75; font-weight: 300; }
.pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; }
.pillar-card { background: var(--white); border: 1.5px solid var(--border-mid); border-radius: 20px; padding: 48px 32px 40px; transition: all 0.4s; position: relative; overflow: hidden; }
.pillar-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; border-radius: 20px 20px 0 0; }
.pillar-card:hover { transform: translateY(-6px); box-shadow: 0 20px 56px rgba(0,0,0,0.08); }
.pillar-card.nutrition { background: linear-gradient(160deg, rgba(57,186,118,0.05) 0%, rgba(255,255,255,0) 50%); }
.pillar-card.body-pillar { background: linear-gradient(160deg, rgba(57,140,186,0.05) 0%, rgba(255,255,255,0) 50%); }
.pillar-card.mind { background: linear-gradient(160deg, rgba(232,184,75,0.05) 0%, rgba(255,255,255,0) 50%); }
.pillar-card.nutrition::before { background: var(--nutrition); }
.pillar-card.body-pillar::before { background: var(--body-blue); }
.pillar-card.mind::before { background: var(--mind); }
.pillar-icon-wrap { width: 72px; height: 72px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
.pillar-card.nutrition .pillar-icon-wrap { background: rgba(57,186,118,0.12); }
.pillar-card.body-pillar .pillar-icon-wrap { background: rgba(57,140,186,0.12); }
.pillar-card.mind .pillar-icon-wrap { background: rgba(232,184,75,0.12); }
.pillar-card h3 { font-size: 24px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
.pillar-hook { font-size: 16px; font-weight: 600; color: var(--ink); margin-bottom: 14px; line-height: 1.4; }
.pillar-card p.pillar-body { font-size: 14.5px; color: var(--muted-2); line-height: 1.75; margin-bottom: 20px; }
.pillar-signals { list-style: none; margin-bottom: 20px; }
.pillar-signals li { font-size: 13.5px; color: var(--ink-2); padding: 6px 0; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); font-weight: 500; }
.pillar-signals li:last-child { border-bottom: none; }
.pillar-signals li::before { content: ''; width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.pillar-card.nutrition .pillar-signals li::before { background: var(--nutrition); }
.pillar-card.body-pillar .pillar-signals li::before { background: var(--body-blue); }
.pillar-card.mind .pillar-signals li::before { background: var(--mind); }
.pillar-data-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.pillar-data-tag { font-size: 10px; font-weight: 700; padding: 4px 11px; border-radius: 5px; }
.pillar-card.nutrition .pillar-data-tag { background: rgba(57,186,118,0.09); color: #2a9148; }
.pillar-card.body-pillar .pillar-data-tag { background: rgba(57,140,186,0.09); color: #2b6e93; }
.pillar-card.mind .pillar-data-tag { background: rgba(232,184,75,0.09); color: #927010; }
.pillars-tagline { text-align: center; font-size: 22px; font-weight: 600; color: var(--ink); letter-spacing: -0.01em; }
.pillars-tagline em { font-style: normal; color: var(--green); }

/* ── STATS BAR ── */
.stats-bar { background: var(--surface); padding: 64px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.stat-num { font-family: var(--font-display); font-size: clamp(48px, 5vw, 68px); color: var(--ink); line-height: 1; }
.stat-num span { color: var(--green); }
.stat-label { font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); }
.stat-sub { font-size: 13px; color: var(--ink-2); line-height: 1.45; max-width: 160px; font-weight: 500; margin-top: 2px; }

/* ── MANIFESTO SECTION ── */
.section-manifesto { padding: var(--section-pad) 0; background: var(--ink); position: relative; overflow: hidden; }
.section-manifesto::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 70% 30%, rgba(46,168,74,0.06) 0%, transparent 55%); }
.manifesto-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; }
.manifesto-left h2 { font-family: var(--font-display); font-size: clamp(44px, 5.5vw, 68px); line-height: 0.95; color: var(--white); margin-bottom: 28px; }
.manifesto-left h2 em { font-style: normal; color: var(--green-accent); }
.manifesto-left p { font-size: 16px; color: rgba(255,255,255,0.50); line-height: 1.85; margin-bottom: 16px; font-weight: 300; }
.manifesto-left p strong { color: rgba(255,255,255,0.80); font-weight: 600; }
.manifesto-right { display: flex; flex-direction: column; gap: 0; }
.manifesto-point { padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
.manifesto-point:last-child { border-bottom: none; }
.manifesto-point-num { font-family: var(--font-display); font-size: 13px; letter-spacing: 0.12em; color: rgba(255,255,255,0.18); margin-bottom: 8px; }
.manifesto-point h4 { font-size: 16px; font-weight: 700; color: var(--white); margin-bottom: 6px; }
.manifesto-point p { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; font-weight: 300; }

/* ── TESTIMONIALS ── */
.section-testimonials { padding: var(--section-pad) 0; background: linear-gradient(135deg, #154D33 0%, #1D6040 50%, #39BA76 100%); position: relative; overflow: hidden; }
#testimonialNebula { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
.section-testimonials .container { position: relative; z-index: 1; }
.testimonials-header { text-align: center; margin-bottom: 60px; }
.testimonials-header h2 { font-family: var(--font-display); font-size: clamp(40px, 5vw, 64px); line-height: 1; color: var(--white); margin-bottom: 14px; }
.testimonials-header h2 em { color: rgba(255,255,255,0.75); font-style: normal; }
.testimonials-header > p { font-size: 17px; color: rgba(255,255,255,0.55); max-width: 480px; margin: 0 auto; line-height: 1.75; }
.testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.testimonial-card { background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.18); border-radius: 16px; padding: 36px 30px; backdrop-filter: blur(12px); transition: all 0.35s; display: flex; flex-direction: column; }
.testimonial-card:hover { border-color: rgba(255,255,255,0.28); background: rgba(255,255,255,0.14); transform: translateY(-4px); }
.t-stars { display: flex; gap: 4px; margin-bottom: 22px; }
.t-star { width: 14px; height: 14px; fill: var(--mind); }
.t-quote { font-size: 15.5px; color: rgba(255,255,255,0.80); line-height: 1.75; margin-bottom: 28px; font-weight: 300; flex: 1; }
.t-quote strong { color: var(--white); font-weight: 700; }
.t-author { display: flex; align-items: center; gap: 14px; margin-top: auto; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.10); }
.t-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.14); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.22); }
.t-avatar-letter { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.5); font-family: var(--font-display); }
.t-name { font-size: 14px; font-weight: 700; color: var(--white); margin-bottom: 3px; }
.t-device { font-size: 11px; color: rgba(255,255,255,0.45); font-weight: 500; letter-spacing: 0.04em; }

/* ── FINAL CTA ── */
.section-cta { padding: var(--section-pad) 0; background: var(--ink); position: relative; overflow: hidden; }
.section-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(46,168,74,0.05) 0%, transparent 60%); }
.cta-inner { text-align: center; position: relative; max-width: 640px; margin: 0 auto; }
.cta-inner h2 { font-family: var(--font-display); font-size: clamp(52px, 7vw, 88px); line-height: 0.92; color: var(--white); margin-bottom: 24px; }
.cta-inner h2 span { color: var(--green-accent); }
.cta-inner > p { font-size: 18px; color: rgba(255,255,255,0.5); line-height: 1.75; margin-bottom: 44px; font-weight: 300; }
.cta-actions { display: flex; flex-direction: column; align-items: center; gap: 18px; }
.cta-note { font-size: 12px; color: rgba(255,255,255,0.28); letter-spacing: 0.06em; }

/* ── FOOTER ── */
footer { background: var(--black); padding: 60px 0 0; }
.footer-inner { max-width: var(--content-max); margin: 0 auto; padding: 0 var(--gutter); display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
.footer-logo img { height: 40px; width: auto; margin-bottom: 14px; filter: brightness(0) invert(1); }
.footer-brand p { font-size: 13px; color: rgba(255,255,255,0.35); line-height: 1.65; max-width: 280px; }
.footer-col ul { list-style: none; }
.footer-col ul li { margin-bottom: 12px; }
.footer-col ul li a { font-size: 13px; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; font-weight: 500; }
.footer-col ul li a:hover { color: rgba(255,255,255,0.80); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); margin-top: 48px; padding: 20px var(--gutter); max-width: var(--content-max); margin-left: auto; margin-right: auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.footer-copy { font-size: 12px; color: rgba(255,255,255,0.22); letter-spacing: 0.04em; }

/* ── MOBILE CTA ── */
.mobile-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; padding: 14px var(--gutter); background: rgba(255,255,255,0.96); backdrop-filter: blur(12px); border-top: 1px solid var(--border); z-index: 180; transition: transform 0.35s; transform: translateY(100%); }
.mobile-cta.show { transform: translateY(0); }
.mobile-cta .btn { width: 100%; justify-content: center; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .problem-grid { gap: 48px; }
  .manifesto-inner { gap: 48px; }
}
@media (max-width: 900px) {
  .nav-links { display: none; }
  .nav-hamburger { display: block; }
  .page-hero-inner { grid-template-columns: 1fr; gap: 48px; }
  .problem-grid { grid-template-columns: 1fr; }
  .pillars-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .manifesto-inner { grid-template-columns: 1fr; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .mobile-cta { display: block; }
  .footer-inner { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .footer-inner { grid-template-columns: 1fr; }
  .vs-row { grid-template-columns: 1fr; }
  .vs-divider { text-align: center; padding: 4px 0; }
}
</style>
</head>
<body>

<!-- MAIN NAV -->
<nav id="mainNav">
  <a href="/" class="nav-logo">
    <img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef">
  </a>
  <ul class="nav-links">
    <li><a href="/features">Features</a></li>
    <li><a href="/how-it-works">How It Works</a></li>
    <li><a href="/why-tlc" class="active-page">Why TLC</a></li>
    <li><a href="/pricing">Pricing</a></li>
    <li><a href="#" class="nav-login" onclick="openLoginModal();return false;">Log in</a></li>
    <li><a href="/start" class="nav-cta">Start Free</a></li>
  </ul>
  <button class="nav-hamburger" onclick="toggleMobileNav()" aria-label="Menu">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  </button>
</nav>

<!-- MOBILE NAV -->
<div class="mobile-nav" id="mobileNav">
  <button class="mobile-nav-close" onclick="toggleMobileNav()" aria-label="Close">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <a href="/" onclick="toggleMobileNav()">Home</a>
  <a href="/features" onclick="toggleMobileNav()">Features</a>
  <a href="/how-it-works" onclick="toggleMobileNav()">How It Works</a>
  <a href="/why-tlc" onclick="toggleMobileNav()">Why TLC</a>
  <a href="/pricing" onclick="toggleMobileNav()">Pricing</a>
  <a href="#" onclick="toggleMobileNav();openLoginModal();return false;">Log in</a>
  <a href="/start" class="btn btn-green">Start Free</a>
</div>

<!-- PAGE HERO -->
<section class="page-hero">
  <div class="container">
    <div class="page-hero-inner">
      <div>
        <div class="page-hero-eyebrow"><span class="label">The Origin</span></div>
        <h1>THE DOTS<br>WERE<br>ALWAYS<br><em>THERE.</em></h1>
        <p class="page-hero-body">Your body is a precision engine. But when its parts operate in isolation, you do not get performance — you get confusion. Your wearable floods you with numbers that feel important but leave you no clearer on what to actually do. Your nutrition data sits in a separate app, disconnected from everything that actually drives it. <strong>The data already exists.</strong> It is just working against itself. TLC is the system that connects it — reads the signals your wearable generates, understands what you are fuelling it with, and turns both into one clear direction. Every day.</p>
        <div class="page-hero-actions">
          <a href="/start" class="btn btn-green">Start Free Today</a>
          <a href="/pricing" class="btn btn-outline">See Plans</a>
        </div>
      </div>
      <div class="page-hero-right">
        <div class="hero-manifesto">
          <div class="manifesto-line">
            <div class="manifesto-icon" style="background:rgba(57,186,118,0.10);">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--nutrition)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
            </div>
            <div class="manifesto-text">
              <strong>Nutrition alone is incomplete</strong>
              <p>Knowing your macros does not explain why your energy crashed Tuesday. The food is only one part of the answer.</p>
            </div>
          </div>
          <div class="manifesto-line">
            <div class="manifesto-icon" style="background:rgba(57,140,186,0.10);">
              <svg viewBox="0 0 24 24" stroke="var(--body-blue)"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div class="manifesto-text">
              <strong>Biometrics alone are directionless</strong>
              <p>Your wearable shows you numbers but it cannot explain what drove them. The patterns are hidden in the gaps.</p>
            </div>
          </div>
          <div class="manifesto-line">
            <div class="manifesto-icon" style="background:rgba(232,184,75,0.10);">
              <svg viewBox="0 0 24 24" stroke="var(--mind)"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
            </div>
            <div class="manifesto-text">
              <strong>How you feel is data, too</strong>
              <p>Mood, energy, and focus are not soft metrics. They are the third pillar. Without them, no system can see the full picture.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- THE PROBLEM WITH EVERYTHING ELSE -->
<section class="section-problem">
  <div class="container">
    <div class="problem-grid">
      <div class="problem-left reveal">
        <span class="label" style="margin-bottom:22px;display:inline-flex;">The Gap</span>
        <h2>WHY EVERY<br>OTHER APP<br><em>FALLS SHORT</em></h2>
        <p>Most health tools are built around a single dimension. Calorie counters track food. Wearables track body. Mood apps track mind. <strong>None of them connect these three things.</strong></p>
        <p>So you end up with three separate data streams that never talk to each other. You see numbers. You do not see patterns. You do not see causation. You do not know why high omega-3 days produce better sleep, or why late-night carbs knock your HRV down 18% by morning.</p>
        <p>Those connections exist. Your body is already showing them to you. Nobody has been joining them together. Until TLC.</p>
      </div>
      <div class="problem-right reveal d2">
        <div class="problem-vs">
          <div class="vs-row">
            <div class="vs-col theirs">
              <div class="vs-label">Other apps</div>
              <div class="vs-text">Show you calories logged</div>
            </div>
            <div class="vs-divider">vs</div>
            <div class="vs-col ours">
              <div class="vs-label">TLC</div>
              <div class="vs-text">Shows you how food drove your sleep last Tuesday</div>
            </div>
          </div>
          <div class="vs-row">
            <div class="vs-col theirs">
              <div class="vs-label">Other apps</div>
              <div class="vs-text">Display HRV as a number</div>
            </div>
            <div class="vs-divider">vs</div>
            <div class="vs-col ours">
              <div class="vs-label">TLC</div>
              <div class="vs-text">Explains why it dropped and what food pattern caused it</div>
            </div>
          </div>
          <div class="vs-row">
            <div class="vs-col theirs">
              <div class="vs-label">Other apps</div>
              <div class="vs-text">Give you a generic meal plan</div>
            </div>
            <div class="vs-divider">vs</div>
            <div class="vs-col ours">
              <div class="vs-label">TLC</div>
              <div class="vs-text">Adapts every week to what your body actually responded to</div>
            </div>
          </div>
          <div class="vs-row">
            <div class="vs-col theirs">
              <div class="vs-label">Other apps</div>
              <div class="vs-text">Start fresh every conversation</div>
            </div>
            <div class="vs-divider">vs</div>
            <div class="vs-col ours">
              <div class="vs-label">TLC</div>
              <div class="vs-text">Carry your complete history into every single interaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- THREE PILLARS (full expanded) -->
<section class="section-pillars" id="pillars">
  <div class="container">
    <div class="section-header reveal">
      <span class="label" style="margin-bottom:20px;display:inline-flex;justify-content:center;">The Foundation</span>
      <h2>THREE PILLARS.<br><em>ONE PICTURE.</em></h2>
      <p>Your food. Your body. Your mind. Tracked separately, they are just numbers. Connected, they reveal the patterns that unlock lasting wellbeing and longevity.</p>
    </div>
    <div class="pillars-grid">
      <div class="pillar-card nutrition reveal-scale d1">
        <div class="pillar-icon-wrap">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#39BA76" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
          </svg>
        </div>
        <h3>Nutrition</h3>
        <p class="pillar-hook">Food is your most powerful lever for how you look, feel, and live. Now you get to use it with precision.</p>
        <p class="pillar-body">TLC maps every meal to your goals, flags patterns before they become problems, and shows you exactly how what you eat drives your sleep, energy, and recovery. Not in theory. From your actual data.</p>
        <ul class="pillar-signals">
          <li>Meal logging via Meal Matchmaker, Pantry Pal, or photo</li>
          <li>Macros tracked against personalised targets</li>
          <li>Food patterns connected to biometric outcomes</li>
          <li>Meal timing and food timing analysis</li>
        </ul>
        <div class="pillar-data-tags">
          <span class="pillar-data-tag">Calories</span>
          <span class="pillar-data-tag">Macros</span>
          <span class="pillar-data-tag">Meal timing</span>
          <span class="pillar-data-tag">Food patterns</span>
          <span class="pillar-data-tag">Micronutrients</span>
        </div>
      </div>
      <div class="pillar-card body-pillar reveal-scale d2">
        <div class="pillar-icon-wrap">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#398CBA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>
        <h3>Body</h3>
        <p class="pillar-hook">Your wearable is already capturing something extraordinary. TLC is what turns that signal into real direction.</p>
        <p class="pillar-body">25+ wearables feed sleep stages, HRV, strain, and recovery into every insight. Your plan adapts in real time to what your body is actually doing today, not what a formula assumed a month ago.</p>
        <ul class="pillar-signals">
          <li>HRV, sleep stages, and recovery score daily</li>
          <li>Resting heart rate and strain tracking</li>
          <li>Biometric trends connected to nutrition patterns</li>
          <li>Manual baseline support if you have no wearable</li>
        </ul>
        <div class="pillar-data-tags">
          <span class="pillar-data-tag">HRV</span>
          <span class="pillar-data-tag">Sleep quality</span>
          <span class="pillar-data-tag">Recovery</span>
          <span class="pillar-data-tag">Strain</span>
          <span class="pillar-data-tag">RHR</span>
        </div>
      </div>
      <div class="pillar-card mind reveal-scale d3">
        <div class="pillar-icon-wrap">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#E8B84B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
          </svg>
        </div>
        <h3>Mind</h3>
        <p class="pillar-hook">How you feel is data. The most powerful kind. TLC captures it every day and connects it to everything else.</p>
        <p class="pillar-body">A 60-second evening reflection captures mood, stress, focus, and energy. TLC connects it to your nutrition and biometrics, surfacing links no single-pillar platform can see. This is where the most surprising patterns live.</p>
        <ul class="pillar-signals">
          <li>Daily mood, energy, focus, and stress check-in</li>
          <li>Wellbeing trends across 7, 14, and 30 days</li>
          <li>Cross-pillar correlations (food-to-mood patterns)</li>
          <li>Reflection feeds directly into daily Dynamic Insight</li>
        </ul>
        <div class="pillar-data-tags">
          <span class="pillar-data-tag">Mood</span>
          <span class="pillar-data-tag">Stress</span>
          <span class="pillar-data-tag">Focus</span>
          <span class="pillar-data-tag">Energy</span>
          <span class="pillar-data-tag">Wellbeing trend</span>
        </div>
      </div>
    </div>
    <p class="pillars-tagline reveal d4">Nobody else connects all three. <em>That is where the insights no other platform can see actually live.</em></p>
  </div>
</section>

<!-- STATS -->
<div class="stats-bar">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-item reveal d1"><span class="stat-num" data-count="3">0</span><span class="stat-label">Pillars Connected</span><span class="stat-sub">No other system joins food, body, and mind.</span></div>
      <div class="stat-item reveal d2"><span class="stat-num" data-count="25" data-suffix="+">0</span><span class="stat-label">Wearables Synced</span><span class="stat-sub">Real biometric data in every insight.</span></div>
      <div class="stat-item reveal d3"><span class="stat-num" data-count="7">0</span><span class="stat-label">Days of Context</span><span class="stat-sub">Every coaching response knows your full week.</span></div>
      <div class="stat-item reveal d4"><span class="stat-num" data-count="52">0</span><span class="stat-label">Strategies a Year</span><span class="stat-sub">A new game plan built from your patterns.</span></div>
    </div>
  </div>
</div>

<!-- MANIFESTO: WHY WE BUILT THIS -->
<section class="section-manifesto">
  <div class="container">
    <div class="manifesto-inner">
      <div class="manifesto-left reveal">
        <span class="label" style="margin-bottom:22px;display:inline-flex;color:var(--green-accent);">Our Belief</span>
        <h2>LONGEVITY IS NOT<br>A PRODUCT.<br>IT IS A <em>PATTERN.</em></h2>
        <p>We did not build TLC to sell you a wellness subscription. We built it because the tools to understand your own body have never been connected into a single, coherent system.</p>
        <p>Your food diary has never talked to your Garmin. Your Oura ring has never informed your recipe tonight. Your mood yesterday has never influenced your meal recommendation tomorrow. <strong>Until now, none of these systems could see each other.</strong></p>
        <p>The science of longevity is not complicated. Sleep deeply, eat well, move your body, and manage your stress. The hard part is doing it consistently in a real life with real demands. TLC does not demand perfection. It helps you understand your own system so you can make better decisions with less effort, every single day.</p>
      </div>
      <div class="manifesto-right reveal d2">
        <div class="manifesto-point">
          <div class="manifesto-point-num">01</div>
          <h4>You already have the data</h4>
          <p>Your wearable, your food choices, and how you feel every day are already generating the signal. TLC is the system that reads it.</p>
        </div>
        <div class="manifesto-point">
          <div class="manifesto-point-num">02</div>
          <h4>Patterns take time to see</h4>
          <p>The connection between Tuesday's salmon and Wednesday's HRV is invisible in a single data point. TLC holds your full history and finds it for you.</p>
        </div>
        <div class="manifesto-point">
          <div class="manifesto-point-num">03</div>
          <h4>Generic advice does not work</h4>
          <p>Your biology is not average. Your response to food, sleep, and stress is unique. TLC learns your specific patterns and gives you guidance built on them, not on a population study.</p>
        </div>
        <div class="manifesto-point">
          <div class="manifesto-point-num">04</div>
          <h4>Consistency beats intensity</h4>
          <p>TLC was built for everyday life, not peak performance camps. 60 seconds each evening. An insight each night. A strategy each week. Small consistent actions compound into lasting change.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="section-testimonials">
  <canvas id="testimonialNebula"></canvas>
  <div class="container">
    <div class="testimonials-header reveal">
      <span class="label" style="margin-bottom:18px;display:inline-flex;justify-content:center;color:rgba(255,255,255,0.55);">Real Experiences</span>
      <h2>PEOPLE WHO <em>JOINED THE DOTS</em></h2>
      <p>What changes when nutrition, body, and mind finally talk to each other.</p>
    </div>
    <div class="testimonials-grid">
      <div class="testimonial-card reveal d1">
        <div class="t-stars">
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <p class="t-quote">I tried every tracker going. They all showed me numbers but never explained <strong>why</strong> my energy crashed every Thursday. TLC spotted the pattern in week two: low sleep Tuesday plus high carbs Wednesday. Fixed it. Never looked back.</p>
        <div class="t-author">
          <div class="t-avatar"><span class="t-avatar-letter">S</span></div>
          <div><div class="t-name">Sarah M.</div><div class="t-device">Oura Ring user</div></div>
        </div>
      </div>
      <div class="testimonial-card reveal d2">
        <div class="t-stars">
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <p class="t-quote">The Coach is unlike anything I've used. It does not just answer questions. It remembers everything. Three months in and it still references something from my first week when it is relevant. That context is <strong>everything.</strong></p>
        <div class="t-author">
          <div class="t-avatar"><span class="t-avatar-letter">J</span></div>
          <div><div class="t-name">James K.</div><div class="t-device">Whoop 4.0 user</div></div>
        </div>
      </div>
      <div class="testimonial-card reveal d3">
        <div class="t-stars">
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg class="t-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <p class="t-quote">I travel for work constantly. Meal Matchmaker genuinely changed how I eat away from home. Instead of guessing, I always know <strong>exactly what to order</strong> and why. It's the first health tool I've used that actually works in real life.</p>
        <div class="t-author">
          <div class="t-avatar"><span class="t-avatar-letter">R</span></div>
          <div><div class="t-name">Rachel B.</div><div class="t-device">No wearable &bull; TLC only</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="section-cta">
  <div class="container">
    <div class="cta-inner">
      <span class="label" style="justify-content:center;margin-bottom:28px;display:inline-flex;color:var(--green-accent);">Start Connecting</span>
      <h2 class="reveal">THE DOTS<br>ARE <span>ALREADY</span><br>THERE.</h2>
      <p class="reveal d1">You have been generating the signal every day. TLC is the system that reads it. Start with Meal Matchmaker, free forever. Add the full connection layer when you are ready.</p>
      <div class="cta-actions reveal d2">
        <a href="/start" class="btn btn-green" style="font-size:13px;padding:18px 52px;">Start Free Today</a>
        <a href="https://tlc-onboarding.chris-ec5.workers.dev" class="btn btn-outline-white" style="font-size:12px;padding:17px 36px;">Start TLC &middot; $9.99/mo</a>
        <span class="cta-note">Cancel anytime &nbsp;&middot;&nbsp; No lock-in &nbsp;&middot;&nbsp; No fees</span>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="footer-logo"><img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef"></div>
      <p>Connecting the dots between nutrition, body, and mind. Eat smarter, feel better, live longer.</p>
    </div>
    <div class="footer-col"><ul>
      <li><a href="/features">Features</a></li>
      <li><a href="/how-it-works">How It Works</a></li>
      <li><a href="/why-tlc">Why TLC</a></li>
      <li><a href="/pricing">Pricing</a></li>
    </ul></div>
    <div class="footer-col"><ul>
      <li><a href="https://www.instagram.com/thelongevitychef_">Instagram</a></li>
      <li><a href="https://docs.google.com/document/d/1ZXE0c5gG4ep34tESNVOQF0SWg7lPpPb4KaQ7fkIcPFg/edit?usp=sharing">FAQs</a></li>
      <li><a href="https://tally.so/r/D4k8eZ">Contact</a></li>
    </ul></div>
    <div class="footer-col"><ul>
      <li><a href="/privacy">Privacy Policy</a></li>
      <li><a href="/terms">Terms &amp; Conditions</a></li>
    </ul></div>
  </div>
  <div class="footer-bottom">
    <span class="footer-copy">&copy; 2026 The Longevity Chef. All rights reserved.</span>
    <span class="footer-copy">Food for Life</span>
  </div>
</footer>

<div class="mobile-cta" id="mobileCta"><a href="/start" class="btn btn-green">Start Free</a></div>

<!-- LOGIN MODAL -->
<div class="login-overlay" id="loginOverlay" onclick="handleOverlayClick(event)">
  <div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
    <button class="login-modal-close" onclick="closeLoginModal()" aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div id="loginForm">
      <h3 id="loginTitle">Welcome back</h3>
      <p>Enter your email and we will send you a login link. No password needed.</p>
      <div class="login-modal-error" id="loginError"></div>
      <input type="email" id="loginEmail" placeholder="your@email.com" autocomplete="email" onkeydown="if(event.key==='Enter')submitMagicLink()" />
      <button class="btn-login-submit" id="loginSubmitBtn" onclick="submitMagicLink()">Send login link</button>
    </div>
    <div class="login-modal-success" id="loginSuccess">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <h4>Check your inbox</h4>
      <p>A login link is on its way. It expires in 15 minutes.</p>
    </div>
  </div>
</div>

<script>
// ── Nav scroll ──
const mainNav = document.getElementById('mainNav');
const mobileCta = document.getElementById('mobileCta');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  mainNav.classList.toggle('scrolled', sy > 50);
  if (mobileCta) mobileCta.classList.toggle('show', sy > 400);
});

// ── Reveal ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.reveal, .reveal-scale').forEach(el => revealObs.observe(el));

// ── Counter ──
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.max(1, Math.floor(target / 24));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current + suffix;
    }, 38);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

// ── Mobile nav ──
function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
  document.body.style.overflow = document.getElementById('mobileNav').classList.contains('open') ? 'hidden' : '';
}

// ── Login modal ──
function openLoginModal() { document.getElementById('loginOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeLoginModal() { document.getElementById('loginOverlay').classList.remove('open'); document.body.style.overflow = ''; }
function handleOverlayClick(e) { if (e.target === e.currentTarget) closeLoginModal(); }
async function submitMagicLink() {
  const email = document.getElementById('loginEmail').value.trim();
  const btn = document.getElementById('loginSubmitBtn');
  const errEl = document.getElementById('loginError');
  if (!email || !email.includes('@')) { errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; return; }
  errEl.style.display = 'none';
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const res = await fetch('https://tlc-engine.chris-ec5.workers.dev/api/magic-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    if (res.ok) { document.getElementById('loginForm').style.display = 'none'; document.getElementById('loginSuccess').style.display = 'block'; }
    else { errEl.textContent = 'Something went wrong. Please try again.'; errEl.style.display = 'block'; btn.disabled = false; btn.textContent = 'Send login link'; }
  } catch { errEl.textContent = 'Something went wrong. Please try again.'; errEl.style.display = 'block'; btn.disabled = false; btn.textContent = 'Send login link'; }
}
(function() {
  const params = new URLSearchParams(window.location.search);
  const s = params.get('login');
  if (s === 'expired' || s === 'invalid') {
    openLoginModal();
    const e = document.getElementById('loginError');
    e.textContent = s === 'expired' ? 'That login link has expired. Please request a new one.' : 'That login link is not valid. Please request a new one.';
    e.style.display = 'block';
  }
})();

// ── Testimonial nebula ──
(function() {
  var canvas = document.getElementById('testimonialNebula');
  if (!canvas) return;
  var section = canvas.parentElement;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var W, H, t = 0, active = true;
  var nodes = [];
  function resize() {
    W = section.offsetWidth; H = section.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    nodes = [];
    for (var i = 0; i < 28; i++) {
      nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 1.5 + 0.5, a: Math.random() * 0.25 + 0.05 });
    }
  }
  function draw() {
    if (!active || !W) { requestAnimationFrame(draw); return; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    t++;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i]; n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      for (var j = i + 1; j < nodes.length; j++) {
        var n2 = nodes[j]; var d = Math.hypot(n.x - n2.x, n.y - n2.y);
        if (d < 160) { ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(n2.x, n2.y); ctx.strokeStyle = 'rgba(255,255,255,' + (1 - d / 160) * 0.12 + ')'; ctx.lineWidth = 0.6; ctx.stroke(); }
      }
      var pulse = n.a + 0.08 * Math.sin(t * 0.04 + i);
      var glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
      glow.addColorStop(0, 'rgba(255,255,255,' + pulse * 0.35 + ')');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,' + pulse + ')'; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  new IntersectionObserver(function(e) { active = e[0].isIntersecting; if (active) resize(); }, { threshold: 0.05 }).observe(section);
  resize(); draw();
})();
</script>
</body>
</html>
`;
// WHY_TLC_HTML_END

// PRICING_HTML_START
const PRICING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pricing | The Longevity Chef</title>
<meta name="description" content="TLC Lite is free. TLC is $9.99 per month. Five connected tools. One intelligence layer. Less than the cost of a single nutritionist session.">
<meta property="og:title" content="Pricing | The Longevity Chef">
<meta property="og:description" content="Five connected tools. One monthly fee. Costs less than one hour with a nutritionist.">
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

@keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes livePulse { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(46,168,74,0.4); } 50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(46,168,74,0); } }

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

.reveal { opacity: 0; transform: translateY(40px); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-scale { opacity: 0; transform: scale(0.94); transition: opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94); }
.reveal-scale.visible { opacity: 1; transform: scale(1); }
.d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; } .d3 { transition-delay: 0.3s; } .d4 { transition-delay: 0.4s; }
.d5 { transition-delay: 0.5s; } .d6 { transition-delay: 0.6s; } .d7 { transition-delay: 0.7s; }

/* ── PRIMARY NAV ── */
nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 18px var(--gutter); background: rgba(255,255,255,0); border-bottom: 1px solid transparent; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
nav.scrolled { background: rgba(255,255,255,0.92); backdrop-filter: blur(20px) saturate(1.4); border-bottom-color: var(--border); }
.nav-logo { display: flex; align-items: center; text-decoration: none; }
.nav-logo img { height: 56px; width: auto; display: block; }
.nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
.nav-links a { color: var(--muted-2); text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; transition: color 0.2s; }
.nav-links a:hover, .nav-links a.active { color: var(--ink); }
.nav-cta { background: var(--ink); color: var(--white) !important; padding: 10px 24px; border-radius: 2px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.25s; text-decoration: none; }
.nav-cta:hover { background: #333; transform: translateY(-1px); }
.nav-login { color: var(--muted-2) !important; font-size: 12px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; text-decoration: none; transition: color 0.2s; }
.nav-login:hover { color: var(--ink) !important; }

/* ── HAMBURGER ── */
.nav-hamburger { display: none; flex-direction: column; justify-content: center; align-items: center; gap: 5px; width: 40px; height: 40px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 300; }
.nav-hamburger span { display: block; width: 22px; height: 1.5px; background: var(--ink); transition: all 0.3s cubic-bezier(0.4,0,0.2,1); transform-origin: center; }
.nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
.mobile-overlay { display: none; position: fixed; inset: 0; background: var(--white); z-index: 250; flex-direction: column; align-items: center; justify-content: center; gap: 32px; }
.mobile-overlay.open { display: flex; }
.mobile-overlay a { font-family: var(--font-display); font-size: 42px; letter-spacing: 0.04em; color: var(--ink); text-decoration: none; transition: color 0.2s; }
.mobile-overlay a:hover { color: var(--green); }
.mobile-overlay-cta { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 16px; }

/* ── LOGIN MODAL ── */
.login-overlay { display: none; position: fixed; inset: 0; background: rgba(26,26,26,0.55); backdrop-filter: blur(4px); z-index: 9000; align-items: center; justify-content: center; padding: 24px; }
.login-overlay.open { display: flex; }
.login-modal { background: #fff; border-radius: 16px; padding: 40px 36px; max-width: 420px; width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,0.18); position: relative; }
.login-modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; color: var(--muted-2); padding: 4px; }
.login-modal-close:hover { color: var(--ink); }
.login-modal h3 { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--ink); margin: 0 0 6px; letter-spacing: 0.03em; }
.login-modal p { font-size: 14px; color: var(--muted-2); margin: 0 0 24px; line-height: 1.5; }
.login-modal input[type="email"] { width: 100%; border: 1.5px solid var(--border); border-radius: 8px; padding: 13px 16px; font-size: 15px; font-family: 'Figtree', sans-serif; color: var(--ink); outline: none; transition: border-color 0.2s; margin-bottom: 14px; }
.login-modal input[type="email"]:focus { border-color: var(--green); }
.login-modal .btn-login-submit { width: 100%; background: var(--green); color: #fff; border: none; border-radius: 8px; padding: 14px; font-size: 14px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: background 0.2s, transform 0.15s; font-family: 'Figtree', sans-serif; }
.login-modal .btn-login-submit:hover { background: #259940; transform: translateY(-1px); }
.login-modal .btn-login-submit:disabled { background: var(--muted); cursor: not-allowed; transform: none; }
.login-modal-success { display: none; text-align: center; padding: 8px 0; }
.login-modal-success h4 { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--ink); margin: 0 0 8px; }
.login-modal-success p { font-size: 14px; color: var(--muted-2); margin: 0; }
.login-modal-error { display: none; background: #fff3f3; border: 1px solid #fca5a5; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #b91c1c; margin-bottom: 12px; }

/* ── PAGE HERO ── */
.page-hero { padding: clamp(140px, 18vw, 220px) 0 clamp(80px, 10vw, 120px); background: var(--white); text-align: center; border-bottom: 1px solid var(--border); }
.page-hero .label { justify-content: center; margin-bottom: 28px; opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s forwards; }
.page-hero h1 { font-family: var(--font-display); font-size: clamp(64px, 10vw, 140px); line-height: 0.86; letter-spacing: 0.01em; color: var(--ink); margin-bottom: 12px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.35s forwards; }
.page-hero-sub { font-family: var(--font-body); font-style: italic; font-weight: 300; font-size: clamp(22px, 3vw, 36px); color: var(--green); display: block; margin-bottom: 28px; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.5s forwards; }
.page-hero-body { font-size: clamp(15px, 1.5vw, 18px); font-weight: 300; color: var(--muted-2); max-width: 540px; margin: 0 auto; line-height: 1.85; opacity: 0; animation: fadeUp 1s cubic-bezier(0.25,0.46,0.45,0.94) 0.65s forwards; }


/* ── PRICING GRID ── */
.pricing-section { padding: 0 0 clamp(100px, 12vw, 160px); }
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: var(--border); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 40px rgba(0,0,0,0.06); }
.plan-card { background: var(--white); padding: clamp(32px, 4vw, 48px) clamp(28px, 3.5vw, 40px); position: relative; display: flex; flex-direction: column; }
.plan-card.featured { background: var(--ink); }
.plan-card-badge { position: absolute; top: 20px; right: 20px; font-size: 9px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink); background: var(--mind); padding: 4px 12px; border-radius: 100px; }
.plan-card.featured .plan-card-badge { color: var(--ink); background: var(--mind); }
.plan-label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
.plan-card.featured .plan-label { color: rgba(255,255,255,0.45); }
.plan-name { font-family: var(--font-display); font-size: 38px; letter-spacing: 0.03em; color: var(--ink); margin-bottom: 6px; line-height: 1; }
.plan-card.featured .plan-name { color: var(--white); }
.plan-price-row { display: flex; align-items: flex-end; gap: 4px; margin-bottom: 8px; }
.plan-price { font-family: var(--font-display); font-size: clamp(52px, 6vw, 72px); line-height: 1; color: var(--ink); letter-spacing: -0.01em; }
.plan-card.featured .plan-price { color: var(--white); }
.plan-price-period { font-size: 13px; font-weight: 500; color: var(--muted); padding-bottom: 10px; }
.plan-card.featured .plan-price-period { color: rgba(255,255,255,0.4); }
.plan-desc { font-size: 13px; color: var(--muted-2); line-height: 1.65; margin-bottom: 28px; min-height: 52px; }
.plan-card.featured .plan-desc { color: rgba(255,255,255,0.55); }
.plan-cta { display: flex; align-items: center; justify-content: center; gap: 8px; font-family: var(--font-body); font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; border: none; cursor: pointer; border-radius: 2px; padding: 15px 24px; transition: all 0.25s cubic-bezier(0.4,0,0.2,1); width: 100%; margin-bottom: 32px; }
.plan-cta:hover { transform: translateY(-2px); }
.plan-cta-free { background: var(--surface); color: var(--ink); }
.plan-cta-free:hover { background: var(--surface-2); box-shadow: 0 8px 20px rgba(0,0,0,0.06); }
.plan-cta-featured { background: var(--green); color: var(--white); box-shadow: 0 4px 20px rgba(46,168,74,0.35); }
.plan-cta-featured:hover { background: var(--green-mid); box-shadow: 0 8px 32px rgba(46,168,74,0.4); }
.plan-cta-pro { background: transparent; color: var(--ink); border: 1.5px solid var(--border-mid); }
.plan-cta-pro:hover { border-color: var(--ink); box-shadow: 0 8px 20px rgba(0,0,0,0.06); }

.plan-divider { height: 1px; background: var(--border); margin-bottom: 28px; }
.plan-card.featured .plan-divider { background: rgba(255,255,255,0.1); }
.plan-features-label { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 18px; }
.plan-card.featured .plan-features-label { color: rgba(255,255,255,0.35); }
.plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; flex: 1; }
.plan-feature { display: flex; align-items: flex-start; gap: 12px; font-size: 13.5px; line-height: 1.55; color: var(--ink-2); }
.plan-card.featured .plan-feature { color: rgba(255,255,255,0.78); }
.plan-feature-check { flex-shrink: 0; width: 18px; height: 18px; margin-top: 1px; }
.plan-feature-check.yes { color: var(--green); }
.plan-card.featured .plan-feature-check.yes { color: var(--green-accent); }
.plan-feature-check.no { color: var(--muted); opacity: 0.4; }
.plan-feature span { flex: 1; }
.plan-feature-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; flex-shrink: 0; margin-top: 2px; }
.tag-new { background: rgba(46,168,74,0.12); color: var(--green); }
.plan-card.featured .tag-new { background: rgba(70,196,97,0.18); color: var(--green-accent); }
.tag-soon { background: rgba(232,184,75,0.15); color: #b8891e; }

/* ── COMPARISON TABLE ── */
.comparison-section { padding: clamp(80px, 10vw, 130px) 0; background: var(--surface); }
.comparison-section .label { margin-bottom: 16px; }
.comparison-section h2 { font-family: var(--font-display); font-size: clamp(48px, 6vw, 88px); line-height: 0.88; letter-spacing: 0.01em; color: var(--ink); margin-bottom: 16px; }
.comparison-section .section-sub { font-size: clamp(15px, 1.5vw, 18px); font-weight: 300; color: var(--muted-2); max-width: 520px; line-height: 1.75; margin-bottom: clamp(48px, 6vw, 72px); }
.comparison-table { width: 100%; border-collapse: collapse; }
.comparison-table th, .comparison-table td { padding: 16px 20px; text-align: left; border-bottom: 1px solid var(--border); font-size: 13.5px; }
.comparison-table th { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); background: transparent; padding-bottom: 20px; border-bottom: 2px solid var(--border-mid); }
.comparison-table th.featured-col { color: var(--green); }
.comparison-table td:first-child { font-weight: 500; color: var(--ink); }
.comparison-table td.center { text-align: center; }
.comparison-table tr:hover td { background: rgba(46,168,74,0.02); }
.comparison-table tr:last-child td { border-bottom: none; }
.comp-check { display: inline-flex; align-items: center; justify-content: center; }
.comp-check.yes { color: var(--green); }
.comp-check.no { color: var(--muted); opacity: 0.35; }
.comp-check.partial { font-size: 11px; font-weight: 700; color: var(--muted-2); letter-spacing: 0.04em; }
.comp-section-header td { background: rgba(46,168,74,0.04); font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--green); padding: 12px 20px; border-bottom: 1px solid var(--green-light); }
.comparison-table th:nth-child(3), .comparison-table td:nth-child(3) { background: rgba(26,26,26,0.02); border-left: 2px solid rgba(46,168,74,0.18); border-right: 2px solid rgba(46,168,74,0.18); }
.comparison-table tr:last-child td:nth-child(3) { border-bottom: 2px solid rgba(46,168,74,0.18); }
.feat-label { display: inline-flex; align-items: center; gap: 6px; }
.feat-info { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; border: 1.5px solid rgba(26,26,26,0.22); color: rgba(26,26,26,0.42); font-size: 9px; font-weight: 700; font-family: var(--font-body); cursor: default; flex-shrink: 0; line-height: 1; }
.feat-info:hover { border-color: var(--green); color: var(--green); }
.feat-tooltip { position: absolute; left: 22px; top: 50%; transform: translateY(-50%); background: var(--ink); color: var(--white); font-size: 12px; font-weight: 400; line-height: 1.5; letter-spacing: 0; text-transform: none; padding: 9px 13px; border-radius: 6px; width: 230px; white-space: normal; pointer-events: none; opacity: 0; transition: opacity 0.15s; z-index: 100; box-shadow: 0 4px 16px rgba(0,0,0,0.18); }
.feat-tooltip::before { content: ''; position: absolute; right: 100%; top: 50%; transform: translateY(-50%); border: 5px solid transparent; border-right-color: var(--ink); }
.feat-info:hover .feat-tooltip { opacity: 1; }

/* ── VALUE SECTION ── */
.value-section { padding: clamp(100px, 12vw, 160px) 0; background: var(--white); }
.value-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(48px, 6vw, 80px); align-items: center; }
.value-left .label { margin-bottom: 20px; }
.value-left h2 { font-family: var(--font-display); font-size: clamp(52px, 6vw, 96px); line-height: 0.88; letter-spacing: 0.01em; color: var(--ink); margin-bottom: 24px; }
.value-left p { font-size: clamp(15px, 1.5vw, 18px); font-weight: 300; color: var(--muted-2); line-height: 1.85; margin-bottom: 16px; }
.value-comparisons { display: flex; flex-direction: column; gap: 2px; margin-top: 36px; }
.value-row { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 16px; padding: 16px 20px; background: var(--surface); border-radius: 4px; }
.value-row:first-child { border-radius: 4px 4px 0 0; }
.value-row:last-child { border-radius: 0 0 4px 4px; background: var(--ink); }
.value-item-name { font-size: 14px; font-weight: 500; color: var(--ink); }
.value-row:last-child .value-item-name { color: var(--white); font-weight: 700; }
.value-item-price { font-family: var(--font-display); font-size: 22px; color: var(--muted); letter-spacing: 0.03em; }
.value-row:last-child .value-item-price { color: var(--green-accent); }
.value-item-freq { font-size: 11px; color: var(--muted); text-align: right; line-height: 1.4; }
.value-row:last-child .value-item-freq { color: rgba(255,255,255,0.45); }

.value-right { position: relative; }
.value-card { background: var(--ink); border-radius: 20px; padding: 40px 36px; box-shadow: 0 32px 80px rgba(0,0,0,0.18); }
.value-card-label { font-size: 9px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--green-accent); margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.value-card-pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--green-accent); animation: livePulse 2s ease-in-out infinite; }
.value-card h3 { font-family: var(--font-display); font-size: 28px; letter-spacing: 0.03em; color: var(--white); margin-bottom: 8px; }
.value-card-quote { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 28px; font-style: italic; }
.value-features { display: flex; flex-direction: column; gap: 10px; }
.value-feat { display: flex; align-items: center; gap: 12px; font-size: 13.5px; color: rgba(255,255,255,0.75); }
.value-feat svg { color: var(--green-accent); flex-shrink: 0; }
.value-card-price-row { display: flex; align-items: flex-end; gap: 8px; margin-top: 28px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); }
.value-card-price { font-family: var(--font-display); font-size: 56px; color: var(--white); line-height: 1; }
.value-card-price-detail { padding-bottom: 8px; }
.value-card-price-detail .per { font-size: 13px; color: rgba(255,255,255,0.4); }
.value-card-price-detail .equiv { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--green-accent); margin-top: 2px; }

/* ── FAQ ── */
.faq-section { padding: clamp(100px, 12vw, 160px) 0; background: var(--surface); }
.faq-section .label { margin-bottom: 16px; }
.faq-section h2 { font-family: var(--font-display); font-size: clamp(48px, 6vw, 88px); line-height: 0.88; letter-spacing: 0.01em; color: var(--ink); margin-bottom: clamp(48px, 6vw, 80px); }
.faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
.faq-item { background: var(--white); }
.faq-item:first-child { border-radius: 12px 12px 0 0; }
.faq-item:last-child { border-radius: 0 0 12px 12px; }
.faq-grid .faq-item:nth-child(odd):nth-last-child(1) { grid-column: 1 / -1; }
.faq-q { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px 28px; cursor: pointer; font-size: 15px; font-weight: 600; color: var(--ink); line-height: 1.4; user-select: none; transition: color 0.2s; }
.faq-q:hover { color: var(--green); }
.faq-icon { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; background: var(--surface); display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
.faq-item.open .faq-icon { background: var(--green); transform: rotate(45deg); }
.faq-icon svg { color: var(--muted-2); }
.faq-item.open .faq-icon svg { color: var(--white); }
.faq-a { max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1); }
.faq-item.open .faq-a { max-height: 400px; }
.faq-a-inner { padding: 0 28px 24px; font-size: 14px; font-weight: 300; color: var(--muted-2); line-height: 1.8; }

/* ── GUARANTEE ── */
.guarantee-section { padding: clamp(80px, 10vw, 120px) 0; background: var(--white); text-align: center; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.guarantee-icon { width: 60px; height: 60px; background: var(--green-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.guarantee-section h2 { font-family: var(--font-display); font-size: clamp(40px, 5vw, 72px); line-height: 0.9; color: var(--ink); margin-bottom: 16px; letter-spacing: 0.01em; }
.guarantee-section p { font-size: clamp(15px, 1.5vw, 18px); font-weight: 300; color: var(--muted-2); max-width: 520px; margin: 0 auto; line-height: 1.85; }

/* ── CTA ── */
.cta-section { padding: clamp(100px, 12vw, 160px) 0; background: var(--ink); position: relative; overflow: hidden; text-align: center; }
.cta-nebula { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.cta-inner { position: relative; z-index: 1; }
.cta-section .label { color: var(--green-accent); justify-content: center; margin-bottom: 24px; }
.cta-section .label::before { background: var(--green-accent); }
.cta-section h2 { font-family: var(--font-display); font-size: clamp(64px, 10vw, 140px); line-height: 0.86; color: var(--white); letter-spacing: 0.01em; margin-bottom: 12px; }
.cta-section .cta-sub { font-family: var(--font-body); font-style: italic; font-weight: 300; font-size: clamp(22px, 3vw, 36px); color: rgba(255,255,255,0.5); margin-bottom: 48px; display: block; }
.cta-actions { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }

/* ── FOOTER ── */
footer { background: var(--black); padding: clamp(60px, 8vw, 100px) 0 40px; }
.footer-top { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: clamp(32px, 5vw, 60px); margin-bottom: clamp(48px, 6vw, 72px); }
.footer-brand img { height: 48px; width: auto; display: block; margin-bottom: 18px; filter: brightness(0) invert(1) opacity(0.8); }
.footer-brand p { font-size: 13px; color: rgba(255,255,255,0.35); line-height: 1.7; max-width: 240px; }
.footer-col h4 { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 18px; }
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.footer-col ul a { font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }
.footer-col ul a:hover { color: rgba(255,255,255,0.85); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.07); padding-top: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.footer-legal { font-size: 12px; color: rgba(255,255,255,0.25); }
.footer-legal a { color: rgba(255,255,255,0.35); text-decoration: none; }
.footer-legal a:hover { color: rgba(255,255,255,0.6); }

/* ── RESPONSIVE ── */
@media (max-width: 1100px) {
  .pricing-grid { grid-template-columns: 1fr; gap: 2px; }
  .plan-card.featured { order: -1; }
  .comparison-section { display: none; }
  .value-grid { grid-template-columns: 1fr; }
  .value-right { display: none; }
  .faq-grid { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .nav-links, .nav-login, .nav-cta { display: none; }
  .nav-hamburger { display: flex; }
  .footer-top { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .footer-top { grid-template-columns: 1fr; }
  .value-comparisons { display: none; }
}
</style>
</head>
<body>

<!-- NAV -->
<nav id="mainNav">
  <a href="/" class="nav-logo" aria-label="The Longevity Chef home">
    <img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef">
  </a>
  <ul class="nav-links">
    <li><a href="/features">Features</a></li>
    <li><a href="/how-it-works">How It Works</a></li>
    <li><a href="/why-tlc">Why TLC</a></li>
    <li><a href="/pricing" class="active">Pricing</a></li>
  </ul>
  <div style="display:flex;align-items:center;gap:20px;">
    <a href="#" class="nav-login" id="navLoginBtn">Log in</a>
    <a href="/start" class="nav-cta">Start Free</a>
  </div>
  <button class="nav-hamburger" id="hamburgerBtn" aria-label="Open menu">
    <span></span><span></span><span></span>
  </button>
</nav>

<!-- MOBILE OVERLAY -->
<div class="mobile-overlay" id="mobileOverlay">
  <a href="/features" onclick="toggleMobileNav()">Features</a>
  <a href="/how-it-works" onclick="toggleMobileNav()">How It Works</a>
  <a href="/why-tlc" onclick="toggleMobileNav()">Why TLC</a>
  <a href="/pricing" onclick="toggleMobileNav()">Pricing</a>
  <div class="mobile-overlay-cta">
    <a href="/start" class="btn btn-green" style="width:220px;justify-content:center;">Start Free</a>
    <a href="#" class="btn btn-outline" style="width:220px;justify-content:center;" id="mobileLoginBtn">Log in</a>
  </div>
</div>

<!-- LOGIN MODAL -->
<div class="login-overlay" id="loginOverlay">
  <div class="login-modal">
    <button class="login-modal-close" id="loginClose" aria-label="Close">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </button>
    <div id="loginForm">
      <h3>Welcome back</h3>
      <p>Enter your email and we'll send you a secure login link.</p>
      <div class="login-modal-error" id="loginError"></div>
      <input type="email" id="loginEmail" placeholder="your@email.com" autocomplete="email">
      <button class="btn-login-submit" id="loginSubmit">Send login link</button>
    </div>
    <div class="login-modal-success" id="loginSuccess">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#ebf7ee"/><path d="M12 20l6 6 10-12" stroke="#2ea84a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <h4>Check your inbox</h4>
      <p>We sent a magic link to your email. Click it to sign in.</p>
    </div>
  </div>
</div>

<!-- PAGE HERO -->
<section class="page-hero">
  <div class="container">
    <div class="label">Membership</div>
    <h1>ONE INVESTMENT.<br>FIVE TOOLS.</h1>
    <span class="page-hero-sub">Costs less than one hour with a nutritionist.</span>
    <p class="page-hero-body">Every TLC tool shares the same intelligence. Your meals inform your coach. Your wearable sharpens your insights. Your insights evolve your plan. Nothing works in isolation.</p>
  </div>
</section>


<!-- PRICING GRID -->
<section class="pricing-section">
  <div class="container">
    <div class="pricing-grid reveal">

      <!-- TLC LITE (FREE) -->
      <div class="plan-card">
        <div class="plan-label">Free forever</div>
        <div class="plan-name">TLC Lite</div>
        <div class="plan-price-row">
          <div class="plan-price">$0</div>
          <div class="plan-price-period">/month</div>
        </div>
        <div class="plan-desc">A genuine taste of what TLC does. No credit card. No expiry. No catch.</div>
        <a href="https://tlc-onboarding-lite.chris-ec5.workers.dev" class="plan-cta plan-cta-free">Get started free</a>
        <div class="plan-divider"></div>
        <div class="plan-features-label">What's included</div>
        <ul class="plan-features">
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Meal Matchmaker (3 searches per day)</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check no" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.08"/><path d="M6 12l6-6M12 12L6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span>Weekly Dynamic Insight</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Basic nutrition logging</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Macro targets and calorie goals</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check no" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.08"/><path d="M6 12l6-6M12 12L6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span>Daily Dynamic Insights</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check no" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.08"/><path d="M6 12l6-6M12 12L6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span>Longevity Coach</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check no" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.08"/><path d="M6 12l6-6M12 12L6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span>Pantry Pal</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check no" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.08"/><path d="M6 12l6-6M12 12L6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span>Wearable integration</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check no" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.08"/><path d="M6 12l6-6M12 12L6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <span>Longevity Score</span>
          </li>
        </ul>
      </div>

      <!-- TLC (FEATURED) -->
      <div class="plan-card featured">
        <div class="plan-card-badge">Most popular</div>
        <div class="plan-label">Best value</div>
        <div class="plan-name">TLC</div>
        <div class="plan-price-row">
          <div class="plan-price" id="tlcPrice">$9.99</div>
          <div class="plan-price-period">/month</div>
        </div>
        <div class="plan-desc">The full system. Daily intelligence, coached guidance, restaurant recommendations and pantry-to-table recipes - all personalised to you.</div>
        <a href="https://tlc-onboarding.chris-ec5.workers.dev?path=tlc" class="plan-cta plan-cta-featured" id="tlcCta">Start TLC</a>
        <div class="plan-divider"></div>
        <div class="plan-features-label">Everything in Lite, plus</div>
        <ul class="plan-features">
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Daily Dynamic Insights</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Weekly Deep-Dive and strategy</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Longevity Coach (unlimited sessions)</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Meal Matchmaker (unlimited searches)</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Pantry Pal (recipes from what you have)</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Wearable sync (25+ devices)</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Longevity Score (weekly)</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Photo meal analysis</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Evening reflection and 8 wellbeing charts</span>
          </li>
        </ul>
      </div>

      <!-- TLC PRO -->
      <div class="plan-card">
        <div class="plan-label">Full system</div>
        <div class="plan-name">TLC Pro</div>
        <div class="plan-price-row">
          <div class="plan-price" id="proPrice">$19.99</div>
          <div class="plan-price-period">/month</div>
        </div>
        <div class="plan-desc">For those who want the full picture: personalised weekly meal plans built around your biology, goals and schedule.</div>
        <a href="https://tlc-onboarding.chris-ec5.workers.dev?path=pro" class="plan-cta plan-cta-pro">Start TLC Pro</a>
        <div class="plan-divider"></div>
        <div class="plan-features-label">Everything in TLC, plus</div>
        <ul class="plan-features">
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Weekly personalised meal plan</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Smart Shopping List (saves 10–15% on groceries)</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Plan adjusts weekly based on your data</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Longevity Score (weekly)</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Smart Shopping List eliminates duplicates across all 28 days</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Priority email support</span>
          </li>
          <li class="plan-feature">
            <svg class="plan-feature-check yes" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12"/><path d="M5.5 9l2.5 2.5L12.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Early access to new features</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</section>

<!-- COMPARISON TABLE -->
<section class="comparison-section">
  <div class="container">
    <div class="label reveal">Feature breakdown</div>
    <h2 class="reveal d1">COMPARE<br>THE PLANS</h2>
    <p class="section-sub reveal d2">Every feature, clearly listed. No asterisks.</p>
    <div class="reveal d2" style="overflow-x:auto;">
      <table class="comparison-table">
        <thead>
          <tr>
            <th style="width:40%;">Feature</th>
            <th class="center" style="width:20%;">TLC Lite</th>
            <th class="center featured-col" style="width:20%;">TLC</th>
            <th class="center" style="width:20%;">TLC Pro</th>
          </tr>
        </thead>
        <tbody>
          <tr class="comp-section-header"><td colspan="4">Dynamic Insights</td></tr>
          <tr>
            <td>Daily Dynamic Insight</td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td>Weekly Dynamic Insight</td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td>Weekly strategy</td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td>Longevity Score</td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check partial">Weekly</span></td>
            <td class="center"><span class="comp-check partial">Weekly</span></td>
          </tr>
          <tr class="comp-section-header"><td colspan="4">Tools</td></tr>
          <tr>
            <td><span class="feat-label">Personal nutrition blueprint<span class="feat-info">i<span class="feat-tooltip">Your personalised calorie and macro targets, calculated from your body stats, goals, and activity level. Displayed on your dashboard as your daily blueprint.</span></span></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td><span class="feat-label">Meal Matchmaker<span class="feat-info">i<span class="feat-tooltip">Finds nearby restaurants in real time and recommends the best dish on their menu, matched to your calorie targets, allergies, and taste preferences.</span></span></span></td>
            <td class="center"><span class="comp-check partial">3/day</span></td>
            <td class="center"><span class="comp-check partial">Unlimited</span></td>
            <td class="center"><span class="comp-check partial">Unlimited</span></td>
          </tr>
          <tr>
            <td><span class="feat-label">Menu Scanner<span class="feat-info">i<span class="feat-tooltip">Photograph any restaurant menu and instantly get a personalised dish recommendation matched to your targets, dietary requirements, and restrictions.</span></span></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td><span class="feat-label">Longevity Coach<span class="feat-info">i<span class="feat-tooltip">An expert nutrition and lifestyle coach with full access to your data. Ask questions, get analysis, and receive personalised guidance in real time.</span></span></span></td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td><span class="feat-label">Pantry Pal<span class="feat-info">i<span class="feat-tooltip">Enter the ingredients you have at home and get personalised recipes with full macros, a smart shopping list, and step-by-step cooking instructions.</span></span></span></td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td><span class="feat-label">Recipe Suggester<span class="feat-info">i<span class="feat-tooltip">Browse longevity-focused recipes matched to your nutrition targets and dietary preferences, with macros calculated and auto-logged to your dashboard.</span></span></span></td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td><span class="feat-label">Weekly meal plan<span class="feat-info">i<span class="feat-tooltip">A full 7-day meal plan built around your goals, preferences, and available ingredients. Includes a consolidated smart shopping list. TLC Pro only.</span></span></span></td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td><span class="feat-label">Photo meal analysis<span class="feat-info">i<span class="feat-tooltip">Take a photo of any meal and get an instant nutritional breakdown estimated from ingredients. Automatically logged to your meal history.</span></span></span></td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr class="comp-section-header"><td colspan="4">Data and integration</td></tr>
          <tr>
            <td>Wearable integration (25+ devices)</td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td>Evening reflection (8 wellbeing charts)</td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td>30-day personalised goals</td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td>Sustainability tips and equivalences</td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td>Dynamic challenges</td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
          <tr>
            <td>Smart Shopping List (saves 10–15% on grocery bills)</td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check no"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span></td>
            <td class="center"><span class="comp-check yes"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- VALUE / PRICE ANCHORING -->
<section class="value-section">
  <div class="container">
    <div class="value-grid">
      <div class="value-left">
        <div class="label reveal">In perspective</div>
        <h2 class="reveal d1">WHAT ELSE<br>$9.99<br>BUYS YOU</h2>
        <p class="reveal d2">A single session with a nutritionist typically costs $80 to $150. One hour with a dietitian. No continuity. No data. No connection between what you eat, how you move, and how you feel.</p>
        <p class="reveal d3">TLC does the connective work automatically - every day, across all three pillars, for less than a dollar per day.</p>
        <div class="value-comparisons reveal d3">
          <div class="value-row">
            <div class="value-item-name">One nutritionist session</div>
            <div class="value-item-price">$120</div>
            <div class="value-item-freq">Per visit<br>No continuity</div>
          </div>
          <div class="value-row">
            <div class="value-item-name">Fitness app (Strava / MyFitnessPal)</div>
            <div class="value-item-price">$12.99</div>
            <div class="value-item-freq">Per month<br>No insight layer</div>
          </div>
          <div class="value-row">
            <div class="value-item-name">Sleep tracker app (Oura Ring app)</div>
            <div class="value-item-price">$5.99</div>
            <div class="value-item-freq">Per month<br>Sleep only</div>
          </div>
          <div class="value-row">
            <div class="value-item-name">TLC (all three pillars)</div>
            <div class="value-item-price">$9.99</div>
            <div class="value-item-freq">Per month<br>Everything connected</div>
          </div>
        </div>
      </div>
      <div class="value-right reveal d2">
        <div class="value-card">
          <div class="value-card-label">
            <div class="value-card-pulse"></div>
            Live daily insight
          </div>
          <h3>Your daily briefing</h3>
          <p class="value-card-quote">"Your HRV dropped 14% this week, tracking alongside three days of lower vegetable intake. Tonight's recommendation focuses on magnesium and fibre."</p>
          <div class="value-features">
            <div class="value-feat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l3.5 3.5L14 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Connects food, sleep and energy automatically
            </div>
            <div class="value-feat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l3.5 3.5L14 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Gets sharper with every day of data
            </div>
            <div class="value-feat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l3.5 3.5L14 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Delivered every evening at your chosen time
            </div>
            <div class="value-feat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l3.5 3.5L14 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Included in TLC from day one
            </div>
          </div>
          <div class="value-card-price-row">
            <div class="value-card-price">$9.99</div>
            <div class="value-card-price-detail">
              <div class="per">/month</div>
              <div class="equiv">33 cents per day</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<!-- IS TLC RIGHT FOR YOU -->
<section style="padding:clamp(80px,10vw,120px) 0;background:var(--white);border-top:1px solid var(--border);">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,6vw,80px);align-items:start;" class="reveal">
      <div>
        <div class="label" style="margin-bottom:18px;">Honest assessment</div>
        <h2 style="font-family:var(--font-display);font-size:clamp(40px,5vw,72px);line-height:0.9;letter-spacing:0.01em;color:var(--ink);margin-bottom:24px;">IS TLC<br>RIGHT FOR<br>YOU?</h2>
        <p style="font-size:clamp(14px,1.4vw,17px);font-weight:300;color:var(--muted-2);line-height:1.8;margin-bottom:0;">Not every tool is right for every person. Here is an honest picture of who TLC is built for and who would be better served elsewhere.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:2px;">
        <div style="background:var(--green-light);border:1.5px solid rgba(46,168,74,0.18);border-radius:12px 12px 0 0;padding:28px 28px 24px;">
          <div style="font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--green);margin-bottom:16px;">TLC is built for you if</div>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">
            <li style="display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:var(--ink-2);line-height:1.5;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:2px;color:var(--green);"><path d="M2 8l3.5 3.5L14 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>You want to understand why your body responds the way it does</li>
            <li style="display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:var(--ink-2);line-height:1.5;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:2px;color:var(--green);"><path d="M2 8l3.5 3.5L14 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>You are interested in patterns over time, not just today's numbers</li>
            <li style="display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:var(--ink-2);line-height:1.5;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:2px;color:var(--green);"><path d="M2 8l3.5 3.5L14 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>You use or want to use a wearable (though not required)</li>
            <li style="display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:var(--ink-2);line-height:1.5;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:2px;color:var(--green);"><path d="M2 8l3.5 3.5L14 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>You eat at restaurants and need guidance that travels with you</li>
            <li style="display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:var(--ink-2);line-height:1.5;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:2px;color:var(--green);"><path d="M2 8l3.5 3.5L14 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>You value personalised intelligence over generic plans</li>
          </ul>
        </div>
        <div style="background:var(--surface);border:1.5px solid var(--border-mid);border-radius:0 0 12px 12px;padding:28px 28px 24px;">
          <div style="font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted);margin-bottom:16px;">A different tool might suit you better if</div>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">
            <li style="display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:var(--muted-2);line-height:1.5;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:2px;color:var(--muted);"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>You just want to count calories (MyFitnessPal does this well and is free)</li>
            <li style="display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:var(--muted-2);line-height:1.5;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:2px;color:var(--muted);"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>You want meal delivery or pre-packaged food (try Factor or Freshly)</li>
            <li style="display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:var(--muted-2);line-height:1.5;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:2px;color:var(--muted);"><path d="M4 12l8-8M12 12L4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Your primary goal is workout tracking rather than nutrition (try Garmin or Strava)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="faq-section">
  <div class="container">
    <div class="label reveal">Common questions</div>
    <h2 class="reveal d1">EVERYTHING<br>YOU WANT<br>TO KNOW</h2>
    <div class="faq-grid reveal d2">


      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)">
          How is TLC different from MyFitnessPal, Cronometer, or Noom?
          <div class="faq-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>
        <div class="faq-a">
          <div class="faq-a-inner">Those tools track what you do. TLC explains what it means. MyFitnessPal and Cronometer are excellent calorie logs, but they treat each day in isolation. They have no way to connect your food choices to how you sleep, how your HRV changes, or how you feel the next day. Noom applies behavioural coaching to eating habits, but without live wearable data. TLC connects all three pillars simultaneously: every meal feeds into your nightly Dynamic Insight, which is also shaped by your wearable data and your evening reflection. That cross-pillar connection is what none of the others do.</div>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)">
          How does the Daily Dynamic Insight work?
          <div class="faq-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>
        <div class="faq-a">
          <div class="faq-a-inner">Each evening at your chosen time (default 8pm), TLC generates a personalised narrative that pulls together everything from that day: your meals, your wearable data (HRV, sleep, recovery, strain), your evening reflection, and your goals. It surfaces patterns across all three, flags anything worth your attention, and closes with a recommendation for tomorrow. After seven days it generates a Weekly Deep-Dive and a new strategy for the week ahead. The longer you use it, the more specific and accurate the insights become.</div>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)">
          What is Meal Matchmaker and how does it work?
          <div class="faq-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>
        <div class="faq-a">
          <div class="faq-a-inner">Meal Matchmaker uses your GPS location to find nearby restaurants, then browses their actual menus to identify the dish that best fits your macro targets, dietary restrictions, allergies, spice tolerance, and health goal. It returns the specific dish name, estimated macros, and a link to the menu. It works at breakfast, lunch, or dinner, in any city, and adapts to your goals automatically. Available free in TLC Lite (3 searches per day) and unlimited in TLC and TLC Pro.</div>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)">
          What is the Longevity Score?
          <div class="faq-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>
        <div class="faq-a">
          <div class="faq-a-inner">The Longevity Score is a composite measure of how well your three pillars are aligning over time. It draws on nutritional consistency, biometric trends (HRV, sleep quality, recovery), reflection data, and goal progress, all weighted by what matters most for your specific goals. It is not a perfect number. It is a directional signal: are your daily choices compounding toward better health, or drifting away from it? TLC members receive it weekly. TLC Pro members receive it daily.</div>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)">
          Do I need a wearable device to use TLC?
          <div class="faq-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>
        <div class="faq-a">
          <div class="faq-a-inner">No. A wearable enriches TLC significantly by feeding live HRV, sleep quality, recovery, and strain data into every insight. But it is entirely optional. Without one, you enter a manual biometric baseline (resting heart rate, daily steps) and TLC builds from your nutrition and reflection data alone. Many members find this more than enough to start seeing meaningful patterns. You can connect a wearable at any point. TLC supports 25+ devices including Oura, WHOOP, Fitbit, Garmin, and Apple Watch.</div>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)">
          How long does getting started take?
          <div class="faq-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>
        <div class="faq-a">
          <div class="faq-a-inner">The onboarding assessment takes around 5 minutes. It covers your goals, dietary preferences, allergies, spice tolerance, health conditions, and lifestyle. Connecting a wearable takes another 2 minutes. Your personalised nutrition blueprint is generated instantly. Your first Dynamic Insight arrives the same evening. There is no lengthy setup, no food diary to manually populate, and no waiting period.</div>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)">
          Can I cancel at any time?
          <div class="faq-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>
        <div class="faq-a">
          <div class="faq-a-inner">Yes, with no penalty and no questions asked. Cancel from your profile settings in under 30 seconds and your access continues until the end of the billing period. You will never be charged again after cancellation. If you return within 12 months, your full data history is waiting for you exactly as you left it.</div>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q" onclick="toggleFaq(this)">
          How does TLC handle my health data?
          <div class="faq-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>
        <div class="faq-a">
          <div class="faq-a-inner">Your data is stored securely and used exclusively to power your personal insights. It is never sold to third parties, never used for advertising, and never shared without your explicit consent. Wearable data is accessed via the Terra API, a regulated health data integration platform. You can request a full export or permanent deletion of your data at any time from your profile settings, with no delay and no forms to complete.</div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- GUARANTEE -->
<section class="guarantee-section">
  <div class="container">
    <div class="guarantee-icon reveal">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L5 7v8c0 5.25 3.85 10.15 9 11.35C19.15 25.15 23 20.25 23 15V7L14 3z" stroke="#2ea84a" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M9.5 14l3 3 6-6" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h2 class="reveal d1">30-DAY PROMISE</h2>
    <p class="reveal d2">If TLC has not shown you something genuinely useful about your health patterns within the first 30 days, email us and we will refund every penny. No conditions, no hoops, no need to justify it.</p>
  </div>
</section>

<!-- FINAL CTA -->
<section class="cta-section">
  <canvas class="cta-nebula" id="ctaNebula"></canvas>
  <div class="container cta-inner">
    <div class="label reveal">Start today</div>
    <h2 class="reveal d1">YOUR FIRST<br>INSIGHT TONIGHT.</h2>
    <span class="cta-sub reveal d2">Free to start. No credit card required.</span>
    <div class="cta-actions reveal d3">
      <a href="https://tlc-onboarding-lite.chris-ec5.workers.dev" class="btn btn-green" style="padding:18px 48px;font-size:13px;">Start Free</a>
      <a href="https://tlc-onboarding.chris-ec5.workers.dev?path=tlc" class="btn btn-outline-white" style="padding:18px 48px;font-size:13px;">Start TLC ($9.99/mo)</a>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef">
        <p>Joining the dots between nutrition, body, and mind - so you can see the patterns that matter.</p>
      </div>
      <div class="footer-col">
        <h4>Product</h4>
        <ul>
          <li><a href="/features">Features</a></li>
          <li><a href="/how-it-works">How It Works</a></li>
          <li><a href="/why-tlc">Why TLC</a></li>
          <li><a href="/pricing">Pricing</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Get started</h4>
        <ul>
          <li><a href="https://tlc-onboarding-lite.chris-ec5.workers.dev">TLC Lite (free)</a></li>
          <li><a href="https://tlc-onboarding.chris-ec5.workers.dev?path=tlc">TLC ($9.99/mo)</a></li>
          <li><a href="https://tlc-onboarding.chris-ec5.workers.dev?path=pro">TLC Pro ($19.99/mo)</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="mailto:hello@thelongevitychef.io">Contact</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-legal">2026 The Longevity Chef. All rights reserved.</span>
      <span class="footer-legal">Built for people who want to understand their body, not just track it.</span>
    </div>
  </div>
</footer>

<script>
// ── NAV ──
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });

function toggleMobileNav() {
  const btn = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('mobileOverlay');
  btn.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
}
document.getElementById('hamburgerBtn').addEventListener('click', toggleMobileNav);

// ── LOGIN MODAL ──
function openLogin() {
  document.getElementById('loginOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('loginEmail').focus(), 100);
}
function closeLogin() {
  document.getElementById('loginOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('navLoginBtn').addEventListener('click', e => { e.preventDefault(); openLogin(); });
document.getElementById('mobileLoginBtn').addEventListener('click', e => { e.preventDefault(); toggleMobileNav(); setTimeout(openLogin, 300); });
document.getElementById('loginClose').addEventListener('click', closeLogin);
document.getElementById('loginOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeLogin(); });
document.getElementById('loginSubmit').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginSubmit');
  errorEl.style.display = 'none';
  if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { errorEl.textContent = 'Please enter a valid email address.'; errorEl.style.display = 'block'; return; }
  btn.disabled = true; btn.textContent = 'Sending...';
  try {
    const res = await fetch('https://tlc-engine.chris-ec5.workers.dev/api/magic-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await res.json();
    if (data.success) { document.getElementById('loginForm').style.display = 'none'; document.getElementById('loginSuccess').style.display = 'block'; }
    else { errorEl.textContent = data.error || 'Something went wrong. Please try again.'; errorEl.style.display = 'block'; btn.disabled = false; btn.textContent = 'Send login link'; }
  } catch { errorEl.textContent = 'Connection error. Please try again.'; errorEl.style.display = 'block'; btn.disabled = false; btn.textContent = 'Send login link'; }
});


// ── FAQ ──
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── REVEAL (Intersection Observer) ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal, .reveal-scale').forEach(el => observer.observe(el));

// ── NEBULA CANVAS (CTA) ──
(function() {
  const canvas = document.getElementById('ctaNebula');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor(W * H / 5200), 90);
    for (let i = 0; i < count; i++) {
      particles.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + 0.3, vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22, opacity: Math.random() * 0.5 + 0.15 });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = \`rgba(70,196,97,\${p.opacity})\`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });
    // lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = \`rgba(70,196,97,\${0.08 * (1 - dist / 100)})\`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', () => { resize(); init(); });
  init(); draw();
})();
</script>
</body>
</html>
`;
// PRICING_HTML_END

// START_HTML_START
const START_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Get Started | The Longevity Chef</title>
<meta name="description" content="Tell us what you are looking to achieve. TLC will find the right path for you.">
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
}

body {
  background: var(--surface);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.65;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#nebulaCanvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.3;
}

/* ── HEADER ── */
header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px clamp(24px, 5vw, 72px);
  background: rgba(245,244,240,0);
}
.header-logo img { height: 48px; width: auto; display: block; }
.header-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  text-decoration: none;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.2s;
}
.header-back:hover { color: var(--ink); }
.header-back svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* ── MAIN ── */
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px);
  position: relative;
  z-index: 1;
}

.start-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--green);
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeUp 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s forwards;
}
.start-eyebrow::before { content: ''; width: 18px; height: 1.5px; background: var(--green); }

@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

.start-headline {
  font-family: var(--font-display);
  font-size: clamp(48px, 7vw, 92px);
  line-height: 0.9;
  letter-spacing: 0.02em;
  color: var(--ink);
  text-align: center;
  margin-bottom: 16px;
  opacity: 0;
  animation: fadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s forwards;
}

.start-sub {
  font-size: clamp(15px, 1.6vw, 18px);
  font-weight: 300;
  color: var(--muted-2);
  text-align: center;
  max-width: 420px;
  line-height: 1.75;
  margin-bottom: 56px;
  opacity: 0;
  animation: fadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s forwards;
}

/* ── GOAL CARDS ── */
.goal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 900px;
  opacity: 0;
  animation: fadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.4s forwards;
}

.goal-card {
  background: var(--white);
  border: 1.5px solid var(--border-mid);
  border-radius: 20px;
  padding: 32px 28px 28px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}
.goal-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: 20px 20px 0 0;
  opacity: 0;
  transition: opacity 0.3s;
}
.goal-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 56px rgba(0,0,0,0.10);
  border-color: transparent;
}
.goal-card:hover::before { opacity: 1; }

.goal-card.gc-free::before { background: linear-gradient(90deg, var(--nutrition), var(--green)); }
.goal-card.gc-tlc::before { background: linear-gradient(90deg, var(--green), var(--green-dark)); }
.goal-card.gc-pro::before { background: linear-gradient(90deg, var(--body-blue), #1d5c7a); }

.goal-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.gc-free .goal-icon { background: rgba(57,186,118,0.10); }
.gc-tlc .goal-icon { background: rgba(46,168,74,0.10); }
.gc-pro .goal-icon { background: rgba(57,140,186,0.10); }
.goal-icon svg { width: 26px; height: 26px; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.gc-free .goal-icon svg { stroke: var(--nutrition); }
.gc-tlc .goal-icon svg { stroke: var(--green); }
.gc-pro .goal-icon svg { stroke: var(--body-blue); }

.goal-tier-pill {
  display: inline-flex;
  align-items: center;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 5px;
  margin-bottom: 12px;
  width: fit-content;
}
.gc-free .goal-tier-pill { background: rgba(57,186,118,0.10); color: #2a9148; }
.gc-tlc .goal-tier-pill { background: rgba(46,168,74,0.10); color: var(--green-dark); }
.gc-pro .goal-tier-pill { background: rgba(57,140,186,0.10); color: #2b6e93; }

.goal-title {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.5vw, 30px);
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--ink);
  margin-bottom: 10px;
}
.goal-body {
  font-size: 13.5px;
  color: var(--muted-2);
  line-height: 1.7;
  flex: 1;
  margin-bottom: 24px;
}
.goal-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 24px;
}
.goal-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--muted-2);
}
.goal-features li svg { flex-shrink: 0; }

.goal-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  margin-top: auto;
}
.goal-cta-text {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.gc-free .goal-cta-text { color: var(--nutrition); }
.gc-tlc .goal-cta-text { color: var(--green); }
.gc-pro .goal-cta-text { color: var(--body-blue); }
.goal-cta-price {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
}
.goal-cta-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.gc-free .goal-cta-arrow { background: rgba(57,186,118,0.10); }
.gc-tlc .goal-cta-arrow { background: rgba(46,168,74,0.10); }
.gc-pro .goal-cta-arrow { background: rgba(57,140,186,0.10); }
.goal-card:hover .goal-cta-arrow { transform: translateX(3px); }
.goal-cta-arrow svg { width: 14px; height: 14px; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.gc-free .goal-cta-arrow svg { stroke: var(--nutrition); }
.gc-tlc .goal-cta-arrow svg { stroke: var(--green); }
.gc-pro .goal-cta-arrow svg { stroke: var(--body-blue); }

.start-note {
  margin-top: 32px;
  font-size: 12px;
  color: var(--muted);
  text-align: center;
  opacity: 0;
  animation: fadeUp 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.6s forwards;
}
.start-note span { color: var(--green); font-weight: 600; }

/* ── RESPONSIVE ── */
@media (max-width: 860px) {
  .goal-grid {
    grid-template-columns: 1fr;
    max-width: 480px;
  }
}
@media (max-width: 520px) {
  .start-headline { font-size: clamp(42px, 12vw, 72px); }
}
</style>
</head>
<body>

<canvas id="nebulaCanvas"></canvas>

<header>
  <a href="/" class="header-logo"><img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef"></a>
  <a href="/" class="header-back">
    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
    Back
  </a>
</header>

<main>
  <div class="start-eyebrow">Your path</div>
  <h1 class="start-headline">WHAT ARE YOU<br>LOOKING TO<br>ACHIEVE?</h1>
  <p class="start-sub">Choose what matters most to you right now. You can always change direction later.</p>

  <div class="goal-grid">

    <!-- FREE TIER -->
    <a href="https://tlc-onboarding-lite.chris-ec5.workers.dev" class="goal-card gc-free">
      <div class="goal-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
      </div>
      <div class="goal-tier-pill">TLC Lite &middot; Free</div>
      <h2 class="goal-title">SMARTER EATING<br>WHEN I'M OUT</h2>
      <p class="goal-body">Find dishes at nearby restaurants that fit your macros, allergies, and health goal. Any city, any menu, in seconds.</p>
      <ul class="goal-features">
        <li>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#39BA76" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Meal Matchmaker (3 searches/day)
        </li>
        <li>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#39BA76" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Personal nutrition blueprint
        </li>
        <li>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#39BA76" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Allergy and goal-aware matching
        </li>
      </ul>
      <div class="goal-cta">
        <div>
          <div class="goal-cta-text">Start free</div>
          <div class="goal-cta-price">No card required</div>
        </div>
        <div class="goal-cta-arrow">
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </a>

    <!-- TLC PAID TIER -->
    <a href="https://tlc-onboarding.chris-ec5.workers.dev?path=tlc" class="goal-card gc-tlc">
      <div class="goal-icon">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="4" cy="6" r="2" stroke-width="1.8"/><circle cx="20" cy="6" r="2" stroke-width="1.8"/><circle cx="12" cy="20" r="2" stroke-width="1.8"/><circle cx="12" cy="13" r="2.5" stroke-width="1.8"/><circle cx="12" cy="13" r="0.8" fill="currentColor" stroke="none"/><line x1="5.7" y1="7.2" x2="10.4" y2="11.6" stroke-width="1.6"/><line x1="18.3" y1="7.2" x2="13.6" y2="11.6" stroke-width="1.6"/><line x1="12" y1="15.5" x2="12" y2="18" stroke-width="1.6"/></svg>
      </div>
      <div class="goal-tier-pill">TLC &middot; $9.99/mo</div>
      <h2 class="goal-title">DAILY INSIGHT<br>INTO MY HEALTH</h2>
      <p class="goal-body">Connect your wearable, log meals, and receive a daily insight that joins the dots between nutrition, sleep, and how you feel.</p>
      <ul class="goal-features">
        <li>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Daily Dynamic Insights
        </li>
        <li>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Longevity Coach with full context
        </li>
        <li>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#2ea84a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          25+ wearables &bull; Pantry Pal &bull; Meal Analyser
        </li>
      </ul>
      <div class="goal-cta">
        <div>
          <div class="goal-cta-text">Start TLC</div>
          <div class="goal-cta-price">7-day free trial</div>
        </div>
        <div class="goal-cta-arrow">
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </a>

    <!-- TLC PRO TIER -->
    <a href="https://tlc-onboarding.chris-ec5.workers.dev?path=pro" class="goal-card gc-pro">
      <div class="goal-icon">
        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="3" stroke-width="1.8"/><path d="M16 2v4M8 2v4" stroke-width="1.8" stroke-linecap="round"/><line x1="3" y1="9" x2="21" y2="9" stroke-width="1.8"/><rect x="7" y="12" width="3" height="3" rx="0.5" fill="currentColor" stroke="none"/><rect x="14" y="12" width="3" height="3" rx="0.5" fill="currentColor" stroke="none"/><rect x="7" y="17" width="3" height="2" rx="0.5" fill="currentColor" stroke="none"/><rect x="14" y="17" width="3" height="2" rx="0.5" fill="currentColor" stroke="none"/></svg>
      </div>
      <div class="goal-tier-pill">TLC Pro &middot; $19.99/mo</div>
      <h2 class="goal-title">COMPLETE MEAL<br>PLANNING SYSTEM</h2>
      <p class="goal-body">Every meal of every day, planned around your biology, goals, and schedule. Auto-generated shopping lists, zero waste, fully adaptable.</p>
      <ul class="goal-features">
        <li>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#398CBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Weekly personalised meal plan
        </li>
        <li>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#398CBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Smart zero-waste shopping list
        </li>
        <li>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#398CBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Everything in TLC, plus daily Longevity Score
        </li>
      </ul>
      <div class="goal-cta">
        <div>
          <div class="goal-cta-text">Start TLC Pro</div>
          <div class="goal-cta-price">7-day free trial</div>
        </div>
        <div class="goal-cta-arrow">
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </a>

  </div>

  <p class="start-note">Not sure which to pick? <span>TLC Lite is always free.</span> You can upgrade at any time with no data loss.</p>
</main>

<script>
// ── Nebula ──
(function() {
  const canvas = document.getElementById('nebulaCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function initParticles() {
    particles = [];
    const count = Math.floor((W * H) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.4,
        a: Math.random() * 0.6 + 0.2
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = \`rgba(46,168,74,\${p.a})\`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = \`rgba(46,168,74,\${0.08 * (1 - dist / 100)})\`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize();
  initParticles();
  draw();
  window.addEventListener('resize', () => { resize(); initParticles(); });
})();
</script>

</body>
</html>
`;
// START_HTML_END

// PRIVACY_HTML_START
const PRIVACY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Privacy Policy | The Longevity Chef</title>
<meta name="description" content="How The Longevity Chef collects, uses, and protects your personal and health data.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
:root {
  --ink: #1a1a1a; --ink-2: #2e2e2e; --surface: #f5f4f0; --white: #ffffff;
  --green: #2ea84a; --green-dark: #1a5c28; --green-light: #ebf7ee;
  --muted: rgba(26,26,26,0.42); --muted-2: rgba(26,26,26,0.65);
  --border: rgba(26,26,26,0.08); --border-mid: rgba(26,26,26,0.14);
  --font-display: 'Bebas Neue', sans-serif; --font-body: 'Figtree', sans-serif;
  --gutter: clamp(24px, 5vw, 72px); --content-max: 800px;
}
body { background: var(--white); color: var(--ink); font-family: var(--font-body); font-size: 16px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
header { display: flex; align-items: center; justify-content: space-between; padding: 20px var(--gutter); border-bottom: 1px solid var(--border); }
header img { height: 44px; width: auto; }
.header-back { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--muted); text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s; }
.header-back:hover { color: var(--ink); }
.header-back svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
main { max-width: var(--content-max); margin: 0 auto; padding: clamp(48px,8vw,80px) var(--gutter) 120px; }
.doc-label { font-size: 10px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; color: var(--green); margin-bottom: 16px; }
h1 { font-family: var(--font-display); font-size: clamp(48px, 6vw, 72px); line-height: 0.92; letter-spacing: 0.02em; color: var(--ink); margin-bottom: 20px; }
.doc-meta { font-size: 13px; color: var(--muted); margin-bottom: 48px; border-bottom: 1px solid var(--border); padding-bottom: 24px; }
h2 { font-family: var(--font-display); font-size: 28px; letter-spacing: 0.03em; color: var(--ink); margin: 40px 0 12px; }
h3 { font-size: 15px; font-weight: 700; color: var(--ink-2); margin: 24px 0 8px; }
p { font-size: 15px; color: var(--muted-2); line-height: 1.75; margin-bottom: 16px; }
ul { padding-left: 20px; margin-bottom: 16px; }
ul li { font-size: 15px; color: var(--muted-2); line-height: 1.75; margin-bottom: 6px; }
a { color: var(--green); text-decoration: none; }
a:hover { text-decoration: underline; }
.highlight-box { background: var(--green-light); border: 1.5px solid rgba(46,168,74,0.18); border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
.highlight-box p { color: var(--ink-2); margin: 0; }
footer { text-align: center; padding: 32px var(--gutter); border-top: 1px solid var(--border); font-size: 13px; color: var(--muted); }
footer a { color: var(--green); }
</style>
</head>
<body>

<header>
  <a href="/"><img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef"></a>
  <a href="/" class="header-back">
    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
    Back
  </a>
</header>

<main>
  <div class="doc-label">Legal</div>
  <h1>PRIVACY<br>POLICY</h1>
  <p class="doc-meta">Last updated: 1 April 2026 &nbsp;&middot;&nbsp; The Longevity Chef Ltd &nbsp;&middot;&nbsp; hello@thelongevitychef.io</p>

  <div class="highlight-box">
    <p><strong>The short version:</strong> Your health data is yours. We use it exclusively to power your personal insights. We never sell it, never share it for advertising, and you can delete it at any time.</p>
  </div>

  <h2>1. WHO WE ARE</h2>
  <p>The Longevity Chef ("TLC", "we", "us") operates the web application available at thelongevitychef.io. We are committed to protecting your privacy and handling your health data with the highest level of care.</p>

  <h2>2. WHAT DATA WE COLLECT</h2>

  <h3>Account information</h3>
  <ul>
    <li>Email address (used for login and notifications)</li>
    <li>Name (optional, used for personalisation)</li>
    <li>Account creation date and tier</li>
  </ul>

  <h3>Health and wellness data</h3>
  <ul>
    <li>Age, sex, height, weight, and body composition data you provide</li>
    <li>Health goals, dietary restrictions, allergies, and food preferences</li>
    <li>Meals logged through the app or analysed via photo</li>
    <li>Evening reflections including mood, energy, focus, and stress ratings</li>
    <li>Wearable biometric data (HRV, sleep, resting heart rate, activity) accessed via Terra API with your explicit consent</li>
    <li>Manual biometric baselines (daily steps, resting heart rate) if no wearable is connected</li>
  </ul>

  <h3>Usage data</h3>
  <ul>
    <li>Pages visited and features used within the application</li>
    <li>Search queries within Meal Matchmaker (location is used in real-time and not stored)</li>
    <li>Error logs and performance data to improve the service</li>
  </ul>

  <h2>3. HOW WE USE YOUR DATA</h2>
  <p>Your data is used exclusively to:</p>
  <ul>
    <li>Generate your personalised Daily Dynamic Insights and weekly strategy</li>
    <li>Provide context to your Longevity Coach</li>
    <li>Match restaurant dishes to your macro targets, goals, and dietary restrictions in Meal Matchmaker</li>
    <li>Calculate your Longevity Score</li>
    <li>Send you optional email notifications (daily insight, weekly summary, reminders)</li>
    <li>Improve the accuracy of our insight and recommendation systems</li>
  </ul>

  <p>We do not use your health data to train generalised machine learning models or share it in aggregated form without complete anonymisation.</p>

  <h2>4. WEARABLE DATA (TERRA API)</h2>
  <p>If you connect a wearable device, your biometric data is accessed through Terra API, a regulated health data integration platform. Terra acts as a data processor on our behalf. Data is accessed only with your explicit authorisation and is stored securely within our system. You can disconnect your wearable and revoke Terra's access at any time from your profile settings.</p>

  <h2>5. DATA SHARING</h2>
  <p>We do not sell your personal or health data. We do not share your data with advertisers or marketing partners. Data may be shared only with:</p>
  <ul>
    <li><strong>Service providers</strong> who operate under strict data processing agreements (e.g., Cloudflare for infrastructure, OpenAI for insight generation, Terra for wearable integration, Google Places for restaurant discovery)</li>
    <li><strong>Legal authorities</strong> if required by applicable law</li>
  </ul>

  <h2>6. DATA RETENTION</h2>
  <p>Your data is retained for the duration of your account plus 12 months after cancellation, giving you time to return without losing your history. After 12 months following cancellation, all personal data is permanently deleted. You can request immediate deletion at any time from your profile settings.</p>

  <h2>7. YOUR RIGHTS</h2>
  <p>You have the right to:</p>
  <ul>
    <li>Access all data we hold about you (available in profile settings)</li>
    <li>Export your full data history at any time</li>
    <li>Correct inaccurate data</li>
    <li>Delete your account and all associated data</li>
    <li>Opt out of email notifications at any time</li>
    <li>Disconnect your wearable and revoke biometric data access</li>
  </ul>
  <p>To exercise any of these rights, use your profile settings or contact us at <a href="mailto:hello@thelongevitychef.io">hello@thelongevitychef.io</a>.</p>

  <h2>8. SECURITY</h2>
  <p>Your data is stored on Cloudflare's global infrastructure, encrypted in transit (TLS) and at rest. We use magic link authentication, meaning you never create a password and credential theft is not a risk for your account access. We conduct regular security reviews and follow OWASP security best practices.</p>

  <h2>9. COOKIES AND TRACKING</h2>
  <p>TLC uses minimal session cookies necessary for authentication and preference storage. We do not use third-party advertising cookies or cross-site tracking pixels.</p>

  <h2>10. CHANGES TO THIS POLICY</h2>
  <p>We will notify you by email if we make material changes to this policy. The "last updated" date at the top of this page will always reflect the most recent version.</p>

  <h2>11. CONTACT</h2>
  <p>For privacy questions or data requests, contact us at <a href="mailto:hello@thelongevitychef.io">hello@thelongevitychef.io</a>. We respond within 3 business days.</p>
</main>

<footer>
  &copy; 2026 The Longevity Chef. &nbsp;&middot;&nbsp; <a href="/terms">Terms of Service</a> &nbsp;&middot;&nbsp; <a href="/privacy">Privacy Policy</a>
</footer>

</body>
</html>
`;
// PRIVACY_HTML_END

// TERMS_HTML_START
const TERMS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Terms of Service | The Longevity Chef</title>
<meta name="description" content="The terms and conditions governing your use of The Longevity Chef application and services.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet">
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
:root {
  --ink: #1a1a1a; --ink-2: #2e2e2e; --surface: #f5f4f0; --white: #ffffff;
  --green: #2ea84a; --green-dark: #1a5c28; --green-light: #ebf7ee;
  --muted: rgba(26,26,26,0.42); --muted-2: rgba(26,26,26,0.65);
  --border: rgba(26,26,26,0.08); --border-mid: rgba(26,26,26,0.14);
  --font-display: 'Bebas Neue', sans-serif; --font-body: 'Figtree', sans-serif;
  --gutter: clamp(24px, 5vw, 72px); --content-max: 800px;
}
body { background: var(--white); color: var(--ink); font-family: var(--font-body); font-size: 16px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
header { display: flex; align-items: center; justify-content: space-between; padding: 20px var(--gutter); border-bottom: 1px solid var(--border); }
header img { height: 44px; width: auto; }
.header-back { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--muted); text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s; }
.header-back:hover { color: var(--ink); }
.header-back svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
main { max-width: var(--content-max); margin: 0 auto; padding: clamp(48px,8vw,80px) var(--gutter) 120px; }
.doc-label { font-size: 10px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; color: var(--green); margin-bottom: 16px; }
h1 { font-family: var(--font-display); font-size: clamp(48px, 6vw, 72px); line-height: 0.92; letter-spacing: 0.02em; color: var(--ink); margin-bottom: 20px; }
.doc-meta { font-size: 13px; color: var(--muted); margin-bottom: 48px; border-bottom: 1px solid var(--border); padding-bottom: 24px; }
h2 { font-family: var(--font-display); font-size: 28px; letter-spacing: 0.03em; color: var(--ink); margin: 40px 0 12px; }
h3 { font-size: 15px; font-weight: 700; color: var(--ink-2); margin: 24px 0 8px; }
p { font-size: 15px; color: var(--muted-2); line-height: 1.75; margin-bottom: 16px; }
ul { padding-left: 20px; margin-bottom: 16px; }
ul li { font-size: 15px; color: var(--muted-2); line-height: 1.75; margin-bottom: 6px; }
a { color: var(--green); text-decoration: none; }
a:hover { text-decoration: underline; }
.highlight-box { background: var(--surface); border: 1.5px solid rgba(26,26,26,0.10); border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
.highlight-box p { color: var(--ink-2); margin: 0; }
footer { text-align: center; padding: 32px var(--gutter); border-top: 1px solid var(--border); font-size: 13px; color: var(--muted); }
footer a { color: var(--green); }
</style>
</head>
<body>

<header>
  <a href="/"><img src="https://fb23a745936a999cb3899f128489a23b.cdn.bubble.io/f1771378911633x956768063650322200/TLC_NEW-removebg-preview.png" alt="The Longevity Chef"></a>
  <a href="/" class="header-back">
    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
    Back
  </a>
</header>

<main>
  <div class="doc-label">Legal</div>
  <h1>TERMS OF<br>SERVICE</h1>
  <p class="doc-meta">Last updated: 1 April 2026 &nbsp;&middot;&nbsp; The Longevity Chef Ltd &nbsp;&middot;&nbsp; hello@thelongevitychef.io</p>

  <div class="highlight-box">
    <p><strong>Important:</strong> TLC provides wellness information and personalised insights for educational purposes. It is not a medical service and does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.</p>
  </div>

  <h2>1. ACCEPTANCE OF TERMS</h2>
  <p>By creating an account or using The Longevity Chef application ("TLC", "the Service"), you agree to these Terms of Service. If you do not agree, do not use the Service.</p>

  <h2>2. DESCRIPTION OF SERVICE</h2>
  <p>TLC is a personal wellness application that connects nutritional data, wearable biometric data, and personal reflections to generate insights, recommendations, and strategies for improving health and longevity. The Service includes:</p>
  <ul>
    <li>Daily Dynamic Insights and weekly strategy generation</li>
    <li>Meal Matchmaker (restaurant dish recommendations)</li>
    <li>Longevity Coach (personalised wellness guidance)</li>
    <li>Pantry Pal (recipe generation)</li>
    <li>Meal Analyser (photo-based nutritional analysis)</li>
    <li>Longevity Score (composite wellness metric)</li>
    <li>Wearable device integration via Terra API</li>
  </ul>

  <h2>3. ELIGIBILITY</h2>
  <p>You must be at least 18 years of age to use TLC. By using the Service, you represent and warrant that you meet this requirement.</p>

  <h2>4. ACCOUNT REGISTRATION</h2>
  <p>You must provide accurate information when creating your account. You are responsible for maintaining the security of your account. TLC uses magic link authentication sent to your registered email; you are responsible for keeping your email account secure. Notify us immediately if you suspect unauthorised access to your account.</p>

  <h2>5. SUBSCRIPTIONS AND BILLING</h2>

  <h3>TLC Lite</h3>
  <p>TLC Lite is free forever with no credit card required. Access to Meal Matchmaker (3 searches per day) and your personal nutrition blueprint is included at no cost.</p>

  <h3>TLC ($9.99/month)</h3>
  <p>TLC is a monthly subscription billed at $9.99 per month. A 7-day free trial is available for new subscribers. Your subscription renews automatically each month until cancelled.</p>

  <h3>TLC Pro ($19.99/month)</h3>
  <p>TLC Pro is a monthly subscription billed at $19.99 per month. A 7-day free trial is available for new subscribers. Your subscription renews automatically each month until cancelled.</p>

  <h3>Cancellation</h3>
  <p>You may cancel your subscription at any time from your profile settings. Cancellation takes effect at the end of the current billing period. You will not be charged again after cancellation. No refunds are provided for partial billing periods, except where required by applicable law.</p>

  <h3>30-day Promise</h3>
  <p>If TLC has not shown you something genuinely useful about your health patterns within your first 30 days, contact us at hello@thelongevitychef.io and we will issue a full refund. No conditions apply.</p>

  <h2>6. HEALTH DISCLAIMER</h2>
  <p>TLC is a wellness information service and not a medical service. The insights, recommendations, and coaching provided by TLC:</p>
  <ul>
    <li>Are for informational and educational purposes only</li>
    <li>Do not constitute medical advice, diagnosis, or treatment</li>
    <li>Should not replace consultation with a qualified healthcare professional</li>
    <li>Should not be used as the sole basis for health-related decisions</li>
  </ul>
  <p>If you have a medical condition, are pregnant, or have specific health concerns, consult your doctor before making changes to your diet, exercise, or lifestyle based on TLC insights.</p>

  <h2>7. NUTRITIONAL AND MACRO DATA</h2>
  <p>Calorie and macronutrient estimates provided by TLC (particularly within Meal Matchmaker and Meal Analyser) are estimates based on publicly available nutritional information and computational analysis. They are not guaranteed to be accurate and should not be relied upon for medical nutrition therapy. TLC provides confidence indicators where available.</p>

  <h2>8. ACCEPTABLE USE</h2>
  <p>You agree not to:</p>
  <ul>
    <li>Use the Service in any way that violates applicable laws or regulations</li>
    <li>Attempt to access other users' accounts or data</li>
    <li>Reverse engineer, decompile, or attempt to extract the source code of the Service</li>
    <li>Use automated means to access the Service without our express permission</li>
    <li>Provide false health information that could result in inappropriate recommendations</li>
  </ul>

  <h2>9. INTELLECTUAL PROPERTY</h2>
  <p>All content, features, and functionality of TLC (including but not limited to the Dynamic Insight system, scoring algorithms, and design) are owned by The Longevity Chef Ltd and are protected by applicable intellectual property laws. Your personal data and health information remain yours.</p>

  <h2>10. LIMITATION OF LIABILITY</h2>
  <p>To the maximum extent permitted by applicable law, The Longevity Chef Ltd shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability to you for any claim arising from these Terms shall not exceed the amount you paid to us in the 12 months preceding the claim.</p>

  <h2>11. CHANGES TO THE SERVICE</h2>
  <p>We reserve the right to modify, suspend, or discontinue any part of the Service at any time. We will provide reasonable notice for material changes that affect paid subscribers.</p>

  <h2>12. TERMINATION</h2>
  <p>We may suspend or terminate your account if you violate these Terms. You may delete your account at any time from your profile settings. Upon termination, your data will be retained for 12 months in accordance with our Privacy Policy, then permanently deleted.</p>

  <h2>13. GOVERNING LAW</h2>
  <p>These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

  <h2>14. CONTACT</h2>
  <p>For questions about these Terms, contact us at <a href="mailto:hello@thelongevitychef.io">hello@thelongevitychef.io</a>.</p>
</main>

<footer>
  &copy; 2026 The Longevity Chef. &nbsp;&middot;&nbsp; <a href="/terms">Terms of Service</a> &nbsp;&middot;&nbsp; <a href="/privacy">Privacy Policy</a>
</footer>

</body>
</html>
`;
// TERMS_HTML_END

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
        version: '2.0.0'
      }), {
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'GET') {
      const path = url.pathname.replace(/\/$/, '') || '/';
      let html;
      if (path === '/' || path === '') html = LANDING_HTML;
      else if (path === '/features') html = FEATURES_HTML;
      else if (path === '/how-it-works') html = HOW_IT_WORKS_HTML;
      else if (path === '/why-tlc') html = WHY_TLC_HTML;
      else if (path === '/pricing') html = PRICING_HTML;
      else if (path === '/start') html = START_HTML;
      else if (path === '/privacy') html = PRIVACY_HTML;
      else if (path === '/terms') html = TERMS_HTML;
      else {
        return new Response('Not Found', { status: 404, headers: cors });
      }

      return new Response(html, {
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
