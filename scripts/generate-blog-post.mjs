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

async function selectNextPost() {
  if (FORCE_SLUG) {
    const match = ALL_POSTS.find((p) => p.slug === FORCE_SLUG);
    if (!match) throw new Error(`No post in schedule with slug "${FORCE_SLUG}"`);
    return match;
  }
  const existing = new Set(listExistingSlugs());
  // Phase 1: walk the fixed topical map (pillar + 16 cluster posts). This
  // establishes topical authority for the core unmet-demand narrative before
  // the blog starts reacting to trending news.
  const ordered = [...ALL_POSTS].sort((a, b) => (a.publishWeek ?? 0) - (b.publishWeek ?? 0));
  const nextScheduled = ordered.find((p) => !existing.has(p.slug));
  if (nextScheduled) return nextScheduled;

  // Phase 2 (forever): all scheduled posts are done. Generate a brand-new
  // trend-driven post. The generator asks Perplexity what's currently
  // under-covered in the eCommerce intelligence space, then uses Claude to
  // refine it into a ClusterPost spec compatible with the rest of the
  // pipeline (internal links to pillar + cross-links to 2-3 related posts).
  console.log(`Fixed schedule exhausted (${existing.size} posts already live). Entering trend-driven mode.`);
  return await generateTrendingTopic([...existing]);
}

// ─── Trend-driven topic generator (evergreen mode) ──────────────────────
//
// When the fixed topical map is exhausted, the weekly cron switches to this
// mode: discover an under-covered angle that's trending right now in the
// eCommerce intelligence space, and spec out a new cluster post for it.
//
// Guarantees the topic:
//   1. Has search demand (current buyer questions, real discussion volume)
//   2. Is NOT already covered by an existing post in the collection
//   3. Reinforces Kaldon's positioning (unmet demand, not cloning)
//   4. Has a unique slug that won't collide with prior posts

