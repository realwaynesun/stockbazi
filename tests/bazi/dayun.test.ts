/**
 * StockBazi - Da Yun Calculator Tests
 * 大运计算器单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDaYun,
  getCurrentDaYun,
  getLiuNian,
  isPastLiChun,
} from '@/lib/bazi/dayun';
import { calculateBazi } from '@/lib/bazi/calculator';
import type { IpoTimeInput } from '@/lib/bazi/types';

describe('calculateDaYun - 大运计算', () => {
  it('should calculate Da Yun for yang year (forward direction)', () => {
    // 2024-02-04 17:00 Beijing - 甲辰年 (甲为阳干，顺排)
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '17:00',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    const daYunResult = calculateDaYun(baziResult, 2024);

    // 甲为阳干，应该顺排
    expect(daYunResult.direction).toBe('forward');

    // 应该有 10 步大运
    expect(daYunResult.cycles).toHaveLength(10);

    // 验证大运序号
    expect(daYunResult.cycles[0].index).toBe(1);
    expect(daYunResult.cycles[9].index).toBe(10);

    // 起运岁数应该是合理的（0-10岁之间）
    expect(daYunResult.startAge).toBeGreaterThanOrEqual(0);
    expect(daYunResult.startAge).toBeLessThanOrEqual(10);
  });

  it('should calculate Da Yun for yin year (backward direction)', () => {
    // 茅台 2001-08-27 09:30 Beijing - 辛巳年 (辛为阴干，逆排)
    const input: IpoTimeInput = {
      date: '2001-08-27',
      time: '09:30',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    const daYunResult = calculateDaYun(baziResult, 2001);

    // 辛为阴干，应该逆排
    expect(daYunResult.direction).toBe('backward');

    // 应该有 10 步大运
    expect(daYunResult.cycles).toHaveLength(10);
  });

  it('should generate correct Da Yun progression for forward direction', () => {
    // 月柱为 丙寅 的情况，顺排应该是 丁卯 -> 戊辰 -> 己巳 ...
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '17:00',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    // 月柱是 丙寅
    expect(baziResult.bazi.monthPillar.gan).toBe('丙');
    expect(baziResult.bazi.monthPillar.zhi).toBe('寅');

    const daYunResult = calculateDaYun(baziResult, 2024);

    // 顺排：丙寅 -> 丁卯 -> 戊辰 -> 己巳 -> 庚午 ...
    expect(daYunResult.cycles[0].ganZhi).toBe('丁卯');
    expect(daYunResult.cycles[1].ganZhi).toBe('戊辰');
    expect(daYunResult.cycles[2].ganZhi).toBe('己巳');
  });

  it('should generate correct Da Yun progression for backward direction', () => {
    // 茅台 月柱为 丙申，逆排应该是 乙未 -> 甲午 -> 癸巳 ...
    const input: IpoTimeInput = {
      date: '2001-08-27',
      time: '09:30',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    // 月柱是 丙申
    expect(baziResult.bazi.monthPillar.gan).toBe('丙');
    expect(baziResult.bazi.monthPillar.zhi).toBe('申');

    const daYunResult = calculateDaYun(baziResult, 2001);

    // 逆排：丙申 -> 乙未 -> 甲午 -> 癸巳 ...
    expect(daYunResult.cycles[0].ganZhi).toBe('乙未');
    expect(daYunResult.cycles[1].ganZhi).toBe('甲午');
    expect(daYunResult.cycles[2].ganZhi).toBe('癸巳');
  });

  it('should calculate correct start years for each Da Yun cycle', () => {
    const input: IpoTimeInput = {
      date: '2001-08-27',
      time: '09:30',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    const daYunResult = calculateDaYun(baziResult, 2001);

    const startAge = daYunResult.startAge;

    // 每步大运相差 10 年
    for (let i = 0; i < 10; i++) {
      const expectedAge = startAge + i * 10;
      const expectedYear = 2001 + expectedAge;

      expect(daYunResult.cycles[i].startAge).toBe(expectedAge);
      expect(daYunResult.cycles[i].startYear).toBe(expectedYear);
    }
  });

  it('should include Wu Xing for each Da Yun cycle', () => {
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '17:00',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    const daYunResult = calculateDaYun(baziResult, 2024);

    // 第一步大运 丁卯
    expect(daYunResult.cycles[0].wuxing).toContain('火'); // 丁 = 火
    expect(daYunResult.cycles[0].wuxing).toContain('木'); // 卯 = 木

    // 第二步大运 戊辰
    expect(daYunResult.cycles[1].wuxing).toContain('土'); // 戊 = 土
    expect(daYunResult.cycles[1].wuxing).toContain('土'); // 辰 = 土
  });
});

describe('getCurrentDaYun - 获取当前大运', () => {
  it('should return correct current Da Yun based on year', () => {
    const input: IpoTimeInput = {
      date: '2001-08-27',
      time: '09:30',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    const daYunResult = calculateDaYun(baziResult, 2001);

    // 假设起运岁数为 3
    // 2001 + 3 = 2004 开始第一步大运
    // 2004-2013 第一步
    // 2014-2023 第二步
    // 2024-2033 第三步

    const currentYear = 2024;
    const currentDaYun = getCurrentDaYun(daYunResult, currentYear);

    expect(currentDaYun).not.toBeNull();
    // 当前年份应该在某个大运周期内
    if (currentDaYun) {
      expect(currentDaYun.startYear).toBeLessThanOrEqual(currentYear);
    }
  });

  it('should return null if before first Da Yun', () => {
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '17:00',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    const daYunResult = calculateDaYun(baziResult, 2024);

    // 如果查询 2024 之前的年份，应该返回 null（假设起运岁数 > 0）
    const currentDaYun = getCurrentDaYun(daYunResult, 2020);
    expect(currentDaYun).toBeNull();
  });
});

describe('getLiuNian - 流年计算', () => {
  it('should return correct Liu Nian for 2024', () => {
    const liuNian = getLiuNian(2024);

    expect(liuNian.gan).toBe('甲');
    expect(liuNian.zhi).toBe('辰');
    expect(liuNian.ganZhi).toBe('甲辰');
  });

  it('should return correct Liu Nian for 2025', () => {
    const liuNian = getLiuNian(2025);

    expect(liuNian.gan).toBe('乙');
    expect(liuNian.zhi).toBe('巳');
    expect(liuNian.ganZhi).toBe('乙巳');
  });

  it('should return correct Liu Nian for historical years', () => {
    // 1980 年
    const liuNian1980 = getLiuNian(1980);
    expect(liuNian1980.gan).toBe('庚');
    expect(liuNian1980.zhi).toBe('申');

    // 2001 年
    const liuNian2001 = getLiuNian(2001);
    expect(liuNian2001.gan).toBe('辛');
    expect(liuNian2001.zhi).toBe('巳');
  });
});

describe('isPastLiChun - 立春判断', () => {
  it('should return true for dates after February', () => {
    expect(isPastLiChun(2024, 3, 1)).toBe(true);
    expect(isPastLiChun(2024, 6, 15)).toBe(true);
    expect(isPastLiChun(2024, 12, 31)).toBe(true);
  });

  it('should return false for dates before February', () => {
    expect(isPastLiChun(2024, 1, 1)).toBe(false);
    expect(isPastLiChun(2024, 1, 31)).toBe(false);
  });

  it('should handle February dates correctly', () => {
    // 2024 年立春大约在 2月4日 16:26
    // 2月4日之后应该是立春后
    // 这个测试依赖于 lunar-javascript 的精确计算
    const result = isPastLiChun(2024, 2, 10);
    expect(result).toBe(true);
  });
});
