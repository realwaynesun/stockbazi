/**
 * StockBazi - Bazi Calculator Tests
 * 八字计算器单元测试
 *
 * 注意：所有期望值基于 lunar-javascript 库的计算结果
 * lunar-javascript 是本项目的八字计算核心引擎
 */

import { describe, it, expect } from 'vitest';
import {
  calculateBazi,
  calculateBaziFromBeijingTime,
  toBeijingTime,
  getBaziString,
} from '@/lib/bazi/calculator';
import type { IpoTimeInput } from '@/lib/bazi/types';

describe('toBeijingTime - 时区转换', () => {
  it('should convert New York time to Beijing time correctly', () => {
    const input: IpoTimeInput = {
      date: '1980-12-12',
      time: '09:30',
      timezone: 'America/New_York',
    };

    const result = toBeijingTime(input);

    // 1980-12-12 09:30 EST = 1980-12-12 22:30 Beijing
    expect(result.year).toBe(1980);
    expect(result.month).toBe(12);
    expect(result.day).toBe(12);
    expect(result.hour).toBe(22);
    expect(result.minute).toBe(30);
  });

  it('should handle Shanghai timezone (same as Beijing)', () => {
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '11:00',
      timezone: 'Asia/Shanghai',
    };

    const result = toBeijingTime(input);

    expect(result.year).toBe(2024);
    expect(result.month).toBe(2);
    expect(result.day).toBe(4);
    expect(result.hour).toBe(11);
    expect(result.minute).toBe(0);
  });

  it('should throw error for invalid date/time', () => {
    const input: IpoTimeInput = {
      date: 'invalid-date',
      time: '09:30',
      timezone: 'America/New_York',
    };

    expect(() => toBeijingTime(input)).toThrow('Invalid date/time');
  });
});

