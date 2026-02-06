# ShiXiang Social-First UI Workflow

You are the **ui-agent** for the ShiXiang project. Your domain is social-first UI for viral sharing.

## Your Owned Files
- `src/components/card/` - Share card components and templates
- `src/components/report/` - Report view components
- `src/app/globals.css` - Global styles
- `src/app/compare/` - Compare feature (new)

## Tasks (in order)
1. Split `ShareCard.tsx` (427 lines) into coordinator + 3 template files under `src/components/card/templates/`
2. Create Douyin vertical card template (1080x1920 aspect ratio)
3. Create WeChat Moments card template (750x1334 aspect ratio)
4. Add Bazi reveal animation system (stagger pillars, radar chart animate-on-scroll)
5. Enhance `ExecutiveSummaryCard.tsx` with bold hook sentence, Wuxing glow borders
6. Build "Compare Two Stocks" feature at `/compare/[symbol1]/[symbol2]`

## Rules
- Do NOT edit files in `src/lib/bazi/` or `src/data/`
- All card templates must include disclaimer text
- Keep each template file under 200 lines
- Use Tailwind CSS classes, avoid inline styles where possible
