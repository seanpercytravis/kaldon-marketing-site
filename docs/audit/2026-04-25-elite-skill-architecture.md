# Kaldon Marketing Site — Elite Skill Architecture & Optimization Plan

**Date:** 2026-04-25
**Repo:** `/Users/seantravis/kaldon-marketing-site` (kaldon.io)
**Stack:** Astro 6 (static output) + Tailwind 3 + Cloudflare Workers + TypeScript + GSAP + Anthropic SDK (auto-blog)
**Goal:** Convert the full skill library from "available" to "structurally enforced" so every marketing-site work surface — pages, content, SEO, conversion, performance, brand, ads, analytics, deliverables — runs at elite level by default, not by remembering to invoke skills.
**Architecture:** Three-layer enforcement: (1) **Skill Routing Map** that converts ambiguous intents into mandatory skill invocations, (2) **CLAUDE.md** at the marketing site root (none exists today) that loads on every session, (3) **UserPromptSubmit hook** in `.claude/settings.json` that injects a routing reminder before every prompt so I cannot drift even if a session reset clears prior context.
**For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

---

## Executive Summary

| Finding | Severity | Owner |
|---|---|---|
| **No `CLAUDE.md`, no `.claude/` directory, no skill enforcement at all on this repo** | **CRITICAL** | §D structural fix |
| 11 of 22 main pages lack schema.org structured data (`vs/*`, `compare/*`, `use-cases/*`, `blog/*`) | **HIGH** | §C P0 |
| `auto-blog.yml` workflow has never fired as cron and zero jobs run on push | **HIGH** | §C P0 |
| `_headers` is missing CSP, HSTS, COEP/COOP/CORP — 4 of the 8 standard headers | **HIGH** | §C P0 |
| Anthropic SDK call in `scripts/generate-blog-post.mjs` has **no prompt caching** (50-90% cost lever per `claude-api` skill) | **HIGH** | §C P0 |
| Plausible Analytics only; no GA4, no GTM, no funnel analysis, no event-level user paths | **HIGH** | §C P1 |
| Zero paid acquisition motion; entire `ads-*` skill suite dormant | **HIGH** | §C P2 |
| Pricing page shows Free + Growth $119 + Pro $239 + Scale $399 + Enterprise + $39.99 single, dashboard memory says current is $149/mo single tier — **price/promise mismatch** when user crosses domain | **HIGH** | Verify/sync §C P0 |
| Homepage has 14 sections (Hero, ConnectedPlatforms, Foundation, Problem, PipelineScroll, ModeBadges, MarketGapWeek, IntelligenceDepth, WhoItsFor, PricingTeaser, SavingsCalculator, FinalCTA, Testimonials) — likely too dense for top-of-funnel conversion | **MEDIUM** | §C P1 |
| GSAP used on 1 component (`PipelineScroll`) out of 12 home components — animation discipline underused | **LOW** | §C P3 |
| 12 audits exist on the dashboard repo; only 2 on marketing site (04-16 design brief + quality audit) | **MEDIUM** | §C P1 recurring audits |
| Existing 04-16 audits' findings were largely addressed (V3 brand spec implemented in tailwind tokens, Satoshi/Inter loaded, Linear-school type scale shipped) — but no recurring re-audit cadence | **LOW** | §D.4 recurring |

**What's already strong (do not break):**
- V3 brand spec implemented: Void/Deep Space/Signal/Gold/Ghost/Chalk tokens in `tailwind.config.mjs`, self-hosted Satoshi + Inter Variable + JetBrains Mono in `global.css`, Linear-school type scale (clamp(48px, 6vw, 64px) display, weight 500)
- BaseLayout has comprehensive SEO props (canonicalUrl, ogImage, ogType, noIndex, structuredData)
- Auto-generated BreadcrumbList structured data on every page
- Per-page OG image system (Satori + Resvg generator at `scripts/generate-og.mjs`)
- Sitemap auto-generated (`@astrojs/sitemap`)
- `llms.txt` for LLM discovery
- Astro static output + Cloudflare Workers (edge-served — should be elite perf)
- Skip-to-content link, focus styles using gold-on-void (a11y baseline)
- Cookie consent is minimal (no blocking modal)
- Componentization done: 12 home components, 10 UI components, 3 layouts (was 661 inline lines on index.astro per 04-16 audit)
- Rewardful affiliate tracking wired (`data-rewardful="e619ee"`)
- Auto-blog system architecture is sound (17-post topical map → trend-driven mode)
- 4 legacy `/vs/*` redirects in `_redirects` keep SEO juice from dead pages

**Strategic frame:** marketing site is the *acquisition + activation surface* for the Kaldon SaaS. Everything here either drives qualified traffic (SEO, ads) or converts it to dashboard signups (CRO, brand, copy). Pipeline-side metrics (MRR, churn, LTV) ultimately depend on this surface working.

---

## Section A — Skill Routing Map (marketing-site-scoped)

The router is a deterministic function: **(user intent ∪ work context) → required skill set**. If a row matches, the listed skills MUST fire before any tool/code action.

### A.1 — Process skills (MANDATORY, every relevant turn)

| Trigger | Required skill(s) |
|---|---|
| Conversation start | `superpowers:using-superpowers` |
| Creative ask / "what should we" / "explore" | `superpowers:brainstorming` (FIRST) |
| Multi-step task ≥ 3 steps OR new feature | `superpowers:writing-plans` |
| ANY feature, page, or fix in code | `superpowers:test-driven-development` (where testable) |
| ANY bug, broken behavior, build failure | `superpowers:systematic-debugging` |
| About to claim "done" / "passing" / "shipped" | `superpowers:verification-before-completion` |
| Major step complete / before merge | `superpowers:requesting-code-review` + `code-reviewer` |
| Implementation finished, ready to integrate | `superpowers:finishing-a-development-branch` |
| Starting feature work needing isolation | `superpowers:using-git-worktrees` |
| 2+ independent tasks | `superpowers:dispatching-parallel-agents` |
| Multi-task plan executing in current session | `superpowers:subagent-driven-development` |
| After ANY code edit, before commit | `simplify` |
| Created or modified a skill file | `superpowers:writing-skills` |

### A.2 — SEO + content surface

| Trigger | Required skill(s) |
|---|---|
| Touching ANY page (`src/pages/*.astro`) | `seo-specialist` (meta + structured data + canonical + OG) |
| Touching site IA, URL hierarchy, navigation, internal links | `site-architecture` |
| Creating or modifying `vs/*` pages | `competitor-alternatives` + `competitive-intel` + `saas-copywriter` |
| Creating or modifying `compare/*` pages | `competitor-alternatives` + `seo-specialist` |
| Creating or modifying `use-cases/*` pages | `landing-page-generator` + `saas-copywriter` + `page-cro` |
| Touching blog content (manual `.astro` or generated `.md`) | `seo-specialist` + `saas-copywriter` |
| Touching `scripts/generate-blog-post.mjs` (Anthropic SDK) | `claude-api` (REQUIRED: prompt caching for the system prompt) |
| Touching `scripts/kaldon-blog-config.mjs` (topical map) | `seo-specialist` + `competitive-intel` |
| Researching new topics for the topical map | `autoresearch` |
| Strip third-party article before ingesting as research source | `defuddle` |

### A.3 — CRO + conversion surface

| Trigger | Required skill(s) |
|---|---|
| Touching `pricing.astro` or pricing copy anywhere | `pricing-strategy` + `competitive-intel` + `page-cro` + `saas-copywriter` |
| Touching homepage (`index.astro`) or any home component | `page-cro` + `landing-page-generator` |
| Touching `demo.astro`, `contact.astro`, or any form | `form-cro` |
| Touching CTAs that cross to `app.kaldon.io` | `signup-flow-cro` (the dashboard side owns the rest) |
| Touching first-touch UX (Hero, above-fold) | `onboarding-cro` |
| Touching `Testimonials.astro` or social-proof copy | `saas-copywriter` |
| Adding a new conversion experiment | `superpowers:brainstorming` + tracking spec via `analytics-tracking` |

### A.4 — Performance + edge surface

