#!/usr/bin/env node
// Kaldon marketing blog auto-publisher.
//
// Run weekly by a GitHub Actions cron (or manually). Picks the next un-published
// post from scripts/kaldon-blog-config.mjs based on the weekly cadence, pulls
// current market trends via Perplexity, writes the article with Claude Sonnet
// 4.5, and writes the result as a markdown file in src/content/blog/.
//
// Env vars required:
//   ANTHROPIC_API_KEY  — Claude article writer
//   PERPLEXITY_API_KEY — trend-refresh (optional; article falls back to evergreen)
//
// Usage:
//   node scripts/generate-blog-post.mjs           # picks the next due post
//   node scripts/generate-blog-post.mjs --slug=product-research-tools-comparison-2026
//                                                 # force-generate a specific post
//   node scripts/generate-blog-post.mjs --dry-run # prints, doesn't write

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KALDON_BRAND, PILLAR, ALL_POSTS, INTERNAL_LINK_MAP } from './kaldon-blog-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(REPO_ROOT, 'src/content/blog');

// ─── CLI args ────────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, v] = a.slice(2).split('=');
      return [k, v ?? true];
    })
);
const DRY_RUN = Boolean(args['dry-run']);
const FORCE_SLUG = args.slug && typeof args.slug === 'string' ? args.slug : null;

// ─── Post selection ──────────────────────────────────────────────────────

function listExistingSlugs() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

function selectNextPost() {
  if (FORCE_SLUG) {
    const match = ALL_POSTS.find((p) => p.slug === FORCE_SLUG);
    if (!match) throw new Error(`No post in schedule with slug "${FORCE_SLUG}"`);
    return match;
  }
  const existing = new Set(listExistingSlugs());
  // Walk the schedule in order (pillar first, then cluster weeks 1..16)
  const ordered = [...ALL_POSTS].sort((a, b) => (a.publishWeek ?? 0) - (b.publishWeek ?? 0));
  const next = ordered.find((p) => !existing.has(p.slug));
  if (!next) {
    console.log('All scheduled posts have been generated. Nothing to do.');
    process.exit(0);
  }
  return next;
}

// ─── Trend refresh via Perplexity ────────────────────────────────────────

async function fetchCurrentTrends(post) {
  if (!process.env.PERPLEXITY_API_KEY) {
    console.warn('PERPLEXITY_API_KEY not set — skipping trend refresh, article will be evergreen.');
    return { trendBlock: '', citations: [] };
  }

  const client = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY,
    baseURL: 'https://api.perplexity.ai',
    timeout: 90_000,
  });

  const calls = [
    {
      name: 'trending_angles',
      prompt: `What are the most discussed angles, questions, and framings for "${post.targetKeyword}" in the ${KALDON_BRAND.productCategory} space as of the last 7 days? Focus on new angles, current consumer concerns, fresh data points (prices, stats, launches), and the language real buyers are using right now. Output 5-8 bullet-list trend signals with specific sources and dates. Prioritize items from the last 14 days.`,
    },
    {
      name: 'recent_news',
      prompt: `What recent news, regulatory changes, product launches, or industry events (last 30 days) would a buyer researching "${post.targetKeyword}" in the eCommerce / DTC / Amazon / Walmart / Shopify space care about? Include brand launches, regulatory shifts (FDA/FTC/platform policy), market data releases, viral moments (TikTok trends, Reddit threads). Output bullet list with URL and date per item. If nothing material happened, say so.`,
    },
    {
      name: 'community_signal',
      prompt: `What are real eCommerce sellers and brand operators saying on Reddit (r/Entrepreneur, r/ecommerce, r/FulfillmentByAmazon, r/shopify), TikTok, X/Twitter, and specialty forums about "${post.targetKeyword}" right now (last 14 days)? Focus on top-upvoted complaints, unanswered questions, brands being praised or criticized, and rising/falling use cases. Output 5-8 signals with platform, sentiment, paraphrased quote, and source URL. Prioritize high-engagement posts.`,
    },
  ];

  const runCall = async (call) => {
    try {
      const res = await client.chat.completions.create({
        model: 'sonar-pro',
        max_tokens: 4000,
        temperature: 0.2,
        search_recency_filter: 'month',
        web_search_options: { search_context_size: 'high' },
        messages: [
          {
            role: 'system',
            content:
              'You are a deep market research agent. Return factual, sourced data with specific numbers, brand names, URLs, and citations. Be exhaustive. Prioritize data from the last 90 days.',
          },
          { role: 'user', content: call.prompt },
        ],
      });
      const text = res.choices?.[0]?.message?.content ?? '';
      const citations = res.citations ?? [];
      return { name: call.name, text, citations };
    } catch (err) {
      console.warn(`Perplexity call "${call.name}" failed: ${err.message}`);
      return { name: call.name, text: '', citations: [] };
    }
  };

  const results = await Promise.all(calls.map(runCall));
  const combined = results
    .filter((r) => r.text.trim().length > 0)
    .map((r) => `\n\n--- ${r.name.toUpperCase()} ---\n\n${r.text}`)
    .join('');
  const allCitations = [...new Set(results.flatMap((r) => r.citations))].slice(0, 10);

  if (!combined) return { trendBlock: '', citations: [] };

  const trendBlock = `
CURRENT MARKET TRENDS (fresh signals from the last 7-30 days, pulled ${new Date().toISOString().slice(0, 10)}):

${combined.trim()}

${allCitations.length > 0 ? `SOURCES: ${allCitations.join(', ')}` : ''}

Use these trend signals to open the article with a timely hook, anchor one or two claims in recent data, and give the reader a reason to trust that this article was written THIS MONTH. Do not dump all of this into the article verbatim. Weave relevant pieces into the lede, one body section, and optionally a FAQ answer.
`.trim();

  return { trendBlock, citations: allCitations };
}

