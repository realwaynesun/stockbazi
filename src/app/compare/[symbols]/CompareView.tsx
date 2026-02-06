'use client';

/**
 * Compare View - Client component for side-by-side stock comparison
 */

import Link from 'next/link';
import type { AnalysisReport } from '@/lib/interpret/generator';
import type { ExecutiveSummary } from '@/lib/interpret/executive-summary';
import { WUXING_COLORS, WUXING_GLOW } from '@/components/card/templates/types';
import { cn } from '@/lib/utils';

interface StockAnalysis {
  report: AnalysisReport;
  summary: ExecutiveSummary;
  hookSentence: string;
}

interface Compatibility {
  type: string;
  label: string;
  desc: string;
}

interface CompareViewProps {
  analysisA: StockAnalysis;
  analysisB: StockAnalysis;
  compatibility: Compatibility;
}

function StockSide({ analysis }: { analysis: StockAnalysis }) {
  const { report, summary, hookSentence } = analysis;
  const dominant = report.wuxing.strength.dominant;
  const color = WUXING_COLORS[dominant];

  return (
    <div className="flex-1 min-w-0">
      {/* Stock name */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white truncate">{report.stock.name}</h2>
        <p className="text-sm text-slate-400">{report.stock.symbol} · {report.stock.exchange}</p>
      </div>

      {/* Bazi string */}
      <div className="text-center mb-4 py-3 bg-slate-800/50 rounded-lg">
        <p className="text-lg font-mono text-slate-200 tracking-wider">{report.bazi.string}</p>
      </div>

      {/* Hook sentence */}
      <p className="text-sm text-amber-400 text-center mb-4 leading-relaxed min-h-[3rem]">
        {hookSentence}
      </p>

      {/* Keywords */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-4">
        {summary.keywords.map((kw, i) => (
          <span
            key={i}
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {kw}
          </span>
        ))}
      </div>

      {/* Dominant wuxing */}
      <div className="text-center mb-3">
        <span
          className="inline-block px-4 py-2 rounded-lg text-lg font-bold"
          style={{
            backgroundColor: `${color}15`,
            color,
            boxShadow: WUXING_GLOW[dominant],
          }}
        >
          {dominant}行主导
        </span>
      </div>

      {/* Year tagline */}
      <p className="text-xs text-slate-400 text-center mb-2">{summary.yearTagline}</p>

      {/* Risk flag */}
      <p className="text-xs text-red-400/80 text-center">⚠️ {summary.riskFlag}</p>

      {/* Link to full analysis */}
      <div className="mt-4 text-center">
        <Link
          href={`/stock/${report.stock.symbol}`}
          className="text-xs text-amber-500/80 hover:text-amber-400 transition-colors"
        >
          查看完整分析 →
        </Link>
      </div>
    </div>
  );
}

export function CompareView({ analysisA, analysisB, compatibility }: CompareViewProps) {
  const typeStyles: Record<string, string> = {
    neutral: 'bg-blue-900/30 border-blue-700/50 text-blue-300',
    supportive: 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300',
    conflicting: 'bg-red-900/30 border-red-700/50 text-red-300',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">
          {analysisA.report.stock.name}
          <span className="text-slate-500 mx-3">VS</span>
          {analysisB.report.stock.name}
        </h1>
        <p className="text-slate-500 text-sm mt-2">八字命盘对比分析</p>
      </div>

      {/* Side-by-side comparison */}
      <div className="flex gap-6">
        <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
          <StockSide analysis={analysisA} />
        </div>
        <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
          <StockSide analysis={analysisB} />
        </div>
      </div>

      {/* Compatibility analysis */}
      <div className={cn('rounded-xl p-6 border text-center', typeStyles[compatibility.type])}>
        <div className="text-xs uppercase tracking-wider opacity-70 mb-2">五行合盘</div>
        <div className="text-2xl font-bold mb-2">{compatibility.label}</div>
        <p className="text-sm opacity-90 max-w-md mx-auto">{compatibility.desc}</p>
      </div>

      {/* Branding + disclaimer */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">☯</span>
          <span className="text-slate-400 font-medium">市相</span>
        </div>
        <p className="text-xs text-slate-600">仅供娱乐，不构成投资建议</p>
      </div>
    </div>
  );
}
