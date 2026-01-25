'use client';

/**
 * StockBazi - Pillar Card Component
 * 单柱展示组件 - 显示天干地支及五行属性
 */

import { cn } from '@/lib/utils';
import type { TianGan, DiZhi, WuXing } from '@/lib/bazi/types';

// 五行颜色映射
const WUXING_COLORS: Record<WuXing, { bg: string; text: string; border: string }> = {
  '木': { bg: 'bg-emerald-950', text: 'text-emerald-400', border: 'border-emerald-500' },
  '火': { bg: 'bg-red-950', text: 'text-red-400', border: 'border-red-500' },
  '土': { bg: 'bg-amber-950', text: 'text-amber-400', border: 'border-amber-500' },
  '金': { bg: 'bg-slate-800', text: 'text-slate-200', border: 'border-slate-400' },
  '水': { bg: 'bg-blue-950', text: 'text-blue-400', border: 'border-blue-500' },
};

// 天干五行映射
const TIANGAN_WUXING: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 地支五行映射
const DIZHI_WUXING: Record<DiZhi, WuXing> = {
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '辰': '土', '戌': '土', '丑': '土', '未': '土',
  '申': '金', '酉': '金',
  '亥': '水', '子': '水',
};

interface PillarCardProps {
  /** 柱名称（年、月、日、时） */
  label: string;
  /** 天干 */
  gan: TianGan;
  /** 地支 */
  zhi: DiZhi;
  /** 是否为日主（日柱） */
  isDayMaster?: boolean;
  /** 十神标签（可选） */
  shishen?: string;
  /** 额外的 CSS 类名 */
  className?: string;
}

export function PillarCard({
  label,
  gan,
  zhi,
  isDayMaster = false,
  shishen,
  className,
}: PillarCardProps) {
  const ganWuxing = TIANGAN_WUXING[gan];
  const zhiWuxing = DIZHI_WUXING[zhi];
  const ganColors = WUXING_COLORS[ganWuxing];
  const zhiColors = WUXING_COLORS[zhiWuxing];

  return (
    <div
      className={cn(
        'relative flex flex-col items-center gap-1',
        isDayMaster && 'ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-900 rounded-lg',
        className
      )}
    >
      {/* 柱标签 */}
      <div className="text-xs text-slate-400 font-medium mb-1">
        {label}
        {isDayMaster && (
          <span className="ml-1 text-amber-400">(日主)</span>
        )}
      </div>

      {/* 十神标签（可选） */}
      {shishen && (
        <div className="text-xs text-purple-400 mb-1">
          {shishen}
        </div>
      )}

      {/* 天干 */}
      <div
        className={cn(
          'w-16 h-16 flex items-center justify-center rounded-t-lg border-2 border-b-0',
          ganColors.bg,
          ganColors.border
        )}
      >
        <span
          className={cn(
            'text-3xl font-bold',
            ganColors.text,
            // 使用楷体风格
            'font-serif'
          )}
        >
          {gan}
        </span>
      </div>

      {/* 五行标签（天干） */}
      <div className={cn('text-xs', ganColors.text, '-mt-0.5 mb-0.5')}>
        {ganWuxing}
      </div>

      {/* 地支 */}
      <div
        className={cn(
          'w-16 h-16 flex items-center justify-center rounded-b-lg border-2 border-t-0',
          zhiColors.bg,
          zhiColors.border
        )}
      >
        <span
          className={cn(
            'text-3xl font-bold',
            zhiColors.text,
            'font-serif'
          )}
        >
          {zhi}
        </span>
      </div>

      {/* 五行标签（地支） */}
      <div className={cn('text-xs', zhiColors.text, '-mt-0.5')}>
        {zhiWuxing}
      </div>
    </div>
  );
}

export default PillarCard;