// ─── Article writer via Claude ───────────────────────────────────────────

async function writeArticle(post, trendBlock, existingSlugs) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is required. Set it in env and retry.');
  }

  const isPillar = post.slug === PILLAR.slug;
  const linkedSlugs = isPillar
    ? INTERNAL_LINK_MAP.pillarToCluster[PILLAR.slug] ?? []
    : [PILLAR.slug, ...(INTERNAL_LINK_MAP.clusterToCluster[post.slug] ?? [])];

  const prompt = `You are writing a blog article for Kaldon, an AI-powered eCommerce intelligence platform. This article must be:
1. GEO-optimized — structured so AI search engines can extract and cite it
2. Written in the brand's voice
3. Factual and authoritative — the kind of content AI engines trust
4. Internally linked to related Kaldon blog content

BRAND: ${KALDON_BRAND.brandName}
BRAND VOICE: ${KALDON_BRAND.brandVoice}
PRODUCT: ${KALDON_BRAND.productName}
PRODUCT CATEGORY: ${KALDON_BRAND.productCategory}
STORE URL: ${KALDON_BRAND.storeDomain}
BRAND COLORS: Primary ${KALDON_BRAND.colorPrimary} (Signal Cyan), Secondary ${KALDON_BRAND.colorSecondary} (Gold), Accent ${KALDON_BRAND.colorAccent} (Chalk). Use these colors when describing visual elements and in the featuredImagePrompt.

MARKET CONTEXT: ${KALDON_BRAND.marketContext}${trendBlock ? `\n\n${trendBlock}` : ''}

ARTICLE TO WRITE:
Title: ${post.title}
Target Keyword: ${post.targetKeyword}
Search Intent: ${post.searchIntent}
Word Count Target: ${post.wordCountTarget}
${isPillar
    ? `Sections: ${post.sections.join(', ')}\nFAQ Questions (answer each): ${post.faqQuestions.join(', ')}`
    : `Angle: ${post.angle}\nContent Type: ${post.contentType}`}

EXISTING BLOG POSTS TO LINK TO (use /blog/[slug]):
${linkedSlugs.map((s) => `- /blog/${s}`).join('\n')}

PILLAR ARTICLE SLUG: /blog/${PILLAR.slug}
KALDON HOME: ${KALDON_BRAND.storeDomain}
KALDON PRICING: ${KALDON_BRAND.storeDomain}/pricing
KALDON FEATURES: ${KALDON_BRAND.storeDomain}/features

Generate a JSON response (and ONLY valid JSON, no markdown fencing):

{
  "title": "Exact article title (match the one above)",
  "slug": "${post.slug}",
  "metaTitle": "SEO title under 60 chars including Kaldon where natural",
  "metaDescription": "Meta description under 160 chars. Benefit-led. Includes keyword.",
  "tldr": "2-3 sentence TLDR that directly answers the main question. This appears at the TOP of the article. AI engines extract this first. Be specific and factual.",
  "content": "Full article in MARKDOWN. Use ## for h2, ### for h3. Use plain paragraphs, lists, and bold where it earns attention. Include [anchor text](/blog/[slug]) for internal links. Include [anchor](${KALDON_BRAND.storeDomain}/pricing) and similar for Kaldon product links where natural (never forced). Do NOT use an h1 (title is rendered separately). Start with the TLDR paragraph. Every section should open with a direct answer before elaboration. Include specific data, numbers, tool names, prices, or claims wherever possible.",
  "excerpt": "2-3 sentence excerpt for the blog listing page.",
  "faqSection": [
    {"question": "Actual question", "answer": "Direct, concise answer (2-3 sentences max)"}
  ],
  "wordCount": 1200,
  "readingTimeMinutes": 5,
  "internalLinks": [
    {"anchorText": "natural anchor text", "targetSlug": "blog-post-slug"}
  ],
  "featuredImagePrompt": "Specific prompt for AI image generation. eCommerce / intelligence-platform relevant, editorial style, dark gradient background with subtle Signal Cyan + Gold accents, no text overlay needed.",
  "tags": ["tag1", "tag2", "tag3"]
}

CRITICAL GEO RULES:
1. TLDR FIRST: The first 200 words are what AI engines extract. Lead with the answer, not a buildup.
2. DIRECT ANSWERS: Every section heading should be answerable. Open each section with the direct answer, then elaborate.
3. FACTUAL TONE: Write as an authority, not a marketer. Cite specific data points where possible. No "amazing," "incredible," or other fluff.
4. FAQ SECTION: ${isPillar ? 'Include 5-8 FAQ items' : 'Include 3-5 FAQ items'} as structured Q&A at the end. These map directly to FAQ schema.
5. INTERNAL LINKS: Link to the pillar article at least once. Link to 2+ other cluster posts from the list above. Link to Kaldon home, pricing, or features naturally (not forced).
6. BRAND VOICE: Match Kaldon's voice: ${KALDON_BRAND.brandVoice}
7. NO EM DASHES: Never use em dashes (U+2014). Prefer period, comma, colon, or parentheses.
8. INCLUDE DATA: Where possible, include statistics, research references, or specific numerical claims that AI engines can extract.
9. LAST UPDATED: The article should feel current. Reference "2026" or "recent" where appropriate, and if trend signals were provided above, weave the most useful ones into the lede.
10. READING LEVEL: 6th-grade reading level on surface, PhD-level thinking underneath. Short sentences. Strong verbs. No jargon without explanation.

Respond ONLY with the JSON. No markdown wrapping.`;

  console.log(`Generating article: "${post.title}" (${isPillar ? 'pillar' : `cluster week ${post.publishWeek}`})`);
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: isPillar ? 16000 : 8000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .replace(/```json|```/g, '')
    .trim();

  const article = JSON.parse(text);
  return article;
}

