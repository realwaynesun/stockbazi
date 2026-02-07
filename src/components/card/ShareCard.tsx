'use client';

/**
 * Share Card Coordinator
 * Template selector, image export, link copy, and caption copy
 */

import { useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Link2, Copy, Check } from 'lucide-react';
import type { AnalysisReport } from '@/lib/interpret/generator';
import {
  deriveExecutiveSummary,
  generateHookSentence,
} from '@/lib/interpret/executive-summary';
import { cn } from '@/lib/utils';
import { ClassicTemplate, DouyinTemplate } from './templates';

interface ShareCardProps {
  report: AnalysisReport;
  className?: string;
}

type TemplateType = 'douyin' | 'classic';

const TEMPLATE_CONFIG: Record<TemplateType, { name: string; desc: string; bg: string }> = {
  douyin: { name: '竖版', desc: '适合社交平台', bg: '#0a0a1a' },
  classic: { name: '完整版', desc: '信息完整', bg: '#0f172a' },
};

const TEMPLATE_COMPONENTS: Record<TemplateType, React.ComponentType<import('./templates').TemplateProps>> = {
  douyin: DouyinTemplate,
  classic: ClassicTemplate,
};

function getStockUrl(symbol: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/stock/${symbol}`;
}

export function ShareCard({ report, className }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [template, setTemplate] = useState<TemplateType>('douyin');
  const [copied, setCopied] = useState<'none' | 'link' | 'caption'>('none');

  const summary = useMemo(() => deriveExecutiveSummary(report), [report]);
  const hookSentence = useMemo(
    () => generateHookSentence(summary, { name: report.stock.name, symbol: report.stock.symbol }),
    [summary, report.stock.name, report.stock.symbol]
  );
  const dominantWuxing = report.wuxing.strength.dominant;
  const stockUrl = getStockUrl(report.stock.symbol);

  const handleExport = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: TEMPLATE_CONFIG[template].bg,
      });
      const link = document.createElement('a');
      link.download = `市相-${report.stock.name}-${template}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(stockUrl);
      setCopied('link');
      setTimeout(() => setCopied('none'), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const handleCopyCaption = async () => {
    const caption = [
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
      `🔗 ${stockUrl}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(caption);
      setCopied('caption');
      setTimeout(() => setCopied('none'), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const TemplateComponent = TEMPLATE_COMPONENTS[template];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Template selector — simple toggle */}
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

      {/* Card preview */}
      <div className="flex justify-center">
        <div ref={cardRef}>
          <TemplateComponent
          report={report}
          summary={summary}
          hookSentence={hookSentence}
          dominantWuxing={dominantWuxing}
        />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        {/* Primary: save image + copy link */}
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
            onClick={handleCopyLink}
            className={cn(
              'flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all',
              copied === 'link'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            )}
          >
            {copied === 'link' ? <Check size={18} /> : <Link2 size={18} />}
            <span className="text-sm">{copied === 'link' ? '已复制' : '复制链接'}</span>
          </button>
        </div>

        {/* Secondary: copy caption */}
        <button
          onClick={handleCopyCaption}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl',
            'border transition-all',
            copied === 'caption'
              ? 'bg-green-500/20 border-green-500/50 text-green-400'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          )}
        >
          {copied === 'caption' ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied === 'caption' ? '已复制到剪贴板' : '复制发布文案'}</span>
        </button>
      </div>
    </div>
  );
}
