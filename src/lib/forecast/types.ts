/**
 * 市相 - Forecast Types
 * 五日运势预测类型定义
 */

import type { TianGan, DiZhi, WuXing, ShiShen } from '@/lib/bazi/types';

/** Single day forecast */
export interface DayForecast {
  date: string;           // "2026-02-08"
  weekday: string;        // "周六"
  ganZhi: string;         // "丙寅"
  gan: TianGan;
  zhi: DiZhi;
  shishen: ShiShen;       // vs stock Day Master
  signal: 'up' | 'down' | 'neutral';
  intensity: 1 | 2 | 3;  // 1=mild, 2=moderate, 3=strong
  reason: string;         // one-line Chinese explanation
}

/** 5-day forecast result */
export interface ForecastResult {
  stockDayMaster: TianGan;
  stockDayMasterWuxing: WuXing;
  todayGanZhi: string;
  days: DayForecast[];
  overallTrend: 'bullish' | 'bearish' | 'mixed';
}
