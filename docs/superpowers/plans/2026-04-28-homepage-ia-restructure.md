# Homepage IA Restructure (Wife-Angle Hybrid) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the kaldon.io homepage from 13 sections to 9 by inserting a new buyer-voice WhoItsForBeginner section at position #2, removing 5 misaligned/redundant sections from the homepage, and relocating two of those sections to where their audience actually is (`/pricing`, `/compare/research-tools`).

**Architecture:** New static Astro section component built in V3 brand style matching the existing IntelligenceDepth pattern (Deep Space cards, mono numerals, hairline borders, no decorative gold or signal cyan). Homepage `index.astro` imports change from 13 components to 9 with reordering. Two existing components (`ProblemSection`, `SavingsCalculator`) are removed from `index.astro` and added to `pricing.astro`; `ProblemSection` is also added to `compare/research-tools.astro`. No new design tokens, no new dependencies, no JavaScript, no GSAP.

**Tech Stack:** Astro 6, Tailwind CSS 3, V3 CSS variables (`--void`, `--deep-space`, `--hairline`, `--chalk`, `--ghost`, `--text-quaternary`), Cloudflare Workers via wrangler.

**Spec:** `docs/superpowers/specs/2026-04-28-homepage-ia-restructure-design.md`

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/components/home/WhoItsForBeginner.astro` | CREATE | New buyer-voice pain-point section, 4 cards, V3-compliant |
| `src/pages/index.astro` | MODIFY | Remove 5 imports/uses, add 1 import/use, reorder render to 9 sections |
| `src/components/home/IntelligenceDepth.astro` | MODIFY | Stat tile signal count `10` → `11` (one prop change) |
| `src/components/home/PipelineScroll.astro` | MODIFY | Absorb FoundationCredibility thesis line into intro paragraph |
| `src/pages/pricing.astro` | MODIFY | Add `ProblemSection` + `SavingsCalculator` imports and uses |
| `src/pages/compare/research-tools.astro` | MODIFY | Add `ProblemSection` import and use |

Components retained in repo but no longer imported on homepage: `FoundationCredibility.astro`, `ModeBadges.astro` (in `ui/`), `Testimonials.astro`. They stay as files for potential future use (e.g., real testimonials when quotes exist).

---

## Task 1: Create WhoItsForBeginner.astro component

**Files:**
- Create: `src/components/home/WhoItsForBeginner.astro`

- [ ] **Step 1: Create the file with the full component**

Write the file with this exact content:

```astro
---
// WhoItsForBeginner.astro. Buyer-voice pain-point section.
// Mirrors the visitor's stalled-seller complaints in their own words
// before the page introduces any feature, pipeline, or technical proof.
// V3-compliant: no decorative gold, no signal cyan, no em dashes, no emojis.
const cards = [
  {
    num: '01',
    headline: "You want to sell online. You just don't know what to sell.",
    body: "You've had the idea for years. Picking the right product still feels like a gamble. What if it doesn't sell?",
  },
  {
    num: '02',
    headline: 'Every product you\'ve thought of already has a hundred competitors.',
    body: "You search Amazon and everything is there already. Cheaper. With thousands of reviews. There's no room left for you.",
  },
  {
    num: '03',
    headline: "You don't want $40,000 in inventory sitting in your garage.",
    body: 'Buying stock before you know it will sell is the part that scares you. One wrong bet and the boxes are still there in November.',
  },
  {
    num: '04',
    headline: 'Every research tool is built for someone who already knows.',
    body: "You don't want to learn how Helium 10 works. You want someone to tell you what to sell.",
  },
];
---

