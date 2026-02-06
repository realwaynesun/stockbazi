'use client';

/**
 * Classic Template - New Chinese Serious Style (新中式严肃盘)
 */

import type { TemplateProps } from './types';
import { WUXING_COLORS } from './types';

export function ClassicTemplate({ report, summary, hookSentence, dominantWuxing }: TemplateProps) {
  const pillars = [
    { label: '年柱', value: report.bazi.yearPillar },
    { label: '月柱', value: report.bazi.monthPillar },
    { label: '日柱', value: report.bazi.dayPillar },
    { label: '时柱', value: report.bazi.hourPillar },
  ];

  return (
    <div
      className="w-[360px] bg-slate-900 rounded-2xl overflow-hidden"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Top gradient accent */}
      <div
        className="h-2"
        style={{
          background: `linear-gradient(to right, ${WUXING_COLORS[dominantWuxing || '木']}40, transparent)`,
        }}
      />

      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{report.stock.name}</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {report.stock.symbol} · {report.stock.exchange}
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>IPO {report.stock.ipoDate}</div>
            <div>{report.stock.ipoTime}</div>
          </div>
        </div>
        <p className="mt-3 text-amber-400 text-sm font-medium">{hookSentence}</p>
      </div>

      {/* Bazi pillars */}
      <div className="px-6 py-4 bg-slate-800/50">
        <div className="flex justify-between">
          {pillars.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-xs text-slate-500 mb-1">{label}</div>
              <div className="text-xl font-bold text-amber-400">{value[0]}</div>
              <div className="text-xl font-bold text-slate-300">{value[1]}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-sm text-slate-400 font-mono">
          {report.bazi.string}
        </div>
      </div>

      {/* Keywords */}
      <div className="px-6 py-4">
        <div className="flex gap-2">
          {summary.keywords.map((kw, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300"
            >
              {kw}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-400">{summary.yearTagline}</p>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">☯</span>
          <span className="text-sm text-slate-300">市相</span>
        </div>
        <span className="text-xs text-slate-600">仅供娱乐</span>
      </div>
    </div>
  );
}