describe('calculateBazi - 核心八字计算', () => {
  /**
   * 案例 1: 立春前验证
   * 2024-02-04 11:00 (Asia/Shanghai) → 癸卯 乙丑 戊戌 戊午
   *
   * 2024年立春精确时间: 2024-02-04 16:26 北京时间
   * 11:00 在立春前，故年柱仍为癸卯（2023农历年）
   */
  it('Case 1: 立春前 - 2024-02-04 11:00 (Asia/Shanghai)', () => {
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '11:00',
      timezone: 'Asia/Shanghai',
    };

    const result = calculateBazi(input);
    const baziString = getBaziString(result);

    // 立春前，仍为癸卯年
    expect(baziString).toBe('癸卯 乙丑 戊戌 戊午');

    expect(result.bazi.yearPillar.gan).toBe('癸');
    expect(result.bazi.yearPillar.zhi).toBe('卯');
    expect(result.bazi.dayPillar.gan).toBe('戊');
    expect(result.bazi.dayPillar.zhi).toBe('戌');
    expect(result.bazi.hourPillar.gan).toBe('戊');
    expect(result.bazi.hourPillar.zhi).toBe('午');

    // 验证阴阳（癸为阴干）
    expect(result.yinYang).toBe('yin');
  });

  /**
   * 案例 2: 立春后验证
   * 2024-02-04 17:00 (Asia/Shanghai) → 甲辰 丙寅 戊戌 辛酉
   *
   * 17:00 在立春后，年柱变为甲辰（2024农历年）
   */
  it('Case 2: 立春后 - 2024-02-04 17:00 (Asia/Shanghai)', () => {
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '17:00',
      timezone: 'Asia/Shanghai',
    };

    const result = calculateBazi(input);
    const baziString = getBaziString(result);

    // 立春后，甲辰年开始
    expect(baziString).toBe('甲辰 丙寅 戊戌 辛酉');

    expect(result.bazi.yearPillar.gan).toBe('甲');
    expect(result.bazi.yearPillar.zhi).toBe('辰');
    expect(result.bazi.monthPillar.gan).toBe('丙');
    expect(result.bazi.monthPillar.zhi).toBe('寅');

    // 验证阴阳（甲为阳干）
    expect(result.yinYang).toBe('yang');

    // 验证五行映射
    expect(result.bazi.yearPillar.ganWuxing).toBe('木');
    expect(result.bazi.yearPillar.zhiWuxing).toBe('土');
  });

  /**
   * 案例 3: AAPL (苹果公司)
   * 1980-12-12 09:30 (America/New_York) → 庚申 戊子 己未 乙亥
   *
   * 转换后北京时间: 1980-12-12 22:30
   * 22:30 属于亥时 (21:00-23:00)
   */
  it('Case 3: AAPL - 1980-12-12 09:30 (America/New_York)', () => {
    const input: IpoTimeInput = {
      date: '1980-12-12',
      time: '09:30',
      timezone: 'America/New_York',
    };

    const result = calculateBazi(input);
    const baziString = getBaziString(result);

    expect(baziString).toBe('庚申 戊子 己未 乙亥');

    // 验证四柱
    expect(result.bazi.yearPillar.gan).toBe('庚');
    expect(result.bazi.yearPillar.zhi).toBe('申');
    expect(result.bazi.monthPillar.gan).toBe('戊');
    expect(result.bazi.monthPillar.zhi).toBe('子');
    expect(result.bazi.dayPillar.gan).toBe('己');
    expect(result.bazi.dayPillar.zhi).toBe('未');
    expect(result.bazi.hourPillar.gan).toBe('乙');
    expect(result.bazi.hourPillar.zhi).toBe('亥');

    // 验证阴阳（庚为阳干）
    expect(result.yinYang).toBe('yang');

    // 验证五行
    expect(result.bazi.yearPillar.ganWuxing).toBe('金');
    expect(result.bazi.dayPillar.ganWuxing).toBe('土');
  });

  /**
   * 案例 4: TSLA (特斯拉)
   * 2010-06-29 09:30 (America/New_York) → 庚寅 壬午 庚戌 丁亥
   *
   * 转换后北京时间: 2010-06-29 21:30 (夏令时 EDT)
   * 21:30 属于亥时 (21:00-23:00)
   */
  it('Case 4: TSLA - 2010-06-29 09:30 (America/New_York)', () => {
    const input: IpoTimeInput = {
      date: '2010-06-29',
      time: '09:30',
      timezone: 'America/New_York',
    };

    const result = calculateBazi(input);
    const baziString = getBaziString(result);

    expect(baziString).toBe('庚寅 壬午 庚戌 丁亥');

    // 验证四柱
    expect(result.bazi.yearPillar.gan).toBe('庚');
    expect(result.bazi.yearPillar.zhi).toBe('寅');
    expect(result.bazi.monthPillar.gan).toBe('壬');
    expect(result.bazi.monthPillar.zhi).toBe('午');
    expect(result.bazi.dayPillar.gan).toBe('庚');
    expect(result.bazi.dayPillar.zhi).toBe('戌');
    expect(result.bazi.hourPillar.gan).toBe('丁');
    expect(result.bazi.hourPillar.zhi).toBe('亥');

    // 验证阴阳（庚为阳干）
    expect(result.yinYang).toBe('yang');
  });

  /**
   * 案例 5: 茅台 (贵州茅台)
   * 2001-08-27 09:30 (Asia/Shanghai) → 辛巳 丙申 壬戌 乙巳
   *
   * 09:30 属于巳时 (09:00-11:00)
   */
  it('Case 5: 茅台 - 2001-08-27 09:30 (Asia/Shanghai)', () => {
    const input: IpoTimeInput = {
      date: '2001-08-27',
      time: '09:30',
      timezone: 'Asia/Shanghai',
    };

    const result = calculateBazi(input);
    const baziString = getBaziString(result);

    expect(baziString).toBe('辛巳 丙申 壬戌 乙巳');

    // 验证四柱
    expect(result.bazi.yearPillar.gan).toBe('辛');
    expect(result.bazi.yearPillar.zhi).toBe('巳');
    expect(result.bazi.monthPillar.gan).toBe('丙');
    expect(result.bazi.monthPillar.zhi).toBe('申');
    expect(result.bazi.dayPillar.gan).toBe('壬');
    expect(result.bazi.dayPillar.zhi).toBe('戌');
    expect(result.bazi.hourPillar.gan).toBe('乙');
    expect(result.bazi.hourPillar.zhi).toBe('巳');

    // 验证阴阳（辛为阴干）
    expect(result.yinYang).toBe('yin');

    // 验证五行
    expect(result.bazi.dayPillar.ganWuxing).toBe('水');
  });
});

describe('calculateBaziFromBeijingTime - 直接北京时间输入', () => {
  it('should calculate bazi correctly with direct Beijing time', () => {
    // 使用立春后时间验证
    const result = calculateBaziFromBeijingTime(2024, 2, 4, 17, 0);

    expect(result.baziString).toBe('甲辰 丙寅 戊戌 辛酉');
  });

  it('should match calculateBazi result for Shanghai timezone', () => {
    const input: IpoTimeInput = {
      date: '2001-08-27',
      time: '09:30',
      timezone: 'Asia/Shanghai',
    };

    const result1 = calculateBazi(input);
    const result2 = calculateBaziFromBeijingTime(2001, 8, 27, 9, 30);

    expect(result1.baziString).toBe(result2.baziString);
  });
});

