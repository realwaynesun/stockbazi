/**
 * 市相 - Feature Guide Page
 * 功能指南页 - 教学性深度解读
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SearchBar } from '@/components/stock/SearchBar';
import { getStockAnalysis } from '@/lib/stock/analysis';
import {
  GUIDE_CONFIGS,
  GUIDE_CONTENT,
  GUIDE_SLUGS,
  getOtherGuides,
  type GuideSlug,
} from '@/lib/guide/content';
import { GuideVisualizations } from './visualizations';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const THEME_STYLES = {
  emerald: {
    gradient: 'from-emerald-950 via-emerald-900/40 to-slate-950',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/50',
    bgAccent: 'bg-emerald-500/20',
    ring: 'ring-emerald-500/30',
    callout: 'bg-emerald-950/30 border-emerald-800/50',
    stepBg: 'bg-emerald-500',
  },
  amber: {
    gradient: 'from-amber-950 via-amber-900/40 to-slate-950',
    accent: 'text-amber-400',
    border: 'border-amber-500/50',
    bgAccent: 'bg-amber-500/20',
    ring: 'ring-amber-500/30',
    callout: 'bg-amber-950/30 border-amber-800/50',
    stepBg: 'bg-amber-500',
  },
  purple: {
    gradient: 'from-purple-950 via-purple-900/40 to-slate-950',
    accent: 'text-purple-400',
    border: 'border-purple-500/50',
    bgAccent: 'bg-purple-500/20',
    ring: 'ring-purple-500/30',
    callout: 'bg-purple-950/30 border-purple-800/50',
    stepBg: 'bg-purple-500',
  },
} as const;

function isValidSlug(slug: string): slug is GuideSlug {
  return GUIDE_SLUGS.includes(slug as GuideSlug);
}

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidSlug(slug)) return {};

  const config = GUIDE_CONFIGS[slug];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shixiang.app';

  return {
    title: `${config.title} | 市相`,
    description: config.seoDescription,
    openGraph: {
      title: `${config.title} | 市相`,
      description: config.seoDescription,
      url: `${siteUrl}/guide/${slug}`,
      siteName: '市相',
      locale: 'zh_CN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${config.title} | 市相`,
      description: config.seoDescription,
    },
    alternates: {
      canonical: `${siteUrl}/guide/${slug}`,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  const config = GUIDE_CONFIGS[slug];
  const content = GUIDE_CONTENT[slug];
  const theme = THEME_STYLES[config.themeColor];
  const otherGuides = getOtherGuides(slug);

  const { report } = await getStockAnalysis(config.stockSymbol);
  if (!report) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shixiang.app';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.title,
    description: config.seoDescription,
    url: `${siteUrl}/guide/${slug}`,
    publisher: { '@type': 'Organization', name: '市相' },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span className="text-2xl">☯</span>
              <span className="font-bold hidden sm:inline">市相</span>
            </Link>
            <div className="flex-1 max-w-lg">
              <SearchBar placeholder="搜索股票..." />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className={`bg-gradient-to-b ${theme.gradient} py-16 md:py-24`}>
        <div className="container mx-auto px-4 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${theme.bgAccent} mb-6`}>
            <span className="text-3xl">{config.icon}</span>
          </div>
          <h1 className={`text-3xl md:text-5xl font-bold ${theme.accent} mb-4`}>
            {config.title}
          </h1>
          <p className="text-lg text-slate-400">
            {config.subtitle}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-16">
        {/* Section 1: What is X? */}
        <section>
          <h2 className="text-2xl font-bold text-slate-200 mb-6">
            {content.intro.heading}
          </h2>
          <div className="space-y-4">
            {content.intro.paragraphs.map((p, i) => (
              <p key={i} className="text-slate-300 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          {content.intro.callout && (
            <div className={`mt-6 p-4 rounded-lg border ${theme.callout}`}>
              <p className={`text-sm ${theme.accent} leading-relaxed`}>
                {content.intro.callout}
              </p>
            </div>
          )}
        </section>

        {/* Section 2: Live Visualization */}
        <section>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">
            实例演示
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            {config.stockName} ({report.stock.symbol}) 的真实数据
          </p>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <GuideVisualizations slug={slug} report={report} />
          </div>
        </section>

        {/* Section 3: Step-by-Step Walkthrough */}
        <section>
          <h2 className="text-2xl font-bold text-slate-200 mb-8">
            逐步解读
          </h2>
          <div className="space-y-6">
            {content.walkthrough.map((step) => (
              <div key={step.step} className="flex gap-4">
                <div className={`shrink-0 w-8 h-8 rounded-full ${theme.stepBg} flex items-center justify-center text-white text-sm font-bold`}>
                  {step.step}
                </div>
                <div className="flex-1 pb-6 border-b border-slate-800 last:border-0">
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Financial Interpretation */}
        <section className="bg-slate-900/30 -mx-4 px-4 py-10 md:mx-0 md:px-8 rounded-xl">
          <h2 className="text-2xl font-bold text-slate-200 mb-6">
            {content.interpretation.heading}
          </h2>
          <div className="space-y-4">
            {content.interpretation.paragraphs.map((p, i) => (
              <p key={i} className="text-slate-300 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-bold text-slate-200 mb-2">
            想看你的股票？
          </h2>
          <p className="text-slate-400 mb-6">
            输入任意股票代码，立即生成完整的八字分析报告
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar autoFocus={false} placeholder="输入股票代码或名称，如 AAPL, 茅台" />
          </div>
        </section>

        {/* Section 6: Other Guides */}
        <section>
          <h3 className="text-center text-slate-500 text-sm mb-4">
            继续探索
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {otherGuides.map((guide) => {
              const guideTheme = THEME_STYLES[guide.themeColor];
              return (
                <Link
                  key={guide.slug}
                  href={`/guide/${guide.slug}`}
                  className={`p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:${guide.themeColor === 'emerald' ? 'border-emerald-500/50' : guide.themeColor === 'amber' ? 'border-amber-500/50' : 'border-purple-500/50'} transition-all group`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${guideTheme.bgAccent} rounded-lg flex items-center justify-center`}>
                      <span className="text-xl">{guide.icon}</span>
                    </div>
                    <div>
                      <div className={`font-semibold text-slate-200 group-hover:${guideTheme.accent} transition-colors`}>
                        {guide.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {guide.subtitle}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-lg">
          <p className="text-amber-300 text-sm text-center">
            ⚠️ 本内容仅供娱乐和教育参考，不构成任何投资建议。股票投资有风险，请理性决策。
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>市相 © 2025 - 新中式金融玄学</p>
        </div>
      </footer>
    </main>
  );
}