<section class="section-spacing" style="background: var(--void);" aria-labelledby="who-its-for-beginner-heading">
  <div class="container-custom">
    <header class="max-w-prose mx-auto text-center mb-12 md:mb-16">
      <span class="kicker">Why You're Stuck</span>
      <h2
        id="who-its-for-beginner-heading"
        class="font-display font-semibold text-chalk"
        style="font-weight: 600; font-size: clamp(32px, 4.5vw, 48px); line-height: 1.1; letter-spacing: -0.02em;"
      >
        If you've thought about selling online but kept stalling, this is why.
      </h2>
      <p class="mt-4 text-body-lg" style="color: var(--ghost); line-height: 1.5;">
        Four reasons most people never start. Kaldon was built to remove all four.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
      {cards.map((c) => (
        <article
          class="p-6 md:p-8 rounded-md"
          style="background: var(--deep-space); border: 1px solid var(--hairline);"
        >
          <span
            class="font-mono text-body-sm block mb-3"
            aria-hidden="true"
            style="color: var(--text-quaternary); letter-spacing: -0.01em;"
          >
            {c.num}
          </span>
          <h3
            class="font-display mb-2"
            style="font-weight: 600; font-size: 18px; color: var(--chalk); letter-spacing: -0.01em; line-height: 1.3;"
          >
            {c.headline}
          </h3>
          <p class="text-body-sm" style="color: var(--ghost); line-height: 1.5;">
            {c.body}
          </p>
        </article>
      ))}
    </div>

    <div class="mt-10 md:mt-12 text-center">
      <a
        href="#pipeline"
        class="who-its-for-beginner-anchor text-body-sm font-mono inline-flex items-center gap-2"
      >
        See what we built →
      </a>
    </div>
  </div>
</section>

<style>
  .who-its-for-beginner-anchor {
    color: var(--ghost);
    transition: color 0.2s ease;
  }
  .who-its-for-beginner-anchor:hover,
  .who-its-for-beginner-anchor:focus-visible {
    color: var(--chalk);
  }
  .who-its-for-beginner-anchor:focus-visible {
    outline: 2px solid var(--gold);
    outline-offset: 4px;
    border-radius: 2px;
  }
</style>
```

- [ ] **Step 2: Verify the file was created**

Run: `ls -la src/components/home/WhoItsForBeginner.astro`
Expected: file exists, non-zero size

- [ ] **Step 3: Verify the build passes with the new component (without it being imported yet)**

Run: `pnpm build 2>&1 | tail -10`
Expected: build completes successfully. Note: at this point the component is not yet imported anywhere, so the build only validates the file's syntax indirectly (Astro doesn't compile unused components). The next task imports it; the real build check happens then.

---

## Task 2: Restructure index.astro to the new 9-section order

**Files:**
- Modify: `src/pages/index.astro` (imports block lines 2-15, render block lines 60-72)

- [ ] **Step 1: Replace the imports block**

Find the current imports (lines 2-15):

```astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/home/Hero.astro';
import ConnectedPlatforms from '../components/home/ConnectedPlatforms.astro';
import FoundationCredibility from '../components/home/FoundationCredibility.astro';
import ProblemSection from '../components/home/ProblemSection.astro';
import PipelineScroll from '../components/home/PipelineScroll.astro';
import ModeBadges from '../components/ui/ModeBadges.astro';
import MarketGapWeek from '../components/home/MarketGapWeek.astro';
import IntelligenceDepth from '../components/home/IntelligenceDepth.astro';
import WhoItsFor from '../components/home/WhoItsFor.astro';
import PricingTeaser from '../components/home/PricingTeaser.astro';
import SavingsCalculator from '../components/home/SavingsCalculator.astro';
import FinalCTA from '../components/home/FinalCTA.astro';
import Testimonials from '../components/home/Testimonials.astro';
```

Replace with:

```astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/home/Hero.astro';
import WhoItsForBeginner from '../components/home/WhoItsForBeginner.astro';
import ConnectedPlatforms from '../components/home/ConnectedPlatforms.astro';
import PipelineScroll from '../components/home/PipelineScroll.astro';
import IntelligenceDepth from '../components/home/IntelligenceDepth.astro';
import MarketGapWeek from '../components/home/MarketGapWeek.astro';
import WhoItsFor from '../components/home/WhoItsFor.astro';
import PricingTeaser from '../components/home/PricingTeaser.astro';
import FinalCTA from '../components/home/FinalCTA.astro';
```

(5 removed: FoundationCredibility, ProblemSection, ModeBadges, SavingsCalculator, Testimonials. 1 added: WhoItsForBeginner.)

- [ ] **Step 2: Replace the render block**

Find the current render block (lines 60-72):

```astro
  <Hero />
  <ConnectedPlatforms />
  <FoundationCredibility />
  <ProblemSection />
  <PipelineScroll />
  <ModeBadges headline="Three ways to use Kaldon. One creation pipeline." />
  <IntelligenceDepth />
  <MarketGapWeek />
  <Testimonials />
  <WhoItsFor />
  <PricingTeaser />
  <SavingsCalculator />
  <FinalCTA />
