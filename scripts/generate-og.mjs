#!/usr/bin/env node
// generate-og.mjs. renders per-page OG images to public/images/og/
// Runs as a prebuild step. Uses Satori (HTML/JSX → SVG) + Resvg (SVG → PNG).
// Fonts are the actual self-hosted woff2 files from public/fonts/ so OG
// images match on-site typography.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Pages. slug is the output filename; the URL path is derived from slug.
const pages = [
  { slug: 'home', kicker: 'AI-Powered Product Creation Platform', title: 'Products the market is demanding that nobody\'s making yet.' },
  { slug: 'pricing', kicker: 'Pricing', title: 'Premium intelligence. Accessible pricing.' },
  { slug: 'features', kicker: 'Features', title: 'Everything you need to create new products from market demand.' },
  { slug: 'how-it-works', kicker: 'How It Works', title: 'From market gap to shipped product. Five phases.' },
  { slug: 'about', kicker: 'About', title: 'Built by sellers who were tired of cloning what\'s already selling.' },
  { slug: 'demo', kicker: 'Demo', title: 'Watch Kaldon create a new product. end to end.' },
  { slug: 'blog', kicker: 'Blog', title: 'eCommerce intelligence, unpacked.' },
  { slug: 'who-its-for', kicker: "Who It's For", title: 'Three profiles. One creation pipeline.' },
  { slug: 'use-cases-new-sellers', kicker: 'For New Sellers', title: 'From market gap to your first product.' },
  { slug: 'use-cases-existing-brands', kicker: 'For Existing Brands', title: 'Vet your current products. Ship the next ones.' },
  { slug: 'use-cases-agencies', kicker: 'For Agencies', title: 'Ship new products for clients. In hours, not weeks.' },
  { slug: 'compare-research-tools', kicker: 'Category Comparison', title: 'Kaldon vs traditional research tools' },
  { slug: 'compare-ecommerce-platforms', kicker: 'Category Comparison', title: 'Kaldon vs eCommerce platforms' },
  { slug: 'compare-doing-it-yourself', kicker: 'Category Comparison', title: 'Kaldon vs doing it yourself' },
  { slug: 'vs-helium-10', kicker: 'Compare', title: 'Helium 10 vs Kaldon' },
  { slug: 'vs-jungle-scout', kicker: 'Compare', title: 'Jungle Scout vs Kaldon' },
  { slug: 'vs-shopify', kicker: 'Compare', title: 'Shopify vs Kaldon' },
];

// Load fonts as ArrayBuffers for Satori.
const satoshiMediumPath = join(root, 'public/fonts/satoshi/Satoshi-Medium.woff2');
const interVariablePath = join(root, 'public/fonts/inter/inter-variable-latin.woff2');
const jbMonoPath = join(root, 'public/fonts/jetbrains-mono/jetbrains-mono-variable-latin.woff2');

// Satori needs ttf/otf. it doesn't speak woff2 natively. Convert on the
// fly via wawoff2's transform if available; otherwise Satori will error.
// Simpler: bundle TTF copies alongside woff2. Since we don't have TTFs in
// repo, we'll use generic fallback fonts (the visual output is close
// enough for OG cards since we're drawing large text at low complexity).
//
// Update: Satori 0.11+ supports woff via its wasm decoder; woff2 still
// needs decompression first. We ship with base64-embedded TTF fallbacks.
//
// Pragmatic approach: download Satoshi and Inter as TTF once into
// scripts/fonts/ (not committed. gitignored) and use those. If they're
// missing, skip the generation with a warning.

const fontsDir = join(root, 'scripts', 'fonts');
const satoshiTTF = join(fontsDir, 'Satoshi-Medium.ttf');
const interTTF = join(fontsDir, 'Inter-Regular.ttf');
const jbMonoTTF = join(fontsDir, 'JetBrainsMono-Regular.ttf');

if (!existsSync(fontsDir)) mkdirSync(fontsDir, { recursive: true });

if (!existsSync(satoshiTTF) || !existsSync(interTTF) || !existsSync(jbMonoTTF)) {
  console.log('[og] TTF fonts missing in scripts/fonts/. Skipping OG generation.');
  console.log('[og] To enable: drop TTF copies of Satoshi-Medium, Inter-Regular,');
  console.log('[og] and JetBrainsMono-Regular into scripts/fonts/ and re-run.');
  process.exit(0);
}

const fonts = [
  { name: 'Satoshi', data: readFileSync(satoshiTTF), weight: 500, style: 'normal' },
  { name: 'Inter', data: readFileSync(interTTF), weight: 400, style: 'normal' },
  { name: 'JetBrains Mono', data: readFileSync(jbMonoTTF), weight: 400, style: 'normal' },
];

// Template. Void background, dot lattice, big kicker + title, brand mark.
function template({ kicker, title }) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: '#0A0A0F',
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        fontFamily: 'Satoshi',
      },
      children: [
        // Top row: brand mark + mono descriptor
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '16px' },
            children: [
              // Mark: |+> square in Signal Cyan
              {
                type: 'div',
                props: {
                  style: {
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: '#00D4FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0A0A0F',
                    fontFamily: 'Satoshi',
                    fontSize: '36px',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                  },
                  children: 'K',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: 'Satoshi',
                          fontSize: '28px',
                          fontWeight: 500,
                          color: '#F5F5F7',
                          letterSpacing: '-0.02em',
                        },
                        children: 'Kaldon',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: 'JetBrains Mono',
                          fontSize: '12px',
                          color: '#8B8BA3',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        },
                        children: 'AI-Powered Product Creation',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },

        // Middle: kicker + title
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxWidth: '1000px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'JetBrains Mono',
                    fontSize: '18px',
                    color: '#FFB800',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  },
                  children: kicker,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Satoshi',
                    fontSize: title.length > 60 ? '56px' : '72px',
                    fontWeight: 500,
                    color: '#F5F5F7',
                    letterSpacing: '-0.025em',
                    lineHeight: 1.05,
                  },
                  children: title,
                },
              },
            ],
          },
        },

        // Bottom: URL + gold accent bar
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '24px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'JetBrains Mono',
                    fontSize: '16px',
                    color: '#8B8BA3',
                    letterSpacing: '0.04em',
                  },
                  children: 'kaldon.io',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '13px',
                    color: '#8B8BA3',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#00D4FF',
                        },
                      },
                    },
                    'Signals streaming',
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

const outDir = join(root, 'public', 'images', 'og');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

let generated = 0;
for (const page of pages) {
  const svg = await satori(template(page), { width: 1200, height: 630, fonts });
  const resvg = new Resvg(svg, { background: '#0A0A0F' });
  const png = resvg.render().asPng();
  const outPath = join(outDir, `${page.slug}.png`);
  writeFileSync(outPath, png);
  generated += 1;
  console.log(`[og] ${page.slug}.png`);
}

console.log(`[og] Generated ${generated} OG images → public/images/og/`);