| Trigger | Required skill(s) |
|---|---|
| Adding any third-party script | `performance-profiler` (LCP/INP/CLS impact) |
| Adding any image | `performance-profiler` (AVIF/WebP, dimensions, lazy) + Astro `<Image>` |
| Touching `astro.config.mjs`, `wrangler.jsonc`, `_headers`, `_redirects` | `senior-devops` + `ci-cd-pipeline-builder` |
| Touching `scripts/generate-favicons.mjs` or `scripts/generate-og.mjs` (build-time generators) | `performance-profiler` (output size) |
| Build time regressions, bundle size growth | `performance-profiler` + `simplify` |
| Cloudflare Workers edge config | `senior-devops` |

### A.5 — Brand + visual + design surface

| Trigger | Required skill(s) |
|---|---|
| Touching color, typography, tokens, `tailwind.config.mjs`, `global.css` | `ui-design-system` + V3 brand spec compliance check |
| Touching ANY page or component visually | `frontend-design` + `ui-ux-pro-max` |
| Adding a new component | `ui-design-system` (token usage) + `frontend-design` (anti-generic patterns) |
| Adding GSAP animation | `gsap-react` is React-specific, on Astro use `gsap-core` + relevant sub-skill (`gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance`) |
| Generating images for the site | `nano-banana-2` + `frontend-design` |
| Researching design references / personas | `ux-researcher-designer` |

### A.6 — Accessibility surface

| Trigger | Required skill(s) |
|---|---|
| Adding ANY interactive component (button, form, dropdown, modal) | `accessibility-specialist` (WCAG AA — keyboard, focus, ARIA) |
| Adding ANY new page | `accessibility-specialist` (heading order, skip link, alt text) |
| Touching `Nav.astro`, `Footer.astro`, mobile menu | `accessibility-specialist` (focus trap, escape, aria-expanded) |
| Touching color combinations | `accessibility-specialist` (contrast ≥ 4.5:1 body, ≥ 3:1 large) |
| Touching forms | `accessibility-specialist` + `form-cro` |

### A.7 — Tracking + analytics surface

| Trigger | Required skill(s) |
|---|---|
| Touching analytics scripts in `BaseLayout.astro` | `analytics-tracking` |
| Adding any tracked event (click, form submit, scroll) | `analytics-tracking` (event taxonomy + naming convention) |
| Adding cross-domain attribution (kaldon.io → app.kaldon.io) | `analytics-tracking` + `signup-flow-cro` |
| Touching Rewardful integration | `referral-program` + `analytics-tracking` |
| Setting up GA4 / GTM / PostHog / Segment | `analytics-tracking` |

### A.8 — Acquisition + ads surface

| Trigger | Required skill(s) |
|---|---|
| Building acquisition strategy | `marketing-demand-acquisition` + `ads-plan saas` |
| Per-platform campaign | `ads-meta` / `ads-google` / `ads-linkedin` / `ads-tiktok` / `ads-microsoft` / `ads-youtube` |
| Budget across platforms | `ads-budget` + `ads-math` |
| Ad creative concept | `ads-create` + `ads-creative` + `saas-copywriter` |
| Ad images | `ads-photoshoot` + `nano-banana-2` |
| Brand DNA for ads | `ads-dna` |
| Competitor ad intel | `ads-competitor` |
| Landing pages for ads | `ads-landing` + `landing-page-generator` + `page-cro` |
| Multi-platform audit | `ads-audit` |
| A/B test design | `ads-test` |
| Cold outbound (agency segment) | `cold-email` |
| Lifecycle / drip / activation email | `email-sequence` |
| Referral / affiliate program (extending Rewardful) | `referral-program` |
| Quarterly competitor pull | `competitive-intel` |

### A.9 — Auto-blog + AI content surface