```

Replace with:

```astro
  <Hero />
  <WhoItsForBeginner />
  <ConnectedPlatforms />
  <PipelineScroll />
  <IntelligenceDepth />
  <MarketGapWeek />
  <WhoItsFor />
  <PricingTeaser />
  <FinalCTA />
```

- [ ] **Step 3: Run pnpm build to verify the IA restructure compiles**

Run: `pnpm build 2>&1 | tail -20`
Expected: build completes successfully, all 30 pages prerender. No "Cannot find module" errors. No template errors.

If the build fails with a missing-import error, double-check that `WhoItsForBeginner.astro` was saved with the exact path `src/components/home/WhoItsForBeginner.astro`.

---

## Task 3: Fix IntelligenceDepth stat tile signal count

**Files:**
- Modify: `src/components/home/IntelligenceDepth.astro:35`

- [ ] **Step 1: Update the StatTile numeral prop from 10 to 11**

Find line 35:

```astro
      <StatTile label="Signal sources" numeral="10" sub="Parallel data streams" />
```

Replace with:

```astro
      <StatTile label="Signal sources" numeral="11" sub="Parallel data streams" />
```

(The body says "eleven signal sources" and the list has 11 entries. The tile was the only place with the wrong count.)

- [ ] **Step 2: Verify the build still passes**

Run: `pnpm build 2>&1 | tail -10`
Expected: build completes successfully.

---

## Task 4: Absorb FoundationCredibility thesis line into PipelineScroll intro

**Files:**
- Modify: `src/components/home/PipelineScroll.astro:86`

- [ ] **Step 1: Update the intro paragraph**

Find line 86 (the `<p>` content):

```
Every step feeds the next. Demand data becomes a validated product concept. The concept becomes a brand. The brand becomes content. The content populates a live store. The store data scales your ads. One continuous creation pipeline.
```

Replace with:

```
Kaldon is new software. The same 5-phase playbook has taken sellers from first product to multi-six-figure annual revenue. Every step feeds the next. Demand data becomes a validated product concept. The concept becomes a brand. The brand becomes content. The content populates a live store. The store data scales your ads. One continuous creation pipeline.
```

(Two new sentences prepended; existing copy continues unchanged.)

- [ ] **Step 2: Verify the build still passes**

Run: `pnpm build 2>&1 | tail -10`
Expected: build completes successfully.

- [ ] **Step 3: Commit the homepage IA restructure as one logical change**

```bash
git add src/components/home/WhoItsForBeginner.astro src/pages/index.astro src/components/home/IntelligenceDepth.astro src/components/home/PipelineScroll.astro
git commit -m "$(cat <<'COMMITEOF'
feat(home): restructure homepage IA to 9 sections, add WhoItsForBeginner

Cut homepage from 13 sections to 9. Insert new WhoItsForBeginner
buyer-voice pain-point section at position #2 in V3 hybrid voice
(her literal complaints, our brand rules: mono numerals, no em
dashes, no emojis, 6th-grade reading age).

