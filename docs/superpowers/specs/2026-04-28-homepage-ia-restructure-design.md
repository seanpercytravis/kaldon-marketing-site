# Homepage IA Restructure (Wife-Angle Hybrid) — Design Spec

**Date:** 2026-04-28
**Author:** Sean (with Claude as collaborator)
**Status:** Approved for plan-writing
**Supersedes priority of:** `docs/audit/2026-04-25-positioning-comparison-wife-angle.md` Section 5 (the original "hybrid" recommendations are now subordinate to this restructure plan; individual elements still apply where consistent)
**Triggered by:** Real users (multiple, beyond the wife) reported they did not understand what kaldon.io has built or is selling. The wife's alternative site (https://kaldonwin-d2qahhtc.manus.space) demonstrates a clearer beginner-comprehensible IA. New evidence pressure-tested the prior verdict and shifted it from "trickle 4-5 elements over a quarter" to "front-load the wife's IA insight onto the main funnel this week."

## 1. Problem statement

The current `kaldon.io` homepage has 13 sections optimized for an existing-brand or agency reader who already knows what eCommerce product research is, what a "DIY stack" looks like, and what "unmet demand" means. Real visitors fall off because the page never first reflects their own confusion or stalled-seller pain back at them. The wife's site solves this with one IA move: place a literal buyer-voice pain-point section at position #3, before any feature, pipeline, or technical proof. The visitor sees their own complaint in their own words within the first two scrolls.

We will adopt that IA insight on our own homepage in our brand voice, while preserving the premium frame that already converts mature buyers.

## 2. Strategic decision

Of three considered approaches:
- **Option A (Patch + Page).** Patch existing homepage and build `/get-started` separately. Rejected: leaves the homepage's IA problem unfixed; new evidence said the homepage itself is failing across visitor types, not just beginners.
- **Option B (Homepage IA restructure).** Reorder the homepage to put a buyer-voice pain-point section at position #2, cut redundant/mis-targeted sections, relocate cost-anchor and savings-calculator to `/pricing` where their audience already is. **Selected.**
- **Option C (Replace homepage).** Adopt the wife's structure and voice wholesale. Rejected: would lose the premium-frame conversion path and disrespect the mature buyers who are converting today.

Within Option B, voice for the new buyer-voice section is **hybrid**: keep the wife's literal buyer-voice complaints and sense-memory specifics, but enforce our brand voice rules (no em dashes, no decorative emojis, mono numerals, V3 color palette, 6th-grade reading age).

## 3. New section order (9 sections)

| # | Section | Component | Status in this scope |
|---|---|---|---|
| 1 | Hero | `Hero.astro` | unchanged |
| 2 | **WhoItsForBeginner** | `WhoItsForBeginner.astro` | **NEW — built in this scope** |
| 3 | ConnectedPlatforms | `ConnectedPlatforms.astro` | unchanged |
| 4 | PipelineScroll | `PipelineScroll.astro` | minor copy: absorb thesis line from removed FoundationCredibility |
| 5 | IntelligenceDepth | `IntelligenceDepth.astro` | content fix: stat tile `10` → `11` |
| 6 | MarketGapWeek | `MarketGapWeek.astro` | unchanged |
| 7 | WhoItsFor | `WhoItsFor.astro` | unchanged |
| 8 | PricingTeaser | `PricingTeaser.astro` | unchanged |
| 9 | FinalCTA | `FinalCTA.astro` | unchanged |

