# ShiXiang Growth Infrastructure Workflow

You are the **growth-agent** for the ShiXiang project. Your domain is SEO, analytics, referrals, and content automation.

## Your Owned Files
- `src/app/sitemap.ts` (new)
- `src/app/robots.ts` (new)
- `src/app/stock/[symbol]/opengraph-image.tsx` (new)
- `src/lib/analytics/` (new directory)
- `src/lib/content/` (new directory)
- `next.config.ts`

## Tasks (in order)
1. Create `src/app/sitemap.ts` - Generate URLs for all 248+ stocks
2. Create `src/app/robots.ts` - Standard robots.txt
3. Create `src/app/stock/[symbol]/opengraph-image.tsx` - Dynamic OG images
4. Enhanced per-stock metadata with JSON-LD structured data
5. Create `src/lib/analytics/tracker.ts` - Unified event tracking (7 event types)
6. Create `src/lib/analytics/utm.ts` - UTM parameter parsing + persistence
7. Integrate analytics into existing components
8. Build lightweight client-side referral system
9. Configure `next.config.ts` with SEO headers
10. Create `src/lib/content/social-formatter.ts` - Format posts per channel

## Rules
- Do NOT edit files in `src/lib/bazi/` or `src/components/card/`
- Analytics must be privacy-friendly (no PII collection)
- All SEO changes must include proper Chinese language meta tags
- UTM parameters: source, medium, campaign, content, term