Removes from homepage (components retained in repo):
- FoundationCredibility (redundant with PipelineScroll)
- ProblemSection (relocated to /pricing in next commit)
- ModeBadges (collides with WhoItsFor segmentation)
- Testimonials (placeholder/fake violates V3 rule, deferred)
- SavingsCalculator (relocated to /pricing in next commit)

Other changes in scope:
- IntelligenceDepth stat tile 10 -> 11 (matched body + list)
- PipelineScroll intro absorbs FoundationCredibility thesis line

Per spec: docs/superpowers/specs/2026-04-28-homepage-ia-restructure-design.md
Triggered by real-user feedback that the homepage failed to convey
what kaldon.io has built or sells. The wife's marketing alternative
demonstrated the IA fix; this lift adopts it on our own homepage in
our brand voice while preserving the premium frame for mature buyers.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
COMMITEOF
)"
```

Expected: commit created on `main`.

---

## Task 5: Add ProblemSection + SavingsCalculator to /pricing

**Files:**
- Modify: `src/pages/pricing.astro` (imports block lines 2-6, render block — exact insertion point determined by reading the page)

- [ ] **Step 1: Read pricing.astro to find the right insertion points**

Run: `wc -l src/pages/pricing.astro && grep -n "</PageHero>\|</section>\|<BaseLayout\|^---$" src/pages/pricing.astro | head -20`

Expected output: line count and the structural anchors. Use this to identify (a) where the imports block ends, (b) where the existing tier grid section ends, and (c) the closest matching insertion points.

- [ ] **Step 2: Add the imports**

Add these two imports to the imports block at lines 2-6 (after the existing imports, before any non-import code):

```astro
import ProblemSection from '../components/home/ProblemSection.astro';
import SavingsCalculator from '../components/home/SavingsCalculator.astro';
```

The imports block should now contain (preserving any existing imports that were already there):

```astro
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHero from '../components/ui/PageHero.astro';
import Button from '../components/ui/Button.astro';
import LinkArrow from '../components/ui/LinkArrow.astro';
import { appUrl } from '../lib/urls';
import ProblemSection from '../components/home/ProblemSection.astro';
import SavingsCalculator from '../components/home/SavingsCalculator.astro';
```

- [ ] **Step 3: Insert ProblemSection after the PageHero**

In the render block, find the closing tag of the existing `<PageHero ... />` (or `</PageHero>` if it has children) and insert immediately after:

```astro
<ProblemSection />
```

This places the cost-anchor between the page intro and the existing tier-grid content, where a price-shopping visitor encounters it as the financial framing before tiers.

- [ ] **Step 4: Insert SavingsCalculator before the FinalCTA section (or as the last block before page close)**

In the render block, find the section that contains the final pricing-page CTA (the one with `Button variant="primary" ... href={appUrl('/signup', 'pricing_final_cta')}`). That is at line 516 per earlier inspection. Insert `<SavingsCalculator />` immediately before that section's opening tag.

If the structure is unclear at implementation time, place it directly above the final CTA `<section>` block. The SavingsCalculator should appear after all tier cards and before the final conversion push.

- [ ] **Step 5: Run pnpm build**

Run: `pnpm build 2>&1 | tail -15`
Expected: build completes successfully, all 30 pages prerender. `/pricing` builds without errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/pricing.astro
git commit -m "$(cat <<'COMMITEOF'
feat(pricing): relocate ProblemSection and SavingsCalculator from homepage

Both components now live on /pricing where their audience (visitors
who have already decided to price-shop) encounters them. The cost-
anchor frames the tier grid; the calculator personalizes savings vs
the visitor's own DIY stack cost.

Removed from homepage in prior commit because they answered questions
beginners have not asked. Audience-fit improved by the move.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
COMMITEOF
)"
```

---

## Task 6: Add ProblemSection to /compare/research-tools

**Files:**
- Modify: `src/pages/compare/research-tools.astro` (imports block lines 2-5, render block — exact insertion point determined by reading the page)

