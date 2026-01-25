/**
 * StockBazi - Wu Xing Strength Calculator Tests
 * 五行强度计算器单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  calculateWuXingStrength,
  getShengRelation,
  getKeRelation,
  getWuXingAttributes,
  generateWuXingSummary,
} from '@/lib/bazi/wuxing';
import { calculateBazi } from '@/lib/bazi/calculator';
import type { IpoTimeInput, Bazi, WuXing } from '@/lib/bazi/types';

describe('calculateWuXingStrength - 五行强度计算', () => {
  it('should calculate Wu Xing strength for a given Bazi', () => {
    // 立春后 2024-02-04 17:00 - 甲辰 丙寅 戊戌 辛酉
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '17:00',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    const strength = calculateWuXingStrength(baziResult.bazi);

    // 验证所有五行都有值
    expect(strength['木']).toBeGreaterThanOrEqual(0);
    expect(strength['火']).toBeGreaterThanOrEqual(0);
    expect(strength['土']).toBeGreaterThanOrEqual(0);
    expect(strength['金']).toBeGreaterThanOrEqual(0);
    expect(strength['水']).toBeGreaterThanOrEqual(0);

    // 验证总和为 100
    const total = strength['木'] + strength['火'] + strength['土'] + strength['金'] + strength['水'];
    expect(total).toBe(100);

    // 验证 dominant 和 weakest 存在
    expect(strength.dominant).toBeDefined();
    expect(strength.weakest).toBeDefined();
  });

  it('should identify dominant and weakest Wu Xing correctly', () => {
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '17:00',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    const strength = calculateWuXingStrength(baziResult.bazi);

    // dominant 应该是分数最高的
    const wuxingList: WuXing[] = ['木', '火', '土', '金', '水'];
    const maxWuxing = wuxingList.reduce((a, b) =>
      strength[a] > strength[b] ? a : b
    );
    expect(strength.dominant).toBe(maxWuxing);

    // weakest 应该是分数最低的
    const minWuxing = wuxingList.reduce((a, b) =>
      strength[a] < strength[b] ? a : b
    );
    expect(strength.weakest).toBe(minWuxing);
  });

  it('should apply month strength correctly', () => {
    // 寅月（正月）木旺
    const yinMonth: IpoTimeInput = {
      date: '2024-02-10',
      time: '09:30',
      timezone: 'Asia/Shanghai',
    };

    const baziYin = calculateBazi(yinMonth);
    const strengthYin = calculateWuXingStrength(baziYin.bazi);

    // 寅月木当令，木的强度应该相对较高
    // 但具体值取决于整个八字配置

    // 午月（五月）火旺
    const wuMonth: IpoTimeInput = {
      date: '2024-06-15',
      time: '09:30',
      timezone: 'Asia/Shanghai',
    };

    const baziWu = calculateBazi(wuMonth);
    const strengthWu = calculateWuXingStrength(baziWu.bazi);

    // 这两个八字的五行分布应该不同
    expect(strengthYin).not.toEqual(strengthWu);
  });

  it('should handle AAPL Bazi correctly', () => {
    // AAPL: 庚申 戊子 己未 乙亥
    // 金金 土水 土土 木水
    const input: IpoTimeInput = {
      date: '1980-12-12',
      time: '09:30',
      timezone: 'America/New_York',
    };

    const baziResult = calculateBazi(input);
    const strength = calculateWuXingStrength(baziResult.bazi);

    // AAPL 八字金土较多
    // 验证计算完成且数值合理
    expect(strength['金']).toBeGreaterThan(0);
    expect(strength['土']).toBeGreaterThan(0);

    // 总和为 100
    const total = Object.values(strength).slice(0, 5).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
  });

  it('should handle 茅台 Bazi correctly', () => {
    // 茅台: 辛巳 丙申 壬戌 乙巳
    // 金火 火金 水土 木火
    const input: IpoTimeInput = {
      date: '2001-08-27',
      time: '09:30',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    const strength = calculateWuXingStrength(baziResult.bazi);

    // 茅台八字火金较多
    expect(strength['火']).toBeGreaterThan(0);
    expect(strength['金']).toBeGreaterThan(0);

    // 总和为 100
    const total = Object.values(strength).slice(0, 5).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
  });
});

describe('getShengRelation - 五行相生', () => {
  it('should return correct Sheng relations', () => {
    expect(getShengRelation('木')).toBe('火'); // 木生火
    expect(getShengRelation('火')).toBe('土'); // 火生土
    expect(getShengRelation('土')).toBe('金'); // 土生金
    expect(getShengRelation('金')).toBe('水'); // 金生水
    expect(getShengRelation('水')).toBe('木'); // 水生木
  });

  it('should form a complete cycle', () => {
    let current: WuXing = '木';
    const visited = new Set<WuXing>();

    for (let i = 0; i < 5; i++) {
      visited.add(current);
      current = getShengRelation(current);
    }

    // 应该遍历所有五行
    expect(visited.size).toBe(5);
    // 最后应该回到木
    expect(current).toBe('木');
  });
});

describe('getKeRelation - 五行相克', () => {
  it('should return correct Ke relations', () => {
    expect(getKeRelation('木')).toBe('土'); // 木克土
    expect(getKeRelation('土')).toBe('水'); // 土克水
    expect(getKeRelation('水')).toBe('火'); // 水克火
    expect(getKeRelation('火')).toBe('金'); // 火克金
    expect(getKeRelation('金')).toBe('木'); // 金克木
  });

  it('should form a complete cycle', () => {
    let current: WuXing = '木';
    const visited = new Set<WuXing>();

    for (let i = 0; i < 5; i++) {
      visited.add(current);
      current = getKeRelation(current);
    }

    // 应该遍历所有五行
    expect(visited.size).toBe(5);
    // 最后应该回到木
    expect(current).toBe('木');
  });
});

describe('getWuXingAttributes - 五行属性', () => {
  it('should return correct attributes for 木', () => {
    const attrs = getWuXingAttributes('木');

    expect(attrs.color).toContain('绿');
    expect(attrs.season).toBe('春');
    expect(attrs.direction).toBe('东');
    expect(attrs.trait).toContain('生发');
  });

  it('should return correct attributes for 火', () => {
    const attrs = getWuXingAttributes('火');

    expect(attrs.color).toBe('红');
    expect(attrs.season).toBe('夏');
    expect(attrs.direction).toBe('南');
    expect(attrs.trait).toContain('炎热');
  });

  it('should return correct attributes for 土', () => {
    const attrs = getWuXingAttributes('土');

    expect(attrs.color).toBe('黄');
    expect(attrs.direction).toBe('中');
    expect(attrs.trait).toContain('承载');
  });

  it('should return correct attributes for 金', () => {
    const attrs = getWuXingAttributes('金');

    expect(attrs.color).toBe('白');
    expect(attrs.season).toBe('秋');
    expect(attrs.direction).toBe('西');
    expect(attrs.trait).toContain('收敛');
  });

  it('should return correct attributes for 水', () => {
    const attrs = getWuXingAttributes('水');

    expect(attrs.color).toBe('黑');
    expect(attrs.season).toBe('冬');
    expect(attrs.direction).toBe('北');
    expect(attrs.trait).toContain('寒冷');
  });
});

describe('generateWuXingSummary - 五行摘要生成', () => {
  it('should generate a summary string', () => {
    const input: IpoTimeInput = {
      date: '2024-02-04',
      time: '17:00',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    const strength = calculateWuXingStrength(baziResult.bazi);
    const summary = generateWuXingSummary(strength);

    // 摘要应该包含最强五行
    expect(summary).toContain(strength.dominant);

    // 摘要应该包含最弱五行
    expect(summary).toContain(strength.weakest);

    // 摘要应该包含百分比
    expect(summary).toContain('%');
  });

  it('should generate different summaries for different Bazi', () => {
    const input1: IpoTimeInput = {
      date: '2024-02-04',
      time: '17:00',
      timezone: 'Asia/Shanghai',
    };

    const input2: IpoTimeInput = {
      date: '2001-08-27',
      time: '09:30',
      timezone: 'Asia/Shanghai',
    };

    const bazi1 = calculateBazi(input1);
    const bazi2 = calculateBazi(input2);

    const strength1 = calculateWuXingStrength(bazi1.bazi);
    const strength2 = calculateWuXingStrength(bazi2.bazi);

    const summary1 = generateWuXingSummary(strength1);
    const summary2 = generateWuXingSummary(strength2);

    // 不同的八字应该生成不同的摘要（如果dominant/weakest不同）
    if (strength1.dominant !== strength2.dominant || strength1.weakest !== strength2.weakest) {
      expect(summary1).not.toBe(summary2);
    }
  });
});
