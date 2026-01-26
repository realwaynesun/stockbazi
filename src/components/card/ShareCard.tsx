'use client';

/**
 * 市相 - 小红书分享卡片组件
 * 用于生成可分享的股票八字卡片图片
 */

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2 } from 'lucide-react';
import type { AnalysisReport } from '@/lib/interpret/generator';
import { cn } from '@/lib/utils';

interface ShareCardProps {
  report: AnalysisReport;
  className?: string;
}

// 五行颜色映射
const WUXING_COLORS: Record<string, string> = {
  木: '#22c55e', // green-500
  火: '#ef4444', // red-500
  土: '#eab308', // yellow-500
  金: '#f8fafc', // slate-50
  水: '#3b82f6', // blue-500
};

// 五行背景渐变
const WUXING_BG: Record<string, string> = {
  木: 'from-green-900/30 to-green-800/10',
  火: 'from-red-900/30 to-red-800/10',
  土: 'from-yellow-900/30 to-yellow-800/10',
  金: 'from-slate-700/30 to-slate-600/10',
  水: 'from-blue-900/30 to-blue-800/10',
};

export function ShareCard({ report, className }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // 获取主导五行
  const getDominantWuxing = () => {
    const { strength } = report.wuxing;
    let max = 0;
    let dominant = '木';
    for (const [key, value] of Object.entries(strength)) {
      if (value > max) {
        max = value;
        dominant = key;
      }
    }
    return dominant;
  };

  const dominantWuxing = getDominantWuxing();

  // 导出为图片
  const handleExport = async () => {
    if (!cardRef.current || isExporting) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0f172a',
      });

      // 下载图片
      const link = document.createElement('a');
      link.download = `市相-${report.stock.name}-${report.stock.symbol}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 卡片预览 */}
      <div
        ref={cardRef}
        className="w-[360px] bg-slate-900 rounded-2xl overflow-hidden"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* 顶部渐变装饰 */}
        <div className={cn(
          'h-2 bg-gradient-to-r',
          WUXING_BG[dominantWuxing]
        )} />

        {/* 头部 - 股票信息 */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {report.stock.name}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {report.stock.symbol} · {report.stock.exchange}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">IPO 日期</div>
              <div className="text-sm text-slate-300">{report.stock.ipoDate}</div>
            </div>
          </div>
        </div>

        {/* 八字排盘 */}
        <div className="px-6 py-4 bg-slate-800/50">
          <div className="text-xs text-slate-500 mb-3">八字排盘</div>
          <div className="flex justify-between">
            {[
              { label: '年柱', value: report.bazi.yearPillar },
              { label: '月柱', value: report.bazi.monthPillar },
              { label: '日柱', value: report.bazi.dayPillar },
              { label: '时柱', value: report.bazi.hourPillar },
            ].map((pillar, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-slate-500 mb-1">{pillar.label}</div>
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-xl font-bold text-amber-400">
                    {pillar.value[0]}
                  </span>
                  <span className="text-xl font-bold text-slate-300">
                    {pillar.value[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <span className="text-sm text-slate-400 font-mono tracking-wider">
              {report.bazi.string}
            </span>
          </div>
        </div>

        {/* 五行强度 */}
        <div className="px-6 py-4">
          <div className="text-xs text-slate-500 mb-3">五行分布</div>
          <div className="flex justify-between items-end h-16">
            {(['木', '火', '土', '金', '水'] as const).map((wx) => {
              const value = report.wuxing.strength[wx];
              const maxValue = Math.max(...Object.values(report.wuxing.strength));
              const height = (value / maxValue) * 100;
              return (
                <div key={wx} className="flex flex-col items-center w-12">
                  <div className="text-xs text-slate-400 mb-1">{value}</div>
                  <div
                    className="w-8 rounded-t-sm transition-all"
                    style={{
                      height: `${height}%`,
                      backgroundColor: WUXING_COLORS[wx],
                      minHeight: '4px',
                    }}
                  />
                  <div
                    className="text-xs mt-1 font-medium"
                    style={{ color: WUXING_COLORS[wx] }}
                  >
                    {wx}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 五行总结 */}
        <div className="px-6 py-4 bg-slate-800/30">
          <p className="text-sm text-slate-300 leading-relaxed">
            {report.wuxing.summary}
          </p>
        </div>

        {/* 十神解读 */}
        {report.shishen.patternInterpretation && (
          <div className="px-6 py-4">
            <div className="text-xs text-slate-500 mb-2">格局特点</div>
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
              {report.shishen.patternInterpretation}
            </p>
          </div>
        )}

        {/* 底部 - 品牌和声明 */}
        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">☯</span>
              <span className="text-sm font-medium text-slate-300">市相</span>
            </div>
            <span className="text-xs text-slate-500">shixiang.vercel.app</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            🔮 仅供娱乐，不构成投资建议
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-3">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={cn(
            'flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl',
            'bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium',
            'transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Download size={18} />
          <span>{isExporting ? '导出中...' : '保存图片'}</span>
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${report.stock.name} 八字分析`,
                text: `${report.stock.name} (${report.stock.symbol}) 的八字分析 - 市相`,
                url: window.location.href,
              });
            }
          }}
          className={cn(
            'px-4 py-3 rounded-xl',
            'bg-slate-700 hover:bg-slate-600 text-slate-200',
            'transition-colors'
          )}
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