- [ ] **Step 1: Read research-tools.astro to identify the insertion point**

Run: `wc -l src/pages/compare/research-tools.astro && grep -n "</PageHero>\|<BaseLayout\|<section\|^---$" src/pages/compare/research-tools.astro | head -20`

Expected: line count and the structural markers. Identify the right place: directly after the PageHero block (so the cost-anchor frames the comparison page before the table or comparison content).

- [ ] **Step 2: Add the import**

Add to the imports block at lines 2-5:

```astro
import ProblemSection from '../../components/home/ProblemSection.astro';
```

(Note `../../` not `../` because this page is two levels deep at `src/pages/compare/`.)

The imports block should now contain (preserving any existing imports that were already there):

```astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import PageHero from '../../components/ui/PageHero.astro';
import Button from '../../components/ui/Button.astro';
import { appUrl } from '../../lib/urls';
import ProblemSection from '../../components/home/ProblemSection.astro';
```

- [ ] **Step 3: Insert ProblemSection after the PageHero**

In the render block, find the closing tag of the existing `<PageHero ... />` and insert immediately after:

```astro
<ProblemSection />
```

This places the cost-anchor at the top of the comparison page, where a visitor who clicked a "vs research tools" link gets the cost-frame before the comparison itself.

- [ ] **Step 4: Run pnpm build**

Run: `pnpm build 2>&1 | tail -15`
Expected: build completes successfully. `/compare/research-tools` builds without errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/compare/research-tools.astro
git commit -m "$(cat <<'COMMITEOF'
feat(compare): add ProblemSection cost-anchor to research-tools

Frames the research-tools comparison page with the same DIY-stack
cost-anchor used elsewhere. Visitor sees the financial weight of
the alternative (Helium 10 + Jungle Scout + ChatGPT Pro etc.) before
the comparison itself, anchoring expectations on Kaldon's all-in
pricing.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
COMMITEOF
)"
```

---

## Task 7: Final verification and visual eyeball

**Files:** None (verification only)

- [ ] **Step 1: Run a final clean build**

Run: `pnpm build 2>&1 | tail -25`
Expected: build completes successfully, all 30 pages prerender, no warnings, no errors.

- [ ] **Step 2: Start dev server in background and visually check the homepage**

Run: `pnpm dev > /tmp/kaldon-dev.log 2>&1 &` then wait 5 seconds.

Open `http://localhost:4321` in a browser (or curl it) and verify:
- Hero renders unchanged at top
- WhoItsForBeginner is the second section, with kicker "Why You're Stuck", H2 "If you've thought about selling online but kept stalling, this is why.", four numbered cards
- Sections following are: ConnectedPlatforms, PipelineScroll, IntelligenceDepth, MarketGapWeek, WhoItsFor, PricingTeaser, FinalCTA
- IntelligenceDepth's "Signal sources" stat tile reads `11`
- PipelineScroll intro now begins "Kaldon is new software. The same 5-phase playbook..."
- No FoundationCredibility, ProblemSection, ModeBadges, Testimonials, or SavingsCalculator on the homepage
- The "See what we built →" anchor link in WhoItsForBeginner scrolls to PipelineScroll when clicked

Also check `/pricing`:
- ProblemSection appears below the page hero
- SavingsCalculator appears near the bottom (before the final CTA section)

Also check `/compare/research-tools`:
- ProblemSection appears below the page hero

- [ ] **Step 3: Stop the dev server**

Run: `pkill -f "astro dev" || true`

- [ ] **Step 4: Run code-reviewer skill on the changeset**

Use the Skill tool to invoke `code-reviewer`. Pass it the four commits (`d32dc7a..HEAD` or the most recent 3 commits depending on count). Address any findings before proceeding.

If code-reviewer finds issues, fix inline and create a follow-up commit.

---

## Task 8: Push and deploy to production

**Files:** None (deploy only)

- [ ] **Step 1: Push to origin/main**

Run: `git push origin main`
Expected: push succeeds, commits land on `origin/main`.

