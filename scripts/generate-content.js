#!/usr/bin/env node
/**
 * Programmatic SEO Content Generator
 * 
 * This script generates SEO-optimized articles at scale using templates.
 * It can be run manually or via Hermes cron jobs.
 * 
 * Usage:
 *   node scripts/generate-content.js --keyword "best CRM for" --modifiers "real estate,small business,nonprofits" --count 5
 *   node scripts/generate-content.js --batch keywords.json
 *   node scripts/generate-content.js --auto-discover --niche "saas"
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Sample article templates with variable interpolation
const TEMPLATES = {
  comparison: {
    title: 'Best {keyword} in {year}: Top {count} Picks Compared',
    sections: [
      {
        heading: 'Why {keyword} Matters',
        prompts: [
          'Explain the importance of {keyword} for {audience}.',
          'Describe the key benefits and ROI potential.',
          'Mention common pain points this solves.',
        ],
      },
      {
        heading: 'Our Top {count} {keyword} Picks',
        prompts: [
          'Review each {count} options with pros/cons.',
          'Include pricing, key features, and best use case.',
          'Add a comparison table.',
        ],
      },
      {
        heading: 'How to Choose the Right {keyword}',
        prompts: [
          'List decision criteria (budget, features, scalability).',
          'Provide a buyer\'s checklist.',
        ],
      },
      {
        heading: 'FAQ',
        prompts: [
          'Answer 5-7 common questions about {keyword}.',
        ],
      },
    ],
  },
  guide: {
    title: 'The Complete Guide to {keyword} ({year})',
    sections: [
      { heading: 'What is {keyword}?', prompts: ['Definition and overview.'] },
      { heading: 'How {keyword} Works', prompts: ['Step-by-step explanation.'] },
      { heading: 'Benefits of {keyword}', prompts: ['List 5-7 benefits with examples.'] },
      { heading: 'Common Mistakes to Avoid', prompts: ['List mistakes and solutions.'] },
      { heading: 'Getting Started with {keyword}', prompts: ['Actionable first steps.'] },
    ],
  },
  review: {
    title: '{keyword} Review: Is It Worth It? ({year})',
    sections: [
      { heading: 'Overview', prompts: ['Product/service summary.'] },
      { heading: 'Key Features', prompts: ['Detailed feature breakdown.'] },
      { heading: 'Pros and Cons', prompts: ['Balanced analysis.'] },
      { heading: 'Pricing', prompts: ['Pricing tiers and value analysis.'] },
      { heading: 'Who Should Use {keyword}?', prompts: ['Ideal customer profiles.'] },
      { heading: 'Alternatives', prompts: ['2-3 alternatives compared.'] },
    ],
  },
};

// Sample data for demos
const SAMPLE_ARTICLES = [
  {
    slug: 'best-crm-for-real-estate-2026',
    title: 'Best CRM for Real Estate in 2026: Top 7 Picks Compared',
    category: 'Real Estate',
    excerpt: 'Find the best CRM for real estate agents. Compare features, pricing, and reviews of the top 7 platforms.',
    keywords: ['best crm for real estate', 'real estate crm', 'crm for agents'],
    content: `## Why CRM Matters for Real Estate

Real estate agents juggle hundreds of leads, follow-ups, and closing timelines. A CRM keeps everything organized...

## Our Top 7 Real Estate CRM Picks

### 1. Follow Up Boss
**Best for:** Teams that prioritize lead response speed
- Price: $69/user/month
- Key features: Speed-to-lead automation, dialer, team reporting

### 2. LionDesk
**Best for:** Solo agents on a budget
- Price: $25/month
- Key features: Video texting, AI assistant, transaction management

[... continues for all 7 options with comparison table ...]

## How to Choose the Right CRM

- **Budget:** Under $50/month or enterprise?
- **Team size:** Solo or 50+ agents?
- **Integrations:** MLS, Zillow, DocuSign?

## FAQ

**Q: Do I need a CRM as a new agent?**
A: Yes. Even with 5-10 leads, follow-up discipline makes or breaks your career.

**Q: Can I use a generic CRM like HubSpot?**
A: You can, but real estate-specific features (MLS integration, listing timelines) justify the niche tools.
`,
    affiliateLinks: [
      { productName: 'Follow Up Boss', affiliateUrl: 'https://followupboss.com/?aff=YOUR_ID', ctaText: 'Start Free Trial', priority: 1 },
      { productName: 'LionDesk', affiliateUrl: 'https://liondesk.com/?ref=YOUR_ID', ctaText: 'Try for $25/mo', priority: 2 },
    ],
    displayAdSlots: ['above-content', 'inline-p3', 'sidebar', 'below-content'],
    leadGenForm: true,
    leadGenHeadline: 'Get our Real Estate CRM Comparison Checklist',
    readingTime: 12,
  },
  {
    slug: 'things-to-do-in-pune',
    title: '27 Things to Do in Pune: A Local\'s Guide (2026)',
    category: 'Travel',
    excerpt: 'Discover the best things to do in Pune — from historic forts to hidden cafes. Updated for 2026.',
    keywords: ['things to do in pune', 'pune travel guide', 'pune attractions'],
    content: `## 1. Explore Shaniwar Wada
The historic fortification in the heart of Pune...

## 2. Trek to Sinhagad Fort
A perfect weekend trek with panoramic views...

[... 25 more attractions with descriptions, tips, and maps ...]
`,
    affiliateLinks: [
      { productName: 'Booking.com Pune Hotels', affiliateUrl: 'https://booking.com/?aid=YOUR_ID', ctaText: 'Find Hotels', priority: 1 },
    ],
    displayAdSlots: ['above-content', 'inline-p3', 'below-content'],
    leadGenForm: false,
    readingTime: 18,
  },
];

async function writeArticleToFile(article, outputDir) {
  const filePath = path.join(outputDir, `${article.slug}.json`);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(article, null, 2));
  console.log(`✅ Generated: ${filePath}`);
  return filePath;
}

async function pushToCMS(article, cmsUrl = 'http://localhost:3001') {
  try {
    const res = await fetch(`${cmsUrl}/api/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...article,
        status: 'published',
        publishedDate: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`CMS returned ${res.status}`);
    const data = await res.json();
    console.log(`🚀 Published to CMS: ${article.slug} (ID: ${data.doc.id})`);
    return data.doc;
  } catch (err) {
    console.error(`❌ Failed to push ${article.slug}:`, err.message);
    return null;
  }
}

function generateArticle(templateType, vars) {
  const template = TEMPLATES[templateType];
  if (!template) throw new Error(`Unknown template: ${templateType}`);

  const interpolate = (str) => {
    return str.replace(/\{(\w+)\}/g, (match, key) => vars[key] || match);
  };

  const title = interpolate(template.title);
  const content = template.sections
    .map((section) => {
      const heading = interpolate(section.heading);
      const body = section.prompts.map((p) => interpolate(p)).join('\n\n');
      return `## ${heading}\n\n${body}\n\n[AI-GENERATED CONTENT PLACEHOLDER - Replace with Hermes output]\n`;
    })
    .join('\n');

  return {
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    title,
    excerpt: `Learn about ${vars.keyword}. Complete guide with reviews, comparisons, and expert recommendations.`,
    content,
    category: vars.category || 'General',
    keywords: [vars.keyword, `${vars.keyword} guide`, `${vars.keyword} ${vars.year || 2026}`],
    displayAdSlots: ['above-content', 'inline-p3', 'below-content'],
    leadGenForm: vars.leadGen !== false,
    readingTime: Math.floor(Math.random() * 10) + 5,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const flags = Object.fromEntries(
    args.filter((_, i) => i % 2 === 0 && args[i].startsWith('--')).map((k, i) => [
      k.replace('--', ''),
      args[args.indexOf(k) + 1]
    ])
  );

  const outputDir = path.join(__dirname, '../generated-content');

  // Demo mode: generate sample articles
  if (flags['demo']) {
    console.log('🎨 Generating demo articles...\n');
    for (const article of SAMPLE_ARTICLES) {
      await writeArticleToFile(article, outputDir);
      if (flags['push']) {
        await pushToCMS(article, flags['cms-url']);
      }
    }
    console.log(`\n✨ Done! Check ${outputDir}`);
    return;
  }

  // Template-based generation
  if (flags['keyword'] && flags['modifiers']) {
    const modifiers = flags['modifiers'].split(',').map(m => m.trim());
    const templateType = flags['template'] || 'comparison';
    const count = parseInt(flags['count']) || modifiers.length;

    console.log(`📝 Generating ${count} articles for "${flags['keyword']}"...\n`);

    for (let i = 0; i < Math.min(count, modifiers.length); i++) {
      const article = generateArticle(templateType, {
        keyword: `${flags['keyword']} ${modifiers[i]}`,
        year: new Date().getFullYear(),
        count: flags['count'] || '7',
        audience: modifiers[i],
        category: flags['category'] || 'General',
      });
      await writeArticleToFile(article, outputDir);
      if (flags['push']) {
        await pushToCMS(article, flags['cms-url']);
      }
    }
    console.log(`\n✨ Done! Check ${outputDir}`);
    return;
  }

  // Print usage
  console.log(`
Programmatic SEO Content Generator

Usage:
  --demo                    Generate demo/sample articles
  --push                    Also push to CMS after generation
  --keyword "head term"     The consistent part (e.g., "best CRM for")
  --modifiers "a,b,c"       Comma-separated variable parts
  --template comparison|guide|review   Article template type
  --category "Category"     Category name
  --count 5                 Number of articles to generate
  --cms-url URL             Payload CMS URL (default: http://localhost:3001)

Examples:
  # Generate demo articles:
  node scripts/generate-content.js --demo

  # Generate CRM comparison articles:
  node scripts/generate-content.js --keyword "best CRM for" --modifiers "real estate,small business,nonprofits,startups" --template comparison --push

  # Generate travel guides programmatically:
  node scripts/generate-content.js --keyword "things to do in" --modifiers "pune,mumbai,delhi,bangalore" --template guide --category "Travel"
`);
}

main().catch(console.error);
