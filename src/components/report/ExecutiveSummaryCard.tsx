'use client';

/**
 * Executive Summary Card
 * Top-of-report quick overview with wuxing glow and hook sentence
 */

import { cn } from '@/lib/utils';
import type { ExecutiveSummary } from '@/lib/interpret/executive-summary';
import { WUXING_GLOW } from '@/components/card/templates/types';

interface ExecutiveSummaryCardProps {
  summary: ExecutiveSummary;
  hookSentence?: string;
  stockName?: string;
  stockSymbol?: string;
  dominantWuxing?: string;
  className?: string;
}

const KEYWORD_COLORS = [
  'bg-purple-900/50 text-purple-300 border-purple-700/50',
  'bg-amber-900/50 text-amber-300 border-amber-700/50',
  'bg-blue-900/50 text-blue-300 border-blue-700/50',
];

export function ExecutiveSummaryCard({
  summary,
  hookSentence,
  stockName,
  stockSymbol,
  dominantWuxing,
  className,
}: ExecutiveSummaryCardProps) {
  const { keywords, yearTagline, playStyle, riskFlag, meta } = summary;
  const glowStyle = dominantWuxing ? WUXING_GLOW[dominantWuxing] : undefined;

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-slate-900/80 to-slate-800/50',
        'border border-slate-700/50 rounded-xl',
        'p-4 sm:p-6',
        'animate-fade-in',
        glowStyle && 'animate-glow-pulse',
        className
      )}
      style={glowStyle ? {
        '--glow-color': glowStyle,
        '--glow-color-intense': glowStyle.replace('0.3)', '0.6)'),
      } as React.CSSProperties : undefined}
    >
      {/* Stock identity */}
      {(stockName || stockSymbol) && (
        <div className="mb-3">
          {stockName && (
            <h3 className="text-lg font-bold text-white">{stockName}</h3>
          )}
          {stockSymbol && (
            <p className="text-xs text-slate-400">{stockSymbol}</p>
          )}
        </div>
      )}

      {/* Hook sentence - bold at top */}
      {hookSentence && (
        <p className="text-amber-400 font-bold text-base sm:text-lg mb-4 leading-snug">
          {hookSentence}
        </p>
      )}

      {/* Keyword tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {keywords.map((keyword, index) => (
          <span
            key={index}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-sm font-bold border',
              KEYWORD_COLORS[index % KEYWORD_COLORS.length]
            )}
          >
            {keyword}
          </span>
        ))}
      </div>

      {/* Summary list */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-lg shrink-0">📅</span>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {yearTagline}
          </p>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-lg shrink-0">🎯</span>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {playStyle}
          </p>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-red-300/90 text-sm sm:text-base leading-relaxed">
            {riskFlag}
          </p>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          IPO: {meta.ipoDate} {meta.ipoTime} · {meta.exchange}
        </div>
        <div className="text-xs text-amber-500/80 font-medium">
          仅供娱乐
        </div>
      </div>
    </div>
  );
}

export default ExecutiveSummaryCard;
