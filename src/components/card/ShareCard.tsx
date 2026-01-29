'use client';

/**
 * 市相 - 分享卡片组件
 * 支持 3 套模板：新中式严肃盘 / 股吧玩梗盘 / 小红书极简
 */

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, Copy, Check } from 'lucide-react';
import type { AnalysisReport } from '@/lib/interpret/generator';
import {
  deriveExecutiveSummary,
  generateHookSentence,
} from '@/lib/interpret/executive-summary';
import { cn } from '@/lib/utils';

interface ShareCardProps {
  report: AnalysisReport;
  className?: string;
}

// 模板类型
type TemplateType = 'classic' | 'meme' | 'minimal';

// 模板配置
const TEMPLATE_CONFIG: Record<TemplateType, { name: string; desc: string }> = {
  classic: { name: '新中式', desc: '信息完整、稳重' },
  meme: { name: '玩梗版', desc: '突出关键词、口语化' },
  minimal: { name: '极简版', desc: '小红书竖版、留白多' },
};

// 五行颜色映射
const WUXING_COLORS: Record<string, string> = {
  木: '#22c55e',
  火: '#ef4444',
  土: '#eab308',
  金: '#f8fafc',
  水: '#3b82f6',
};

export function ShareCard({ report, className }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [isCopied, setIsCopied] = useState(false);

  // 推导数据
  const summary = deriveExecutiveSummary(report);
  const hookSentence = generateHookSentence(summary, {
    name: report.stock.name,
    symbol: report.stock.symbol,
  });
  const dominantWuxing = report.wuxing.strength.dominant;

  // 导出为图片
  const handleExport = async () => {
    if (!cardRef.current || isExporting) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: template === 'minimal' ? '#fafaf9' : '#0f172a',
      });

      const link = document.createElement('a');
      link.download = `市相-${report.stock.name}-${template}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // 生成发布文案
  const generateCaption = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const lines = [
      hookSentence,
      '',
      `📊 ${summary.keywords.join(' | ')}`,
      `📅 ${summary.yearTagline}`,
      '',
      '—————————',
      '🔮 仅供娱乐，不构成投资建议',
      '',
      '#炒股玄学 #市相 #股票八字 #A股 #美股',
      '',
      `🔗 ${url}`,
    ];
    return lines.join('\n');
  };

  // 复制发布文案
  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(generateCaption());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 模板选择器 */}
      <div className="flex gap-2">
        {(Object.keys(TEMPLATE_CONFIG) as TemplateType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTemplate(t)}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-sm transition-all',
              template === t
                ? 'bg-amber-500 text-slate-900 font-medium'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            )}
          >
            <div>{TEMPLATE_CONFIG[t].name}</div>
            <div className="text-xs opacity-70">{TEMPLATE_CONFIG[t].desc}</div>
          </button>
        ))}
      </div>

      {/* 卡片预览 */}
      <div ref={cardRef}>
        {template === 'classic' && (
          <ClassicTemplate
            report={report}
            summary={summary}
            hookSentence={hookSentence}
            dominantWuxing={dominantWuxing}
          />
        )}
        {template === 'meme' && (
          <MemeTemplate
            report={report}
            summary={summary}
            hookSentence={hookSentence}
            dominantWuxing={dominantWuxing}
          />
        )}
        {template === 'minimal' && (
          <MinimalTemplate
            report={report}
            summary={summary}
            hookSentence={hookSentence}
          />
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col gap-3">
        {/* 主要操作 */}
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl',
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
                  text: hookSentence,
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

        {/* 复制发布文案 */}
        <button
          onClick={handleCopyCaption}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl',
            'border transition-all',
            isCopied
              ? 'bg-green-500/20 border-green-500/50 text-green-400'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          )}
        >
          {isCopied ? <Check size={18} /> : <Copy size={18} />}
          <span>{isCopied ? '已复制到剪贴板' : '复制发布文案'}</span>
        </button>
      </div>
    </div>
  );
}

// ============ 模板组件 Props ============
interface TemplateProps {
  report: AnalysisReport;
  summary: ReturnType<typeof deriveExecutiveSummary>;
  hookSentence: string;
  dominantWuxing?: string;
}

// ============ 新中式严肃盘 ============
function ClassicTemplate({ report, summary, hookSentence, dominantWuxing }: TemplateProps) {
  return (
    <div
      className="w-[360px] bg-slate-900 rounded-2xl overflow-hidden"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* 顶部渐变 */}
      <div
        className="h-2"
        style={{
          background: `linear-gradient(to right, ${WUXING_COLORS[dominantWuxing || '木']}40, transparent)`,
        }}
      />

      {/* 头部 */}
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
        {/* 爆点句 */}
        <p className="mt-3 text-amber-400 text-sm font-medium">{hookSentence}</p>
      </div>

      {/* 八字排盘 */}
      <div className="px-6 py-4 bg-slate-800/50">
        <div className="flex justify-between">
          {['年柱', '月柱', '日柱', '时柱'].map((label, i) => {
            const pillars = [
              report.bazi.yearPillar,
              report.bazi.monthPillar,
              report.bazi.dayPillar,
              report.bazi.hourPillar,
            ];
            return (
              <div key={label} className="text-center">
                <div className="text-xs text-slate-500 mb-1">{label}</div>
                <div className="text-xl font-bold text-amber-400">{pillars[i][0]}</div>
                <div className="text-xl font-bold text-slate-300">{pillars[i][1]}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-center text-sm text-slate-400 font-mono">
          {report.bazi.string}
        </div>
      </div>

      {/* 关键词 */}
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

      {/* 底部 */}
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

// ============ 股吧玩梗盘 ============
function MemeTemplate({ report, summary, hookSentence, dominantWuxing }: TemplateProps) {
  return (
    <div
      className="w-[360px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-700"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* 大字标题 */}
      <div className="px-6 pt-6 pb-4 text-center">
        <h2 className="text-3xl font-black text-white">{report.stock.name}</h2>
        <p className="text-slate-500 text-sm mt-1">{report.stock.symbol}</p>
      </div>

      {/* 爆点句 - 超大突出 */}
      <div className="px-6 py-4 bg-amber-500/10 border-y border-amber-500/30">
        <p className="text-xl font-bold text-amber-400 text-center leading-snug">
          「{hookSentence}」
        </p>
      </div>

      {/* 关键词 - 大号标签 */}
      <div className="px-6 py-5 flex justify-center gap-3">
        {summary.keywords.map((kw, i) => (
          <span
            key={i}
            className={cn(
              'px-4 py-2 rounded-lg text-base font-bold',
              i === 0
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : i === 1
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
            )}
          >
            {kw}
          </span>
        ))}
      </div>

      {/* 八字 - 简化 */}
      <div className="px-6 py-3 text-center">
        <span className="text-2xl font-bold text-slate-300 tracking-widest">
          {report.bazi.string}
        </span>
      </div>

      {/* 一句话 */}
      <div className="px-6 py-4">
        <p className="text-center text-slate-400">{summary.yearTagline}</p>
        <p className="text-center text-red-400/80 text-sm mt-2">⚠️ {summary.riskFlag}</p>
      </div>

      {/* 底部 */}
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

// ============ 小红书极简竖版 ============
function MinimalTemplate({ report, summary, hookSentence }: Omit<TemplateProps, 'dominantWuxing'>) {
  return (
    <div
      className="w-[320px] bg-stone-50 rounded-2xl overflow-hidden"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* 大量留白顶部 */}
      <div className="h-8" />

      {/* 股票名 */}
      <div className="px-8 text-center">
        <h2 className="text-3xl font-bold text-stone-800">{report.stock.name}</h2>
        <p className="text-stone-400 text-sm mt-1">{report.stock.symbol}</p>
      </div>

      {/* 八字 */}
      <div className="px-8 py-8 text-center">
        <p className="text-2xl font-serif text-stone-700 tracking-[0.3em]">
          {report.bazi.string}
        </p>
      </div>

      {/* 爆点句 */}
      <div className="px-8 pb-6">
        <p className="text-lg text-stone-600 text-center leading-relaxed">
          {hookSentence}
        </p>
      </div>

      {/* 关键词 */}
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

      {/* 分隔线 */}
      <div className="mx-8 border-t border-stone-200" />

      {/* 底部 */}
      <div className="px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400">☯</span>
          <span className="text-sm text-stone-500">市相</span>
        </div>
        <span className="text-xs text-stone-400">仅供娱乐</span>
      </div>

      {/* 底部留白 */}
      <div className="h-4" />
    </div>
  );
}
