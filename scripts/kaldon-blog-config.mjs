// Kaldon's own marketing blog topical map.
// Pillar + cluster structure, 16 weeks of content. The auto-publisher reads
// `scripts/blog-schedule.json` (generated/maintained separately) to track
// which post is "next up" so the weekly cron knows what to write.
//
// The pillar covers the umbrella topic; clusters orbit it and cross-link.
// Each post has a target keyword, search intent, angle, and content type.
// Trend-refresh pulls current signals for each keyword before writing.

export const KALDON_BRAND = {
  brandName: 'Kaldon',
  brandVoice:
    'Technical, precise, data-forward. PhD-level thinking at a 6th-grade reading level. Confident, never hype. Prefers concrete numbers, named tools, and specific data over generalities. No em dashes. Reads like an operator who has actually launched products, not a marketer.',
  productName: 'Kaldon',
  productCategory: 'AI-powered eCommerce intelligence platform',
  productSlug: 'kaldon',
  storeDomain: 'https://kaldon.io',
  colorPrimary: '#00D4FF',
  colorSecondary: '#FFB800',
  colorAccent: '#F5F5F7',
  marketContext: `Kaldon is a unified 5-phase SaaS platform that replaces the 6+ premium subscriptions and 3+ freelance services most eCommerce sellers stack to launch a product: research (Jungle Scout Brand Owner + Helium 10 Diamond), content (ChatGPT Pro, Jasper Business, Copy.ai Team), visuals (Canva Teams + Adobe CC + Midjourney), social (Later Agency + Hootsuite Business), store (Shopify Advanced + premium apps), and per-launch services (pro photography, listing agencies, brand studios). A premium DIY stack runs $18,000 to $50,000+ per year. Kaldon Growth is $149/mo and covers the whole pipeline. Core differentiator: discovers UNMET DEMAND the market is paying for but nobody is shipping yet, vs research tools that help you clone existing bestsellers. The 5 phases are Discover, Build, Create, Launch, Grow. ICP: new sellers looking for first product, existing Amazon brands expanding to DTC/Walmart, agencies running client launches. 150+ brands have been launched using the 5-phase process that Kaldon now productizes.`,
};

/**
 * Kaldon's pillar article. This is the spine every cluster post links back to.
 */
export const PILLAR = {
  title: 'How to find a winning eCommerce product in 2026: the unmet-demand playbook',
  slug: 'find-winning-ecommerce-product-unmet-demand-playbook',
  targetKeyword: 'how to find a winning product to sell online',
  searchIntent: 'informational',
  wordCountTarget: 3200,
  sections: [
    'Why most product research starts at the wrong question',
    'The difference between cloning bestsellers and finding unmet demand',
    'The 10 demand signals that matter (and which ones mislead)',
    'How to validate a UVP before you spend',
    'Supplier verification and why capability beats quotes',
    'Brand, content, store, and ad setup as one connected workflow',
    'The full economics: $18K-$50K DIY stack vs $149/mo consolidated platform',
    'When to launch, when to wait, when to kill the idea',
  ],
  faqQuestions: [
    'How do I find an unmet demand product vs just a popular product?',
    'What research tools do I actually need in 2026?',
    'How long should product validation take?',
    'What is the real cost of launching a new eCommerce product?',
    'Can AI find winning products better than humans?',
    'How do I know if a supplier can actually make my product?',
    'Should I start with Amazon, Walmart, or DTC?',
    'What margins should I target for a new launch?',
  ],
  contentType: 'pillar',
};

/**
 * 16 cluster posts, each orbiting the pillar. The publishWeek number
 * indicates scheduling (week 1 = first cluster post, 16 weeks total).
 *
 * Content types:
 * - how_to: step-by-step operator guide
 * - comparison: vs a competitor or approach
 * - benefits: value framing around a capability
 * - buying_guide: buyer-journey oriented
 * - case_study: worked example or pattern
 * - news_trends: timely, trend-heavy (ideal for trend-refresh)
 * - myths: myth-busting framing
 * - ingredient_deep_dive: zoom into one capability
 */
