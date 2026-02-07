'use client';

/**
 * 市相 - Guide Page Visualizations
 * 指南页可视化组件 - 根据 slug 渲染对应的图表
 */

import { BaziChart } from '@/components/bazi/BaziChart';
import { WuxingRadar, WuxingBars } from '@/components/bazi/WuxingRadar';
import { DayunTimeline } from '@/components/report/DayunTimeline';
import type { AnalysisReport } from '@/lib/interpret/generator';
import type { GuideSlug } from '@/lib/guide/content';

interface GuideVisualizationsProps {
  slug: GuideSlug;
  report: AnalysisReport;
}

export function GuideVisualizations({ slug, report }: GuideVisualizationsProps) {
  switch (slug) {
    case 'bazi':
      return <BaziVisualization report={report} />;
    case 'wuxing':
      return <WuxingVisualization report={report} />;
    case 'dayun':
      return <DayunVisualization report={report} />;
  }
}

function BaziVisualization({ report }: { report: AnalysisReport }) {
  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-slate-500 mb-2">
        {report.stock.name} ({report.stock.symbol}) · IPO {report.stock.ipoDate}
      </div>
      <BaziChart
        bazi={{
          yearPillar: {
            gan: report.bazi.yearPillar[0] as any,
            zhi: report.bazi.yearPillar[1] as any,
            ganWuxing: '木' as any,
            zhiWuxing: '土' as any,
          },
          monthPillar: {
            gan: report.bazi.monthPillar[0] as any,
            zhi: report.bazi.monthPillar[1] as any,
            ganWuxing: '火' as any,
            zhiWuxing: '木' as any,
          },
          dayPillar: {
            gan: report.bazi.dayPillar[0] as any,
            zhi: report.bazi.dayPillar[1] as any,
            ganWuxing: '土' as any,
            zhiWuxing: '土' as any,
          },
          hourPillar: {
            gan: report.bazi.hourPillar[0] as any,
            zhi: report.bazi.hourPillar[1] as any,
            ganWuxing: '金' as any,
            zhiWuxing: '金' as any,
          },
        }}
        baziString={report.bazi.string}
      />
      <div className="p-4 bg-slate-800/50 rounded-lg">
        <p className="text-sm text-slate-400">
          <span className="text-slate-300 font-medium">日主：</span>
          {report.bazi.dayPillar[0]} · {report.bazi.yinYang === '阳' ? '阳' : '阴'}命 ·
          格局 {report.shishen.pattern}
        </p>
      </div>
    </div>
  );
}

function WuxingVisualization({ report }: { report: AnalysisReport }) {
  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-slate-500 mb-2">
        {report.stock.name} ({report.stock.symbol}) · 五行分布
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <WuxingRadar strength={report.wuxing.strength} height={280} />
        <WuxingBars strength={report.wuxing.strength} />
      </div>
      <div className="p-4 bg-slate-800/50 rounded-lg">
        <p className="text-sm text-slate-300 leading-relaxed">
          {report.wuxing.summary}
        </p>
      </div>
    </div>
  );
}

function DayunVisualization({ report }: { report: AnalysisReport }) {
  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-slate-500 mb-2">
        {report.stock.name} ({report.stock.symbol}) · 百年大运
      </div>
      <DayunTimeline
        cycles={report.dayun.cycles as any}
        startAge={report.dayun.startAge}
        direction={report.dayun.direction === '顺行' ? 'forward' : 'backward'}
      />
      {report.dayun.current && (
        <div className="p-4 bg-purple-950/30 border border-purple-800/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-300 text-sm">当前大运</span>
            <span className="text-xl font-bold text-amber-400">
              {report.dayun.current.ganZhi}
            </span>
            <span className="text-slate-500 text-sm">
              ({report.dayun.current.startYear} 年起)
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {report.dayun.current.interpretation}
          </p>
        </div>
      )}
    </div>
  );
}
