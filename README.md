# Programmatic SEO Engine 🚀

> **Astro + Payload CMS + Hermes-powered content generation for scaling SEO at warp speed.**

Generate thousands of SEO-optimized articles using programmatic templates, monetize through ads/affiliates/leads, and deploy anywhere.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      HERMES AGENT                            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Keyword      │───▶│ Content      │───▶│ Push to CMS  │  │
│  │ Research     │    │ Generator    │    │ (API)        │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PAYLOAD CMS (Port 3001)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Articles │ │Categories│ │ Keywords │ │  Media   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌────────────────────────────────────────────────────┐     │
│  │ Site Settings (Ads, Analytics, Affiliate Config)   │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API (REST/GraphQL)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ASTRO WEB APP (Port 4321)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ SSR Build    │  │ Static Pages │  │ API Routes   │      │
│  │ getStaticPaths│  │ /blog/[slug] │  │ /api/leads   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Display Ads  │  │ Affiliate    │  │ Lead Gen     │      │
│  │ (AdSense)    │  │ Links        │  │ Forms        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone and start everything
git clone https://github.com/hemanshum/programmatic-seo-engine.git
cd programmatic-seo-engine

# Create environment files
cp apps/cms/.env.example apps/cms/.env
cp apps/web/.env.example apps/web/.env

# Start services
docker-compose up -d

# CMS Admin:     http://localhost:3001/admin
# Astro Frontend: http://localhost:4321
```

### Option 2: Local Development

```bash
# Install dependencies
npm install
cd apps/cms && npm install
cd ../web && npm install

# Start CMS (Terminal 1)
cd apps/cms
npm run dev

# Start Astro (Terminal 2)
cd apps/web
npm run dev
```

---

## Programmatic Content Generation

### 1. Generate Demo Articles

```bash
node scripts/generate-content.js --demo
```

### 2. Generate from Keyword Patterns

```bash
# Pattern: "best CRM for [modifier]"
node scripts/generate-content.js \
  --keyword "best CRM for" \
  --modifiers "real estate,small business,nonprofits,startups,law firms" \
  --template comparison \
  --category "Software" \
  --push
```

### 3. Generate Location-Based Content

```bash
# Travel guides pattern
node scripts/generate-content.js \
  --keyword "things to do in" \
  --modifiers "pune,mumbai,delhi,bangalore,jaipur,goa" \
  --template guide \
  --category "Travel"
```

### 4. Hermes Agent Integration

This repository includes a Hermes skill at `~/.hermes/skills/programmatic-seo/`. Once loaded, Hermes can:

- Research keywords via web search
- Generate full articles using GPT-4/Claude
- Push directly to Payload CMS via API
- Schedule daily batches via cron jobs

**Example Hermes cron job:**

```bash
hermes cron create \
  --name "daily-content-batch" \
  --schedule "0 2 * * *" \
  --prompt "Generate 5 SEO articles for the next keywords in the queue and push to http://localhost:3001/api/articles" \
  --output local
