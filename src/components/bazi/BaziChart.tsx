'use client';

/**
 * StockBazi - Bazi Chart Component
 * 四柱八字展示组件 - 横向排列年月日时四柱
 */

import { cn } from '@/lib/utils';
import { PillarCard } from './PillarCard';
import type { Bazi } from '@/lib/bazi/types';

interface BaziChartProps {
  /** 八字数据 */
  bazi: Bazi;
  /** 八字字符串（可选，用于备用显示） */
  baziString?: string;
  /** 是否显示十神标签 */
  showShishen?: boolean;
  /** 十神数据（按柱：年、月、日、时） */
  shishenLabels?: [string, string, string, string];
  /** 额外的 CSS 类名 */
  className?: string;
}

export function BaziChart({
  bazi,
  baziString,
  showShishen = false,
  shishenLabels,
  className,
}: BaziChartProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* 八字字符串标题 */}
      {baziString && (
        <div className="text-center">
          <span className="text-2xl font-bold text-amber-400 tracking-widest font-serif">
            {baziString}
          </span>
        </div>
      )}

      {/* 四柱排列 */}
      <div className="flex justify-center gap-6 md:gap-8">
        {/* 年柱 */}
        <PillarCard
          label="年柱"
          gan={bazi.yearPillar.gan}
          zhi={bazi.yearPillar.zhi}
          shishen={showShishen ? shishenLabels?.[0] : undefined}
        />

        {/* 月柱 */}
        <PillarCard
          label="月柱"
          gan={bazi.monthPillar.gan}
          zhi={bazi.monthPillar.zhi}
          shishen={showShishen ? shishenLabels?.[1] : undefined}
        />

        {/* 日柱（日主） */}
        <PillarCard
          label="日柱"
          gan={bazi.dayPillar.gan}
          zhi={bazi.dayPillar.zhi}
          isDayMaster
          shishen={showShishen ? shishenLabels?.[2] : undefined}
        />

        {/* 时柱 */}
        <PillarCard
          label="时柱"
          gan={bazi.hourPillar.gan}
          zhi={bazi.hourPillar.zhi}
          shishen={showShishen ? shishenLabels?.[3] : undefined}
        />
      </div>

      {/* 图例 */}
      <div className="flex justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          木
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          火
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          土
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-slate-300" />
          金
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          水
        </span>
      </div>
    </div>
  );
}

export default BaziChart;
