# Skill Router (check before responding) — Kaldon Marketing Site

## Process triggers
- Creative ask? → `superpowers:brainstorming` first
- Multi-step (≥3)? → `superpowers:writing-plans`
- Code/page change? → `simplify` after edit + `superpowers:verification-before-completion` + `code-reviewer` before merge
- Bug? → `superpowers:systematic-debugging` (root cause before fix)
- 2+ independent tasks? → `superpowers:dispatching-parallel-agents`
- Branch closing? → `superpowers:finishing-a-development-branch`

## Surface triggers
- Any page (`src/pages/*.astro`)? → `seo-specialist` + `accessibility-specialist`
- Pricing? → `pricing-strategy` + `competitive-intel` + `page-cro` + verify cross-repo parity with dashboard Stripe
- `vs/*`, `compare/*`, `use-cases/*`? → `competitor-alternatives` + `saas-copywriter` + `seo-specialist`
- Form (`contact.astro`, `demo.astro`)? → `form-cro` + `accessibility-specialist`
- Cross-domain CTA → `app.kaldon.io`? → `signup-flow-cro` + `analytics-tracking` + `senior-security`
- `_headers` / `_redirects` / `wrangler.jsonc`? → `senior-security` + `senior-devops`
- `tailwind.config.mjs` / `global.css` / V3 tokens? → `ui-design-system` + V3 spec check
- Anthropic SDK (`generate-blog-post.mjs`)? → `claude-api` (prompt caching mandatory)
- GitHub workflow? → `ci-cd-pipeline-builder`
- Animation? → `gsap-core` + sub-skill (Astro context, not React)
- New page? → composite: `brainstorming` → `seo-specialist` → `landing-page-generator` → `saas-copywriter` → `page-cro` → `accessibility-specialist` → `frontend-design` → `analytics-tracking`
- Ads/acquisition? → `marketing-demand-acquisition` + `ads-plan saas` + per-platform
- Investigation worth a graph? → `graphify`

## V3 brand iron rules
- Gold `#FFB800` = primary CTAs ONLY. Nothing else.
- Signal `#00D4FF` = live-data affordances ONLY (pulsing dots, active rings). Never on CTAs.
- No em dashes (—). Use period, comma, or colon.
- No DM Sans, no Google Fonts. Self-hosted Satoshi + Inter Variable + JetBrains Mono only.
- Type scale: Linear-school (clamp(48px, 6vw, 64px) display, weight 500). Not Stripe-school 96px.
- Anti-generic-AI: no gradient-text H1, no blur-blob backgrounds, no glow-pulse CTAs, no kitchen-sink color grids.
- Copy: 6th-grade reading age, PhD thinking underneath.

If a trigger applies and you skip the skill, state the reason explicitly.
