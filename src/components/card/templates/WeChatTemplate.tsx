'use client';

/**
 * WeChat Moments Template - Clean Elegant Style (微信朋友圈)
 * 750x1334 simulated with w-[375px] aspect-[3/4]
 */

import type { TemplateProps } from './types';
import { WUXING_COLORS } from './types';

export function WeChatTemplate({ report, summary, hookSentence, dominantWuxing }: TemplateProps) {
  const wuxing = dominantWuxing || '木';
  const accentColor = WUXING_COLORS[wuxing];

  const pillars = [
    { label: '年柱', value: report.bazi.yearPillar },
    { label: '月柱', value: report.bazi.monthPillar },
    { label: '日柱', value: report.bazi.dayPillar },
    { label: '时柱', value: report.bazi.hourPillar },
  ];

  return (
    <div
      className="w-[375px] aspect-[3/4] rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: `linear-gradient(160deg, #fefefe 0%, #f5f0eb 40%, #ede4da 100%)`,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Subtle top accent */}
      <div className="h-1 opacity-40" style={{ backgroundColor: accentColor }} />

      {/* Header with generous whitespace */}
      <div className="pt-10 px-10 text-center">
        <p className="text-xs text-stone-400 tracking-[0.3em] uppercase mb-3">市相 · 命盘</p>
        <h2 className="text-3xl font-bold text-stone-800">{report.stock.name}</h2>
        <p className="text-sm text-stone-400 mt-1.5">
          {report.stock.symbol} · {report.stock.exchange}
        </p>
      </div>

      {/* Hook sentence - emphasis area */}
      <div className="px-10 pt-8 pb-6">
        <p className="text-xl text-stone-700 text-center leading-relaxed font-medium">
          {hookSentence}
        </p>
      </div>

      {/* Bazi in calligraphy style */}
      <div className="mx-10 py-6 border-y border-stone-200">
        <div className="flex justify-between px-4">
          {pillars.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-[10px] text-stone-400 mb-1.5">{label}</div>
              <div className="text-2xl font-serif text-stone-700">{value[0]}</div>
              <div className="text-2xl font-serif text-stone-500">{value[1]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className="px-10 pt-6 flex justify-center gap-2">
        {summary.keywords.map((kw, i) => (
          <span
            key={i}
            className="px-4 py-1.5 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${accentColor}12`,
              color: accentColor,
            }}
          >
            {kw}
          </span>
        ))}
      </div>

      {/* Year tagline */}
      <div className="px-10 pt-4 text-center">
        <p className="text-sm text-stone-500">{summary.yearTagline}</p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* QR code placeholder area */}
      <div className="mx-10 mb-4 py-4 border border-dashed border-stone-300 rounded-lg text-center">
        <div className="w-14 h-14 mx-auto bg-stone-200 rounded-lg flex items-center justify-center">
          <span className="text-2xl text-stone-400">☯</span>
        </div>
        <p className="text-[10px] text-stone-400 mt-2">扫码查看完整分析</p>
      </div>

      {/* Footer */}
      <div className="px-10 pb-6 flex items-center justify-between">
        <span className="text-xs text-stone-400">
          IPO {report.stock.ipoDate}
        </span>
        <span className="text-[10px] text-stone-400">仅供娱乐，不构成投资建议</span>
      </div>
    </div>
  );
}
