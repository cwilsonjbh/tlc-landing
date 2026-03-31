#!/usr/bin/env node
// Reads all 5 HTML page files and embeds them as template literals in src/index.js
// Run before deploy: node sync-pages.js

const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, 'src', 'index.js');

const pages = [
  { file: 'homepage.html',     start: '// LANDING_HTML_START',     end: '// LANDING_HTML_END',     const: 'LANDING_HTML' },
  { file: 'features.html',     start: '// FEATURES_HTML_START',    end: '// FEATURES_HTML_END',    const: 'FEATURES_HTML' },
  { file: 'how-it-works.html', start: '// HOW_IT_WORKS_HTML_START',end: '// HOW_IT_WORKS_HTML_END',const: 'HOW_IT_WORKS_HTML' },
  { file: 'why-tlc.html',      start: '// WHY_TLC_HTML_START',     end: '// WHY_TLC_HTML_END',     const: 'WHY_TLC_HTML' },
  { file: 'pricing.html',      start: '// PRICING_HTML_START',     end: '// PRICING_HTML_END',     const: 'PRICING_HTML' },
];

let workerSource = fs.readFileSync(workerPath, 'utf8');

for (const page of pages) {
  const filePath = path.join(__dirname, page.file);

  if (!fs.existsSync(filePath)) {
    console.error(`Missing: ${page.file} — skipping`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const startIdx = workerSource.indexOf(page.start);
  const endIdx   = workerSource.indexOf(page.end);

  if (startIdx === -1 || endIdx === -1) {
    console.error(`Markers not found for ${page.file} (${page.start} / ${page.end})`);
    process.exit(1);
  }

  const escaped = html
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  const block = `${page.start}\nconst ${page.const} = \`${escaped}\`;\n${page.end}`;

  workerSource =
    workerSource.slice(0, startIdx) +
    block +
    workerSource.slice(endIdx + page.end.length);

  console.log(`Synced: ${page.file} → ${page.const}`);
}

fs.writeFileSync(workerPath, workerSource, 'utf8');
console.log('All pages synced into src/index.js');