export const CLUSTER_POSTS = [
  {
    title: 'The 10 product-research tools most sellers use in 2026 (and why you only need one)',
    slug: 'product-research-tools-comparison-2026',
    targetKeyword: 'best product research tools ecommerce 2026',
    searchIntent: 'commercial',
    wordCountTarget: 1800,
    angle: 'Honest comparison of Jungle Scout, Helium 10, Viral Launch, Sellerboard, Keepa, SmartScout, AMZScout, and where Kaldon fits. End with the math: what replaces what, and total monthly cost.',
    contentType: 'comparison',
    publishWeek: 1,
  },
  {
    title: 'How to spot unmet demand on Amazon, Walmart, and TikTok Shop before your competitors',
    slug: 'spot-unmet-demand-amazon-walmart-tiktok',
    targetKeyword: 'find unmet demand ecommerce',
    searchIntent: 'informational',
    wordCountTarget: 1600,
    angle: 'A concrete method: review-gap analysis, search-demand deltas, social-momentum vs available-supply mismatch. Worked examples with real category data.',
    contentType: 'how_to',
    publishWeek: 2,
  },
  {
    title: 'The $50,000 DIY eCommerce tool stack, line by line (and what it costs to consolidate)',
    slug: 'diy-ecommerce-tool-stack-cost-breakdown',
    targetKeyword: 'cost to launch ecommerce product',
    searchIntent: 'informational',
    wordCountTarget: 1900,
    angle: 'Full cost breakdown of a premium DIY stack: JS Brand Owner, H10 Diamond, Jasper Business, Copy.ai Team, ChatGPT Pro, Canva Teams, Adobe CC, Midjourney Mega, Later Agency, Hootsuite Business, Shopify Advanced + apps, pro photography, listing agencies, brand studios. Annual totals. Where the numbers actually come from.',
    contentType: 'case_study',
    publishWeek: 3,
  },
  {
    title: 'How to validate a product UVP before buying inventory',
    slug: 'validate-product-uvp-before-buying-inventory',
    targetKeyword: 'validate product idea before manufacturing',
    searchIntent: 'informational',
    wordCountTarget: 1500,
    angle: 'A pre-launch validation playbook: landing-page tests, paid-traffic micro-budgets, presale signal gathering, review-sentiment scraping, and the "would you click buy" threshold.',
    contentType: 'how_to',
    publishWeek: 4,
  },
  {
    title: 'What AI-generated brand identity actually looks like (logo, palette, voice)',
    slug: 'ai-generated-brand-identity-real-examples',
    targetKeyword: 'ai brand identity generation',
    searchIntent: 'informational',
    wordCountTarget: 1400,
    angle: 'Real before/after: what an AI-generated brand looks like vs a Fiverr freelancer vs a $5K agency. Specific output samples, palette choices, voice guidelines.',
    contentType: 'ingredient_deep_dive',
    publishWeek: 5,
  },
  {
    title: 'Supplier verification: what to ask before you wire the deposit',
    slug: 'supplier-verification-checklist-china-usa',
    targetKeyword: 'how to verify manufacturer supplier',
    searchIntent: 'informational',
    wordCountTarget: 1700,
    angle: 'Operator checklist: factory audit questions, Alibaba red flags, sample protocols, payment terms, ISO/BSCI certifications, and when to use ThomasNet vs Made-in-China vs domestic.',
    contentType: 'how_to',
    publishWeek: 6,
  },
  {
    title: 'Amazon to DTC: when to diversify and what to move first',
    slug: 'amazon-dtc-diversification-playbook',
    targetKeyword: 'amazon to dtc migration',
    searchIntent: 'informational',
    wordCountTarget: 1600,
    angle: 'Decision framework for when to launch a DTC store alongside Amazon: revenue thresholds, margin math, email list economics, customer acquisition cost crossover point.',
    contentType: 'buying_guide',
    publishWeek: 7,
  },
  {
    title: 'The real economics of a 6-figure Amazon brand in 2026',
    slug: 'six-figure-amazon-brand-economics-2026',
    targetKeyword: 'amazon brand profitability 2026',
    searchIntent: 'informational',
    wordCountTarget: 1900,
    angle: 'Full P&L breakdown: COGS, PPC spend, fees, storage, returns, brand-registry overhead. Net margin realities by category. What changed in 2026 vs 2023.',
    contentType: 'case_study',
    publishWeek: 8,
  },
  {
    title: 'Walmart vs Amazon for new sellers in 2026: honest category comparison',
    slug: 'walmart-vs-amazon-new-sellers-2026',
    targetKeyword: 'walmart marketplace vs amazon',
    searchIntent: 'commercial',
    wordCountTarget: 1500,
    angle: 'Data-driven comparison: buyer demographics, conversion rates, fee structures, ad platforms, search algorithms. Which categories win on which platform.',
    contentType: 'comparison',
    publishWeek: 9,
  },
  {
    title: 'Content that converts: a month of on-brand social posts without a creator',
    slug: 'month-on-brand-social-content-no-creator',
    targetKeyword: 'ai social media content brand',
    searchIntent: 'informational',
    wordCountTarget: 1500,
    angle: 'How AI-generated content stacks up against a $4K/mo content agency. Platform mix (IG, TikTok, LinkedIn, X, Pinterest), posting cadence, voice consistency, what still needs a human.',
    contentType: 'ingredient_deep_dive',
    publishWeek: 10,
  },
  {
    title: 'Shopify + 12 apps vs a unified pipeline: the hidden app tax',
    slug: 'shopify-apps-hidden-cost-unified-platform',
    targetKeyword: 'shopify apps total cost',
    searchIntent: 'commercial',
    wordCountTarget: 1600,
    angle: 'Every premium Shopify app a real brand runs (Klaviyo, Yotpo, Judge.me, Postscript, Rebuy, AfterShip, etc.) with monthly cost, and what an integrated platform collapses.',
    contentType: 'comparison',
    publishWeek: 11,
  },
  {
    title: 'Auto-published SEO blog for eCommerce: how it actually works (and why it ranks)',
    slug: 'auto-published-seo-blog-ecommerce-ranking',
    targetKeyword: 'auto publish seo blog ecommerce',
    searchIntent: 'informational',
    wordCountTarget: 1700,
    angle: 'The mechanics: pillar + cluster topical authority, trend-refresh via Perplexity, AI article generation, GEO optimization (TLDR-first, FAQ schema, internal links). Why this beats hand-written quarterly content.',
    contentType: 'how_to',
    publishWeek: 12,
  },
  {
    title: 'TikTok Shop strategy for new DTC brands in 2026',
    slug: 'tiktok-shop-strategy-dtc-2026',
    targetKeyword: 'tiktok shop strategy',
    searchIntent: 'informational',
    wordCountTarget: 1500,
    angle: 'When TikTok Shop wins, when it loses, and what content actually converts. Creator-commission economics, video requirements, and the audience crossover with existing Amazon buyers.',
    contentType: 'news_trends',
    publishWeek: 13,
  },
  {
    title: 'Myths about AI product research every seller still believes',
    slug: 'ai-product-research-myths-debunked',
    targetKeyword: 'ai product research accuracy',
    searchIntent: 'informational',
    wordCountTarget: 1400,
    angle: '5-7 myths: "AI just scrapes Amazon", "it hallucinates prices", "big sellers already use it", "it\'s a black box", etc. Addressed with specific mechanics and counter-examples.',
    contentType: 'myths',
    publishWeek: 14,
  },
  {
    title: 'From market gap to live store in 72 hours: a worked example',
    slug: 'market-gap-to-live-store-72-hours-case-study',
    targetKeyword: 'launch ecommerce product in days',
    searchIntent: 'informational',
    wordCountTarget: 1800,
    angle: 'Concrete end-to-end walkthrough: hour 0 demand signal, hour 4 UVP validation, hour 8 supplier shortlist, hour 24 brand identity, hour 36 content pack, hour 48 storefront deploy, hour 72 ads live.',
    contentType: 'case_study',
    publishWeek: 15,
  },
  {
    title: 'Agency vs AI platform for product launches: which wins in 2026',
    slug: 'agency-vs-ai-platform-product-launches-2026',
    targetKeyword: 'ecommerce agency vs ai platform',
    searchIntent: 'commercial',
    wordCountTarget: 1600,
    angle: 'When a $10K/mo agency retainer is worth it, and when an AI platform at $149/mo wins on speed, cost, and output quality. Ideal for agencies considering how to differentiate.',
    contentType: 'comparison',
    publishWeek: 16,
  },
];