// ─── Markdown file writer ────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function buildMarkdown(post, article, citations) {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  const prettyDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const readTime = `${article.readingTimeMinutes ?? Math.ceil((article.wordCount ?? post.wordCountTarget) / 250)} min`;

  // Escape YAML frontmatter strings
  const yamlStr = (s) => JSON.stringify(s ?? '');

  const frontmatter = [
    '---',
    `title: ${yamlStr(article.title)}`,
    `slug: ${yamlStr(article.slug)}`,
    `excerpt: ${yamlStr(article.excerpt)}`,
    `category: ${yamlStr(categoryFromContentType(post.contentType))}`,
    `date: ${yamlStr(prettyDate)}`,
    `readTime: ${yamlStr(readTime)}`,
    `tldr: ${yamlStr(article.tldr)}`,
    `metaDescription: ${yamlStr(article.metaDescription.slice(0, 180))}`,
    `tags: ${JSON.stringify(article.tags ?? [])}`,
    `autoGenerated: true`,
    `citations: ${JSON.stringify(citations ?? [])}`,
    `lastUpdated: ${yamlStr(dateStr)}`,
    '---',
    '',
  ].join('\n');

  // TLDR-first rendering: the TLDR paragraph, then the body, then FAQ section
  const faqBlock = (article.faqSection ?? [])
    .map((f) => `\n### ${f.question}\n\n${f.answer}\n`)
    .join('');

  const body = `**TLDR.** ${article.tldr}\n\n${article.content}\n\n${faqBlock ? `## Frequently asked questions\n${faqBlock}` : ''}`;

  return `${frontmatter}${body}\n`;
}

function categoryFromContentType(ct) {
  const map = {
    pillar: 'Product Research',
    how_to: 'Product Research',
    comparison: 'Marketplace Tips',
    benefits: 'Brand Building',
    buying_guide: 'Marketplace Tips',
    case_study: 'Product Research',
    news_trends: 'Marketplace Tips',
    myths: 'Product Research',
    ingredient_deep_dive: 'Brand Building',
  };
  return map[ct] ?? 'Product Research';
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  const post = selectNextPost();
  console.log(`Next post in schedule: "${post.title}" (slug: ${post.slug})`);

  const existingSlugs = listExistingSlugs();
  console.log(`${existingSlugs.length} posts already published in content collection.`);

  const { trendBlock, citations } = await fetchCurrentTrends(post);
  if (trendBlock) {
    console.log(`Trend refresh returned ${citations.length} citations.`);
  } else {
    console.log('Trend refresh returned empty. Article will be evergreen.');
  }

  const article = await writeArticle(post, trendBlock, existingSlugs);
  const md = buildMarkdown(post, article, citations);

  if (DRY_RUN) {
    console.log('\n--- DRY RUN OUTPUT ---\n');
    console.log(md.slice(0, 2000) + (md.length > 2000 ? '\n...[truncated]' : ''));
    console.log(`\n(${md.length} chars total)`);
    return;
  }

  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
  const filePath = path.join(CONTENT_DIR, `${post.slug}.md`);
  fs.writeFileSync(filePath, md, 'utf8');
  console.log(`Wrote ${filePath} (${md.length} chars)`);
}

main().catch((err) => {
  console.error('Blog generation failed:', err);
  process.exit(1);
});
