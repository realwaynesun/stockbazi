/**
 * 市相 - 5-Day Forecast Engine
 * 五日运势预测计算模块
 *
 * Derives daily stock predictions from the interaction between
 * the stock's Day Master (日主) and each future day's GanZhi.
 */

import { Solar } from 'lunar-javascript';
import type { TianGan, DiZhi, WuXing, Bazi } from '@/lib/bazi/types';
import { calculateShiShen } from '@/lib/bazi/shishen';
import { TIAN_GAN_WUXING, DI_ZHI_WUXING, WUXING_SHENG, WUXING_KE } from '@/lib/bazi/constants';
import {
  SHISHEN_SIGNAL,
  SHISHEN_INTENSITY,
  SHISHEN_REASONS,
  DI_ZHI_CHONG,
  DI_ZHI_HE,
  WEEKDAY_NAMES,
} from './constants';
import type { DayForecast, ForecastResult } from './types';

/** Get daily GanZhi from lunar-javascript */
function getDayGanZhi(year: number, month: number, day: number) {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const ganZhi = lunar.getDayInGanZhi();
  return { gan: ganZhi[0] as TianGan, zhi: ganZhi[1] as DiZhi, ganZhi };
}

/** Score WuXing interaction: day branch element vs stock Day Master element */
export function scoreWuXing(dayMasterWx: WuXing, dayBranchWx: WuXing): number {
  if (WUXING_SHENG[dayBranchWx] === dayMasterWx) return +2;  // generates me
  if (dayMasterWx === dayBranchWx) return +1;                 // same element
  if (WUXING_KE[dayMasterWx] === dayBranchWx) return +1;     // I control it
  if (WUXING_SHENG[dayMasterWx] === dayBranchWx) return -1;  // drains me
  if (WUXING_KE[dayBranchWx] === dayMasterWx) return -2;     // conquers me
  return 0;
}

/** Score branch clashes/combinations vs stock's 4 pillar branches */
export function scoreBranches(stockBazi: Bazi, dayZhi: DiZhi): number {
  const branches = [
    stockBazi.yearPillar.zhi,
    stockBazi.monthPillar.zhi,
    stockBazi.dayPillar.zhi,
    stockBazi.hourPillar.zhi,
  ];

  let score = 0;
  for (const branch of branches) {
    if (DI_ZHI_CHONG[dayZhi] === branch) score -= 2;
    if (DI_ZHI_HE[dayZhi] === branch) score += 2;
  }
  return Math.max(-3, Math.min(3, score));
}

/** ShiShen numeric score for composite calculation */
const SHISHEN_SCORE: Record<string, number> = {
  '正财': +3, '偏财': +2, '食神': +2, '正印': +1, '比肩': +1,
  '正官': 0, '偏印': -1, '劫财': -1, '伤官': -2, '七杀': -3,
};

/** Combine scores into final signal */
function compositeSignal(
  shishenScore: number,
  wuxingScore: number,
  branchScore: number
): { signal: 'up' | 'down' | 'neutral'; intensity: 1 | 2 | 3 } {
  const weighted = shishenScore * 0.5 + wuxingScore * 0.3 + branchScore * 0.2;

  const signal: 'up' | 'down' | 'neutral' =
    weighted > 0.8 ? 'up' : weighted < -0.8 ? 'down' : 'neutral';

  const abs = Math.abs(weighted);
  const intensity: 1 | 2 | 3 = abs > 2 ? 3 : abs > 1.2 ? 2 : 1;

  return { signal, intensity };
}

/**
 * Calculate 5-day forecast for a stock
 * @param stockDayMaster - The stock's Day Master (日主天干)
 * @param stockBazi - The stock's full Bazi (for branch interactions)
 * @param baseDate - Starting date (defaults to today in Beijing time)
 */
export function calculateForecast(
  stockDayMaster: TianGan,
  stockBazi: Bazi,
  baseDate?: Date
): ForecastResult {
  const now = baseDate ?? new Date();
  const dayMasterWx = TIAN_GAN_WUXING[stockDayMaster];

  // Today's GanZhi for header
  const todayInfo = getDayGanZhi(now.getFullYear(), now.getMonth() + 1, now.getDate());

  const days: DayForecast[] = [];

  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const { gan, zhi, ganZhi } = getDayGanZhi(year, month, day);

    // ShiShen relationship
    const shishen = calculateShiShen(stockDayMaster, gan);
    const shishenNum = SHISHEN_SCORE[shishen] ?? 0;

    // WuXing interaction (day branch vs Day Master)
    const wuxingNum = scoreWuXing(dayMasterWx, DI_ZHI_WUXING[zhi]);

    // Branch clash/combination
    const branchNum = scoreBranches(stockBazi, zhi);

    // Composite signal
    const { signal, intensity } = compositeSignal(shishenNum, wuxingNum, branchNum);

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    days.push({
      date: dateStr,
      weekday: WEEKDAY_NAMES[d.getDay()],
      ganZhi,
      gan,
      zhi,
      shishen,
      signal,
      intensity,
      reason: SHISHEN_REASONS[shishen],
    });
  }

  const upCount = days.filter(d => d.signal === 'up').length;
  const downCount = days.filter(d => d.signal === 'down').length;
  const overallTrend: ForecastResult['overallTrend'] =
    upCount > downCount ? 'bullish' : downCount > upCount ? 'bearish' : 'mixed';

  return {
    stockDayMaster,
    stockDayMasterWuxing: dayMasterWx,
    todayGanZhi: todayInfo.ganZhi,
    days,
    overallTrend,
  };
}
