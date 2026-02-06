'use client';

/**
 * Share Card Coordinator
 * Template selector, image export, and caption copy
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
import {
  ClassicTemplate,
  MemeTemplate,
  MinimalTemplate,
  DouyinTemplate,
  WeChatTemplate,
} from './templates';

interface ShareCardProps {
  report: AnalysisReport;
  className?: string;
}

type TemplateType = 'classic' | 'meme' | 'minimal' | 'douyin' | 'wechat';

const TEMPLATE_CONFIG: Record<TemplateType, { name: string; desc: string; bg: string }> = {
  classic: { name: '新中式', desc: '信息完整', bg: '#0f172a' },
  meme: { name: '玩梗版', desc: '股吧风格', bg: '#0f172a' },
  minimal: { name: '极简版', desc: '小红书', bg: '#fafaf9' },
  douyin: { name: '抖音版', desc: '竖版视觉', bg: '#0a0a1a' },
  wechat: { name: '朋友圈', desc: '微信分享', bg: '#fefefe' },
};

const TEMPLATE_COMPONENTS: Record<TemplateType, React.ComponentType<import('./templates').TemplateProps>> = {
  classic: ClassicTemplate,
  meme: MemeTemplate,
  minimal: MinimalTemplate,
  douyin: DouyinTemplate,
  wechat: WeChatTemplate,
};

export function ShareCard({ report, className }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [isCopied, setIsCopied] = useState(false);

  const summary = deriveExecutiveSummary(report);
  const hookSentence = generateHookSentence(summary, {
    name: report.stock.name,
    symbol: report.stock.symbol,
  });
  const dominantWuxing = report.wuxing.strength.dominant;

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
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateCaption = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return [
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
    ].join('\n');
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(generateCaption());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleShare = () => {
    if (!navigator.share) return;
    navigator.share({
      title: `${report.stock.name} 八字分析`,
      text: hookSentence,
      url: window.location.href,
    });
  };

  const TemplateComponent = TEMPLATE_COMPONENTS[template];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Template selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(TEMPLATE_CONFIG) as TemplateType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTemplate(t)}
            className={cn(
              'shrink-0 px-3 py-2 rounded-lg text-sm transition-all',
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
      <div ref={cardRef}>
        <TemplateComponent
          report={report}
          summary={summary}
          hookSentence={hookSentence}
          dominantWuxing={dominantWuxing}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
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
            onClick={handleShare}
            className={cn(
              'px-4 py-3 rounded-xl',
              'bg-slate-700 hover:bg-slate-600 text-slate-200',
              'transition-colors'
            )}
          >
            <Share2 size={18} />
          </button>
        </div>

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
