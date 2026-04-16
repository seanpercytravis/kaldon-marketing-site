# Kaldon Marketing Site — Design Brief (Synthesized from Research)

**Date:** 2026-04-16
**Sources:** V3 spec (authoritative) + 5 research agents (Linear/Stripe/Vercel computed CSS + 8 adjacent SaaS benchmarks + eCommerce vertical audit + Inter/Satoshi technical specs)
**Target:** 9+/10 quality vs. Linear/Stripe/Vercel apex; 8.5/10 realistic against Kaldon's direct competitor set (who top out at 6/10).

---

## Strategic reframe

The biggest finding from the research: **Linear's hero type is 64px, not 96px.** My initial assumption (Stripe/Vercel-size display at 80–96px) was only half right.

Two schools of world-class display:

| | Stripe / Vercel | Linear / Attio / Resend |
|---|---|---|
| H1 size | 72–96px | 54–64px |
| Weight | 500–600 | 500–510 (custom axis) |
| Tracking | -0.03em | -0.022em |
| Feel | marketing-display | **data-dense, editorial** |
| Category fit | consumer / finance / deploy | developer / data / B2B SaaS |

The V3 spec calls Kaldon **"Bloomberg Terminal meets Linear meets Stripe."** That aesthetic pulls toward Linear's school — data-dense, editorial, confident but not shouty. This is a positioning-correct choice: Kaldon is selling intelligence to people who trust data over theatrics. **64px display at weight 500, tight tracking, narrow column** is the right call over 96px marketing flash.

This also means: **less work to differentiate from Stripe-clones** (there are thousands) and more alignment with the serious-data-tool category (Linear, Attio, Supabase, Particl).

---

## Final design tokens

### Color

```css
/* V3 palette — authoritative */
--void:       #0A0A0F;   /* page background (NOT pure #000 — the V3 variant has a hint of blue) */
--deep-space: #12121A;   /* card surface, level 1 */
--graphite:   #1E1E2A;   /* nested surface, level 2, also border-solid */
--signal:     #00D4FF;   /* primary accent — LIVE DATA ONLY, never CTA */
--gold:       #FFB800;   /* premium accent — PRIMARY CTA ONLY */
--ghost:      #8B8BA3;   /* muted text, tertiary */
--chalk:      #F5F5F7;   /* primary text */

/* Derived tokens */
--surface-3:       #272733;   /* deepest elevation (inputs) */
--border-hairline: rgba(255,255,255,0.06);   /* Attio/Linear pattern */
--border-active:   rgba(255,255,255,0.14);   /* hover state */
--lattice:         rgba(255,255,255,0.04);   /* dot-grid background at <5% */
--text-secondary:  #C8CAD3;   /* second-tier text */
--text-quaternary: rgba(139,139,163,0.55);  /* deep-muted */
--gold-hover:      #FFC633;
--signal-glow:     rgba(0,212,255,0.15);    /* only on live-data ring indicators */
```

**Accent discipline — the iron rule:**
- **Gold `#FFB800`** = 100% of primary CTAs, active pricing tier, anything that is "click here". Never used for decoration.
- **Signal `#00D4FF`** = ONLY on live-data affordances (pulsing dot on "data streaming", active-state ring on the currently-viewed phase tab, in-chart callouts). NEVER on CTAs, NEVER on decorative gradients, NEVER as a headline highlight.
- **Every other color** = monochromatic Chalk / Ghost / semi-transparent whites.
- **The 10% rule:** accent colors combined should touch <10% of the page surface area. Everything else is Void / Deep Space / Chalk / Ghost.

**Why this discipline matters:** Adjacent-SaaS research flagged that Clerk already uses `#00D4FF` as a highlight cyan. Overusing Signal would make Kaldon look like a Clerk clone. Letting Gold carry primary warmth puts Kaldon in its own visual position.

### Typography

