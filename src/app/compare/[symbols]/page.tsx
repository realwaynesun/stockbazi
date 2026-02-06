/**
 * Compare Two Stocks - Side-by-side Bazi analysis
 * URL format: /compare/AAPL-vs-TSLA
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchStockInfo, inferExchange, normalizeSymbol, validateSymbol } from '@/lib/stock/fetcher';
import { calculateBazi } from '@/lib/bazi/calculator';
import { calculateDaYun } from '@/lib/bazi/dayun';
import { calculateWuXingStrength } from '@/lib/bazi/wuxing';
import { generateAnalysisReport, type AnalysisReport } from '@/lib/interpret/generator';
import {
  deriveExecutiveSummary,
  generateHookSentence,
  type ExecutiveSummary,
} from '@/lib/interpret/executive-summary';
import { WUXING_SHENG, WUXING_KE } from '@/lib/bazi/constants';
import type { WuXing } from '@/lib/bazi/types';
import { CompareView } from './CompareView';

interface PageProps {
  params: Promise<{ symbols: string }>;
}

interface StockAnalysis {
  report: AnalysisReport;
  summary: ExecutiveSummary;
  hookSentence: string;
}

async function analyzeStock(rawSymbol: string): Promise<StockAnalysis | null> {
  try {
    const symbol = normalizeSymbol(rawSymbol);
    if (!validateSymbol(symbol)) return null;

    const exchange = inferExchange(symbol);
    if (!exchange) return null;

    const fetchResult = await fetchStockInfo(symbol, exchange);
    if (!fetchResult.success || !fetchResult.data) return null;

    const stockInfo = fetchResult.data;
    if (!stockInfo.ipoDate) return null;

    const ipoDateStr = formatDateString(stockInfo.ipoDate);
    const baziResult = calculateBazi({
      date: ipoDateStr,
      time: stockInfo.ipoTime,
      timezone: stockInfo.timezone,
    });

    const ipoYear = stockInfo.ipoDate.getFullYear();
    const daYunResult = calculateDaYun(baziResult, ipoYear);
    const wuxingStrength = calculateWuXingStrength(baziResult.bazi);
    const report = generateAnalysisReport(stockInfo, baziResult, wuxingStrength, daYunResult);
    const summary = deriveExecutiveSummary(report);
    const hookSentence = generateHookSentence(summary, {
      name: report.stock.name,
      symbol: report.stock.symbol,
    });

    return { report, summary, hookSentence };
  } catch {
    return null;
  }
}

function formatDateString(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCompatibility(a: WuXing, b: WuXing): { type: string; label: string; desc: string } {
  if (a === b) {
    return { type: 'neutral', label: '比和', desc: `${a}与${b}同行，能量共振，竞争中有默契` };
  }
  if (WUXING_SHENG[a] === b) {
    return { type: 'supportive', label: `${a}生${b}`, desc: `${a}生${b}，前者为后者提供能量与支撑` };
  }
  if (WUXING_SHENG[b] === a) {
    return { type: 'supportive', label: `${b}生${a}`, desc: `${b}生${a}，后者为前者提供能量与支撑` };
  }
  if (WUXING_KE[a] === b) {
    return { type: 'conflicting', label: `${a}克${b}`, desc: `${a}克${b}，前者对后者形成压制与挑战` };
  }
  if (WUXING_KE[b] === a) {
    return { type: 'conflicting', label: `${b}克${a}`, desc: `${b}克${a}，后者对前者形成压制与挑战` };
  }
  return { type: 'neutral', label: '无直接关系', desc: '两者五行无直接生克关系' };
}

export default async function ComparePage({ params }: PageProps) {
  const { symbols } = await params;
  const parts = decodeURIComponent(symbols).split('-vs-');

  if (parts.length !== 2) notFound();

  const [symbolA, symbolB] = parts;
  const [analysisA, analysisB] = await Promise.all([
    analyzeStock(symbolA),
    analyzeStock(symbolB),
  ]);

  if (!analysisA || !analysisB) notFound();

  const dominantA = analysisA.report.wuxing.strength.dominant;
  const dominantB = analysisB.report.wuxing.strength.dominant;
  const compatibility = getCompatibility(dominantA, dominantB);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span className="text-2xl">☯</span>
              <span className="font-bold">市相</span>
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-sm">双股对比</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <CompareView
          analysisA={analysisA}
          analysisB={analysisB}
          compatibility={compatibility}
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>市相 © 2025 - 新中式金融玄学 · 仅供娱乐，不构成投资建议</p>
        </div>
      </footer>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { symbols } = await params;
  const parts = decodeURIComponent(symbols).split('-vs-');
  const title = parts.length === 2
    ? `${parts[0].toUpperCase()} vs ${parts[1].toUpperCase()} 八字对比`
    : '股票对比';

  return {
    title: `${title} - 市相`,
    description: '两只股票的八字命盘对比分析',
  };
}
