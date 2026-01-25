'use client';

/**
 * StockBazi - Da Yun Timeline Component
 * 大运时间线组件 - 显示 10 步大运
 */

import { cn } from '@/lib/utils';
import type { DaYun, WuXing } from '@/lib/bazi/types';

// 五行颜色映射
const WUXING_COLORS: Record<WuXing, string> = {
  '木': 'bg-emerald-500',
  '火': 'bg-red-500',
  '土': 'bg-amber-500',
  '金': 'bg-slate-300',
  '水': 'bg-blue-500',
};

interface DayunTimelineProps {
  /** 大运列表 */
  cycles: DaYun[];
  /** 起运岁数 */
  startAge: number;
  /** 顺/逆行 */
  direction: 'forward' | 'backward';
  /** 当前年份 */
  currentYear?: number;
  /** 额外的 CSS 类名 */
  className?: string;
}

export function DayunTimeline({
  cycles,
  startAge,
  direction,
  currentYear = new Date().getFullYear(),
  className,
}: DayunTimelineProps) {
  // 找出当前大运
  const currentCycleIndex = cycles.findIndex((cycle, index) => {
    const nextCycle = cycles[index + 1];
    if (!nextCycle) {
      return currentYear >= cycle.startYear;
    }
    return currentYear >= cycle.startYear && currentYear < nextCycle.startYear;
  });

  return (
    <div className={cn('space-y-4', className)}>
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-200">大运流年</h3>
        <div className="text-sm text-slate-400">
          起运 {startAge} 岁 · {direction === 'forward' ? '顺行' : '逆行'}
        </div>
      </div>

      {/* 时间线 */}
      <div className="relative overflow-x-auto pb-4">
        <div className="flex gap-2 min-w-max">
          {cycles.map((cycle, index) => {
            const isCurrent = index === currentCycleIndex;
            const isPast = currentYear >= cycle.startYear && !isCurrent;
            const endYear = cycles[index + 1]?.startYear
              ? cycles[index + 1].startYear - 1
              : cycle.startYear + 9;

            return (
              <div
                key={cycle.index}
                className={cn(
                  'flex flex-col items-center p-3 rounded-lg transition-all',
                  isCurrent
                    ? 'bg-purple-900/50 ring-2 ring-amber-500'
                    : isPast
                    ? 'bg-slate-800/50 opacity-60'
                    : 'bg-slate-800/30'
                )}
              >
                {/* 大运序号 */}
                <div className="text-xs text-slate-500 mb-1">
                  第 {cycle.index} 运
                </div>

                {/* 干支 */}
                <div
                  className={cn(
                    'text-2xl font-bold font-serif',
                    isCurrent ? 'text-amber-400' : 'text-slate-300'
                  )}
                >
                  {cycle.ganZhi}
                </div>

                {/* 五行标签 */}
                <div className="flex gap-1 mt-2">
                  {cycle.wuxing.map((wx, i) => (
                    <span
                      key={i}
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-xs text-white',
                        WUXING_COLORS[wx]
                      )}
                    >
                      {wx}
                    </span>
                  ))}
                </div>

                {/* 年份区间 */}
                <div className="text-xs text-slate-400 mt-2">
                  {cycle.startYear} - {endYear}
                </div>

                {/* 起运岁数 */}
                <div className="text-xs text-slate-500">
                  {cycle.startAge} 岁
                </div>

                {/* 当前标记 */}
                {isCurrent && (
                  <div className="mt-2 px-2 py-0.5 bg-amber-500/20 rounded text-xs text-amber-400">
                    当前
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 说明 */}
      <div className="text-xs text-slate-500 text-center">
        每步大运 10 年，共 100 年
      </div>
    </div>
  );
}

export default DayunTimeline;