```

---

## Content Collections & CMS Schema

### Articles

| Field | Type | Description |
|-------|------|-------------|
| `title` | Text | SEO-optimized H1 |
| `slug` | Text | URL-friendly identifier |
| `status` | Select | draft / published / scheduled |
| `category` | Relationship | Links to Categories |
| `keywords` | Relationship | Target search terms |
| `excerpt` | Textarea | Meta description |
| `content` | Rich Text | Lexical editor |
| `metaTitle` | Text | Override `<title>` |
| `metaDescription` | Textarea | Override meta desc |
| `monetization` | Group | Affiliate links, ad slots, lead gen |

### Keywords

| Field | Type | Description |
|-------|------|-------------|
| `term` | Text | Exact keyword to target |
| `searchVolume` | Number | Monthly searches |
| `difficulty` | Number | 0-100 difficulty score |
| `cpc` | Number | Cost per click |
| `cluster` | Text | Keyword group name |
| `headTerm` | Text | Pattern constant |
| `modifier` | Text | Pattern variable |
| `intent` | Select | informational/commercial/transactional |
| `status` | Select | research/ready/writing/published/update |

---

## Monetization Setup

### 1. Display Ads (Google AdSense)

1. Get your `ca-pub-XXXXXXXX` ID from AdSense
2. Add to `apps/web/.env`:
   ```
   PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```
3. Ad slots are configured per-article in the CMS:
   - `above-content` — Leaderboard after title
   - `inline-p3` — Rectangle after 3rd paragraph
   - `sidebar` — Skyscraper in sticky sidebar
   - `below-content` — Auto format after article

### 2. Affiliate Commissions

Add affiliate products in each article's **Monetization** tab:

```json
{
  "productName": "Follow Up Boss",
  "affiliateUrl": "https://followupboss.com/?aff=YOUR_ID",
  "ctaText": "Start Free Trial",
  "priority": 1
}
```

The highest-priority product renders as the **TOP PICK** card.

### 3. Lead Generation

Enable **Lead Gen Form** per article. Captured leads POST to `/api/leads/capture`.

**Integrate with your stack:**
- **ConvertKit/Mailchimp:** Add their API call in `apps/web/src/pages/api/leads/capture.ts`
- **Zapier:** Uncomment the webhook code and add your Zapier URL
- **Airtable:** Use `airtable` npm package to create records
- **CRM:** Push to HubSpot/Salesforce via their APIs

---

## SEO Features

| Feature | Implementation |
|---------|---------------|
| **Sitemap** | `@astrojs/sitemap` auto-generates `/sitemap-index.xml` |
| **RSS Feed** | `@astrojs/rss` at `/rss.xml` |
| **Structured Data** | JSON-LD for Organization, BreadcrumbList, Article |
| **Open Graph** | `og:title`, `og:description`, `og:image`, `og:type=article` |
| **Twitter Cards** | `twitter:card=summary_large_image` |
| **Canonical URLs** | Per-page canonical with fallback to current URL |
| **Meta Robots** | `index,follow,max-snippet:-1,max-image-preview:large` |
| **Partytown** | Third-party scripts (analytics, ads) run in web worker |
| **Static Generation** | `getStaticPaths()` pre-renders all pages at build time |

---

## Deployment

### Vercel (Frontend + Serverless Functions)

```bash
cd apps/web
npx vercel --prod
```

### Netlify (Static + Edge Functions)

```bash
cd apps/web
npx netlify deploy --build --prod
```

### Self-Hosted (Docker)

```bash
# Production build
docker-compose -f docker-compose.yml up -d --build

# With custom domain
echo "SITE=https://your-domain.com" >> .env
echo "PAYLOAD_PUBLIC_SERVER_URL=https://api.your-domain.com" >> .env
docker-compose up -d
```

### Payload CMS Cloud (Managed)

Deploy CMS to [Payload Cloud](https://payloadcms.com/cloud) and update `CMS_URL` in Astro `.env`.

---

## Hermes Skill: `programmatic-seo`

This project includes a reusable Hermes skill. Install it:

```bash
# Copy skill to your Hermes installation
cp -r scripts/hermes-skill ~/.hermes/skills/programmatic-seo
```

**What the skill enables:**

1. **Keyword Pattern Research**
   - Identifies `head term + modifier` patterns
   - Checks search volume via free keyword APIs
   - Scores difficulty and commercial intent

2. **Bulk Article Generation**
   - Writes 800-2000 word articles using templates
   - Includes comparison tables, pros/cons, FAQ
   - Optimizes for featured snippets

3. **CMS Integration**
   - Auto-creates articles via Payload REST API
   - Sets status to `published` or `draft`
   - Links keywords and categories

4. **Cron Scheduling**
   - Daily: Generate 5-10 new articles
   - Weekly: Update underperforming content
   - Monthly: Keyword gap analysis

---

## Project Structure

```
programmatic-seo-engine/
├── apps/
│   ├── cms/                        # Payload CMS backend
│   │   ├── src/
│   │   │   ├── collections/        # Articles, Categories, Keywords, Media
│   │   │   ├── payload.config.ts   # CMS configuration
│   │   │   └── server.ts           # Express entry point
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/                        # Astro frontend
│       ├── src/
│       │   ├── components/         # BaseHead, DisplayAd, AffiliateLink, LeadGen
│       │   ├── layouts/            # BlogPost layout
│       │   ├── pages/              # Routes (index, blog, category, API)
│       │   ├── lib/                # CMS API client
│       │   └── content/            # Local content fallback
│       ├── Dockerfile
│       └── package.json
│
├── scripts/
│   └── generate-content.js         # Programmatic content generator
│
├── docker-compose.yml
└── README.md
```

---

## Environment Variables

### CMS (`apps/cms/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3001) |
| `PAYLOAD_SECRET` | Encryption key (generate strong random string) |
| `DATABASE_URI` | SQLite file path or MongoDB URI |
| `PAYLOAD_PUBLIC_SERVER_URL` | CMS public URL |
| `PAYLOAD_PUBLIC_WEB_URL` | Frontend URL |

### Web (`apps/web/.env`)

| Variable | Description |
|----------|-------------|
| `CMS_URL` | Payload API base URL |
| `SITE` | Production domain |
| `PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense publisher ID |

---

## License

MIT — Built for scaling content and revenue. 📈
