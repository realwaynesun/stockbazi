/**
 * ShiXiang - Cross-Validation Tests
 * 端到端交叉验证测试
 *
 * 验证从 IpoTimeInput 到完整分析报告的整个计算流程
 */

import { describe, it, expect } from 'vitest';
import { calculateBazi, getBaziString } from '@/lib/bazi/calculator';
import { calculateWuXingStrength } from '@/lib/bazi/wuxing';
import { calculateDaYun } from '@/lib/bazi/dayun';
import { calculateBaziShiShen } from '@/lib/bazi/shishen';
import type { IpoTimeInput, BaziResult } from '@/lib/bazi/types';

describe('Cross-Validation - AAPL', () => {
  const input: IpoTimeInput = {
    date: '1980-12-12',
    time: '09:30',
    timezone: 'America/New_York',
  };

  let baziResult: BaziResult;

  it('should calculate bazi correctly', () => {
    baziResult = calculateBazi(input);
    expect(getBaziString(baziResult)).toBe('庚申 戊子 己未 乙亥');
  });

  it('should calculate wuxing strength without errors', () => {
    const wuxingStrength = calculateWuXingStrength(baziResult.bazi);

    expect(wuxingStrength).toBeDefined();
    expect(wuxingStrength.木).toBeGreaterThanOrEqual(0);
    expect(wuxingStrength.火).toBeGreaterThanOrEqual(0);
    expect(wuxingStrength.土).toBeGreaterThanOrEqual(0);
    expect(wuxingStrength.金).toBeGreaterThanOrEqual(0);
    expect(wuxingStrength.水).toBeGreaterThanOrEqual(0);

    // 总和应该是 100
    const total = wuxingStrength.木 + wuxingStrength.火 + wuxingStrength.土 +
                  wuxingStrength.金 + wuxingStrength.水;
    expect(total).toBe(100);

    // 应该有最强和最弱五行
    expect(wuxingStrength.dominant).toBeDefined();
    expect(wuxingStrength.weakest).toBeDefined();
    expect(['木', '火', '土', '金', '水']).toContain(wuxingStrength.dominant);
    expect(['木', '火', '土', '金', '水']).toContain(wuxingStrength.weakest);
  });

  it('should calculate dayun without errors', () => {
    const ipoYear = 1980;
    const dayunResult = calculateDaYun(baziResult, ipoYear);

    expect(dayunResult).toBeDefined();
    expect(dayunResult.startAge).toBeGreaterThanOrEqual(0);
    expect(dayunResult.direction).toMatch(/^(forward|backward)$/);
    expect(dayunResult.cycles).toHaveLength(10);

    // 验证每个大运周期
    dayunResult.cycles.forEach((cycle, index) => {
      expect(cycle.index).toBe(index + 1);
      expect(cycle.startAge).toBeGreaterThanOrEqual(0);
      expect(cycle.startYear).toBeGreaterThanOrEqual(ipoYear);
      expect(cycle.gan).toBeDefined();
      expect(cycle.zhi).toBeDefined();
      expect(cycle.ganZhi).toBe(`${cycle.gan}${cycle.zhi}`);
      expect(cycle.wuxing).toHaveLength(2);
    });
  });

  it('should calculate shishen without errors', () => {
    const shishenResult = calculateBaziShiShen(baziResult.bazi);

    expect(shishenResult).toBeDefined();
    expect(shishenResult.yearPillar).toBeDefined();
    expect(shishenResult.monthPillar).toBeDefined();
    expect(shishenResult.dayPillar).toBeDefined();
    expect(shishenResult.hourPillar).toBeDefined();

    // 日柱天干应该总是比肩
    expect(shishenResult.dayPillar.gan).toBe('比肩');

    // 验证十神统计
    expect(shishenResult.shishenCount).toBeDefined();
    expect(Object.keys(shishenResult.shishenCount)).toHaveLength(10);

    // 所有十神计数应该是非负数
    Object.values(shishenResult.shishenCount).forEach(count => {
      expect(count).toBeGreaterThanOrEqual(0);
    });

    expect(shishenResult.dominantShiShen).toBeDefined();
    expect(shishenResult.pattern).toBeDefined();
  });

  it('should complete full pipeline without errors', () => {
    const wuxing = calculateWuXingStrength(baziResult.bazi);
    const dayun = calculateDaYun(baziResult, 1980);
    const shishen = calculateBaziShiShen(baziResult.bazi);

    // 验证所有计算结果都存在且有效
    expect(baziResult.baziString).toBe('庚申 戊子 己未 乙亥');
    expect(wuxing.dominant).toBeDefined();
    expect(dayun.cycles).toHaveLength(10);
    expect(shishen.pattern).toBeDefined();
  });
});