describe('BaziResult - 结果数据完整性', () => {
  it('should include lunar date information', () => {
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '17:00',
      timezone: 'Asia/Shanghai',
    };

    const result = calculateBazi(input);

    expect(result.lunarDate).toBeDefined();
    expect(result.lunarDate.year).toBeDefined();
    expect(result.lunarDate.month).toBeDefined();
    expect(result.lunarDate.day).toBeDefined();
    // 立春后，年干支为甲辰
    expect(result.lunarDate.yearGanZhi).toBe('甲辰');
  });

  it('should include solar term information', () => {
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '17:00',
      timezone: 'Asia/Shanghai',
    };

    const result = calculateBazi(input);

    expect(result.solarTerm).toBeDefined();
    expect(result.solarTerm.prev).toBeDefined();
    expect(result.solarTerm.next).toBeDefined();
    expect(result.solarTerm.prev.name).toBeDefined();
    expect(result.solarTerm.next.name).toBeDefined();
  });

  it('should include Beijing time in result', () => {
    const input: IpoTimeInput = {
      date: '1980-12-12',
      time: '09:30',
      timezone: 'America/New_York',
    };

    const result = calculateBazi(input);

    expect(result.beijingTime).toBeDefined();
    expect(result.inputDate).toBeDefined();
  });
});

describe('五行映射验证', () => {
  it('should correctly map Tian Gan to Wu Xing', () => {
    const result = calculateBaziFromBeijingTime(2024, 2, 4, 17, 0);

    // 甲 → 木
    expect(result.bazi.yearPillar.ganWuxing).toBe('木');
    // 丙 → 火
    expect(result.bazi.monthPillar.ganWuxing).toBe('火');
    // 戊 → 土
    expect(result.bazi.dayPillar.ganWuxing).toBe('土');
    // 辛 → 金
    expect(result.bazi.hourPillar.ganWuxing).toBe('金');
  });

  it('should correctly map Di Zhi to Wu Xing', () => {
    const result = calculateBaziFromBeijingTime(2024, 2, 4, 17, 0);

    // 辰 → 土
    expect(result.bazi.yearPillar.zhiWuxing).toBe('土');
    // 寅 → 木
    expect(result.bazi.monthPillar.zhiWuxing).toBe('木');
    // 戌 → 土
    expect(result.bazi.dayPillar.zhiWuxing).toBe('土');
    // 酉 → 金
    expect(result.bazi.hourPillar.zhiWuxing).toBe('金');
  });
});

describe('Edge Cases - 边界情况', () => {
  it('should handle midnight crossing (day boundary)', () => {
    // 测试跨日边界：纽约 23:00 = 北京次日 12:00
    const input: IpoTimeInput = {
      date: '2020-01-01',
      time: '23:00',
      timezone: 'America/New_York',
    };

    const result = calculateBazi(input);

    // 应该能正常计算，不抛出错误
    expect(result.baziString).toBeDefined();
    expect(result.bazi).toBeDefined();
  });

  it('should handle daylight saving time transitions', () => {
    // 夏令时期间：纽约 09:30 EDT = 北京 21:30
    const input: IpoTimeInput = {
      date: '2020-06-15',
      time: '09:30',
      timezone: 'America/New_York',
    };

    const bjTime = toBeijingTime(input);

    // EDT (UTC-4) -> Beijing (UTC+8) = +12 hours
    expect(bjTime.hour).toBe(21);
    expect(bjTime.minute).toBe(30);
  });

  it('should handle early morning hours (子时跨日)', () => {
    // 子时 (23:00-01:00) 跨日测试
    const result1 = calculateBaziFromBeijingTime(2024, 1, 15, 23, 30);
    const result2 = calculateBaziFromBeijingTime(2024, 1, 16, 0, 30);

    // 两者时辰都应该是子时
    expect(result1.bazi.hourPillar.zhi).toBe('子');
    expect(result2.bazi.hourPillar.zhi).toBe('子');
  });

  it('should handle various exchanges', () => {
    // 东京证券交易所 (TSE) - 09:00 JST
    const tseInput: IpoTimeInput = {
      date: '2020-03-15',
      time: '09:00',
      timezone: 'Asia/Tokyo',
    };

    const tseTime = toBeijingTime(tseInput);
    // Tokyo (UTC+9) -> Beijing (UTC+8) = -1 hour
    expect(tseTime.hour).toBe(8);

    // 香港交易所 (HKEX) - 09:30 HKT
    const hkexInput: IpoTimeInput = {
      date: '2020-03-15',
      time: '09:30',
      timezone: 'Asia/Hong_Kong',
    };

    const hkexTime = toBeijingTime(hkexInput);
    // Hong Kong (UTC+8) = Beijing (UTC+8)
    expect(hkexTime.hour).toBe(9);
    expect(hkexTime.minute).toBe(30);
  });
});