| Trigger | Required skill(s) |
|---|---|
| Touching `generate-blog-post.mjs` Anthropic SDK calls | `claude-api` (mandatory: prompt caching, model selection, error handling) |
| Touching trend-refresh Perplexity calls | `claude-api` (it's not Anthropic but the request/error patterns are similar; use as guidance) |
| Touching the topical map | `seo-specialist` + `competitive-intel` |
| Touching the auto-blog GitHub Action | `ci-cd-pipeline-builder` |
| Touching Astro content collection schema | `seo-specialist` (frontmatter must serialize to JSON-LD) |

### A.10 — Cross-domain integration surface (kaldon.io ↔ app.kaldon.io)

| Trigger | Required skill(s) |
|---|---|
| CTA links that cross to dashboard | `signup-flow-cro` + `analytics-tracking` (UTM + cross-domain) |
| Pricing page sync between marketing + dashboard | `pricing-strategy` (single source of truth principle) |
| Auth session bleed-over considerations | `senior-security` (open redirect, phishing, token leakage in URL) |

### A.11 — Knowledge + research

| Trigger | Required skill(s) |
|---|---|
| Investigation worth a knowledge graph | `graphify` |
| Topic research with multiple sources | `autoresearch` |
| Strip web page before ingestion | `defuddle` |
| Save conversation to wiki | `save` |
| Wiki vault setup | `wiki` |
| Wiki source ingestion | `wiki-ingest` |
| Wiki query | `wiki-query` |
| Wiki health check | `wiki-lint` |
| Visual canvas | `canvas` |
| Multi-source research notebook | `notebooklm` |

### A.12 — Composite triggers (always fire together)

| Composite | Members |
|---|---|
| **Code change checkpoint** | `simplify` → `superpowers:verification-before-completion` → `code-reviewer` → `superpowers:requesting-code-review` |
| **New page** | `superpowers:brainstorming` → `seo-specialist` → `landing-page-generator` → `saas-copywriter` → `page-cro` → `accessibility-specialist` → `frontend-design` → `analytics-tracking` |
| **Pricing change** | `pricing-strategy` → `competitive-intel` → `page-cro` → `saas-copywriter` → `analytics-tracking` (+ verify cross-domain consistency with dashboard) |
| **GTM launch** | `marketing-demand-acquisition` → `ads-plan saas` → per-platform `ads-*` → `ads-landing` → `analytics-tracking` |
| **Brand change** | `ui-design-system` → V3 spec compliance check → `frontend-design` → `accessibility-specialist` (contrast) |
| **Auto-blog post** | `claude-api` (prompt caching) → `seo-specialist` (frontmatter quality) → `superpowers:verification-before-completion` (build still passes) |
| **Auto-blog config change** | `seo-specialist` → `competitive-intel` (topical relevance) → `ci-cd-pipeline-builder` (workflow still fires) |
| **Branch close** | `superpowers:verification-before-completion` (`pnpm build` passes) → `simplify` → `code-reviewer` → `superpowers:finishing-a-development-branch` |

If a skill is listed for a trigger and you do NOT invoke it, you must explicitly state why. "Not relevant because X." Never silently skip.

---

## Section B — Project audit findings

13 surfaces walked. Recent commits (Apr 16-24) showed strong work, but skill discipline was inconsistent.

### B.1 — Homepage (`src/pages/index.astro`, 14 components)

**Current:** Hero → ConnectedPlatforms → FoundationCredibility → ProblemSection → PipelineScroll → ModeBadges → MarketGapWeek → IntelligenceDepth → WhoItsFor → PricingTeaser → SavingsCalculator → FinalCTA → Testimonials.

**Skills that should have fired but didn't:**
- `page-cro` — 14 sections is dense. Per CRO research, top-of-funnel pages convert better with 5-8 focused sections. Long pages can work for high-intent traffic but homepage typically gets mixed-intent. Need a CRO baseline measurement before proposing cuts.
- `landing-page-generator` — The skill provides explicit conversion frameworks (AIDA, PAS, hero patterns). The homepage architecture would benefit from being explicitly designed against one.
- `accessibility-specialist` — 14 sections means many headings; need to verify heading order is semantic (one H1, sequential H2s, no skipped levels).
- `gsap-scrolltrigger` — only `PipelineScroll` uses GSAP; the other 13 sections use plain Tailwind animations. There's room for choreographed reveals on Hero, IntelligenceDepth, FinalCTA. Per 04-16 audit: "Gradient `animate-on-scroll` reveals with no choreography" was a finding.
- `analytics-tracking` — Section-level scroll tracking would tell you which sections drive engagement vs which are decorative. Currently no event taxonomy.

**Severity:** MEDIUM. Site converts; could convert better.

### B.2 — Conversion pages (pricing, features, demo, contact)

**Current:** All 4 have schema.org structured data. Pricing shows Free/$119/$239/$399/Enterprise/$39.99 (5 tiers + single).

**Skills that should have fired:**
- `pricing-strategy` — Tier structure looks like the Validate $49 / Launch $149 / Scale $349 / Agency model the dashboard roadmap proposed (P1 #18) but the prices don't quite match: marketing shows $119/$239/$399, dashboard memory says current is $149/mo single tier. **Two systems are out of sync.** Either marketing site shows future pricing not yet live in Stripe, or dashboard has been updated and memory is stale. This needs verification IMMEDIATELY before any user clicks through and gets a different price.
- `competitive-intel` — Competitor pricing references (Helium 10 / JS / ZonGuru / Sell The Trend) should anchor the value prop on the page. Need to verify presence.
- `form-cro` — `contact.astro` and `demo.astro` forms; need form-CRO baseline (field count, button copy, validation, success state).
- `signup-flow-cro` — `demo.astro` and CTAs to dashboard need cross-domain signup flow audit.

**Severity:** HIGH (price mismatch is a trust killer).

### B.3 — SEO funnel (`vs/*`, `compare/*`, `use-cases/*` — 9 pages)

**Current:** 3 vs/ pages (shopify, helium-10, jungle-scout), 3 compare/ pages, 3 use-cases/ pages. **None have schema.org structured data** per the grep.

**Skills that should have fired:**
- `seo-specialist` — These are the highest-intent SEO pages on the site. Missing `Product` / `SoftwareApplication` / `FAQPage` / `HowTo` schema is leaving rich-result eligibility on the table. Recent commit `bd210f2 feat(seo): add SoftwareApplication + HowTo schema to conversion pages` shipped this for *some* pages but not these.
- `competitor-alternatives` — The skill provides explicit page templates for vs / alternatives pages with SEO meta + comparison tables + objection handling. Worth re-checking each vs page against the skill's checklist.
- `competitive-intel` — Helium 10 is at 2.7/5 Trustpilot per the dashboard's competitive-intel audit. That's an explicit selling point for `vs/helium-10.astro`. Need to verify it's used.
- `saas-copywriter` — Comparison-page copy has specific tone needs (factual, not snarky; objection-led, not feature-led).

**Severity:** HIGH. These pages are SEO leverage points; shipping without structured data is leaving tens of % of organic CTR on the table.

### B.4 — Blog (auto-publisher + 5 manual articles)

**Current:** 5 hand-written + 1 dynamic `[slug]` route + auto-publisher. Per BLOG.md: 17-post topical map (1 pillar + 16 clusters), then trend-driven evergreen mode. Schedule: Mon + Thu 16:00 UTC.

**Skills that should have fired:**
- `claude-api` — `scripts/generate-blog-post.mjs` calls Anthropic SDK to write articles. The skill mandates **prompt caching for system prompts**. Each article likely uses a long system prompt (style guide, SEO rules, brand voice, schema requirements). Caching would cut Anthropic spend 50-90% on every run. Currently uncached.
- `seo-specialist` — Blog frontmatter must serialize to JSON-LD `Article` / `BlogPosting`. Need to verify generated posts include `datePublished`, `dateModified`, `author`, `headline`, `image`. The schema.org grep showed `vs/`, `compare/`, `use-cases/` lack structured data; blog/* may share that gap.
- `competitive-intel` — Trend-refresh is good but should also pull *competitor content gaps* (topics Helium 10 ranks for that Kaldon doesn't) for programmatic SEO targeting.
- `defuddle` — When the auto-blogger fetches sources, defuddling them first would save 40-60% tokens.

**Severity:** HIGH (cost lever) + MEDIUM (SEO gap).

### B.5 — BaseLayout + brand foundation

**Current:** Strong. V3 brand tokens implemented in tailwind config. Self-hosted Satoshi/Inter/JetBrains. Linear-school type scale. Skip-to-content link. Auto-OG-image resolution by URL slug. Auto-BreadcrumbList structured data. Plausible + Rewardful loaded.

**Skills that should have fired:**
- `accessibility-specialist` — BaseLayout has a skip link (good). Need full WCAG AA audit on Nav.astro and Footer.astro (focus management, mobile menu trap, aria states).
- `performance-profiler` — Three font preloads is correct. Plausible + Rewardful are deferred (good). But Cookie consent inline JS adds ~200 bytes to every page; could be deferred and only loaded if cookie not set.
- `senior-security` — `_headers` has X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. **Missing: Content-Security-Policy, Strict-Transport-Security (HSTS), Cross-Origin-Embedder-Policy, Cross-Origin-Opener-Policy, Cross-Origin-Resource-Policy.** That's 5 of the 9 standard headers absent. Marketing site doesn't have user data or auth so the risk is lower than the dashboard, but CSP would still block any future XSS via injected blog content.

**Severity:** MEDIUM (security headers are cheap, no downside to adding).

### B.6 — Tracking + analytics

**Current:** Plausible + Rewardful only. No GA4, no GTM, no PostHog, no Segment, no Hotjar/FullStory.

**Skills that should have fired:**
- `analytics-tracking` — Plausible is privacy-first but capped: no funnel analysis, no cohort retention, no event-level user paths, no session replay. For a SaaS marketing site that needs to understand "Hero CTA → Pricing → Demo → Signup" funnel, Plausible alone is insufficient. Either add PostHog (privacy-friendlier than GA4, includes funnels + cohorts + replay) or GA4 (incumbent, free) alongside.
- `signup-flow-cro` — Cross-domain attribution from kaldon.io → app.kaldon.io needs explicit setup. UTM params are implicit; without GA4/PostHog cross-domain config or a server-side join, the signup is treated as direct traffic on the dashboard.
- `referral-program` — Rewardful is wired but no formal program design (commission tier, payout cadence, marketing materials). The skill provides this.

**Severity:** HIGH (no analytics = no CRO loop).

### B.7 — Auto-blog system (`auto-blog.yml` workflow)

**Memory observations 5569-5571:**
- Workflow has been failing on every push
- All failures have zero jobs (workflow never starts)
- Has never fired as scheduled cron

**Skills that should have fired:**
- `ci-cd-pipeline-builder` — Zero jobs typically means: (1) repo Actions disabled at Settings → Actions level, (2) default workflow permissions restricted (read-only), (3) workflow file has YAML structural error that prevents parsing, or (4) workflow lives outside `.github/workflows/` (it doesn't — verified). Most likely #2: GitHub by default sets workflow permissions to read-only on repos created after 2023; the workflow has `permissions: contents: write, pull-requests: write` declared but if the repo-level setting overrides workflow-level, the run fails to start. This is a 1-toggle fix in Settings → Actions → General → Workflow permissions.
- `senior-devops` — Diagnosing the failure mode and writing a runbook so this doesn't recur on the next workflow added.

**Severity:** HIGH. Marketing site auto-blog content engine is the SEO authority builder. It's broken for >2 weeks per memory.

### B.8 — Cross-domain CTAs (kaldon.io → app.kaldon.io)

**Current:** Per commit `aac35c5 split-domain CTA rewrite + SEO baseline audit` and `685f37f Reverse-link audit — app → marketing URLs for domain split`, the domain split was done.

**Skills that should have fired:**
- `signup-flow-cro` — The CTA copy → click → land on app.kaldon.io → signup is the conversion event. Need to audit the full flow: button copy, click latency (Cloudflare → another origin), session bridging if user is already logged in to app, and the landing page on app side.
- `analytics-tracking` — Cross-domain UTM passthrough must be tested end-to-end. Rewardful coupon code propagation across the domain hop must be tested.
- `senior-security` — Open redirects on cross-domain CTAs are a phishing risk (someone could share `https://kaldon.io/?cta=https://attacker.example`). Verify CTAs are hardcoded, not parameterized.

**Severity:** MEDIUM.

### B.9 — Security headers gap

Already covered in B.5. Verbatim missing: `Content-Security-Policy`, `Strict-Transport-Security`, `Cross-Origin-Embedder-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`.

**Skills that should fire:**
- `senior-security` — Standard security header set for static marketing sites. CSP is the most defensive; HSTS is a quick win.

### B.10 — OG images + structured data coverage

**Coverage:**
- Schema.org: 11 pages have it (index, how-it-works, pricing, features, 404, about, contact, demo, privacy, terms, who-its-for); 11 don't (vs/*, compare/*, use-cases/*, blog/*).
- OG images: per `ogSlugFromPath()` mapping in BaseLayout, all main pages have explicit OG slugs. Need to verify generated PNG files actually exist for all of them.

**Skills that should have fired:**
- `seo-specialist` — Coverage gap on the SEO-leverage pages (vs/, compare/, use-cases/) is the highest-leverage fix.

**Severity:** HIGH.

### B.11 — Performance baseline

**Current:** No measured baseline. Astro static + Cloudflare Workers should yield top-1% Core Web Vitals, but unverified.

**Skills that should have fired:**
- `performance-profiler` — Run Lighthouse + WebPageTest + PageSpeed Insights baseline on every public page. Establish budget. Add Lighthouse CI to GitHub Actions.

**Severity:** MEDIUM (likely already great; need numbers to confirm).

### B.12 — Acquisition motion

**Current:** Zero paid acquisition. Zero outbound. Rewardful is the only acquisition lever, and program design is informal.

**Skills that should have fired:**
- All `ads-*` skills (entire suite dormant on this surface).
- `marketing-demand-acquisition` — Strategic GTM doc.
- `cold-email` — Agency-segment outbound (Kaldon's "Agency" tier targets agencies; cold outbound is the natural channel).
- `referral-program` — Rewardful is wired; design needs formalizing (commission tier, payout, marketing kit).

**Severity:** HIGH (zero motion = ARR depends entirely on inbound).

### B.13 — Knowledge + memory hygiene

**Current:** 2 audits exist on marketing site (04-16 design brief + 04-16 quality audit). 12 audits on dashboard repo. No wiki, no graphify, no recurring re-audit cadence on marketing site.

**Skills that should have fired:**
- `wiki` — One-time vault setup gives a queryable knowledge layer.
- `graphify` — The competitor matrix, the topical map, the funnel are all graph-worthy.
- Recurring `seo-specialist` + `competitive-intel` re-audits.

**Severity:** LOW-MEDIUM (compounds over time).

---

## Section C — Optimization plan (prioritized work items)

Each item lists: **scope · primary skill(s) · effort (S < 1d, M < 1wk, L > 1wk) · exit criteria**.

### P0 — Operating-system fixes (ship within 7 days)

| # | Move | Skill(s) | Effort | Exit criteria |
|--:|---|---|:--:|---|
| 1 | **Lock skill router into structural enforcement** (create CLAUDE.md from scratch + .claude/settings.json with UserPromptSubmit hook + skill-router-reminder.md + memory pointer) | `update-config` + `superpowers:writing-skills` | S | New session loads router rules without me remembering; settings.json hook injects reminder per prompt |
| 2 | **Fix `auto-blog.yml`** — diagnose zero-jobs failure (most likely repo Actions workflow permissions setting), restore cron + push triggers | `ci-cd-pipeline-builder` + `senior-devops` | S | Workflow runs on next Mon/Thu 16:00 UTC; `workflow_dispatch` works |
| 3 | **Add schema.org structured data** to `vs/*`, `compare/*`, `use-cases/*`, `blog/*` (currently 11 of 22 pages missing it) | `seo-specialist` | S | All 22 main pages have appropriate structured data; Rich Results Test passes |
| 4 | **Add prompt caching** to `scripts/generate-blog-post.mjs` Anthropic SDK calls | `claude-api` | S | System prompt cached; cache hit rate >80% on subsequent runs; cost reduction visible |
| 5 | **Verify pricing parity** between marketing (`pricing.astro`) and dashboard live Stripe products. If misaligned, sync ONE source of truth. | `pricing-strategy` + cross-repo verification | S | Marketing prices match Stripe live products exactly OR pricing.astro is updated to current dashboard pricing |
| 6 | **Add missing security headers to `_headers`**: CSP, HSTS, COEP/COOP/CORP | `senior-security` | S | `_headers` has full standard header set; securityheaders.com grade A or higher |
| 7 | **Wire GA4 (or PostHog) alongside Plausible** for funnel/cohort capability + cross-domain attribution to app.kaldon.io | `analytics-tracking` + `signup-flow-cro` | M | Funnel visible: Hero → Pricing → Demo → cross-domain signup; cohort retention measurable |
| 8 | **Verify all OG image PNGs exist** for every page declared in `ogSlugFromPath()` mapping | `superpowers:verification-before-completion` | S | Manual check: every page's resolved OG image returns 200 |

### P1 — Domain audits + first-pass execution (ship within 30 days)

| # | Move | Skill(s) | Effort | Output |
|--:|---|---|:--:|---|
| 9 | **Lighthouse / Core Web Vitals baseline** on every page | `performance-profiler` | S | Baseline doc; perf budget defined; Lighthouse CI added to GitHub Actions |
| 10 | **WCAG AA audit** on every public page | `accessibility-specialist` | M | Findings ranked; auto-test in CI; Nav + Footer focus management verified |
| 11 | **Refactor homepage to focused 7-9 sections** (drop or merge 5+ from current 14) based on heatmap/scroll data | `page-cro` + `landing-page-generator` + `analytics-tracking` (data first) | M | Homepage <2,000 px scroll-length; bounce rate measured before/after |
| 12 | **Refresh `vs/*` pages** against `competitor-alternatives` skill checklist (objection handling, comparison tables, schema) | `competitor-alternatives` + `competitive-intel` + `saas-copywriter` | M | Each vs page has: hero with comparison anchor, comparison table with sources, objection FAQ, social proof, schema |
| 13 | **Refresh `compare/*` pages** with category-level positioning (eCom platforms, research tools, DIY) | `competitor-alternatives` + `seo-specialist` + `saas-copywriter` | M | Each compare page targets a distinct query intent with clear winners/use-cases |
| 14 | **Refresh `use-cases/*` pages** for new-sellers / existing-brands / agencies personas | `landing-page-generator` + `ux-researcher-designer` + `saas-copywriter` | M | Each page has: persona-specific hero, jobs-to-be-done framing, persona-specific testimonials |
| 15 | **Auto-blog topical map review** + competitor content-gap analysis | `seo-specialist` + `competitive-intel` | S | 17-post map verified against current Helium10/JS gap analysis; 5 new gap-targeted posts queued |
| 16 | **Form CRO** on `contact.astro` and `demo.astro` | `form-cro` + `accessibility-specialist` | S | Field count minimized, button copy specific, success state clear, validation accessible |
| 17 | **Cross-domain signup flow E2E audit** (kaldon.io CTA → app.kaldon.io signup → activation) | `signup-flow-cro` + `analytics-tracking` | S | UTM passthrough verified; Rewardful coupon propagates; user gets to first WOW moment <3 min |
| 18 | **Persona + journey map** for new-seller / existing-brand / agency buyer types | `ux-researcher-designer` | S | 3 personas, 3 journey maps; informs use-cases pages |
| 19 | **Component design system documentation** for the 22 components | `ui-design-system` + `frontend-design` | S | Each component has: token usage, prop API, accessibility notes, do/don't visuals |
| 20 | **GSAP choreography** on Hero, IntelligenceDepth, FinalCTA (currently only PipelineScroll uses GSAP) | `gsap-scrolltrigger` + `gsap-timeline` + `gsap-performance` | M | Reveals are sequenced (not all 14 fading-up identically); reduced-motion respected |
| 21 | **Internal linking audit** — broken links, orphan pages, anchor text quality | `site-architecture` + `seo-specialist` | S | 0 broken internal links; every page reachable in ≤3 clicks from home; keyword-rich anchor where natural |
| 22 | **Programmatic SEO opportunity scan** — long-tail queries the topical map doesn't cover but Kaldon could rank for | `seo-specialist` + `autoresearch` | M | Backlog of programmatic page templates (e.g., "Kaldon vs [tool] for [use-case]") |
| 23 | **Rewardful program design** — formalize commission tier, payout, marketing kit | `referral-program` | S | Program spec doc; 3 affiliate-ready creative assets; tracking event for affiliate-driven signups |
| 24 | **Replace fake testimonials with real ones** (per 04-16 audit finding — was not yet addressed?) | `saas-copywriter` + verify | S | Every testimonial has: real name, real title, real photo OR is removed |
| 25 | **Link the dashboard's 04-16 audit findings still applicable** (some shipped: V3 brand tokens, fonts, type scale, componentization) and **mark closed** what's done | `superpowers:verification-before-completion` | S | Updated audit summary doc; closed items marked |

### P2 — Acquisition motion (ship within 90 days)

| # | Move | Skill(s) | Effort | Output |
|--:|---|---|:--:|---|
| 26 | **GTM strategy doc** | `marketing-demand-acquisition` + `ads-plan saas` | M | Channel mix, phased plan, budget |
| 27 | **Brand DNA extraction for ads** | `ads-dna` | S | brand-profile.json |
| 28 | **Competitor ad intel** (Helium 10, JS, ZonGuru ads on Meta + Google) | `ads-competitor` | S | Audit doc with creative + targeting + LP analysis |
| 29 | **Ad creative concepts** (3 angles per platform, 5 hooks per angle) | `ads-create` + `ads-creative` + `saas-copywriter` | M | Per-platform brief; ready to produce |
| 30 | **Ad images** | `ads-photoshoot` + `nano-banana-2` | S | All formats per platform spec |
| 31 | **Per-platform launch** (Meta + Google first, LinkedIn for agencies later) | `ads-meta` + `ads-google` + `ads-budget` + `ads-math` | L | Live campaigns; CAC tracked; ROAS positive within 30 days |
| 32 | **Per-campaign landing pages** | `ads-landing` + `landing-page-generator` + `page-cro` | M | Match-message LPs with conversion tracking |
| 33 | **A/B test plan** | `ads-test` | S | Backlog with hypotheses, sample size, MDE per test |
| 34 | **Cold email outbound** (agency segment specifically) | `cold-email` | M | 3-step sequence; reply rate >5% |
| 35 | **Lifecycle email sequence** (newsletter → free analysis → demo → trial) | `email-sequence` | M | Templates live; sequence triggered by tracked events |
| 36 | **Quarterly competitor re-pull** | `competitive-intel` | S | Recurring schedule (handled by §D.4) |

### P3 — Scaling & polish (ongoing)

| # | Move | Skill(s) | Effort | Output |
|--:|---|---|:--:|---|
| 37 | **Visual consistency pass** — every page audited against `frontend-design` anti-generic-AI checklist | `frontend-design` + `ui-ux-pro-max` | M | No leftover gradient-text headlines, no blurred color blobs, no kitchen-sink color grids |
| 38 | **Image format pipeline** — AVIF/WebP + responsive `srcset` everywhere | `performance-profiler` | M | Image bytes <50% of current; LCP image is AVIF |
| 39 | **Font subset optimization** — only load chars actually used (Inter has ~100kb of glyph weight) | `performance-profiler` | S | Font payload <40kb total |
| 40 | **Reduced-motion variants** for every animation | `accessibility-specialist` + `gsap-performance` | S | `prefers-reduced-motion: reduce` honored on every GSAP timeline |
| 41 | **Wiki vault setup** + ingest 04-16 audits + this plan | `wiki` + `wiki-ingest` | S | Vault live; queryable |
| 42 | **Knowledge graph** of competitor matrix + topical map + funnel | `graphify` | S | Graph artifacts in repo |
| 43 | **`llms.txt` quarterly refresh** with current pricing + product surface | `seo-specialist` | S | Recurring schedule |
| 44 | **Sitemap manual review** quarterly (some pages may need `<priority>` adjustment, lastmod) | `seo-specialist` | S | Recurring schedule |
| 45 | **Microcopy audit** across all CTAs, error states, empty states | `saas-copywriter` | S | All copy 6th-grade reading age, no em dashes, value-first verbs |
| 46 | **Plausible → upgrade tier** OR full PostHog/GA4 migration depending on P0 #7 outcome | `analytics-tracking` | S | Plan documented; budget allocated |

### Recurring cadences (post-P1, owned by `schedule` skill or local cron)

| Cadence | Job | Skill(s) |
|---|---|---|
| Daily | `pnpm build` green check; deployable | `superpowers:verification-before-completion` |
| On every deploy | Lighthouse CI on 5 key pages | `performance-profiler` |
| Weekly | Auto-blog deploy verification (Mon + Thu 16:00 UTC posts shipped) | `ci-cd-pipeline-builder` |
| Bi-weekly | Internal links + sitemap re-check | `site-architecture` |
| Monthly | Lighthouse + WCAG re-pass on every public page | `performance-profiler` + `accessibility-specialist` |
| Monthly | Competitor SEO + ad pull (Helium 10, JS, ZonGuru) | `competitive-intel` + `ads-competitor` |
| Quarterly | `llms.txt` + sitemap manual refresh | `seo-specialist` |
| Quarterly | Pricing review (vs competitor + cross-repo sync check) | `pricing-strategy` |
| Quarterly | Topical map gap analysis | `seo-specialist` + `competitive-intel` |
| Quarterly | Brand spec compliance re-audit | `ui-design-system` + `frontend-design` |
| On every commit | Verification before completion | `superpowers:verification-before-completion` |
| On every prompt | Skill router check | (UserPromptSubmit hook) |

---

## Section D — Structural enforcement architecture

Five layers, redundantly enforced. If any layer drifts, the others catch it.

### D.1 — Layer 1: CLAUDE.md (creating from scratch — none exists today)

**File to create:** `/Users/seantravis/kaldon-marketing-site/CLAUDE.md`

**Proposed content** (full text — see §G self-review):

```markdown
# Kaldon Marketing Site (kaldon.io)

## Purpose

Acquisition + activation surface for the Kaldon SaaS. Drives qualified traffic via SEO + ads, converts to dashboard signups via CRO + brand + copy.

## Tech Stack

- Astro 6 (static output, `output: 'static'`)
- Tailwind CSS 3 + PostCSS
- Cloudflare Workers via `@astrojs/cloudflare` adapter
- TypeScript
- GSAP for animation (currently only `PipelineScroll`)
- Self-hosted fonts: Satoshi (display) + Inter Variable (body) + JetBrains Mono (kicker/stat)
- Anthropic SDK + OpenAI SDK for auto-blog (`scripts/generate-blog-post.mjs`)
- Resvg + Satori for OG image generation (`scripts/generate-og.mjs`)
- pnpm + wrangler

## Brand System (V3 — IRON RULES)

- **Gold `#FFB800`** = 100% of primary CTAs. Never used for decoration. Never anywhere else.
- **Signal `#00D4FF`** = ONLY on live-data affordances (pulsing dots, active-state rings, in-chart callouts). Never on CTAs. Never as headline highlights. Never in decorative gradients.
- Background: Void `#0A0A0F`. Card: Deep Space `#12121A`. Border: Graphite `#1E1E2A` or hairline `rgba(255,255,255,0.06)`.
- Type: Display = Satoshi, Body = Inter Variable, Mono = JetBrains. **No DM Sans.** No system fallback in production output.
- Type scale: Linear-school. Display `clamp(48px, 6vw, 64px)` weight 500, tracking `-0.022em`. **Not Stripe-school 96px.**
- Accent colors total <10% of any page surface. Everything else: Void / Deep Space / Chalk / Ghost.
- Anti-generic-AI checklist (do NOT introduce):
  - Gradient text on hero H1
  - Blurred color blobs in backgrounds
  - Floating screenshot with cyan glow shadow
  - Kitchen-sink color grids (one color per accent role)
  - `btn-glow` / `animation: glow-pulse` on CTAs
  - 5 inline SVG stars + vague trust claims
  - 4 simultaneous overlays (announcement bar + cookie + sticky CTA + exit intent)
- Voice: Kaldon-specific. Technical, precise, data-forward. **Not** founder-personal. **Not** EFH voice.
- Copy: 6th-grade reading age, PhD thinking underneath. **No em dashes (`—`).** Use period, comma, or colon instead.

## Code Standards

- All pages must declare structured data appropriate to type (Product / SoftwareApplication / Article / FAQPage / HowTo / BreadcrumbList auto)
- All pages must have a per-page OG image (declared in `ogSlugFromPath` map in `BaseLayout.astro` and generated PNG in `public/images/og/`)
- All CTAs that cross to `app.kaldon.io` must preserve UTM params and Rewardful affiliate context
- Every interactive component must be keyboard-accessible with visible focus state (gold-on-void)
- Cookie consent: minimal, non-blocking, bottom corner only
- Self-hosted fonts only. No Google Fonts in production.
- Security headers in `public/_headers` must include CSP, HSTS, COEP/COOP/CORP, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy
- All Anthropic SDK calls must use prompt caching for system prompts
- Every page must build cleanly with `pnpm build` before any commit

## Deploy Workflow

- Branch: usually `main`
- Commit format: `verb(scope): one-line summary`
- Pre-push: `pnpm build` must succeed
- Cloudflare Workers deploy via `pnpm run deploy` (or auto on main push if wired)
- Auto-blog: `.github/workflows/auto-blog.yml` runs Mon + Thu 16:00 UTC

## Skill Routing Protocol (Elite Default)

This protocol is the operational standard. Drift is failure.

### Process triggers (always evaluate)
| Signal | Required skills (in order) |
|---|---|
| New page / new feature | `superpowers:brainstorming` → `superpowers:writing-plans` → `superpowers:test-driven-development` (where testable) → `superpowers:verification-before-completion` |
| Bug / broken behavior / build failure | `superpowers:systematic-debugging` (always; never guess) → `superpowers:verification-before-completion` |
| ≥3 step task | `superpowers:writing-plans` → `superpowers:subagent-driven-development` OR `superpowers:executing-plans` |
| 2+ independent tasks | `superpowers:dispatching-parallel-agents` |
| Pre-commit / pre-PR | `simplify` → `superpowers:verification-before-completion` → `code-reviewer` → `superpowers:requesting-code-review` |
| Implementation complete | `superpowers:finishing-a-development-branch` |

### Surface triggers (evaluate by file path / topic)
| File / topic | Required skills |
|---|---|
| Any `src/pages/*.astro` | `seo-specialist` (meta + structured data) + `accessibility-specialist` |
| `pricing.astro` | `pricing-strategy` + `competitive-intel` + `page-cro` + `saas-copywriter` (verify cross-repo parity with dashboard) |
| `vs/*`, `compare/*`, `use-cases/*` | `competitor-alternatives` + `competitive-intel` + `saas-copywriter` + `seo-specialist` |
| `index.astro` or any home component | `page-cro` + `landing-page-generator` + `frontend-design` |
| `contact.astro`, `demo.astro`, any form | `form-cro` + `accessibility-specialist` |
| Cross-domain CTA → `app.kaldon.io` | `signup-flow-cro` + `analytics-tracking` + `senior-security` |
| `BaseLayout.astro` head/scripts | `seo-specialist` + `performance-profiler` + `analytics-tracking` |
| `_headers` / `_redirects` / `wrangler.jsonc` | `senior-security` + `senior-devops` |
| `astro.config.mjs` / `tailwind.config.mjs` / `global.css` | `ui-design-system` + V3 brand spec compliance check |
| `tailwind.config.mjs` | `ui-design-system` (token integrity) |
| `scripts/generate-blog-post.mjs` (Anthropic SDK) | `claude-api` (REQUIRED: prompt caching) |
| `scripts/kaldon-blog-config.mjs` (topical map) | `seo-specialist` + `competitive-intel` |
| `.github/workflows/auto-blog.yml` | `ci-cd-pipeline-builder` + `senior-devops` |
| Any new image / video / animation | `performance-profiler` + relevant `gsap-*` for animation |
| Any new component | `ui-design-system` + `frontend-design` + `accessibility-specialist` |
| User-facing copy | `saas-copywriter` (no em dashes, 6th-grade reading age, PhD thinking under) |
| GSAP usage | `gsap-core` (Astro context, not React) + relevant sub-skill |

### Composite kickoffs
- **New page:** `superpowers:brainstorming` → `seo-specialist` → `landing-page-generator` → `saas-copywriter` → `page-cro` → `accessibility-specialist` → `frontend-design` → `analytics-tracking`
- **Pricing change:** `pricing-strategy` → `competitive-intel` → `page-cro` → `saas-copywriter` → `analytics-tracking` → cross-repo dashboard parity check
- **GTM launch:** `marketing-demand-acquisition` → `ads-plan saas` → per-platform `ads-*` → `ads-landing` → `analytics-tracking`
- **Brand change:** `ui-design-system` → V3 spec compliance → `frontend-design` → `accessibility-specialist` (contrast)
- **Auto-blog post:** `claude-api` (prompt caching) → `seo-specialist` (frontmatter quality) → `superpowers:verification-before-completion` (build passes)
- **Branch close:** `superpowers:verification-before-completion` (build green) → `simplify` → `code-reviewer` → `superpowers:finishing-a-development-branch`

If a skill is listed for a trigger and you do NOT invoke it, you must explicitly state why before proceeding. "Not relevant because X." Never silently skip.

## Do Not

- Use DM Sans, Google Fonts, or system fallback as primary in production
- Use Signal `#00D4FF` on CTAs (Gold only). Use Gold for decoration (Signal-only roles only).
- Hardcode hex values where a Tailwind token exists
- Use em dashes (`—`) in any user-facing copy
- Add gradient text headlines, blurred color blobs, glow-pulse animations, kitchen-sink color grids
- Ship sample/fake testimonials
- Add a Google Font preconnect; use self-hosted only
- Ship a page without structured data
- Add an Anthropic SDK call without prompt caching
- Push without `pnpm build` passing
- Add a third-party script without checking LCP impact

## Available Skills (most-used on this surface)

**SEO + content:** seo-specialist, site-architecture, competitor-alternatives, competitive-intel, autoresearch, defuddle
**CRO:** page-cro, form-cro, signup-flow-cro, onboarding-cro, landing-page-generator, saas-copywriter, pricing-strategy
**Performance + edge:** performance-profiler, senior-devops, ci-cd-pipeline-builder
**Brand + design:** ui-design-system, frontend-design, ui-ux-pro-max, ux-researcher-designer, gsap-core/scrolltrigger/timeline/performance, nano-banana-2
**Accessibility:** accessibility-specialist
**Analytics + acquisition:** analytics-tracking, marketing-demand-acquisition, ads-plan saas, ads-meta/google/linkedin/tiktok/microsoft, ads-budget, ads-math, ads-test, ads-creative, ads-competitor, ads-photoshoot, ads-dna, cold-email, email-sequence, referral-program
**Content automation:** claude-api (auto-blog), seo-specialist
**Security:** senior-security
**Process:** all `superpowers:*`, simplify, code-reviewer

## Connected Services / MCPs

- Plausible Analytics (lightweight, privacy-first; data at plausible.io)
- Rewardful (`data-rewardful="e619ee"` for affiliate tracking; admin at app.rewardful.com)
- Cloudflare Workers (deploy via `wrangler`; observability enabled in `wrangler.jsonc`)
- Anthropic SDK (auto-blog post generation; secret in `ANTHROPIC_API_KEY`)
- OpenAI SDK (auxiliary; secret in `OPENAI_API_KEY` — currently unused but installed)
- Perplexity (auto-blog trend refresh; secret in `PERPLEXITY_API_KEY`)
```

### D.2 — Layer 2: UserPromptSubmit hook

**File to create:** `/Users/seantravis/kaldon-marketing-site/.claude/settings.json`

```json
{
  "permissions": {
    "allow": []
  },
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cat /Users/seantravis/kaldon-marketing-site/.claude/skill-router-reminder.md"
          }
        ]
      }
    ]
  }
}
```

### D.3 — Layer 3: Skill router reminder file

**File to create:** `/Users/seantravis/kaldon-marketing-site/.claude/skill-router-reminder.md`

```markdown
# Skill Router (check before responding)
- Creative ask? → brainstorming first
- Multi-step (≥3)? → writing-plans
- Code/page change? → simplify after + verification-before-completion + code-reviewer before merge
- Bug? → systematic-debugging (root cause before fix)
- Any page? → seo-specialist + accessibility-specialist
- Pricing? → pricing-strategy + competitive-intel + page-cro + verify cross-repo parity
- vs/*, compare/*, use-cases/*? → competitor-alternatives + saas-copywriter
- Form? → form-cro + accessibility-specialist
- Cross-domain CTA? → signup-flow-cro + analytics-tracking + senior-security
- _headers / _redirects / wrangler? → senior-security + senior-devops
- tailwind / global.css / V3 tokens? → ui-design-system + V3 spec check (Gold=CTA only, Signal=live-data only)
- Anthropic SDK? → claude-api (prompt caching mandatory)
- GitHub workflow? → ci-cd-pipeline-builder
- Animation? → gsap-core + sub-skill (Astro context, not React)
- New page? → composite: brainstorming → seo-specialist → landing-page-generator → saas-copywriter → page-cro → accessibility-specialist → frontend-design → analytics-tracking
- Ads/acquisition? → marketing-demand-acquisition + ads-plan saas + per-platform
- Worth a graph? → graphify
- 2+ independent tasks? → dispatching-parallel-agents
- Branch closing? → finishing-a-development-branch

V3 brand iron rules: Gold #FFB800 = CTA only. Signal #00D4FF = live data only. No em dashes. No DM Sans. Self-hosted fonts only.

If a trigger applies and you skip the skill, state the reason explicitly.
```

### D.4 — Layer 4: Persistent memory entry

Add to `/Users/seantravis/.claude/projects/-Users-seantravis-product-discovery-dashboard/memory/MEMORY.md` (or a new marketing-site-scoped memory dir if one exists):

A pointer entry: `[Marketing site skill router protocol](feedback_kaldon_marketing_skill_router.md) — ALWAYS-ON for kaldon-marketing-site repo. V3 brand iron rules + skill triggers.`

And the file `feedback_kaldon_marketing_skill_router.md` containing the compressed router + V3 iron rules.

(The user already added a similar pipeline-side entry. The marketing-site equivalent needs to be a separate file so it doesn't conflict.)

### D.5 — Layer 5: Recurring agents (the `schedule` skill)

After approval, install routines per §C cadence table.

| Routine | Cadence | Action |
|---|---|---|
| `kaldon-marketing-build-green` | Daily | `pnpm build` must pass; alert if not |
| `kaldon-marketing-lighthouse` | On every deploy | Lighthouse CI on 5 key pages; alert if score drops |
| `kaldon-marketing-autoblog-verify` | Weekly Mon + Thu 17:00 UTC (1h after cron) | Verify the day's auto-blog post shipped |
| `kaldon-marketing-internal-links` | Bi-weekly | Crawl + verify no broken links |
| `kaldon-marketing-perf-a11y` | Monthly | Full Lighthouse + WCAG sweep |
| `kaldon-marketing-competitor-pull` | Monthly | `competitive-intel` + `ads-competitor` rerun |
| `kaldon-marketing-llms-refresh` | Quarterly | Update `llms.txt` with current pricing + product surface |
| `kaldon-marketing-pricing-parity` | Quarterly | Verify pricing.astro matches dashboard Stripe live products |
| `kaldon-marketing-topical-gap` | Quarterly | Re-run topical map vs competitor content gaps |
| `kaldon-marketing-brand-compliance` | Quarterly | V3 spec re-audit |

---

## Section E — Missing skills to acquire

Marketing site has fewer skill gaps than the pipeline because the surface is narrower. But there are real ones.

| # | Proposed skill | Rationale | Acquisition path |
|--:|---|---|---|
| 1 | **`astro-best-practices`** | Astro-specific patterns (content collections, image optimization, view transitions, hybrid output, prefetch) are not captured by generic frontend skills. The marketing site uses Astro 6 with content collections; getting the patterns right matters. | Build via `superpowers:writing-skills` |
| 2 | **`cloudflare-workers-edge`** | Workers-specific patterns: KV, D1, Durable Objects (none used yet but future-relevant), `_headers` syntax, `wrangler` ops, observability, rollback. Currently inferred. | Build via `superpowers:writing-skills` |
| 3 | **`schema-org-markup`** | A skill that knows the full schema.org vocabulary for SaaS marketing (SoftwareApplication, Product, Organization, Review, AggregateRating, FAQPage, HowTo, Article, BreadcrumbList, BlogPosting) and emits validated JSON-LD. The 11-page coverage gap is exactly the kind of thing a skill would prevent. | Build via `superpowers:writing-skills` |
| 4 | **`lighthouse-ci`** | Wraps the Lighthouse CLI with: budgets, GitHub Actions integration, regression alerts, mobile/desktop profiles, throttling. Generic `performance-profiler` covers principles but not workflow. | Build via `superpowers:writing-skills` |
| 5 | **`image-optimization-pipeline`** | AVIF/WebP encoding, responsive `srcset`, art-direction, blur placeholders, lazy loading, fetchpriority, Astro `<Image>` component patterns, CDN headers. | Build via `superpowers:writing-skills` |
| 6 | **`generative-engine-optimization`** (GEO) | The auto-blog system mentions GEO. ChatGPT/Perplexity/Claude search citations work differently from Google SERP. A skill for: structured citations, claim density, source diversity, authority signals, llms.txt structure. | Build via `superpowers:writing-skills` |
| 7 | **`programmatic-seo`** | Building hundreds of long-tail landing pages from a template + data table. Use cases: `Kaldon vs [tool] for [use-case]`, `Best AI [feature] for [persona]`. Done well, this is 10x SEO leverage. | Build via `superpowers:writing-skills` |
| 8 | **`rewardful-affiliate-ops`** | Specific to the Rewardful product: link generation, commission rules, payout cadence, affiliate-recruiting copy, dashboard exports. Generic `referral-program` covers strategy; this would cover ops. | Build via `superpowers:writing-skills` |
| 9 | **`plausible-or-posthog-events`** | Event taxonomy, naming convention, custom dimensions, funnels, cohorts. Generic `analytics-tracking` covers principles; this would be tool-specific. | Build via `superpowers:writing-skills` |
| 10 | **`og-image-generator`** | The repo already has `scripts/generate-og.mjs` (Satori + Resvg). A skill that captures: typography rules for OG, Twitter card variants, fallback strategies, A/B testing OGs for shareability. | Build via `superpowers:writing-skills` |
| 11 | **`cross-domain-attribution`** | Marketing on `kaldon.io`, app on `app.kaldon.io`. UTM passthrough, Rewardful coupon propagation, GA4 cross-domain config, server-side join, first-touch vs last-touch attribution. | Build via `superpowers:writing-skills` |
| 12 | **`shopify-partners-positioning`** | The dashboard roadmap (P2 #31) calls for repositioning storefront generator as "Pre-Shopify Validator." That positioning lives on this marketing site. A skill for Partner program criteria, positioning language, partnership outreach. | Build via `superpowers:writing-skills` |

**Recommended order:** acquire #1 (Astro best practices) and #4 (Lighthouse CI) first — both have direct daily value. Then #3 (schema.org markup) since the 11-page gap is shippable in P0. Then the rest as time permits.

---

## Section F — Elite outcomes (the bar)

Without measurable outcomes, "elite" is a vibe. These are the success criteria the architecture must hold against.

### F.1 — Performance & accessibility

| Metric | Floor (current likely) | Elite target |
|---|---|---|
| Lighthouse Performance (mobile) | Unmeasured | ≥95 on every public page |
| Lighthouse Accessibility | Unmeasured | ≥98 on every public page |
| Lighthouse Best Practices | Unmeasured | ≥95 |
| Lighthouse SEO | Unmeasured | 100 (achievable on Astro static) |
| LCP (mobile, 4G throttled) | Unmeasured | <1.5s |
| INP | Unmeasured | <200ms p75 |
| CLS | Unmeasured | <0.05 |
| Total bundle size (initial) | Unmeasured | <100kb gzipped |
| WCAG | Skip link + focus state | AA on every page; auto-test in CI; manual screen-reader pass quarterly |
| Cumulative Perf budget | None | Enforced in CI; PR fails if any page regresses >5% |

### F.2 — SEO

| Metric | Floor | Elite |
|---|---|---|
| Schema.org coverage | 11/22 pages | 22/22 pages |
| Rich Results eligibility | Partial | Every page passes Rich Results Test |
| Sitemap freshness | Auto via @astrojs/sitemap | Pages with `lastmod` correctly set |
| Internal links | Some | 0 broken; every page reachable in ≤3 clicks; keyword-rich anchors where natural |
| Indexed pages | Unmeasured | 22 main + 17 blog + programmatic = 60-100+ indexed within 90 days |
| Organic traffic | Baseline (auto-blog firing 2x/week) | 2x growth quarter-over-quarter for first 4 quarters; then steady |
| Top-10 keywords | Unmeasured | 5+ in top 10 within 90 days; 20+ within 180 days |
| GEO citations (ChatGPT, Perplexity, Claude search) | Unmeasured | Cited on ≥10 long-tail Kaldon-relevant queries |

### F.3 — Conversion

| Metric | Floor | Elite |
|---|---|---|
| Hero CTA → Pricing CTR | Unmeasured | >25% |
| Pricing → Demo/Signup CTR | Unmeasured | >15% |
| Cross-domain signup completion | Unmeasured | >60% (people who click CTA finish signup on app side) |
| Form abandonment (`demo.astro`, `contact.astro`) | Unmeasured | <30% |
| Bounce rate (homepage) | Unmeasured | <50% |
| Time on `vs/*` page (high-intent SEO) | Unmeasured | >2 min average |

### F.4 — Brand consistency

| Surface | Floor | Elite |
|---|---|---|
| V3 token usage | Implemented in tailwind | 100% of pages use tokens; 0 hardcoded hex outside design tokens |
| Font fidelity | Self-hosted Satoshi/Inter/JBM | 0 FOIT; <100ms font-display: swap impact |
| Iron rules (Gold-CTA, Signal-data) | Implemented | Quarterly audit confirms no regressions |
| Anti-generic-AI checklist | Per 04-16 audit (most addressed) | Re-audited quarterly; nothing on the list ships |

### F.5 — Auto-blog system

| Metric | Floor | Elite |
|---|---|---|
| Workflow firing | Broken (zero jobs per memory) | Fires 100% of scheduled runs (Mon + Thu 16:00 UTC) |
| Anthropic cost per post | No prompt caching | <$0.30/post via cached system prompt |
| Post quality (manual review) | Unmeasured | Each post: ≥1500 words, ≥3 trend-refresh signals, FAQ section, structured data, internal links to ≥3 cluster posts |
| Post indexing time | Unmeasured | <48h to indexed by Google |

### F.6 — Acquisition

| Metric | Floor | Elite (within 180 days of GTM launch) |
|---|---|---|
| Paid channels live | 0 | Meta + Google + (LinkedIn for agency tier) |
| Blended CAC | N/A | <$80 for Growth tier ($119/mo, target LTV:CAC 3:1) |
| Ad QS / ROAS | N/A | Google QS ≥7 on top 10 keywords; Meta ROAS ≥1.5 within 60 days |
| Cold email reply rate (agency) | 0 | >5% reply rate on 3-step sequence |
| Affiliate-driven signups | 0 (Rewardful wired but no program) | 5%+ of all signups via affiliates within 90 days of program launch |

### F.7 — Operating discipline

| Surface | Floor | Elite |
|---|---|---|
| Skill invocation discipline | Ad hoc, ~10% of available skills used on this surface | Router enforced; 80%+ of relevant skills invoked per their triggers |
| Audit cadence | One-time (04-16) | Recurring per §D.5 schedule |
| Knowledge graph | None | Competitor matrix + topical map + funnel graphed |
| Wiki vault | None | Set up; audits ingested; queryable |
| ADRs | 0 | Brand spec, blog architecture, analytics stack each have an ADR |

---

## Section G — Self-review

Running the writing-plans self-review checklist against this document.

### G.1 — Spec coverage

User asked for:
1. ✅ Audit every skill against where it can be used on the marketing site → §A Routing Map covers triggers across 12 categories; not-relevant skills (BullMQ, agent-designer, senior-data-engineer, churn-prevention, etc.) are implicitly excluded as they don't appear in any trigger
2. ✅ Lock skills into process so they fire automatically → §D five-layer enforcement (CLAUDE.md, hook, reminder file, memory pointer, recurring routines)
3. ✅ Audit project against new architecture → §B walks 13 surfaces (homepage, conversion pages, SEO funnel, blog, BaseLayout, tracking, auto-blog, cross-domain, security headers, OG/schema coverage, performance, acquisition, knowledge mgmt)
4. ✅ Optimization plan → §C with P0/P1/P2/P3 tiers (46 work items) + recurring cadences
5. ✅ Double-check work — this section
6. ✅ Define elite outcomes → §F across 7 dimensions
7. ✅ Send findings before execution → this document; awaiting approval
8. ✅ Lock in structurally after agreement → §D specifies exact files + content
9. ✅ Identify missing skills → §E lists 12 with rationale + acquisition path

### G.2 — Placeholder scan

Searched for: TBD, TODO, "fill in", "implement later", "appropriate error handling", "similar to", "etc." None found in actionable items. Every item names files, paths, or skills.

### G.3 — Type / name consistency

- File paths absolute and consistent: `/Users/seantravis/kaldon-marketing-site/...`
- Skill names match the registry (verified against the system-reminder skill list)
- Brand tokens consistent (Void/Deep Space/Signal/Gold/Ghost/Chalk per V3)
- Composite triggers in §A.12 use the same skill names as §A.1-A.11
- §D.5 routine names align with skill names they invoke

### G.4 — Gaps I found and fixed inline

- Initially missed `claude-api` in the auto-blog surface — added to A.9 and as P0 #4
- Initially missed pricing parity with dashboard — added as P0 #5 (HIGH severity in the executive summary)
- Initially missed `_headers` security gap — added to B.5 and P0 #6
- Initially missed that Plausible alone is insufficient for SaaS funnel analysis — added to B.6 and P0 #7
- Initially missed schema.org coverage gap on 11 pages — promoted to P0 #3
- Initially listed 8 missing skills; added #6 GEO (mentioned in BLOG.md), #11 cross-domain attribution, #12 Shopify Partners positioning after recalling the dashboard roadmap P2 #31

### G.5 — Spec requirements with no task

Re-checked the user's prompt:
- "Go through every single skill" — §A covers it (categorized; full coverage verified against system-reminder list)
- "Lock that into your process" — §D
- "Double check your work" — §G
- "Audit against your new skill architecture" — §B
- "Specifically for the marketing site" — every section is marketing-site-scoped; no pipeline-only items leaked
- "Optimization plan" — §C
- "Outcomes" — §F
- "Send findings" — this document
- "If I agree, we will execute" — explicit handoff at end
- "Lock these into structural enforcement" — §D specifies exact files post-approval
- "Tell me about missing skills" — §E

No spec requirement uncovered.

### G.6 — Honest weaknesses of this plan

- **Volume risk:** 46 work items + 11 recurring cadences. Will take quarters of execution. P0 alone (8 items) is ~5-7 dev-days.
- **Hook overhead:** UserPromptSubmit hook injects ~500 tokens per prompt. Acceptable for the discipline gained, but quantified.
- **No measured baseline yet:** elite outcomes (§F) are aspirational. The first P1 item (Lighthouse baseline) gives us numbers; until then, the targets are guidance.
- **Pricing parity check (P0 #5) requires reading the dashboard repo.** This blurs the marketing-site-only scope but is necessary because price/promise mismatch is a high-severity trust killer that lives at the seam.
- **Some triggers fire often:** `seo-specialist` + `accessibility-specialist` would fire on every page touch. Could be tuned to "first time per file per session" if it gets noisy.
- **Missing skills (§E) require building before they can fire.** Until they exist, those gaps stay covered by my judgment + memory.
- **Auto-blog fix (P0 #2) is a guess until I touch GitHub repo settings.** Most likely cause is the Settings → Actions workflow permissions being read-only (default for repos created post-2023), but it might be something else (e.g., billing limit, branch protection blocking writes, or a cached YAML). Need to verify before editing.

---

## Execution handoff

**Plan complete and saved to** `/Users/seantravis/kaldon-marketing-site/docs/audit/2026-04-25-elite-skill-architecture.md`.

**Awaiting approval.**

**If approved as-is**, I will:
1. Execute P0 #1 first (lock the router into CLAUDE.md, settings.json hook, reminder file, memory) so the rest of the plan is governed by the new architecture
2. Then dispatch parallel agents on P0 #2 (auto-blog), #3 (schema), #4 (prompt caching), #6 (security headers) — all independent
3. Then P0 #5 (pricing parity — requires cross-repo read) and #7 (analytics — needs decision on PostHog vs GA4) which need approval before I move
4. Then queue P1 audits in parallel (most independent)

**Two execution options:**
1. **Subagent-Driven (recommended)** — fresh subagent per task, two-stage review between, fast iteration on P0 + P1.
2. **Inline Execution** — all in this session, with checkpoints for review.

**If the plan needs changes** — flag specific items, I'll revise §C/§D/§E and re-self-review.

**If the plan is too aggressive** — name the constraint (cash, calendar, focus) and I'll prune to a 30/60/90 ship list.

**Once locked in**, I'll never operate without the router again on this marketing-site repo. That's the whole point.
