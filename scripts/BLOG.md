# Kaldon Auto-Blog System

## What this is

A weekly auto-publisher for the Kaldon marketing blog. It pulls current market trends from Perplexity, writes a GEO-optimized article with Claude Sonnet, and commits a markdown file to `src/content/blog/` that Astro renders at `/blog/{slug}`.

## Architecture

```
scripts/kaldon-blog-config.mjs    → topical map (pillar + 16 clusters)
scripts/generate-blog-post.mjs    → the generator (trend refresh + article writer)
src/content.config.ts             → Astro content collection schema
src/content/blog/*.md             → generated posts (auto-committed)
src/pages/blog/[slug].astro       → dynamic route for generated posts
.github/workflows/weekly-blog.yml → weekly cron (Mondays 16:00 UTC)
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
- **Scheduled**: every Monday at 16:00 UTC (09:00 PT / 12:00 ET)
- **Manual**: via `workflow_dispatch` on the Actions tab, with optional `slug` and `dry_run` inputs

## Order of operations per run

1. Select the next un-published post in the schedule (pillar first, then clusters by `publishWeek`)
2. Pull current trends via 3 parallel Perplexity calls (trending angles, recent news, community signal)
3. Generate the article with Claude Sonnet, weaving trend signals into the lede + one body section + optionally a FAQ answer
4. Write `src/content/blog/{slug}.md` with frontmatter (title, tldr, category, tags, citations, lastUpdated, etc.)
5. Run `pnpm run build` to verify the site still builds with the new post
6. Commit the new `.md` file to main
7. Deploy to Cloudflare Workers

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

- Perplexity: 3 sonar-pro calls × ~2K tokens each = ~$0.06
- Claude Sonnet 4.5: one 12-16K token generation = ~$0.20 to $0.35
- Total: under $0.50 per article

16 clusters + 1 pillar = 17 articles = ~$8 total for a full cycle of auto-published content.
