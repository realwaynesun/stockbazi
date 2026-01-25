'use client';

/**
 * 市相 - Report View Component
 * 完整分析报告视图组件
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaziChart } from '@/components/bazi/BaziChart';
import { WuxingRadar, WuxingBars } from '@/components/bazi/WuxingRadar';
import { DayunTimeline } from './DayunTimeline';
import type { AnalysisReport } from '@/lib/interpret/generator';
import { cn } from '@/lib/utils';

interface ReportViewProps {
  /** 分析报告数据 */
  report: AnalysisReport;
  /** 额外的 CSS 类名 */
  className?: string;
}

export function ReportView({ report, className }: ReportViewProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* 股票基本信息 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <span className="text-2xl text-amber-400">{report.stock.name}</span>
              <span className="ml-2 text-lg text-slate-400">{report.stock.symbol}</span>
            </div>
            <span className="text-sm text-slate-500">{report.stock.exchange}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div>
              <span className="text-slate-500">IPO 日期：</span>
              <span>{report.stock.ipoDate}</span>
            </div>
            <div>
              <span className="text-slate-500">IPO 时间：</span>
              <span>{report.stock.ipoTime}</span>
            </div>
            <div>
              <span className="text-slate-500">阴阳：</span>
              <span className={report.bazi.yinYang === '阳' ? 'text-amber-400' : 'text-purple-400'}>
                {report.bazi.yinYang}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 八字排盘 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">八字排盘</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* 五行分析 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">五行分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <WuxingRadar strength={report.wuxing.strength} height={280} />
            <div className="space-y-4">
              <WuxingBars strength={report.wuxing.strength} />
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {report.wuxing.summary}
                </p>
              </div>
              {report.wuxing.dominantIndustries.length > 0 && (
                <div>
                  <div className="text-xs text-slate-500 mb-2">关联行业</div>
                  <div className="flex flex-wrap gap-2">
                    {report.wuxing.dominantIndustries.slice(0, 5).map((industry) => (
                      <span
                        key={industry}
                        className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 十神格局 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">十神格局</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-purple-900/50 rounded-lg">
              <span className="text-purple-300">格局</span>
              <span className="ml-2 text-xl font-bold text-amber-400">
                {report.shishen.pattern}
              </span>
            </div>
            <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">主导十神</span>
              <span className="ml-2 text-xl font-bold text-slate-200">
                {report.shishen.dominantShiShen}
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-slate-300 text-sm leading-relaxed">
              {report.shishen.patternInterpretation}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-lg">
              <div className="text-emerald-400 text-sm font-medium mb-2">✓ 正面特征</div>
              <p className="text-slate-300 text-sm">{report.shishen.dominantInterpretation.positive}</p>
            </div>
            <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-lg">
              <div className="text-red-400 text-sm font-medium mb-2">✗ 风险因素</div>
              <p className="text-slate-300 text-sm">{report.shishen.dominantInterpretation.negative}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 大运流年 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">大运流年</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DayunTimeline
            cycles={report.dayun.cycles as any}
            startAge={report.dayun.startAge}
            direction={report.dayun.direction === '顺行' ? 'forward' : 'backward'}
          />

          {report.dayun.current && (
            <div className="p-4 bg-purple-950/30 border border-purple-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-purple-300">当前大运</span>
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

          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-slate-400">{report.liuNian.year} 流年</span>
              <span className="text-lg font-bold text-slate-200">
                {report.liuNian.ganZhi}
              </span>
              <span className="text-sm text-purple-400">
                {report.liuNian.shishen}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {report.liuNian.interpretation}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 投资建议 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">综合分析</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-500 text-sm mb-1">投资风格</div>
              <div className="text-lg text-slate-200">{report.summary.investmentStyle}</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-slate-500 text-sm mb-1">风险等级</div>
              <div
                className={cn(
                  'text-lg font-medium',
                  report.summary.riskLevel === '低风险'
                    ? 'text-emerald-400'
                    : report.summary.riskLevel === '高风险'
                    ? 'text-red-400'
                    : 'text-amber-400'
                )}
              >
                {report.summary.riskLevel}
              </div>
            </div>
          </div>

          <div>
            <div className="text-slate-500 text-sm mb-2">关键因素</div>
            <div className="flex flex-wrap gap-2">
              {report.summary.keyFactors.map((factor, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 免责声明 */}
      <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-lg">
        <p className="text-amber-300 text-sm text-center">
          {report.summary.disclaimer}
        </p>
      </div>

      {/* 生成时间 */}
      <div className="text-center text-xs text-slate-600">
        报告生成于 {new Date(report.generatedAt).toLocaleString('zh-CN')}
      </div>
    </div>
  );
}

export default ReportView;
