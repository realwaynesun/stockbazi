'use client';

/**
 * Meme Template - Stock Forum Meme Style (股吧玩梗盘)
 */

import { cn } from '@/lib/utils';
import type { TemplateProps } from './types';

const KEYWORD_STYLES = [
  'bg-purple-500/20 text-purple-300 border border-purple-500/50',
  'bg-amber-500/20 text-amber-300 border border-amber-500/50',
  'bg-blue-500/20 text-blue-300 border border-blue-500/50',
];

export function MemeTemplate({ report, summary, hookSentence }: TemplateProps) {
  return (
    <div
      className="w-[360px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-700"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Big title */}
      <div className="px-6 pt-6 pb-4 text-center">
        <h2 className="text-3xl font-black text-white">{report.stock.name}</h2>
        <p className="text-slate-500 text-sm mt-1">{report.stock.symbol}</p>
      </div>

      {/* Hook sentence - prominent */}
      <div className="px-6 py-4 bg-amber-500/10 border-y border-amber-500/30">
        <p className="text-xl font-bold text-amber-400 text-center leading-snug">
          「{hookSentence}」
        </p>
      </div>

      {/* Keywords - large tags */}
      <div className="px-6 py-5 flex justify-center gap-3">
        {summary.keywords.map((kw, i) => (
          <span
            key={i}
            className={cn('px-4 py-2 rounded-lg text-base font-bold', KEYWORD_STYLES[i])}
          >
            {kw}
          </span>
        ))}
      </div>

      {/* Bazi - simplified */}
      <div className="px-6 py-3 text-center">
        <span className="text-2xl font-bold text-slate-300 tracking-widest">
          {report.bazi.string}
        </span>
      </div>

      {/* Year tagline + risk */}
      <div className="px-6 py-4">
        <p className="text-center text-slate-400">{summary.yearTagline}</p>
        <p className="text-center text-red-400/80 text-sm mt-2">⚠️ {summary.riskFlag}</p>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>☯</span>
          <span className="text-slate-400">市相</span>
        </div>
        <span className="text-xs text-slate-600">仅供娱乐，不构成建议</span>
      </div>
    </div>
  );
}