```css
/* V3 spec fonts */
--font-display: 'Satoshi-Variable', 'Inter Variable', 'SF Pro Display', system-ui, sans-serif;
--font-body:    'Inter Variable', 'SF Pro Text', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', ui-monospace, 'SF Mono', monospace;

/* Font features (Inter) */
body {
  font-family: var(--font-body);
  font-feature-settings: 'ss01', 'cv11';  /* alternate digits + single-story a */
  font-optical-sizing: auto;
}

/* Type scale — Linear-school, not Stripe-school */
--text-display:  clamp(48px, 6vw, 64px);    /* Hero H1 — matches Linear */
--text-h1:       clamp(40px, 5vw, 56px);    /* Page H1 */
--text-h2:       clamp(28px, 3.5vw, 40px);  /* Section headline */
--text-h3:       24px;                        /* Card headline */
--text-h4:       18px;                        /* Sub-headline */
--text-body-lg:  18px;                        /* Hero subhead */
--text-body:     16px;                        /* Default */
--text-body-sm:  15px;                        /* Inline secondary */
--text-small:    14px;                        /* Captions */
--text-kicker:   12px;                        /* Mono uppercase eyebrow */

/* Weight map */
--weight-display: 500;    /* Satoshi Medium — NOT 700/800 */
--weight-headline: 600;   /* Satoshi Semibold for smaller heads */
--weight-body: 400;
--weight-body-emphasis: 500;
--weight-kicker: 500;

/* Tracking (negative at display, positive on mono kickers) */
--tracking-display: -0.022em;   /* Linear's computed value */
--tracking-h1:      -0.02em;
--tracking-h2:      -0.015em;
--tracking-body:    -0.005em;
--tracking-kicker:  0.08em;     /* Vercel pattern */

/* Line heights — tight on display, open on body */
--leading-display: 1.05;
--leading-h1:      1.1;
--leading-h2:      1.15;
--leading-h3:      1.3;
--leading-body:    1.55;
--leading-body-lg: 1.5;
```

**The kicker pattern** (stolen from Vercel): every H2 gets a small Mono label above it — 12px uppercase, +0.08em tracking, color `--ghost`. This replaces the current "eyebrow" pattern and gives each section a "chapter label" feel.

**Example:**
```
INTELLIGENCE DEPTH          ← kicker (Mono 12px uppercase, Ghost)
See the Full Picture         ← H2 (Satoshi 40px weight 600, Chalk)
```

### Spacing & layout

```css
/* Container */
--container:       1200px;    /* Vercel/Linear standard — tighter than most SaaS 1440 */
--gutter-x:        clamp(16px, 3vw, 32px);

/* Section padding — matches Linear's 128px rhythm */
--section-y:       clamp(80px, 10vw, 128px);
--section-y-large: clamp(120px, 14vw, 180px);  /* Hero + pre-footer */

/* Grid */
--grid-gap:        16px;
--grid-gap-md:     24px;
--grid-gap-lg:     32px;

/* Radius — Linear school: sharp */
--radius-btn:  6px;
--radius-card: 12px;
--radius-xl:   16px;

/* Borders */
--border-width: 1px;
```

**No alternating section backgrounds.** The entire homepage shares `--void`. Separation is done via 1px hairlines and different content densities, exactly like Linear.

### Motion vocabulary — the hard part

The research agents were near-unanimous: **the world-class sites have LESS motion, not more.** Linear has no scroll-triggered fade-ups at all. Vercel has a dot lattice and a globe. Stripe has one WebGL gradient on the home hero only.

Motion inventory for Kaldon (intentionally short):

1. **Header scroll transition** — transparent → `rgba(10,10,15,0.8)` + `backdrop-filter: blur(20px)` with 1px hairline appearing. 100ms ease.
2. **Hero product panel 3D transform** — static transform (no scroll-scrubbing): `perspective: 4000px; rotateX(38deg) rotateY(30deg) rotate(325deg)`. Bottom fades to Void via CSS mask. **Linear pattern.**
3. **Single pulse dot** on one live-data indicator in the hero product pane — Signal Cyan, 16px, 1.75s cubic-bezier(0.66,0,0,1) infinite. Marks the "data streaming" moment.
4. **5-phase horizontal scroll-scrub (GSAP ScrollTrigger with containerAnimation)** — pinned section, vertical scroll → horizontal pan across 5 phase panels, `ease: "none"`. This is Kaldon's signature motion — turns the 5-phase story into a cinematic moment. Respects `prefers-reduced-motion` by falling back to a vertical stack.
5. **ScrollTrigger.batch for card reveals** — limited to pricing tiles and use-case cards. Staggered 120ms between batches, 400ms duration, `y: 12px → 0, opacity: 0 → 1`. **Single animation primitive, not the random fade-up-everything we had before.**
6. **Button hover** — 160ms ease-out-quad on background + border only. No scale, no glow pulse. Linear's rule.
7. **Arrow-advance text links** (Stripe pattern) — `→` translates `translateX(3px)` on hover, 200ms ease-out.

