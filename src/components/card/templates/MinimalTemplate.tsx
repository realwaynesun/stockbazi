'use client';

/**
 * Minimal Template - Xiaohongshu Vertical Style (小红书极简竖版)
 */

import type { TemplateProps } from './types';

export function MinimalTemplate({ report, summary, hookSentence }: TemplateProps) {
  return (
    <div
      className="w-[320px] bg-stone-50 rounded-2xl overflow-hidden"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Top whitespace */}
      <div className="h-8" />

      {/* Stock name */}
      <div className="px-8 text-center">
        <h2 className="text-3xl font-bold text-stone-800">{report.stock.name}</h2>
        <p className="text-stone-400 text-sm mt-1">{report.stock.symbol}</p>
      </div>

      {/* Bazi */}
      <div className="px-8 py-8 text-center">
        <p className="text-2xl font-serif text-stone-700 tracking-[0.3em]">
          {report.bazi.string}
        </p>
      </div>

      {/* Hook sentence */}
      <div className="px-8 pb-6">
        <p className="text-lg text-stone-600 text-center leading-relaxed">
          {hookSentence}
        </p>
      </div>

      {/* Keywords */}
      <div className="px-8 pb-6 flex justify-center gap-2">
        {summary.keywords.map((kw, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-stone-200 rounded-full text-sm text-stone-600"
          >
            {kw}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-8 border-t border-stone-200" />

      {/* Footer */}
      <div className="px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400">☯</span>
          <span className="text-sm text-stone-500">市相</span>
        </div>
        <span className="text-xs text-stone-400">仅供娱乐</span>
      </div>

      {/* Bottom whitespace */}
      <div className="h-4" />
    </div>
  );
}
