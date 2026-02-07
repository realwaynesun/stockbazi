/**
 * 市相 - Forecast Engine Tests
 * 五日预测计算测试
 */

import { describe, it, expect } from 'vitest';
import { calculateForecast, scoreWuXing, scoreBranches } from '@/lib/forecast';
import { calculateBazi } from '@/lib/bazi/calculator';
import { SHISHEN_SIGNAL, DI_ZHI_CHONG, DI_ZHI_HE } from '@/lib/forecast';
import type { Bazi } from '@/lib/bazi/types';

// AAPL: 1980-12-12 09:30 EST -> Beijing 22:30 -> 庚申 戊子 己未 乙亥
const AAPL_BAZI = calculateBazi({
  date: '1980-12-12',
  time: '09:30',
  timezone: 'America/New_York',
});

// TSLA: 2010-06-29 09:30 EST -> Beijing 21:30 -> 庚寅 壬午 庚戌 丁亥
const TSLA_BAZI = calculateBazi({
  date: '2010-06-29',
  time: '09:30',
  timezone: 'America/New_York',
});

describe('calculateForecast', () => {
  it('returns exactly 5 days', () => {
    const result = calculateForecast(
      AAPL_BAZI.bazi.dayPillar.gan,
      AAPL_BAZI.bazi,
      new Date(2026, 1, 7) // Feb 7, 2026
    );
    expect(result.days).toHaveLength(5);
  });

  it('returns consecutive dates starting from base date', () => {
    const baseDate = new Date(2026, 1, 7);
    const result = calculateForecast(
      AAPL_BAZI.bazi.dayPillar.gan,
      AAPL_BAZI.bazi,
      baseDate
    );

    for (let i = 0; i < 5; i++) {
      const expected = new Date(baseDate);
      expected.setDate(baseDate.getDate() + i);
      const expectedStr = `${expected.getFullYear()}-${String(expected.getMonth() + 1).padStart(2, '0')}-${String(expected.getDate()).padStart(2, '0')}`;
      expect(result.days[i].date).toBe(expectedStr);
    }
  });

  it('sets Day Master correctly for AAPL (己)', () => {
    const result = calculateForecast(
      AAPL_BAZI.bazi.dayPillar.gan,
      AAPL_BAZI.bazi,
      new Date(2026, 1, 7)
    );
    expect(result.stockDayMaster).toBe('己');
    expect(result.stockDayMasterWuxing).toBe('土');
  });

  it('sets Day Master correctly for TSLA (庚)', () => {
    const result = calculateForecast(
      TSLA_BAZI.bazi.dayPillar.gan,
      TSLA_BAZI.bazi,
      new Date(2026, 1, 7)
    );
    expect(result.stockDayMaster).toBe('庚');
    expect(result.stockDayMasterWuxing).toBe('金');
  });

  it('is deterministic (same input = same output)', () => {
    const base = new Date(2026, 1, 7);
    const r1 = calculateForecast(AAPL_BAZI.bazi.dayPillar.gan, AAPL_BAZI.bazi, base);
    const r2 = calculateForecast(AAPL_BAZI.bazi.dayPillar.gan, AAPL_BAZI.bazi, base);
    expect(r1.days).toEqual(r2.days);
    expect(r1.overallTrend).toBe(r2.overallTrend);
  });

  it('each day has valid signal and intensity', () => {
    const result = calculateForecast(
      AAPL_BAZI.bazi.dayPillar.gan,
      AAPL_BAZI.bazi,
      new Date(2026, 1, 7)
    );

    for (const day of result.days) {
      expect(['up', 'down', 'neutral']).toContain(day.signal);
      expect([1, 2, 3]).toContain(day.intensity);
      expect(day.ganZhi).toHaveLength(2);
      expect(day.reason.length).toBeGreaterThan(0);
      expect(day.shishen.length).toBeGreaterThan(0);
    }
  });

  it('each day has valid weekday', () => {
    const result = calculateForecast(
      AAPL_BAZI.bazi.dayPillar.gan,
      AAPL_BAZI.bazi,
      new Date(2026, 1, 7) // Saturday
    );
    expect(result.days[0].weekday).toBe('周六');
    expect(result.days[1].weekday).toBe('周日');
    expect(result.days[2].weekday).toBe('周一');
  });

  it('todayGanZhi is populated', () => {
    const result = calculateForecast(
      AAPL_BAZI.bazi.dayPillar.gan,
      AAPL_BAZI.bazi,
      new Date(2026, 1, 7)
    );
    expect(result.todayGanZhi).toHaveLength(2);
  });

  it('overallTrend reflects majority signal', () => {
    const result = calculateForecast(
      AAPL_BAZI.bazi.dayPillar.gan,
      AAPL_BAZI.bazi,
      new Date(2026, 1, 7)
    );
    const up = result.days.filter(d => d.signal === 'up').length;
    const down = result.days.filter(d => d.signal === 'down').length;

    if (up > down) expect(result.overallTrend).toBe('bullish');
    else if (down > up) expect(result.overallTrend).toBe('bearish');
    else expect(result.overallTrend).toBe('mixed');
  });
});

