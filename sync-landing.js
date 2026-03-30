#!/usr/bin/env node
// Reads landing.html and embeds it as a template literal in src/index.js
// Run before deploy: node sync-landing.js

const fs = require('fs');
const path = require('path');

const landingPath = path.join(__dirname, 'landing.html');
const workerPath = path.join(__dirname, 'src', 'index.js');

const landingHTML = fs.readFileSync(landingPath, 'utf8');
let workerSource = fs.readFileSync(workerPath, 'utf8');

const startMarker = '// LANDING_HTML_START';
const endMarker = '// LANDING_HTML_END';

const landingStart = workerSource.indexOf(startMarker);
const landingEnd = workerSource.indexOf(endMarker);

if (landingStart === -1 || landingEnd === -1) {
  console.error('Could not find LANDING_HTML_START / LANDING_HTML_END markers in src/index.js');
  process.exit(1);
}

const escaped = landingHTML.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const block = `// LANDING_HTML_START\nconst LANDING_HTML = \`${escaped}\`;\n// LANDING_HTML_END`;

workerSource = workerSource.slice(0, landingStart) + block + workerSource.slice(landingEnd + endMarker.length);

fs.writeFileSync(workerPath, workerSource, 'utf8');
console.log('Landing HTML synced into src/index.js');
