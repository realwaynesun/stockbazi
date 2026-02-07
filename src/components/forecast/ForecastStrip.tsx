'use client';

/**
 * 市相 - 5-Day Forecast Strip
 * 五日运势预测条 - Hero component showing birth time, current time, and daily signals
 */

import { cn } from '@/lib/utils';
import type { ForecastResult, DayForecast } from '@/lib/forecast/types';

interface ForecastStripProps {
  stockName: string;
  stockSymbol: string;
  baziString: string;
  ipoDate: string;
  forecast: ForecastResult;
  className?: string;
}

const WUXING_ACCENT: Record<string, string> = {
  '木': 'border-emerald-500/40',
  '火': 'border-red-500/40',
  '土': 'border-amber-500/40',
  '金': 'border-slate-400/40',
  '水': 'border-blue-500/40',
};

const SIGNAL_STYLES = {
  up: {
    bg: 'bg-emerald-950/30 border-emerald-800/30',
    arrow: 'text-emerald-400',
    tag: 'bg-emerald-900/50 text-emerald-300',
    char: '\u25B2',
  },
  down: {
    bg: 'bg-red-950/30 border-red-800/30',
    arrow: 'text-red-400',
    tag: 'bg-red-900/50 text-red-300',
    char: '\u25BC',
  },
  neutral: {
    bg: 'bg-slate-800/30 border-slate-700/30',
    arrow: 'text-yellow-400',
    tag: 'bg-slate-700/50 text-slate-300',
    char: '\u2014',
  },
} as const;

const TREND_TEXT: Record<string, string> = {
  bullish: '偏多',
  bearish: '偏空',
  mixed: '震荡',
};

function SignalArrows({ signal, intensity }: Pick<DayForecast, 'signal' | 'intensity'>) {
  const style = SIGNAL_STYLES[signal];
  const chars = signal === 'neutral'
    ? style.char
    : Array.from({ length: intensity }, () => style.char).join('');

  return <span className={cn('text-lg font-bold tracking-wider', style.arrow)}>{chars}</span>;
}

function ForecastCard({ day, isToday }: { day: DayForecast; isToday: boolean }) {
  const parts = day.date.split('-');
  const shortDate = `${parseInt(parts[1])}/${parseInt(parts[2])}`;
  const style = SIGNAL_STYLES[day.signal];

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border min-w-[72px]',
        'transition-all',
        style.bg,
        isToday && 'ring-1 ring-amber-500/50'
      )}
    >
      <div className="text-xs text-slate-400">
        {shortDate} {day.weekday}
      </div>
      <div className="text-base font-bold text-slate-100 font-serif">
        {day.ganZhi}
      </div>
      <SignalArrows signal={day.signal} intensity={day.intensity} />
      <div className={cn('text-xs px-2 py-0.5 rounded-full', style.tag)}>
        {day.shishen}
      </div>
      <div className="text-[10px] text-slate-500 text-center leading-tight mt-0.5">
        {day.reason}
      </div>
    </div>
  );
}

export function ForecastStrip({
  stockName,
  stockSymbol,
  baziString,
  ipoDate,
  forecast,
  className,
}: ForecastStripProps) {
  const accent = WUXING_ACCENT[forecast.stockDayMasterWuxing] ?? 'border-amber-500/40';
  const todayDate = forecast.days[0]?.date;
  const upCount = forecast.days.filter(d => d.signal === 'up').length;
  const downCount = forecast.days.filter(d => d.signal === 'down').length;
  const neutralCount = forecast.days.length - upCount - downCount;

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-purple-950/30',
        'border rounded-xl p-4 sm:p-6',
        accent,
        className
      )}
    >
      {/* Header: stock identity + birth time + today */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white">{stockName}</h2>
          <span className="text-sm text-slate-400">{stockSymbol}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-purple-400">{'\u262F'}</span>
            <span className="text-slate-500">生辰</span>
            <span className="font-serif text-amber-300 font-medium tracking-wide">
              {baziString}
            </span>
            <span className="text-slate-600 text-xs">({ipoDate})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400">{'\u23F0'}</span>
            <span className="text-slate-500">今日</span>
            <span className="font-serif text-slate-200 font-medium">
              {forecast.todayGanZhi}日
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-4" />

      {/* 5-day forecast strip */}
      <div className="overflow-x-auto -mx-1 px-1 pb-2">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-5">
          {forecast.days.map((day) => (
            <ForecastCard
              key={day.date}
              day={day}
              isToday={day.date === todayDate}
            />
          ))}
        </div>
      </div>

      {/* Overall trend + disclaimer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          总体趋势：
          <span className={cn(
            'font-medium',
            forecast.overallTrend === 'bullish' && 'text-emerald-400',
            forecast.overallTrend === 'bearish' && 'text-red-400',
            forecast.overallTrend === 'mixed' && 'text-yellow-400',
          )}>
            {TREND_TEXT[forecast.overallTrend]}
          </span>
          <span className="text-slate-600 ml-1">
            ({upCount}涨 {downCount}跌 {neutralCount}平)
          </span>
        </span>
        <span className="text-[10px] text-amber-500/60 bg-amber-500/5 px-2 py-0.5 rounded-full">
          仅供娱乐
        </span>
      </div>
    </div>
  );
}
