/**
 * 市相 (ShiXiang) - Stock Analysis Page
 * 股票八字分析页面
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ReportView } from '@/components/report/ReportView';
import { SearchBar } from '@/components/stock/SearchBar';
import { fetchStockInfo, inferExchange, normalizeSymbol, validateSymbol } from '@/lib/stock/fetcher';
import { calculateBazi } from '@/lib/bazi/calculator';
import { calculateDaYun } from '@/lib/bazi/dayun';
import { calculateWuXingStrength } from '@/lib/bazi/wuxing';
import { generateAnalysisReport, type AnalysisReport } from '@/lib/interpret/generator';
import type { IpoTimeInput } from '@/lib/bazi/types';

interface PageProps {
  params: Promise<{ symbol: string }>;
}

/**
 * 股票分析结果
 */
interface StockAnalysisResult {
  report: AnalysisReport | null;
  stockInfo: Awaited<ReturnType<typeof fetchStockInfo>>['data'] | null;
  noIpoData: boolean;
}

/**
 * 获取股票分析数据
 */
async function getStockAnalysis(rawSymbol: string): Promise<StockAnalysisResult> {
  try {
    const symbol = normalizeSymbol(rawSymbol);
    if (!validateSymbol(symbol)) {
      return { report: null, stockInfo: null, noIpoData: false };
    }

    const exchange = inferExchange(symbol);
    if (!exchange) {
      return { report: null, stockInfo: null, noIpoData: false };
    }

    const fetchResult = await fetchStockInfo(symbol, exchange);
    if (!fetchResult.success || !fetchResult.data) {
      return { report: null, stockInfo: null, noIpoData: false };
    }

    const stockInfo = fetchResult.data;

    // 如果没有 IPO 日期，返回股票信息但标记无数据
    if (!stockInfo.ipoDate) {
      return { report: null, stockInfo, noIpoData: true };
    }

    const ipoInput: IpoTimeInput = {
      date: formatDateString(stockInfo.ipoDate),
      time: stockInfo.ipoTime,
      timezone: stockInfo.timezone,
    };

    const baziResult = calculateBazi(ipoInput);
    const ipoYear = stockInfo.ipoDate.getFullYear();
    const daYunResult = calculateDaYun(baziResult, ipoYear);
    const wuxingStrength = calculateWuXingStrength(baziResult.bazi);

    const report = generateAnalysisReport(
      stockInfo,
      baziResult,
      wuxingStrength,
      daYunResult
    );

    return { report, stockInfo, noIpoData: false };
  } catch (error) {
    console.error('Error analyzing stock:', error);
    return { report: null, stockInfo: null, noIpoData: false };
  }
}

function formatDateString(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params;
  const { report, stockInfo, noIpoData } = await getStockAnalysis(symbol);

  if (!report && !noIpoData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
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
        {/* 生成卡片按钮 */}
        {report && (
          <div className="max-w-3xl mx-auto mb-6 flex justify-end">
            <Link
              href={`/card/${symbol}`}
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
 * 生成页面元数据
 */
export async function generateMetadata({ params }: PageProps) {
  const { symbol } = await params;
  return {
    title: `${symbol.toUpperCase()} 八字分析 - 市相`,
    description: `${symbol.toUpperCase()} 股票的四柱八字、五行、大运分析报告`,
  };
}