- [ ] **Step 2: Deploy to Cloudflare Workers**

Run: `pnpm run deploy 2>&1 | tail -25`
Expected: build + wrangler deploy succeed. New version ID printed at the end. URL `https://kaldon.io` should be the deploy target.

- [ ] **Step 3: Production curl verification — homepage new section**

Run: `curl -sf https://kaldon.io/ | grep -o "If you've thought about selling online but kept stalling[^<]*" | head -1`
Expected: prints the H2 verbatim. Confirms WhoItsForBeginner is live.

- [ ] **Step 4: Production curl verification — IntelligenceDepth fix**

Run: `curl -sf https://kaldon.io/ | grep -A 1 "Signal sources" | head -5`
Expected: shows `11` near the "Signal sources" label.

- [ ] **Step 5: Production curl verification — PipelineScroll absorbed thesis**

Run: `curl -sf https://kaldon.io/ | grep -o "Kaldon is new software[^<]*" | head -1`
Expected: prints the absorbed thesis line.

- [ ] **Step 6: Production curl verification — pricing has ProblemSection content**

Run: `curl -sf https://kaldon.io/pricing/ | grep -o "A real DIY stack costs[^<]*" | head -1`
Expected: prints the ProblemSection H2 verbatim from `/pricing`.

- [ ] **Step 7: Production curl verification — pricing no longer on homepage**

Run: `curl -sf https://kaldon.io/ | grep -c "A real DIY stack costs"`
Expected: `0` (zero hits — confirms ProblemSection is no longer on the homepage).

- [ ] **Step 8: Production curl verification — research-tools has ProblemSection**

Run: `curl -sf https://kaldon.io/compare/research-tools/ | grep -o "A real DIY stack costs[^<]*" | head -1`
Expected: prints the ProblemSection H2 from `/compare/research-tools`.

- [ ] **Step 9: Final end-of-task report**

Report to the user:
- Commit SHAs of all changes
- Cloudflare Workers version ID
- Confirmation that all 8 production curl checks passed
- Any unexpected behavior observed during the visual eyeball check

---

## Out of scope (do NOT touch in this plan)

- `/get-started` page (deferred)
- Hero copy revision (deferred)
- V3 brand iron rule cleanup pass on retained components (deferred)
- Action-promise CTA A/B test (deferred until paid traffic launches)
- Testimonials replacement (waiting on real attributable quotes)
- Quantified Hero stat (E.2 item, separate scope)
- Real platform logos in ConnectedPlatforms (E.2 item, separate scope)

---

## Self-review (post-write)

**Spec coverage:** ✓
- Section 3 (new IA): Tasks 1, 2 cover it
- Section 4 (WhoItsForBeginner design): Task 1 implements it verbatim per spec
- Section 5 (other affected files): Tasks 3, 4, 5, 6 cover IntelligenceDepth fix, PipelineScroll absorption, /pricing relocations, /compare addition
- Section 6 (out of scope): explicitly listed in plan
- Section 7 (success criteria): Task 7 (visual + build verification) and Task 8 (production curl checks) cover all 9 criteria
- Section 9 (risks): Task 7 visual check covers risk 1 (Hero/section register feel); Task 8 step 6 confirms ProblemSection still accessible at /pricing for risk 2; risk 3 (testimonial removal) accepted per V3 rule
- Section 10 (verification plan): mapped to Task 7 + Task 8

**Placeholder scan:** No "TBD," "TODO," "implement later." `/pricing` insertion location uses "find the closing tag of the PageHero" with line numbers from inspection; engineer can locate exactly. `/compare/research-tools` same pattern. Code is exact and complete in every step.

**Type consistency:** Component names match spec. Import paths use correct relative depth (`../components/home/...` for `/pages/`, `../../components/home/...` for `/pages/compare/`). Anchor target `#pipeline` verified to exist at `PipelineScroll.astro:77`.

**Coverage gap check:** None.

---
