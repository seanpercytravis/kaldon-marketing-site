# Kaldon Auto-Blog System

## What this is

A **twice-weekly evergreen auto-publisher** (Mondays + Thursdays) for the Kaldon marketing blog. It pulls current market trends from Perplexity, writes a GEO-optimized article with Claude Sonnet, and commits a markdown file to `src/content/blog/` that Astro renders at `/blog/{slug}`.

**Never runs out of topics:** phase 1 works through a fixed 17-post topical map (1 pillar + 16 clusters) to establish authority. Phase 2 (forever after) switches to trend-driven mode where Perplexity surfaces under-covered angles in the eCommerce space and Claude specs out a fresh post.

## Architecture

```
scripts/kaldon-blog-config.mjs    → topical map (pillar + 16 clusters)
scripts/generate-blog-post.mjs    → the generator (trend refresh + article writer)
src/content.config.ts             → Astro content collection schema
src/content/blog/*.md             → generated posts (auto-committed)
src/pages/blog/[slug].astro       → dynamic route for generated posts
.github/workflows/auto-blog.yml   → 2x/week cron (Mon + Thu 16:00 UTC)
```

Hand-written posts at `src/pages/blog/*.astro` still take precedence (Astro's route resolution). The two coexist. Blog index at `/blog` lists both.

## Running it

### Locally (for testing)

```bash
# Dry-run: prints the article, does not write a file
ANTHROPIC_API_KEY=sk-ant-xxx PERPLEXITY_API_KEY=pplx-xxx \
  node scripts/generate-blog-post.mjs --dry-run

# Force-generate a specific slug
ANTHROPIC_API_KEY=sk-ant-xxx PERPLEXITY_API_KEY=pplx-xxx \
  node scripts/generate-blog-post.mjs --slug=product-research-tools-comparison-2026

# Auto-pick the next un-published post in the schedule
ANTHROPIC_API_KEY=sk-ant-xxx PERPLEXITY_API_KEY=pplx-xxx \
  node scripts/generate-blog-post.mjs
```

### GitHub Actions (production)

Required repo secrets:
- `ANTHROPIC_API_KEY` — Claude Sonnet article writer
- `PERPLEXITY_API_KEY` — trend refresh (optional; article falls back to evergreen if missing)
- `CLOUDFLARE_API_TOKEN` — deploys after successful commit (optional; otherwise post is committed to main and deployed on next manual deploy)

The workflow runs:
- **Scheduled**: every Monday AND Thursday at 16:00 UTC (09:00 PT / 12:00 ET)
- **Manual**: via `workflow_dispatch` on the Actions tab, with optional `slug` and `dry_run` inputs
- **Never expires**: once the fixed 17-post topical map is complete, every future run generates a fresh trend-driven post. The schedule runs forever.

## Order of operations per run

**Phase 1 (scheduled mode, first 17 posts):**
1. Select the next un-published post from `ALL_POSTS` by `publishWeek` order
2. Pull current trends via 3 parallel Perplexity calls (trending angles, recent news, community signal)
3. Generate the article with Claude Sonnet, weaving trend signals into the lede + one body section + optionally a FAQ answer
4. Write `src/content/blog/{slug}.md` with frontmatter (title, tldr, category, tags, citations, lastUpdated, etc.)
5. Run `pnpm run build` to verify the site still builds with the new post
6. Commit the new `.md` file to main
7. Deploy to Cloudflare Workers

**Phase 2 (evergreen mode, after the fixed schedule is done):**
1. Run 2 parallel Perplexity scans:
   a. Trending questions real sellers are asking that existing articles don't answer (last 14 days)
   b. Emerging topics: platform policy changes, new AI tools, ad format shifts, regulatory news (last 30 days)
2. Claude picks the single highest-value under-covered angle and specs out a ClusterPost:
   - Title, slug, target keyword, search intent, word count
   - Angle + why-now rationale
   - Cross-links to 3 most-related existing posts (pulled from the live content collection)
3. Slug collision guard: if the generated slug already exists, suffix with date
4. Proceed through steps 2-7 of phase 1 with the fresh topic spec

## Topical map

- 1 pillar: "How to find a winning eCommerce product in 2026: the unmet-demand playbook"
- 16 clusters covering comparison tools, unmet demand, tool-stack cost, UVP validation, brand identity, supplier verification, Amazon-to-DTC, 6-fig brand economics, Walmart vs Amazon, AI content, Shopify app tax, auto-publishing mechanics, TikTok Shop, AI-research myths, market-gap to live store in 72h, agency vs AI platform

Each cluster has a fixed `targetKeyword`, `angle`, `searchIntent`, `wordCountTarget`, and an internal-link graph tied back to the pillar and cross-linked to 2 other clusters.

## Voice + GEO rules enforced in the prompt

- TLDR-first (first 200 words are AI-extract bait)
- Direct answers at the top of every section
- FAQ section with 3-5 items (5-8 on pillar)
- Internal links: pillar at least once, 2+ other clusters, Kaldon home/pricing/features naturally
- No em dashes, no marketing fluff, no "amazing / incredible"
- 6th-grade reading level on surface, PhD-level thinking underneath
- References "2026" and "recent" where trend signals support it
- Article JSON-LD schema emitted automatically by BlogPostLayout

## Cost per post

- Perplexity trend refresh: 3 sonar-pro calls × ~2K tokens each = ~$0.06
- Claude Sonnet 4.5 article gen: one 12-16K token generation = ~$0.20 to $0.35
- Evergreen mode only: 2 extra Perplexity scans + small Claude topic-spec call = ~$0.05
- Total: ~$0.50 per scheduled article, ~$0.55 per evergreen article

At 2× per week (104 posts / year): ~$55/year in API cost for an always-fresh blog.
