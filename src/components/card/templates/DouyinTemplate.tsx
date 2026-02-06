'use client';

/**
 * Douyin Template - Vertical Short Video Style (抖音竖版)
 * 1080x1920 simulated with w-[360px] aspect-[9/16]
 */

import type { TemplateProps } from './types';
import { WUXING_COLORS, WUXING_GLOW } from './types';

export function DouyinTemplate({ report, summary, hookSentence, dominantWuxing }: TemplateProps) {
  const wuxing = dominantWuxing || '木';
  const color = WUXING_COLORS[wuxing];
  const glow = WUXING_GLOW[wuxing];

  const pillars = [
    { label: '年', value: report.bazi.yearPillar },
    { label: '月', value: report.bazi.monthPillar },
    { label: '日', value: report.bazi.dayPillar },
    { label: '时', value: report.bazi.hourPillar },
  ];

  return (
    <div
      className="w-[360px] aspect-[9/16] rounded-2xl overflow-hidden relative flex flex-col"
      style={{
        background: `linear-gradient(180deg, #0a0a1a 0%, #111133 50%, #0a0a1a 100%)`,
        boxShadow: glow,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top glow bar */}
      <div className="h-1.5" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />

      {/* Stock name - large and bold at top */}
      <div className="pt-10 pb-4 text-center">
        <h2 className="text-4xl font-black text-white tracking-wide">{report.stock.name}</h2>
        <p className="text-sm mt-2" style={{ color }}>{report.stock.symbol} · {report.stock.exchange}</p>
      </div>

      {/* Bazi string - decorative */}
      <div className="py-6 text-center">
        <div className="flex justify-center gap-6">
          {pillars.map(({ label, value }) => (
            <div key={label} className="text-center animate-pillar-reveal">
              <div className="text-xs text-slate-500 mb-2">{label}</div>
              <div className="text-3xl font-bold" style={{ color }}>{value[0]}</div>
              <div className="text-3xl font-bold text-slate-200">{value[1]}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-base text-slate-400 font-mono tracking-[0.4em]">
          {report.bazi.string}
        </p>
      </div>

      {/* Giant keywords - centered hero area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {summary.keywords.map((kw, i) => (
            <span
              key={i}
              className="px-5 py-2.5 rounded-full text-lg font-bold border"
              style={{
                borderColor: `${color}60`,
                color,
                backgroundColor: `${color}15`,
              }}
            >
              {kw}
            </span>
          ))}
        </div>

        {/* Hook sentence - the hero text */}
        <p
          className="text-2xl font-bold text-center leading-relaxed"
          style={{ color }}
        >
          「{hookSentence}」
        </p>

        {/* Year tagline */}
        <p className="mt-6 text-sm text-slate-400 text-center">
          {summary.yearTagline}
        </p>
      </div>

      {/* Bottom branding + disclaimer */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">☯</span>
          <span className="text-base font-bold text-white">市相</span>
        </div>
        <span className="text-xs text-slate-600">仅供娱乐，不构成投资建议</span>
      </div>

      {/* Bottom glow bar */}
      <div className="h-1" style={{ background: `linear-gradient(to right, transparent, ${color}40, transparent)` }} />
    </div>
  );
}