**Banned motion** (confirmed absent in all 3 apex benchmarks):
- `btn-glow` infinite pulse on primary CTA
- Gradient text shimmer on H1
- Decorative blurred color blobs (`blur-[120px]`)
- Glowing cyan screenshot shadows
- Scroll-jacking
- Autoplay video
- Lottie loops
- Cursor trail / custom cursor

---

## Signature techniques to implement

### 1. 3D isometric hero product pane (Linear pattern)

Hero right side: an actual (or near-actual) Kaldon analysis panel rendered as DOM HTML (not a PNG), rotated in 3D. Contains live-looking data rows, opportunity score `82/100`, a chart, filter pills. One Signal Cyan pulse-dot indicates "data streaming." Bottom fades to Void via `mask-image`.

Implementation: fixed-size ~760×680px panel, absolute positioning, CSS transform. If full DOM is too heavy, a high-res screenshot with the same 3D transform and fade works as fallback. Either way: **no browser chrome, no Safari frame, no MacBook bezel**. A custom 56px "app bar" with `Kaldon / Analysis › Iron Bottle` breadcrumb.

### 2. Numbered 5-phase pipeline with oversized mono numerals (Cal pattern)

Kaldon's structural differentiator is the 5-phase pipeline. Render it as:

```
01          DISCOVER
(JetBrains  Satoshi 32px weight 600
Mono 96px   
weight 400  "Know if a product will sell before
Ghost)      you invest a dollar."
            
            Inter 16px Ghost body.

            (Live product mini-demo, isometric)
```

Five of these, horizontally scroll-scrubbed by GSAP ScrollTrigger containerAnimation, pinned. One of the strongest visual signatures Kaldon can own — nobody in the eCommerce-intelligence vertical has anything remotely like it.

### 3. Dot lattice background (Vercel pattern)

Hero + CTA bands only. Not everywhere.

```css
.hero-bg {
  background-color: var(--void);
  background-image: radial-gradient(circle, var(--lattice) 1px, transparent 1px);
  background-size: 24px 24px;
  background-position: center;
}
```

Signals "infrastructure / mission control" without being heavy-handed.

### 4. Mono kickers above every H2 (Vercel pattern)

```html
<div class="kicker">INTELLIGENCE DEPTH</div>
<h2>See the Full Picture</h2>
```

```css
.kicker {
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ghost);
  margin-bottom: 12px;
}
```

### 5. Hairline surfaces, no drop-shadows (Attio/Linear/Vercel unanimous)

```css
.card {
  background: var(--deep-space);
  border: 1px solid var(--border-hairline);
  border-radius: var(--radius-card);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.02) inset;  /* Attio inner glow trick */
}
.card:hover {
  border-color: var(--border-active);
}
```

### 6. Gradient-border trick (Linear pattern) — reserved for premium cards

Used on the "Recommended" pricing tier and the hero product pane:

