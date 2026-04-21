#!/usr/bin/env node
// Rasterizes public/favicon.svg into the two PNG sizes the site ships:
//   favicon-32.png   — 32x32, used by browsers and tabs
//   favicon-180.png  — 180x180, used by iOS Apple-touch-icon
//
// Uses @resvg/resvg-js (already installed for OG image generation) so there's
// no extra dependency. Re-run with `node scripts/generate-favicons.mjs`
// whenever the source SVG changes.

import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '../public');
const SRC = path.join(PUBLIC, 'favicon.svg');
const svg = fs.readFileSync(SRC, 'utf8');

const sizes = [
  { out: 'favicon-32.png', px: 32 },
  { out: 'favicon-180.png', px: 180 },
];

for (const { out, px } of sizes) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: px },
    background: 'rgba(0,0,0,0)',
  });
  const pngData = resvg.render().asPng();
  const target = path.join(PUBLIC, out);
  fs.writeFileSync(target, pngData);
  console.log(`[favicon] ${out}  ${px}x${px}  (${pngData.length.toLocaleString()} bytes)`);
}

console.log('[favicon] Done. Rebuild the site to pick up new icons.');