**Removed from homepage (5 sections cut, components retained in repo):**
- `FoundationCredibility.astro` — redundant with PipelineScroll's "5 phases" framing. Thesis line absorbed into PipelineScroll intro.
- `ProblemSection.astro` — answers a question beginners haven't asked. Relocated to `/pricing` and (excerpted) `/compare/research-tools`.
- `ModeBadges.astro` — 3-mode segmentation collides with WhoItsFor's 3-persona segmentation; WhoItsFor wins because each card is a routing link.
- `Testimonials.astro` — placeholder/fake content violates V3 brand "Do Not: Ship sample/fake testimonials" rule. Removed from homepage until real attributable quotes exist (E.1 #1, deferred).
- `SavingsCalculator.astro` — interactive pricing tool that assumes the visitor has already decided to price the product. Relocated to `/pricing`.

## 4. WhoItsForBeginner component design

**Path:** `src/components/home/WhoItsForBeginner.astro`

**Section structure:**
```
<section>
  <header>
    <kicker>Why You're Stuck</kicker>
    <h2>If you've thought about selling online but kept stalling, this is why.</h2>
    <subhead>Four reasons most people never start. Kaldon was built to remove all four.</subhead>
  </header>

  <grid> (4 cards, 2x2 on tablet+, single column on mobile)
    [Card 01] [Card 02]
    [Card 03] [Card 04]
  </grid>

  <footer>
    <a href="#pipeline">See what we built →</a>  (text link, ghost color)
  </footer>
</section>
```

**Card content (verbatim):**

```
01  You want to sell online. You just don't know what to sell.
    You've had the idea for years. Picking the right product
    still feels like a gamble. What if it doesn't sell?

02  Every product you've thought of already has a hundred competitors.
    You search Amazon and everything is there already. Cheaper.
    With thousands of reviews. There's no room left for you.

03  You don't want $40,000 in inventory sitting in your garage.
    Buying stock before you know it will sell is the part that
    scares you. One wrong bet and the boxes are still there in
    November.

04  Every research tool is built for someone who already knows.
    You don't want to learn how Helium 10 works. You want
    someone to tell you what to sell.
```

**Visual treatment (V3-compliant):**
- Section background: `var(--void)` (`#0A0A0F`).
- Card background: `var(--deep-space)` (`#12121A`).
- Card border: `1px solid var(--hairline)` (`rgba(255,255,255,0.06)`).
- Card padding: same as IntelligenceDepth list rows.
- Mono numeral: JetBrains Mono, color `var(--text-quaternary)`, no decorative gold.
- Card headline: Satoshi, weight 600, color `var(--chalk)`, 18-20px.
- Card body: Inter Variable, weight 400, color `var(--ghost)`, line-height 1.5.
- No emojis, no decorative gold, no signal cyan, no gradient borders, no glow shadows.
- Spacing follows the existing IntelligenceDepth section's vertical rhythm.

**No CTA in section body.** Soft anchor link only (`See what we built →`) scrolls to PipelineScroll. The visitor just had their pain mirrored; pushing for conversion one section in is too aggressive. Hard CTAs remain at Hero (top), PricingTeaser (mid), FinalCTA (bottom).

**Accessibility requirements:**
- Section is a `<section aria-labelledby="who-its-for-beginner-heading">` with the H2 carrying that id.
- Each card is a `<article>` element with the numeral `aria-hidden="true"` (decorative).
- Soft anchor link has visible focus state (gold ring, V3-compliant).

## 5. Other affected files

### `src/pages/index.astro`
- Remove imports: `FoundationCredibility`, `ProblemSection`, `ModeBadges`, `Testimonials`, `SavingsCalculator`.
- Add import: `WhoItsForBeginner`.
- Reorder rendered components to match Section 3 of this spec.

### `src/components/home/PipelineScroll.astro`
- Intro paragraph absorbs FoundationCredibility's thesis. Add as a new sentence at the start of the existing intro: `Kaldon is new software. The same 5-phase playbook has taken sellers from first product to multi-six-figure annual revenue.` Then the existing "Every step feeds the next..." sentence continues.

### `src/components/home/IntelligenceDepth.astro`
- Stat tile reads `10` for "Signal sources." Body and list both reference 11. Change tile numeral from `10` to `11` (existing prop on `<StatTile numeral="10" .../>` to `numeral="11"`).

### `src/pages/pricing.astro`
- Insert `<ProblemSection />` between the existing PricingHero and the tier grid (or in whichever existing location best fits the page's current rhythm; final placement decided in implementation, not spec).
- Insert `<SavingsCalculator />` below the tier grid.
- Update `index.astro`'s removed imports — these now live on `pricing.astro`.

### `src/pages/compare/research-tools.astro`
- Insert excerpted `<ProblemSection />` either as a top-level callout or absorbed into the page's intro. Implementation decides exact form.

## 6. Out of scope (deferred)

The following are explicitly not in this scope and will be tackled separately:

- **`/get-started` beginner landing page.** Per the 04-25 plan; valuable but distinct project.
- **Action-promise CTA A/B test** ("Find My Winning Product. Free."). Held until paid acquisition launches and traffic volume is sufficient for statistical power.
- **Hero copy revision.** May feel disjointed with the new section #2; revisit after this ships and we see how it lands.
- **V3 brand iron rule cleanup.** The homepage audit flagged 8+ decorative gold/signal violations across other components (FoundationCredibility numeral, ConnectedPlatforms `+40 more` pill, ModeBadges names, PipelineScroll scrub gradient, etc.). Some of those components are being removed from the homepage in this scope, which incidentally resolves their violations. The remaining violations on retained components (PipelineScroll, IntelligenceDepth stat tile accents, MarketGapWeek card border, WhoItsFor featured numeral, PricingTeaser Pro tier border + badge) are deferred to a dedicated cleanup pass.
- **Testimonials replacement.** E.1 #1 deferred until real attributable quotes exist.
- **Quantified social proof on Hero.** E.2 item, separate scope.
- **Real platform logos on ConnectedPlatforms.** E.2 item, separate scope.

## 7. Success criteria

- All 9 sections render in the specified order.
- WhoItsForBeginner renders V3-compliant (no decorative gold, no signal cyan, no em dashes, no emojis).
- ProblemSection and SavingsCalculator no longer appear on the homepage; both render correctly on `/pricing`.
- ProblemSection (or excerpt) appears on `/compare/research-tools`.
- IntelligenceDepth stat tile reads `11`.
- PipelineScroll intro contains the absorbed thesis line.
- `pnpm build` passes cleanly with no warnings or errors.
- All retained pages (homepage, `/pricing`, `/compare/research-tools`) build and prerender successfully.
- Lighthouse mobile and desktop performance scores on homepage do not regress more than 2 points from current baseline.
- All cross-domain CTAs (`app.kaldon.io/signup`) preserve UTM and Rewardful affiliate params.

## 8. Architectural notes

- **No new dependencies, no new design tokens, no new fonts.** All styling uses existing V3 CSS variables and the same component patterns established in IntelligenceDepth and WhoItsFor.
- **No JavaScript, no GSAP.** WhoItsForBeginner is a static section; cards are CSS-grid layout with no animation or scroll-pinning.
- **Component reusability.** WhoItsForBeginner card pattern (mono numeral + headline + body) is identical to IntelligenceDepth's source-row pattern. If a future page benefits from the same structure, the markup can be lifted directly.

## 9. Risks

- **Homepage feels disjointed if Hero copy is left untouched.** The Hero says "Products the market is demanding that nobody's making yet" and section #2 will say "You don't know what to sell." This register gap is the single biggest risk in shipping IA without Hero copy revision. Mitigation: ship and watch user behavior; revisit Hero copy in a separate scope based on what we observe.
- **Mature buyers who valued ProblemSection on the homepage may not find it on `/pricing`.** Mitigation: `/pricing` is the next logical step for any visitor priced-shopping; the cost-anchor lives where pricing decisions are made. Also add internal linking from PipelineScroll or PricingTeaser to `/pricing` (already exists in PricingTeaser's "See all plans and features →" link).
- **Removing Testimonials may reduce perceived social proof.** Mitigation: Testimonials are currently fake; honest absence is preferred over dishonest presence per CLAUDE.md "Do Not" rule. Add back when real quotes exist.

## 10. Verification plan

After implementation:
1. `pnpm build` must pass.
2. `pnpm dev` and visual-eyeball check: homepage renders 9 sections in order, WhoItsForBeginner displays correctly mobile + desktop, no V3 violations introduced.
3. Verify `/pricing` and `/compare/research-tools` render the relocated sections cleanly.
4. Run `code-reviewer` on the changeset before commit.
5. After commit + push + `pnpm run deploy`, curl production HTML for at least one verbatim string from the new section to confirm live.