```css
.gradient-border {
  position: relative;
  background: var(--deep-space);
  border-radius: var(--radius-card);
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(to bottom right, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

### 7. Arrow-advance text links (Stripe pattern)

Every "See more →", "Read the story →" CTA pattern:

```css
.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--signal);  /* ONLY text-link place Signal appears */
  font-weight: 500;
  transition: gap 200ms ease-out;
}
.link-arrow:hover { gap: 10px; }
```

### 8. White-on-Gold primary CTA, flat

```css
.btn-primary {
  background: var(--gold);
  color: var(--void);
  border-radius: var(--radius-btn);
  height: 44px;
  padding: 0 20px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: -0.005em;
  border: none;
  transition: background 160ms ease-out;
}
.btn-primary:hover { background: var(--gold-hover); }
```

**No glow, no shadow, no scale transform, no pulse animation.** Linear's rule.

Secondary button:
```css
.btn-secondary {
  background: rgba(255,255,255,0.06);
  color: var(--chalk);
  border: 1px solid var(--border-active);
  border-radius: var(--radius-btn);
  height: 44px; padding: 0 20px;
  font-weight: 500;
}
.btn-secondary:hover { background: rgba(255,255,255,0.10); }
```

---

## Homepage section-by-section plan

### Section 1 — Hero

- **Layout:** 60/40 split at ≥1024px (text left, product pane right). Stacks on mobile.
- **Background:** Void with dot lattice 24px @ 4% opacity.
- **Kicker:** `AI-POWERED ECOMMERCE INTELLIGENCE`
- **H1 (Satoshi 64px weight 500 letter-spacing -0.022em Chalk):**
  > From Research to Revenue. Any Marketplace.
  *No gradient-text. Single color.*
- **Subhead (Inter 18px Ghost, max-width 420px):**
  > Kaldon finds winning products across Amazon, Walmart, and DTC — then builds your brand, creates your content, launches your store, and grows your business. One platform. One click at a time.
- **CTAs:** `[Gold primary: Start Free — 2 Analyses]` `[Secondary arrow-advance: See how it works →]`
- **Trust line (Inter 14px Ghost):** No credit card. Free plan available.
- **Product pane (right):** isometric 3D transform, ~760×680px, single Signal pulse dot, bottom mask-fade to Void.
- **No star ratings. No "Trusted by 3 marketplaces" claim.**

### Section 2 — Connected-platforms strip

- Replaces generic "logos" with real SVG marks of Amazon / Walmart / Stripe / Meta / TikTok / Google / Shopify. Monochrome (Chalk at 60% opacity). Single-row horizontal flex.
- Eyebrow: `Connected to the marketplaces, ad platforms, and tools your business runs on.`
- 1px hairline divider above + below. 80px vertical padding.

### Section 3 — The $10,000 Problem

- Full-spec V3 copy preserved.
- Replace 6-color rainbow grid with **6 typographic cards, monochrome**, each using the same hairline surface + Ghost iconography (stroke-only icons, no colored fills).
- Bottom summary: `$207–400+/mo` (Chalk, strikethrough via `<del>` + color `--text-quaternary`), `$149/mo Kaldon` in Gold.
- One-line closer in Ghost: "And none of them talk to each other."

### Section 4 — The 5-phase pipeline (signature moment)

- **Kicker:** `THE PIPELINE`
- **H2:** Five Steps from Idea to Income
- **Implementation:** GSAP ScrollTrigger containerAnimation (pinned section, vertical scroll → horizontal pan across 5 full-width phase panels, `ease: "none"`). Each panel:
  - Oversized mono numeral `01` through `05` (JetBrains Mono 96px, `--text-quaternary`)
  - Phase name (Satoshi 32px Chalk)
  - Outcome sentence (Inter 20px Chalk)
  - 3-bullet outcomes (Inter 16px Ghost with Signal Cyan checkmarks — ONE of the few Signal uses)
  - Isometric mini product-pane on the right
- Progress indicator: 5 dots at the top showing which phase is active during scroll-scrub.
- Reduced-motion fallback: vertical stack, no scroll-scrub.

### Section 5 — Intelligence Depth

- Preserves V3 copy.
- Visual: 11 intelligence sources rendered as a **typographic list with mono numerals** (`01.` through `11.`). Each source = single line, Chalk name + Ghost description.
- No icons per source (avoids the rainbow-icon-grid anti-pattern).
- Closing line in Gold italics: *"Other tools give you a spreadsheet. Kaldon gives you a strategy."*

### Section 6 — Who It's For (3 cards)

- 3 columns on desktop, stack on mobile. Hairline surface.
- Each card: Satoshi 20px title, Inter 16px Ghost body, Signal-arrow link to use-case page.

### Section 7 — Pricing teaser

- 5 tier-cards (matches V3 spec: Free / Growth $149 / Pro $299 / Scale $499 / Enterprise $1,499). 2 rows on desktop (3 + 2) with Pro elevated as recommended.
- Pro card uses gradient-border trick + Gold "RECOMMENDED" pill.
- Gold CTA on Pro, ghost CTAs on others.

### Section 8 — Social proof / connected platforms

- V3 says "Built With" section — use it as a text-forward block with real platform logos, not fake testimonials.
- If beta quotes exist (real ones only), 2 side-by-side quote blocks, text only, no headshot carousel.
- If no real quotes: skip the testimonial section entirely until we have them. **No sample testimonials shipping.**

### Section 9 — Savings calculator

- Keep the concept. Redesign:
  - Monochrome card, Satoshi labels, Inter Ghost values.
  - Slider uses custom CSS (Signal Cyan track at 40% opacity, Chalk thumb).
  - Output numbers in Gold (the "your savings" tension belongs with the CTA color).
  - Single Gold CTA below.

### Section 10 — Final CTA band

- Full-bleed band with dot lattice background.
- H2 `Satoshi 40px`: "Your next product is waiting. On every marketplace."
- Subhead Inter 18px Ghost.
- Gold CTA + trust line.
- **This is the only other dot-lattice section besides hero.**

---

## What we're removing from the current site

Confirmed kills (research-validated: absent from all 3 apex benchmarks):
1. All `gradient-text` on headlines
2. All `blur-[120px]` color blobs (cyan + purple atmospheric glows)
3. `box-shadow: 0 0 40px rgba(34,211,238,0.05)` glowing screenshots
4. `btn-glow` infinite pulse
5. 10 decorative utility colors in Tailwind config (purple, pink, orange, yellow, red, green, blue, light-cyan)
6. DM Sans + Space Mono font stack
7. Exit-intent popup
8. Sticky mobile CTA bar (Stripe has none — we don't need one either)
9. Announcement bar pulse (quiet band only, or delete)
10. 5 duplicate inline SVG star icons × 15 instances
11. The generic `animate-on-scroll` fade-up-everything pattern
12. Sample testimonials (Sarah M / James R / Priya K)
13. "★★★★★ Trusted by eCommerce sellers across 3 marketplaces" vague-trust widget
14. Rainbow color grid on the $10k Problem section
15. Growth $119 / Pro $239 pricing (replaced with V3-correct $149 / $299)

---

## Technical stack for rebuild

- **Fonts:** Self-host via `@fontsource` packages. Satoshi via `@fontsource/satoshi` (comes as variable). Inter via `@fontsource-variable/inter` (variable). JetBrains Mono via `@fontsource-variable/jetbrains-mono`.
- **GSAP:** Install `gsap` + `@gsap/react` (if we add React islands) or load via CDN for Astro-native use. Register `ScrollTrigger` once, lazy-loaded below the fold.
- **Component architecture:** Create `src/components/` with:
  - `ui/Button.astro`, `ui/Card.astro`, `ui/Kicker.astro`, `ui/LinkArrow.astro`
  - `layout/Nav.astro`, `layout/Footer.astro`, `layout/Section.astro`
  - `home/Hero.astro`, `home/ProblemGrid.astro`, `home/PipelineScroll.astro`, `home/IntelligenceDepth.astro`, `home/WhoItsFor.astro`, `home/PricingTeaser.astro`, `home/SavingsCalculator.astro`, `home/FinalCTA.astro`
  - `visuals/ProductPane.astro` (the 3D isometric hero visual)
  - `visuals/DotLattice.astro`
- **CSS strategy:** Tailwind v3 with custom design tokens in `tailwind.config.mjs`. Component-scoped styles in Astro `<style>` blocks for complex visuals (ProductPane, PipelineScroll).
- **Build target:** zero-error `pnpm run build`, LCP < 2.5s, CLS < 0.1, total JS < 100KB on homepage.

---

## The "Linear bar" we're hitting

A professional web designer should look at the Kaldon site and believe a funded startup's design team built it. The concrete meaning of that for Kaldon:

- Type system visibly intentional (Satoshi display at 64px w500 with -0.022em tracking, not default Bold Heavy)
- Palette visibly disciplined (Gold on <3% of page surface area; Signal on <1%; rest monochrome)
- Motion visibly purposeful (one hero 3D transform + one pulse dot + one pipeline scroll-scrub — not animate-everything)
- Product visually prominent (live pane in hero, real data rows, no PNG dashboard)
- No template tells (no gradient text, no color blobs, no glowing screenshots, no star rating, no exit popup)

If we execute this brief precisely, the ceiling is 8.5/10 against Kaldon's direct competitors and 7.5/10 against the apex tier — which is dramatically beyond the current 5.5/10 and puts Kaldon in its own visual position in the eCommerce-intelligence vertical.
