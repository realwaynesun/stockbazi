/**
 * StockBazi - Stock Analysis Page
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
 * 获取股票分析数据
 */
async function getStockAnalysis(rawSymbol: string): Promise<AnalysisReport | null> {
  try {
    const symbol = normalizeSymbol(rawSymbol);
    if (!validateSymbol(symbol)) {
      return null;
    }

    const exchange = inferExchange(symbol);
    if (!exchange) {
      return null;
    }

    const fetchResult = await fetchStockInfo(symbol, exchange);
    if (!fetchResult.success || !fetchResult.data) {
      return null;
    }

    const stockInfo = fetchResult.data;

    const ipoInput: IpoTimeInput = {
      date: formatDateString(stockInfo.ipoDate),
      time: stockInfo.ipoTime,
      timezone: stockInfo.timezone,
    };

    const baziResult = calculateBazi(ipoInput);
    const ipoYear = stockInfo.ipoDate.getFullYear();
    const daYunResult = calculateDaYun(baziResult, ipoYear);
    const wuxingStrength = calculateWuXingStrength(baziResult.bazi);

    return generateAnalysisReport(
      stockInfo,
      baziResult,
      wuxingStrength,
      daYunResult
    );
  } catch (error) {
    console.error('Error analyzing stock:', error);
    return null;
  }
}

function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params;
  const report = await getStockAnalysis(symbol);

  if (!report) {
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
              <span className="font-bold hidden sm:inline">StockBazi</span>
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
        <ReportView report={report} />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>StockBazi © 2024 - 新中式金融玄学</p>
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
    title: `${symbol.toUpperCase()} 八字分析 - StockBazi`,
    description: `${symbol.toUpperCase()} 股票的四柱八字、五行、大运分析报告`,
  };
}