/**
 * Combined schedule: pillar (week 0) + 16 clusters (weeks 1-16).
 */
export const ALL_POSTS = [{ ...PILLAR, publishWeek: 0 }, ...CLUSTER_POSTS];

/**
 * Internal link map: for each cluster, which other cluster slugs it should
 * link to. Keeps topical authority graph dense. The pillar is always linked.
 */
export const INTERNAL_LINK_MAP = {
  pillarToCluster: Object.fromEntries([[PILLAR.slug, CLUSTER_POSTS.map((c) => c.slug)]]),
  clusterToPillar: Object.fromEntries(CLUSTER_POSTS.map((c) => [c.slug, PILLAR.slug])),
  clusterToCluster: {
    'product-research-tools-comparison-2026': ['spot-unmet-demand-amazon-walmart-tiktok', 'ai-product-research-myths-debunked', 'diy-ecommerce-tool-stack-cost-breakdown'],
    'spot-unmet-demand-amazon-walmart-tiktok': ['validate-product-uvp-before-buying-inventory', 'market-gap-to-live-store-72-hours-case-study'],
    'diy-ecommerce-tool-stack-cost-breakdown': ['shopify-apps-hidden-cost-unified-platform', 'agency-vs-ai-platform-product-launches-2026'],
    'validate-product-uvp-before-buying-inventory': ['supplier-verification-checklist-china-usa', 'market-gap-to-live-store-72-hours-case-study'],
    'ai-generated-brand-identity-real-examples': ['month-on-brand-social-content-no-creator', 'agency-vs-ai-platform-product-launches-2026'],
    'supplier-verification-checklist-china-usa': ['validate-product-uvp-before-buying-inventory', 'six-figure-amazon-brand-economics-2026'],
    'amazon-dtc-diversification-playbook': ['walmart-vs-amazon-new-sellers-2026', 'tiktok-shop-strategy-dtc-2026'],
    'six-figure-amazon-brand-economics-2026': ['amazon-dtc-diversification-playbook', 'agency-vs-ai-platform-product-launches-2026'],
    'walmart-vs-amazon-new-sellers-2026': ['amazon-dtc-diversification-playbook', 'tiktok-shop-strategy-dtc-2026'],
    'month-on-brand-social-content-no-creator': ['ai-generated-brand-identity-real-examples', 'auto-published-seo-blog-ecommerce-ranking'],
    'shopify-apps-hidden-cost-unified-platform': ['diy-ecommerce-tool-stack-cost-breakdown', 'agency-vs-ai-platform-product-launches-2026'],
    'auto-published-seo-blog-ecommerce-ranking': ['month-on-brand-social-content-no-creator', 'ai-product-research-myths-debunked'],
    'tiktok-shop-strategy-dtc-2026': ['amazon-dtc-diversification-playbook', 'walmart-vs-amazon-new-sellers-2026'],
    'ai-product-research-myths-debunked': ['product-research-tools-comparison-2026', 'auto-published-seo-blog-ecommerce-ranking'],
    'market-gap-to-live-store-72-hours-case-study': ['spot-unmet-demand-amazon-walmart-tiktok', 'validate-product-uvp-before-buying-inventory'],
    'agency-vs-ai-platform-product-launches-2026': ['diy-ecommerce-tool-stack-cost-breakdown', 'ai-generated-brand-identity-real-examples'],
  },
};