async function generateTrendingTopic(existingSlugs) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY required for trend-driven topic generation.');
  }

  // Step 1: Perplexity scan for what's currently trending + under-covered
  let trendContext = '';
  let trendCitations = [];
  if (process.env.PERPLEXITY_API_KEY) {
    const client = new OpenAI({
      apiKey: process.env.PERPLEXITY_API_KEY,
      baseURL: 'https://api.perplexity.ai',
      timeout: 90_000,
    });
    const calls = [
      {
        name: 'trending_questions',
        prompt: `What are the top questions eCommerce sellers, DTC brand operators, and Amazon FBA sellers are asking right now (last 14 days) that are NOT well-answered by existing blog content? Focus on: unmet demand discovery, product research tools, AI content creation for brands, listing optimization, supplier verification, brand building, Walmart/TikTok Shop expansion, ad economics, and emerging platform trends. For each: the question as real sellers phrase it, the platform where it's being asked (Reddit / X / TikTok / forums), and why existing articles miss the mark. Output 8-12 items.`,
      },
      {
        name: 'emerging_topics',
        prompt: `What are emerging topics, product launches, regulatory changes, or technology shifts in the eCommerce and DTC space that happened in the last 30 days and have NOT yet been extensively covered by content marketers? Include: new AI tools, platform policy changes (Amazon, Walmart, TikTok Shop, Meta, Shopify), supply chain shifts, tariff news, marketplace algorithm changes, creator economy developments, new ad formats. Output 8-12 items with source URLs and dates.`,
      },
    ];
    try {
      const results = await Promise.all(
        calls.map(async (call) => {
          const res = await client.chat.completions.create({
            model: 'sonar-pro',
            max_tokens: 4000,
            temperature: 0.3,
            search_recency_filter: 'month',
            web_search_options: { search_context_size: 'high' },
            messages: [
              { role: 'system', content: 'You are a market intelligence agent. Return specific, sourced items with URLs and dates. Prioritize the last 30 days.' },
              { role: 'user', content: call.prompt },
            ],
          });
          return { name: call.name, text: res.choices?.[0]?.message?.content ?? '', citations: res.citations ?? [] };
        })
      );
      trendContext = results
        .filter((r) => r.text.trim().length > 0)
        .map((r) => `--- ${r.name.toUpperCase()} ---\n${r.text}`)
        .join('\n\n');
      trendCitations = [...new Set(results.flatMap((r) => r.citations))].slice(0, 10);
    } catch (err) {
      console.warn(`Trend scan failed: ${err.message}. Falling back to Claude-only topic invention.`);
    }
  }

  // Step 2: Claude picks the best under-covered topic and specs it out.
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const existingList = existingSlugs.map((s) => `- ${s}`).join('\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `You are the content strategist for Kaldon, an AI-powered eCommerce intelligence platform. Kaldon's positioning is: discover UNMET DEMAND (products the market is paying for but nobody is shipping yet) vs clone bestsellers. Core differentiator vs Jungle Scout, Helium 10, Shopify.

EXISTING BLOG POSTS (do not duplicate angles from these):
${existingList}

${trendContext ? `CURRENT TRENDING QUESTIONS + EMERGING TOPICS IN ECOMMERCE (fresh from the last 30 days):\n\n${trendContext}\n\n` : ''}

Pick ONE topic to write next. Criteria:
1. Trending or evergreen-with-current-relevance (not stale)
2. NOT duplicating an existing post angle
3. Reinforces Kaldon's unmet-demand positioning naturally (without being forced)
4. Has clear search intent from real sellers
5. Word count target 1400-1800 (cluster range)

Respond with ONLY this JSON (no markdown fencing):

{
  "title": "Full article title",
  "slug": "url-safe-slug-no-collision",
  "targetKeyword": "primary SEO keyword",
  "searchIntent": "informational" | "commercial" | "transactional",
  "wordCountTarget": 1500,
  "angle": "The specific angle and hook in 1-2 sentences. What makes this article different from what's already out there.",
  "contentType": "how_to" | "comparison" | "benefits" | "buying_guide" | "case_study" | "news_trends" | "myths" | "ingredient_deep_dive",
  "whyNow": "Why this topic matters THIS week specifically. Reference 1-2 of the trending signals above if they apply.",
  "crossLinksTo": ["slug1", "slug2", "slug3"]
}

"crossLinksTo" must be 3 slugs from the EXISTING POSTS list above (the ones most topically related to this new article). Do not invent slugs.`,
    }],
  });

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .replace(/```json|```/g, '')
    .trim();

  const topic = JSON.parse(text);

  // Normalize to the shape the rest of the pipeline expects (ClusterPost-ish)
  const normalized = {
    title: topic.title,
    slug: topic.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, ''),
    targetKeyword: topic.targetKeyword,
    searchIntent: topic.searchIntent ?? 'informational',
    wordCountTarget: topic.wordCountTarget ?? 1500,
    angle: topic.angle,
    contentType: topic.contentType ?? 'how_to',
    publishWeek: 999, // sentinel: "trend-driven, not part of fixed schedule"
    whyNow: topic.whyNow,
    _crossLinks: topic.crossLinksTo ?? [],
    _topicCitations: trendCitations,
  };

  console.log(`Trend-driven topic selected: "${normalized.title}"`);
  console.log(`  slug: ${normalized.slug}`);
  console.log(`  why now: ${normalized.whyNow}`);
  console.log(`  cross-links: ${normalized._crossLinks.join(', ')}`);

  // Collision guard — if the model produced a slug that already exists, add a dated suffix
  if (existingSlugs.includes(normalized.slug)) {
    const dateSuffix = new Date().toISOString().slice(0, 10);
    normalized.slug = `${normalized.slug}-${dateSuffix}`;
    console.log(`  slug collision detected → suffixed: ${normalized.slug}`);
  }

  return normalized;
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
  const isTrendDriven = post.publishWeek === 999;
  // Trend-driven posts carry their own cross-link list (`_crossLinks`) picked
  // by the topic generator. Scheduled posts use the static link map.
  //
  // CRITICAL: only link to posts that have ACTUALLY been published. The static
  // map (INTERNAL_LINK_MAP) references the full 17-post schedule, but posts
  // later in the schedule don't exist yet at generation time. Linking to them
  // creates 404s. Filter against existingSlugs so the article only hrefs
  // posts that are live.
  const existingSet = new Set(existingSlugs);
  const candidateLinks = isPillar
    ? INTERNAL_LINK_MAP.pillarToCluster[PILLAR.slug] ?? []
    : isTrendDriven
      ? [PILLAR.slug, ...(post._crossLinks ?? [])]
      : [PILLAR.slug, ...(INTERNAL_LINK_MAP.clusterToCluster[post.slug] ?? [])];
  // PILLAR.slug is a special case: the pillar is the current post being
  // generated for the first run, so it's "in flight" rather than existing.
  // Cluster posts always include the pillar slug since the pillar exists by
  // the time any cluster is generated.
  const linkedSlugs = candidateLinks.filter((slug) => existingSet.has(slug));

  // ─── Static system prompt (cached) ──────────────────────────────────────
  // This block contains only content that does NOT change between calls:
  // brand constants (imported from kaldon-blog-config.mjs), the GEO rules,
  // and the JSON output spec. Anthropic prompt caching uses prefix matching,
  // so any byte change here would invalidate the cache. All per-post data
  // (title, keyword, slug, trend block, link list) goes in the user message.
  //
  // Cache TTL is 5 minutes by default. Mon/Thu cron runs are far apart so
  // most cron-triggered runs will be cache MISSES (writes), but back-to-back
  // manual runs and any --slug retries within 5 minutes will hit. Even a
  // single cache write costs only 1.25x; reads cost 0.1x. Break-even at 2
  // requests within the TTL window.
  const systemPrompt = `You are writing a blog article for Kaldon, an AI-powered eCommerce intelligence platform. This article must be:
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

MARKET CONTEXT: ${KALDON_BRAND.marketContext}

KALDON HOME (marketing): ${KALDON_BRAND.storeDomain}
KALDON PRICING (marketing): ${KALDON_BRAND.storeDomain}/pricing
KALDON FEATURES (marketing): ${KALDON_BRAND.storeDomain}/features
PILLAR ARTICLE SLUG: /blog/${PILLAR.slug}

OUTPUT FORMAT — Generate a JSON response (and ONLY valid JSON, no markdown fencing):

{
  "title": "Exact article title (match the one specified in the user message)",
  "slug": "Exact slug specified in the user message",
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
4. FAQ SECTION: Pillar articles include 5-8 FAQ items, cluster articles include 3-5. The user message specifies which type. These map directly to FAQ schema.
5. INTERNAL LINKS: Link to the pillar article at least once. Link to 2+ other cluster posts from the list provided in the user message. Link to Kaldon home, pricing, or features naturally (not forced).
6. BRAND VOICE: Match Kaldon's voice: ${KALDON_BRAND.brandVoice}
7. NO EM DASHES: Never use em dashes (U+2014). Prefer period, comma, colon, or parentheses.
8. INCLUDE DATA: Where possible, include statistics, research references, or specific numerical claims that AI engines can extract.
9. LAST UPDATED: The article should feel current. Reference "2026" or "recent" where appropriate, and if trend signals are provided in the user message, weave the most useful ones into the lede.
10. READING LEVEL: 6th-grade reading level on surface, PhD-level thinking underneath. Short sentences. Strong verbs. No jargon without explanation.

Respond ONLY with the JSON. No markdown wrapping.`;

  // ─── Dynamic user message (NOT cached) ──────────────────────────────────
  // Everything that varies per article: title, keyword, trend block, link
  // list, signup UTM, pillar-vs-cluster branch.
  const userMessage = `ARTICLE TO WRITE:
Title: ${post.title}
Slug: ${post.slug}
Article Type: ${isPillar ? 'PILLAR (5-8 FAQ items)' : 'CLUSTER (3-5 FAQ items)'}
Target Keyword: ${post.targetKeyword}
Search Intent: ${post.searchIntent}
Word Count Target: ${post.wordCountTarget}
${isPillar
    ? `Sections: ${post.sections.join(', ')}\nFAQ Questions (answer each): ${post.faqQuestions.join(', ')}`
    : `Angle: ${post.angle}\nContent Type: ${post.contentType}`}

EXISTING BLOG POSTS TO LINK TO (use /blog/[slug]):
${linkedSlugs.map((s) => `- /blog/${s}`).join('\n')}

KALDON SIGNUP (app domain, use this exact URL whenever linking to signup or starting a free trial):
  https://app.kaldon.io/signup?utm_source=marketing_site&utm_medium=cta&utm_campaign=blog_${post.slug.replace(/-/g, '_')}
${trendBlock ? `\n${trendBlock}\n` : ''}
Generate the JSON response per the format and rules in the system prompt. The "slug" field in your output must be exactly: ${post.slug}`;

  console.log(`Generating article: "${post.title}" (${isPillar ? 'pillar' : `cluster week ${post.publishWeek}`})`);
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: isPillar ? 16000 : 8000,
    system: [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  });

  // Cache observability — verify hits over time. cache_read_input_tokens > 0
  // means the system prompt prefix was served from cache (~0.1x cost).
  // cache_creation_input_tokens > 0 means we just paid the ~1.25x write
  // premium that future calls within the TTL will benefit from.
  const usage = response.usage ?? {};
  console.log(
    `Claude usage: input=${usage.input_tokens ?? 0} output=${usage.output_tokens ?? 0} ` +
    `cache_write=${usage.cache_creation_input_tokens ?? 0} cache_read=${usage.cache_read_input_tokens ?? 0}`
  );

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
  const post = await selectNextPost();
  console.log(`Next post: "${post.title}" (slug: ${post.slug}${post.publishWeek === 999 ? ', TREND-DRIVEN' : post.publishWeek !== undefined ? `, week ${post.publishWeek}` : ''})`);

  const existingSlugs = listExistingSlugs();
  console.log(`${existingSlugs.length} posts already published in content collection.`);

  const { trendBlock, citations } = await fetchCurrentTrends(post);
  if (trendBlock) {
    console.log(`Trend refresh returned ${citations.length} citations.`);
  } else {
    console.log('Trend refresh returned empty. Article will be evergreen.');
  }

  // Trend-driven topics already carry topic-discovery citations; merge them
  // with the article's trend-refresh citations so the full research trail
  // appears in the final frontmatter.
  const allCitations = [...new Set([...(post._topicCitations ?? []), ...citations])].slice(0, 15);

  const article = await writeArticle(post, trendBlock, existingSlugs);
  const md = buildMarkdown(post, article, allCitations);

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
