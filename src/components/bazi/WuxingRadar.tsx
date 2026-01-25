'use client';

/**
 * 市相 - Wu Xing Radar Chart Component
 * 五行强度雷达图组件 - 使用 ECharts 可视化
 */

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { WuXingStrength, WuXing } from '@/lib/bazi/types';
import { cn } from '@/lib/utils';

// 五行颜色
const WUXING_COLORS: Record<WuXing, string> = {
  '木': '#10b981', // emerald
  '火': '#ef4444', // red
  '土': '#f59e0b', // amber
  '金': '#94a3b8', // slate
  '水': '#3b82f6', // blue
};

interface WuxingRadarProps {
  /** 五行强度数据 */
  strength: WuXingStrength;
  /** 图表高度 */
  height?: number;
  /** 是否显示数值标签 */
  showLabels?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
}

export function WuxingRadar({
  strength,
  height = 300,
  showLabels = true,
  className,
}: WuxingRadarProps) {
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string; value: number }) => {
        return `${params.name}: ${params.value}%`;
      },
    },
    radar: {
      indicator: [
        { name: `木\n${strength['木']}%`, max: 50, color: WUXING_COLORS['木'] },
        { name: `火\n${strength['火']}%`, max: 50, color: WUXING_COLORS['火'] },
        { name: `土\n${strength['土']}%`, max: 50, color: WUXING_COLORS['土'] },
        { name: `金\n${strength['金']}%`, max: 50, color: WUXING_COLORS['金'] },
        { name: `水\n${strength['水']}%`, max: 50, color: WUXING_COLORS['水'] },
      ],
      shape: 'polygon',
      splitNumber: 5,
      axisName: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: 'bold',
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.2)',
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(30, 41, 59, 0.3)', 'rgba(30, 41, 59, 0.5)'],
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.3)',
        },
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              strength['木'],
              strength['火'],
              strength['土'],
              strength['金'],
              strength['水'],
            ],
            name: '五行强度',
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              color: '#d4af37', // gold
              width: 2,
            },
            areaStyle: {
              color: 'rgba(212, 175, 55, 0.3)',
            },
            itemStyle: {
              color: '#d4af37',
              borderColor: '#fff',
              borderWidth: 2,
            },
          },
        ],
      },
    ],
  }), [strength]);

  return (
    <div className={cn('w-full', className)}>
      <ReactECharts
        option={option}
        style={{ height, width: '100%' }}
        opts={{ renderer: 'svg' }}
      />

      {/* 强弱分析 */}
      {showLabels && (
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: WUXING_COLORS[strength.dominant] }}
            />
            <span className="text-slate-300">
              最旺：<span className="font-bold">{strength.dominant}</span>
              <span className="text-slate-500 ml-1">({strength[strength.dominant]}%)</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full opacity-50"
              style={{ backgroundColor: WUXING_COLORS[strength.weakest] }}
            />
            <span className="text-slate-300">
              最弱：<span className="font-bold">{strength.weakest}</span>
              <span className="text-slate-500 ml-1">({strength[strength.weakest]}%)</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 五行条形图组件（备选显示方式）
 */
export function WuxingBars({
  strength,
  className,
}: {
  strength: WuXingStrength;
  className?: string;
}) {
  const wuxingList: WuXing[] = ['木', '火', '土', '金', '水'];

  return (
    <div className={cn('space-y-3', className)}>
      {wuxingList.map((wx) => (
        <div key={wx} className="flex items-center gap-3">
          <span
            className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm"
            style={{ backgroundColor: WUXING_COLORS[wx] }}
          >
            {wx}
          </span>
          <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${strength[wx]}%`,
                backgroundColor: WUXING_COLORS[wx],
              }}
            />
          </div>
          <span className="w-12 text-right text-slate-400 text-sm">
            {strength[wx]}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default WuxingRadar;
