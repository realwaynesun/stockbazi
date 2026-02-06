/**
 * 市相 (ShiXiang) - Stock Analysis Page
 * 股票八字分析页面
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ReportView } from '@/components/report/ReportView';
import { SearchBar } from '@/components/stock/SearchBar';
import { IpoTimeSelector } from '@/components/stock/IpoTimeSelector';
import { fetchStockInfo, inferExchange, normalizeSymbol, validateSymbol } from '@/lib/stock/fetcher';
import { calculateBazi } from '@/lib/bazi/calculator';
import { calculateDaYun } from '@/lib/bazi/dayun';
import { calculateWuXingStrength } from '@/lib/bazi/wuxing';
import { generateAnalysisReport, type AnalysisReport } from '@/lib/interpret/generator';
import { formatDateString } from '@/lib/utils';
import type { IpoTimeInput } from '@/lib/bazi/types';

interface PageProps {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ time?: string }>;
}

/**
 * 股票分析结果
 */
interface StockAnalysisResult {
  report: AnalysisReport | null;
  stockInfo: Awaited<ReturnType<typeof fetchStockInfo>>['data'] | null;
  noIpoData: boolean;
  /** 实际使用的 IPO 时间 */
  usedTime: string;
  /** 默认 IPO 时间（交易所开盘时间） */
  defaultTime: string;
}

/**
 * 获取股票分析数据
 * @param rawSymbol - 股票代码
 * @param customTime - 自定义 IPO 时间（可选，格式 HH:MM）
 */
async function getStockAnalysis(
  rawSymbol: string,
  customTime?: string
): Promise<StockAnalysisResult> {
  const emptyResult: StockAnalysisResult = {
    report: null,
    stockInfo: null,
    noIpoData: false,
    usedTime: '09:30',
    defaultTime: '09:30',
  };

  try {
    const symbol = normalizeSymbol(rawSymbol);
    if (!validateSymbol(symbol)) {
      return emptyResult;
    }

    const exchange = inferExchange(symbol);
    if (!exchange) {
      return emptyResult;
    }

    const fetchResult = await fetchStockInfo(symbol, exchange);
    if (!fetchResult.success || !fetchResult.data) {
      return emptyResult;
    }

    const stockInfo = fetchResult.data;
    const defaultTime = stockInfo.ipoTime;

    // 如果没有 IPO 日期，返回股票信息但标记无数据
    if (!stockInfo.ipoDate) {
      return {
        report: null,
        stockInfo,
        noIpoData: true,
        usedTime: defaultTime,
        defaultTime,
      };
    }

    // 使用自定义时间或默认时间
    const usedTime = isValidTime(customTime) ? customTime! : defaultTime;

    const ipoInput: IpoTimeInput = {
      date: formatDateString(stockInfo.ipoDate),
      time: usedTime,
      timezone: stockInfo.timezone,
    };

    const baziResult = calculateBazi(ipoInput);
    const ipoYear = stockInfo.ipoDate.getFullYear();
    const daYunResult = calculateDaYun(baziResult, ipoYear);
    const wuxingStrength = calculateWuXingStrength(baziResult.bazi);

    // 更新 stockInfo 中的 ipoTime 以反映实际使用的时间
    const updatedStockInfo = { ...stockInfo, ipoTime: usedTime };

    const report = generateAnalysisReport(
      updatedStockInfo,
      baziResult,
      wuxingStrength,
      daYunResult
    );

    return {
      report,
      stockInfo: updatedStockInfo,
      noIpoData: false,
      usedTime,
      defaultTime,
    };
  } catch (error) {
    console.error('Error analyzing stock:', error);
    return emptyResult;
  }
}

/**
 * 验证时间格式 (HH:MM)
 */
function isValidTime(time?: string): boolean {
  if (!time) return false;
  return /^([01]?\d|2[0-3]):([0-5]\d)$/.test(time);
}


export default async function StockPage({ params, searchParams }: PageProps) {
  const { symbol } = await params;
  const { time: customTime } = await searchParams;
  const { report, stockInfo, noIpoData, usedTime, defaultTime } = await getStockAnalysis(
    symbol,
    customTime
  );

  if (!report && !noIpoData) {
    notFound();
  }

  const isCustomTime = usedTime !== defaultTime;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* JSON-LD structured data */}
      {stockInfo && (
        <StockJsonLd symbol={stockInfo.symbol} name={stockInfo.name} />
      )}

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
              <SearchBar
                defaultValue={symbol}
                placeholder="搜索其他股票..."
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* 工具栏：时间选择器 + 生成卡片按钮 */}
        {report && (
          <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between gap-4">
            {/* IPO 时间选择器 */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">IPO 时辰</span>
              <IpoTimeSelector
                currentTime={usedTime}
                defaultTime={defaultTime}
              />
              {isCustomTime && (
                <span className="text-xs text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded">
                  自定义时辰
                </span>
              )}
            </div>

            {/* 生成卡片按钮 */}
            <Link
              href={`/card/${symbol}${customTime ? `?time=${customTime}` : ''}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              生成分享卡片
            </Link>
          </div>
        )}

        {noIpoData && stockInfo ? (
          <div className="max-w-2xl mx-auto">
            {/* Stock Info Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{stockInfo.name}</h1>
                  <p className="text-slate-400">{stockInfo.symbol} · {stockInfo.exchange}</p>
                </div>
              </div>
              {stockInfo.price && (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">
                    {stockInfo.currency === 'CNY' ? '¥' : stockInfo.currency === 'HKD' ? 'HK$' : '$'}
                    {stockInfo.price.toFixed(2)}
                  </span>
                  {stockInfo.change !== undefined && (
                    <span className={`text-lg ${stockInfo.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stockInfo.change >= 0 ? '+' : ''}{stockInfo.change.toFixed(2)}
                      ({stockInfo.changePct?.toFixed(2)}%)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* No IPO Data Warning */}
            <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔮</span>
              </div>
              <h2 className="text-xl font-bold text-amber-400 mb-2">暂无上市日期数据</h2>
              <p className="text-slate-400 mb-4">
                无法获取该股票的准确上市日期，因此无法进行八字分析。
              </p>
              <p className="text-slate-500 text-sm">
                这通常发生在较早上市的股票，历史数据可能不完整。
              </p>
            </div>
          </div>
        ) : report ? (
          <ReportView report={report} />
        ) : null}
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

/**
 * JSON-LD 结构化数据
 */
function StockJsonLd({ symbol, name }: { symbol: string; name: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shixiang.app';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${name} (${symbol}) 八字分析`,
    description: `${name} 股票的四柱八字、五行、大运分析报告`,
    url: `${siteUrl}/stock/${symbol}`,
    publisher: {
      '@type': 'Organization',
      name: '市相',
    },
    about: {
      '@type': 'FinancialProduct',
      name: `${name} (${symbol})`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * 生成页面元数据
 */
export async function generateMetadata({ params }: PageProps) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shixiang.app';

  return {
    title: `${upperSymbol} 八字分析`,
    description: `${upperSymbol} 股票的四柱八字、五行、十神、大运分析报告 - 市相新中式金融玄学`,
    openGraph: {
      title: `${upperSymbol} 八字分析 | 市相`,
      description: `用八字解读 ${upperSymbol} 的命理与运势`,
      url: `${siteUrl}/stock/${symbol}`,
      siteName: '市相',
      locale: 'zh_CN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${upperSymbol} 八字分析 | 市相`,
      description: `用八字解读 ${upperSymbol} 的命理与运势`,
    },
    alternates: {
      canonical: `${siteUrl}/stock/${symbol}`,
    },
  };
}
