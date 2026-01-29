'use client';

/**
 * 市相 - Executive Summary Card
 * 一屏结论卡组件 - 报告页顶部的快速概览
 */

import { cn } from '@/lib/utils';
import type { ExecutiveSummary } from '@/lib/interpret/executive-summary';

interface ExecutiveSummaryCardProps {
  /** 一屏结论数据 */
  summary: ExecutiveSummary;
  /** 额外的 CSS 类名 */
  className?: string;
}

// 关键词配色方案（交替使用）
const KEYWORD_COLORS = [
  'bg-purple-900/50 text-purple-300 border-purple-700/50',
  'bg-amber-900/50 text-amber-300 border-amber-700/50',
  'bg-blue-900/50 text-blue-300 border-blue-700/50',
];

export function ExecutiveSummaryCard({ summary, className }: ExecutiveSummaryCardProps) {
  const { keywords, yearTagline, playStyle, riskFlag, meta } = summary;

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-slate-900/80 to-slate-800/50',
        'border border-slate-700/50 rounded-xl',
        'p-4 sm:p-6',
        className
      )}
    >
      {/* 关键词标签 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium border',
              KEYWORD_COLORS[index % KEYWORD_COLORS.length]
            )}
          >
            {keyword}
          </span>
        ))}
      </div>

      {/* 结论列表 */}
      <div className="space-y-3">
        {/* 当年运势 */}
        <div className="flex items-start gap-3">
          <span className="text-lg shrink-0">📅</span>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {yearTagline}
          </p>
        </div>

        {/* 投资风格 */}
        <div className="flex items-start gap-3">
          <span className="text-lg shrink-0">🎯</span>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {playStyle}
          </p>
        </div>

        {/* 风险提示 */}
        <div className="flex items-start gap-3">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-red-300/90 text-sm sm:text-base leading-relaxed">
            {riskFlag}
          </p>
        </div>
      </div>

      {/* 底部信息栏 */}
      <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
        {/* IPO 信息 */}
        <div className="text-xs text-slate-500">
          IPO: {meta.ipoDate} {meta.ipoTime} · {meta.exchange}
        </div>

        {/* 免责标签 */}
        <div className="text-xs text-amber-500/80 font-medium">
          仅供娱乐
        </div>
      </div>
    </div>
  );
}

export default ExecutiveSummaryCard;
