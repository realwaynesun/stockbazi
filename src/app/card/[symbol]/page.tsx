/**
 * 市相 (ShiXiang) - Share Card Page
 * 股票八字分享卡片页面
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShareCard } from '@/components/card/ShareCard';
import { fetchStockInfo, inferExchange, normalizeSymbol, validateSymbol } from '@/lib/stock/fetcher';
import { calculateBazi } from '@/lib/bazi/calculator';
import { calculateDaYun } from '@/lib/bazi/dayun';
import { calculateWuXingStrength } from '@/lib/bazi/wuxing';
import { generateAnalysisReport, type AnalysisReport } from '@/lib/interpret/generator';
import type { IpoTimeInput } from '@/lib/bazi/types';

interface PageProps {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ time?: string }>;
}

function formatDateString(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 验证时间格式 (HH:MM)
 */
function isValidTime(time?: string): boolean {
  if (!time) return false;
  return /^([01]?\d|2[0-3]):([0-5]\d)$/.test(time);
}

async function getStockReport(
  rawSymbol: string,
  customTime?: string
): Promise<AnalysisReport | null> {
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
    if (!fetchResult.success || !fetchResult.data || !fetchResult.data.ipoDate) {
      return null;
    }

    const stockInfo = fetchResult.data;
    const usedTime = isValidTime(customTime) ? customTime! : stockInfo.ipoTime;

    const ipoInput: IpoTimeInput = {
      date: formatDateString(stockInfo.ipoDate),
      time: usedTime,
      timezone: stockInfo.timezone,
    };

    const baziResult = calculateBazi(ipoInput);
    const ipoYear = stockInfo.ipoDate!.getFullYear();
    const daYunResult = calculateDaYun(baziResult, ipoYear);
    const wuxingStrength = calculateWuXingStrength(baziResult.bazi);

    // 更新 stockInfo 中的 ipoTime 以反映实际使用的时间
    const updatedStockInfo = { ...stockInfo, ipoTime: usedTime };

    return generateAnalysisReport(
      updatedStockInfo,
      baziResult,
      wuxingStrength,
      daYunResult
    );
  } catch (error) {
    console.error('Error generating report:', error);
    return null;
  }
}

export default async function CardPage({ params, searchParams }: PageProps) {
  const { symbol } = await params;
  const { time: customTime } = await searchParams;
  const report = await getStockReport(symbol, customTime);

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
              <span className="font-bold">市相</span>
            </Link>
            <Link
              href={`/stock/${symbol}`}
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              查看完整报告 →
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              {report.stock.name} 八字卡片
            </h1>
            <p className="text-slate-400 text-sm">
              保存图片分享到小红书、微信等平台
            </p>
          </div>

          {/* Card */}
          <ShareCard report={report} />

          {/* Tips */}
          <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2">分享提示</h3>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• 点击「保存图片」下载高清卡片</li>
              <li>• 图片尺寸适合小红书竖版帖子</li>
              <li>• 可配合 #股票八字 #市相 等话题发布</li>
              <li>• 记得添加免责声明：仅供娱乐</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>🔮 仅供娱乐，不构成投资建议</p>
          <p className="mt-2">市相 © 2025 - 新中式金融玄学</p>
        </div>
      </footer>
    </main>
  );
}