describe('scoreWuXing', () => {
  it('returns +2 when day branch generates Day Master (生我)', () => {
    // 火生土 -> Earth Day Master benefits from Fire branch
    expect(scoreWuXing('土', '火')).toBe(2);
  });

  it('returns +1 for same element', () => {
    expect(scoreWuXing('木', '木')).toBe(1);
  });

  it('returns +1 when Day Master controls day branch (我克)', () => {
    // 木克土
    expect(scoreWuXing('木', '土')).toBe(1);
  });

  it('returns -1 when day branch drains Day Master (我生)', () => {
    // 木生火 -> Wood Day Master drained by Fire
    expect(scoreWuXing('木', '火')).toBe(-1);
  });

  it('returns -2 when day branch conquers Day Master (克我)', () => {
    // 金克木 -> Gold conquers Wood Day Master
    expect(scoreWuXing('木', '金')).toBe(-2);
  });
});

describe('scoreBranches', () => {
  // TSLA branches: 寅(year), 午(month), 戌(day), 亥(hour)
  const tslaBazi = TSLA_BAZI.bazi;

  it('detects 六冲 (clash) with stock branches', () => {
    // 申: CHONG[申]=寅 (in TSLA year) → -2, HE[申]=巳 (not in TSLA) → 0
    expect(scoreBranches(tslaBazi, '申')).toBe(-2);
  });

  it('detects 六合 (combination) with stock branches', () => {
    // 卯: CHONG[卯]=酉 (not in TSLA) → 0, HE[卯]=戌 (in TSLA day) → +2
    expect(scoreBranches(tslaBazi, '卯')).toBe(2);
  });

  it('cancels when clash and harmony both match', () => {
    // AAPL branches: 申, 子, 未, 亥 — perfectly balanced
    // 寅: clashes 申 but harmonizes 亥 → net 0
    expect(scoreBranches(AAPL_BAZI.bazi, '寅')).toBe(0);
  });

  it('returns 0 for neutral branches', () => {
    // 巳: CHONG[巳]=亥 (in TSLA hour) → -2, HE[巳]=申 (not in TSLA) → 0
    // Actually 巳 clashes 亥. Let's use a truly neutral one.
    // 酉: CHONG[酉]=卯 (not in TSLA), HE[酉]=辰 (not in TSLA)
    expect(scoreBranches(tslaBazi, '酉')).toBe(0);
  });

  it('caps score at [-3, +3]', () => {
    const result = scoreBranches(tslaBazi, '申');
    expect(result).toBeGreaterThanOrEqual(-3);
    expect(result).toBeLessThanOrEqual(3);
  });
});

describe('SHISHEN_SIGNAL mapping completeness', () => {
  const allShiShen = [
    '比肩', '劫财', '食神', '伤官', '偏财',
    '正财', '七杀', '正官', '偏印', '正印',
  ] as const;

  it('every ShiShen has a signal mapping', () => {
    for (const ss of allShiShen) {
      expect(SHISHEN_SIGNAL[ss]).toBeDefined();
      expect(['up', 'down', 'neutral']).toContain(SHISHEN_SIGNAL[ss]);
    }
  });
});

describe('DI_ZHI_CHONG and DI_ZHI_HE completeness', () => {
  const allDiZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

  it('every DiZhi has a clash pair', () => {
    for (const dz of allDiZhi) {
      expect(DI_ZHI_CHONG[dz]).toBeDefined();
    }
  });

  it('clashes are symmetric', () => {
    for (const dz of allDiZhi) {
      const partner = DI_ZHI_CHONG[dz];
      expect(DI_ZHI_CHONG[partner]).toBe(dz);
    }
  });

  it('every DiZhi has a harmony pair', () => {
    for (const dz of allDiZhi) {
      expect(DI_ZHI_HE[dz]).toBeDefined();
    }
  });

  it('harmonies are symmetric', () => {
    for (const dz of allDiZhi) {
      const partner = DI_ZHI_HE[dz];
      expect(DI_ZHI_HE[partner]).toBe(dz);
    }
  });
});