describe('Cross-Validation - TSLA', () => {
  const input: IpoTimeInput = {
    date: '2010-06-29',
    time: '09:30',
    timezone: 'America/New_York',
  };

  let baziResult: BaziResult;

  it('should calculate bazi correctly', () => {
    baziResult = calculateBazi(input);
    expect(getBaziString(baziResult)).toBe('庚寅 壬午 庚戌 丁亥');
  });

  it('should calculate wuxing strength without errors', () => {
    const wuxingStrength = calculateWuXingStrength(baziResult.bazi);

    expect(wuxingStrength).toBeDefined();

    // 总和应该是 100
    const total = wuxingStrength.木 + wuxingStrength.火 + wuxingStrength.土 +
                  wuxingStrength.金 + wuxingStrength.水;
    expect(total).toBe(100);

    expect(wuxingStrength.dominant).toBeDefined();
    expect(wuxingStrength.weakest).toBeDefined();
  });

  it('should calculate dayun without errors', () => {
    const ipoYear = 2010;
    const dayunResult = calculateDaYun(baziResult, ipoYear);

    expect(dayunResult).toBeDefined();
    expect(dayunResult.cycles).toHaveLength(10);

    // 验证大运时间的连续性
    for (let i = 0; i < dayunResult.cycles.length - 1; i++) {
      const current = dayunResult.cycles[i];
      const next = dayunResult.cycles[i + 1];
      expect(next.startAge - current.startAge).toBe(10);
    }
  });

  it('should calculate shishen without errors', () => {
    const shishenResult = calculateBaziShiShen(baziResult.bazi);

    expect(shishenResult).toBeDefined();
    expect(shishenResult.dayPillar.gan).toBe('比肩');
    expect(shishenResult.dominantShiShen).toBeDefined();
    expect(shishenResult.pattern).toBeDefined();
  });

  it('should complete full pipeline without errors', () => {
    const wuxing = calculateWuXingStrength(baziResult.bazi);
    const dayun = calculateDaYun(baziResult, 2010);
    const shishen = calculateBaziShiShen(baziResult.bazi);

    expect(baziResult.baziString).toBe('庚寅 壬午 庚戌 丁亥');
    expect(wuxing.dominant).toBeDefined();
    expect(dayun.cycles).toHaveLength(10);
    expect(shishen.pattern).toBeDefined();
  });
});

describe('Cross-Validation - 茅台', () => {
  const input: IpoTimeInput = {
    date: '2001-08-27',
    time: '09:30',
    timezone: 'Asia/Shanghai',
  };

  let baziResult: BaziResult;

  it('should calculate bazi correctly', () => {
    baziResult = calculateBazi(input);
    expect(getBaziString(baziResult)).toBe('辛巳 丙申 壬戌 乙巳');
  });

  it('should calculate wuxing strength without errors', () => {
    const wuxingStrength = calculateWuXingStrength(baziResult.bazi);

    expect(wuxingStrength).toBeDefined();

    // 总和应该是 100
    const total = wuxingStrength.木 + wuxingStrength.火 + wuxingStrength.土 +
                  wuxingStrength.金 + wuxingStrength.水;
    expect(total).toBe(100);

    expect(wuxingStrength.dominant).toBeDefined();
    expect(wuxingStrength.weakest).toBeDefined();
  });

  it('should calculate dayun without errors', () => {
    const ipoYear = 2001;
    const dayunResult = calculateDaYun(baziResult, ipoYear);

    expect(dayunResult).toBeDefined();
    expect(dayunResult.cycles).toHaveLength(10);

    // 每个大运应该间隔 10 年
    dayunResult.cycles.forEach((cycle, index) => {
      expect(cycle.index).toBe(index + 1);
      expect(cycle.startYear).toBe(ipoYear + cycle.startAge);
    });
  });

  it('should calculate shishen without errors', () => {
    const shishenResult = calculateBaziShiShen(baziResult.bazi);

    expect(shishenResult).toBeDefined();
    expect(shishenResult.dayPillar.gan).toBe('比肩');
    expect(shishenResult.dominantShiShen).toBeDefined();
    expect(shishenResult.pattern).toBeDefined();
  });

  it('should complete full pipeline without errors', () => {
    const wuxing = calculateWuXingStrength(baziResult.bazi);
    const dayun = calculateDaYun(baziResult, 2001);
    const shishen = calculateBaziShiShen(baziResult.bazi);

    expect(baziResult.baziString).toBe('辛巳 丙申 壬戌 乙巳');
    expect(wuxing.dominant).toBeDefined();
    expect(dayun.cycles).toHaveLength(10);
    expect(shishen.pattern).toBeDefined();
  });
});

describe('Cross-Validation - Data Consistency', () => {
  it('should produce consistent results for same input', () => {
    const input: IpoTimeInput = {
      date: '1980-12-12',
      time: '09:30',
      timezone: 'America/New_York',
    };

    const result1 = calculateBazi(input);
    const result2 = calculateBazi(input);

    expect(result1.baziString).toBe(result2.baziString);
    expect(getBaziString(result1)).toBe(getBaziString(result2));
  });

  it('should produce different results for different inputs', () => {
    const input1: IpoTimeInput = {
      date: '1980-12-12',
      time: '09:30',
      timezone: 'America/New_York',
    };

    const input2: IpoTimeInput = {
      date: '2010-06-29',
      time: '09:30',
      timezone: 'America/New_York',
    };

    const result1 = calculateBazi(input1);
    const result2 = calculateBazi(input2);

    expect(result1.baziString).not.toBe(result2.baziString);
  });
});
