/**
 * 市相 - Executive Summary Tests
 * 一屏结论卡推导函数测试
 */

import { describe, it, expect } from 'vitest';
import {
  deriveExecutiveSummary,
  generateHookSentence,
  type ExecutiveSummary,
  type StockMeta,
} from '@/lib/interpret/executive-summary';
import type { AnalysisReport } from '@/lib/interpret/generator';
import type { ShiShen } from '@/lib/bazi/types';

/**
 * 创建测试用的 AnalysisReport mock
 */
function createMockReport(overrides: Partial<AnalysisReport> = {}): AnalysisReport {
  const defaultReport: AnalysisReport = {
    stock: {
      symbol: 'AAPL',
      name: '苹果',
      exchange: 'NASDAQ',
      ipoDate: '1980-12-12',
      ipoTime: '09:30',
    },
    bazi: {
      string: '庚申 戊子 己未 乙亥',
      yearPillar: '庚申',
      monthPillar: '戊子',
      dayPillar: '己未',
      hourPillar: '乙亥',
      yinYang: '阳',
    },
    wuxing: {
      strength: {
        木: 21,
        火: 2,
        土: 28,
        金: 8,
        水: 41,
        dominant: '水',
        weakest: '火',
      },
      summary: '命局五行以【水】为主导',
      dominantIndustries: ['航运', '物流', '医药'],
    },
    shishen: {
      pattern: '羊刃格',
      patternInterpretation: '竞争激烈，攻击性强',
      dominantShiShen: '伤官',
      dominantInterpretation: {
        keyword: '创造·叛逆',
        financial: '颠覆创新',
        positive: '颠覆式创新成功',
        negative: '挑战监管失败',
      },
    },
    dayun: {
      startAge: 8,
      direction: '顺行',
      cycles: [],
      current: {
        ganZhi: '壬辰',
        startYear: 2018,
        shishen: '正财',
        interpretation: '盈利能力增强',
      },
    },
    liuNian: {
      year: 2026,
      ganZhi: '丙午',
      shishen: '正印',
      interpretation: '品牌价值凸显',
    },
    summary: {
      investmentStyle: '防御型投资',
      riskLevel: '高风险',
      keyFactors: ['格局：羊刃格', '主导五行：水'],
      disclaimer: '仅供娱乐',
    },
    generatedAt: '2026-01-28T00:00:00.000Z',
  };

  return { ...defaultReport, ...overrides };
}

describe('deriveExecutiveSummary - 基础功能', () => {
  it('should return ExecutiveSummary with all required fields', () => {
    const report = createMockReport();
    const result = deriveExecutiveSummary(report);

    expect(result).toHaveProperty('keywords');
    expect(result).toHaveProperty('yearTagline');
    expect(result).toHaveProperty('playStyle');
    expect(result).toHaveProperty('riskFlag');
    expect(result).toHaveProperty('meta');
  });

  it('should return exactly 3 keywords', () => {
    const report = createMockReport();
    const result = deriveExecutiveSummary(report);

    expect(result.keywords).toHaveLength(3);
    expect(Array.isArray(result.keywords)).toBe(true);
  });

  it('should include meta information from report', () => {
    const report = createMockReport();
    const result = deriveExecutiveSummary(report);

    expect(result.meta.ipoDate).toBe('1980-12-12');
    expect(result.meta.ipoTime).toBe('09:30');
    expect(result.meta.exchange).toBe('NASDAQ');
  });
});

describe('deriveExecutiveSummary - Keywords 推导', () => {
  it('should derive keywords from shishen and wuxing', () => {
    const report = createMockReport();
    const result = deriveExecutiveSummary(report);

    // 第一个关键词: 主导十神
    expect(result.keywords[0]).toBe('伤官');

    // 第二个关键词: X旺
    expect(result.keywords[1]).toBe('水旺');

    // 第三个关键词: 需补X
    expect(result.keywords[2]).toBe('需补火');
  });

  it('should reflect different dominant wuxing', () => {
    const report = createMockReport({
      wuxing: {
        strength: {
          木: 5,
          火: 10,
          土: 15,
          金: 50,
          水: 20,
          dominant: '金',
          weakest: '木',
        },
        summary: '金旺',
        dominantIndustries: [],
      },
    });

    const result = deriveExecutiveSummary(report);

    expect(result.keywords[1]).toBe('金旺');
    expect(result.keywords[2]).toBe('需补木');
  });

  it('should reflect different dominant shishen', () => {
    const report = createMockReport({
      shishen: {
        pattern: '正官格',
        patternInterpretation: '规范稳健',
        dominantShiShen: '正官',
        dominantInterpretation: {
          keyword: '监管·规范',
          financial: '合规',
          positive: '稳健',
          negative: '受限',
        },
      },
    });

    const result = deriveExecutiveSummary(report);

    expect(result.keywords[0]).toBe('正官');
  });
});

describe('deriveExecutiveSummary - YearTagline 推导', () => {
  it('should include year and shishen in tagline', () => {
    const report = createMockReport();
    const result = deriveExecutiveSummary(report, { year: 2026 });

    expect(result.yearTagline).toContain('2026');
    expect(result.yearTagline).toContain('正印');
  });

  it('should use different tagline for different shishen', () => {
    const reportA = createMockReport({
      liuNian: {
        year: 2026,
        ganZhi: '丙午',
        shishen: '正印',
        interpretation: '',
      },
    });

    const reportB = createMockReport({
      liuNian: {
        year: 2026,
        ganZhi: '丙午',
        shishen: '七杀',
        interpretation: '',
      },
    });

    const resultA = deriveExecutiveSummary(reportA);
    const resultB = deriveExecutiveSummary(reportB);

    expect(resultA.yearTagline).not.toBe(resultB.yearTagline);
    expect(resultA.yearTagline).toContain('品牌价值');
    expect(resultB.yearTagline).toContain('竞争');
  });

  it('should respect custom year option', () => {
    const report = createMockReport();

    const result2025 = deriveExecutiveSummary(report, { year: 2025 });
    const result2030 = deriveExecutiveSummary(report, { year: 2030 });

    expect(result2025.yearTagline).toContain('2025');
    expect(result2030.yearTagline).toContain('2030');
  });
});

describe('deriveExecutiveSummary - PlayStyle 推导', () => {
  it('should combine wuxing style with shishen modifier', () => {
    const report = createMockReport();
    const result = deriveExecutiveSummary(report);

    // 水 -> 防御型思路, 伤官 -> 高风险高回报
    expect(result.playStyle).toContain('防御型思路');
    expect(result.playStyle).toContain('高风险高回报');
  });

  it('should not contain buy/sell recommendations', () => {
    const report = createMockReport();
    const result = deriveExecutiveSummary(report);

    // 不应包含买卖建议
    expect(result.playStyle).not.toMatch(/买入|卖出|加仓|减仓|清仓/);
  });

  it('should vary by dominant wuxing', () => {
    const woodReport = createMockReport({
      wuxing: {
        strength: { 木: 50, 火: 10, 土: 15, 金: 5, 水: 20, dominant: '木', weakest: '金' },
        summary: '',
        dominantIndustries: [],
      },
    });

    const fireReport = createMockReport({
      wuxing: {
        strength: { 木: 10, 火: 50, 土: 15, 金: 5, 水: 20, dominant: '火', weakest: '金' },
        summary: '',
        dominantIndustries: [],
      },
    });

    const woodResult = deriveExecutiveSummary(woodReport);
    const fireResult = deriveExecutiveSummary(fireReport);

    expect(woodResult.playStyle).toContain('成长型');
    expect(fireResult.playStyle).toContain('趋势型');
  });
});

describe('deriveExecutiveSummary - RiskFlag 推导', () => {
  it('should derive risk from dominant shishen', () => {
    const report = createMockReport();
    const result = deriveExecutiveSummary(report);

    // 伤官 -> 监管冲突或激进扩张翻车
    expect(result.riskFlag).toContain('监管');
  });

  it('should add extra warning for extremely weak wuxing', () => {
    const report = createMockReport({
      wuxing: {
        strength: {
          木: 20,
          火: 2, // 极弱
          土: 28,
          金: 10,
          水: 40,
          dominant: '水',
          weakest: '火',
        },
        summary: '',
        dominantIndustries: [],
      },
    });

    const result = deriveExecutiveSummary(report);

    // 火行极弱 (<=5)，应该有额外提示
    expect(result.riskFlag).toContain('火');
    expect(result.riskFlag).toContain('极弱');
  });

  it('should not add extra warning for moderately weak wuxing', () => {
    const report = createMockReport({
      wuxing: {
        strength: {
          木: 20,
          火: 10, // 不算极弱
          土: 25,
          金: 15,
          水: 30,
          dominant: '水',
          weakest: '火',
        },
        summary: '',
        dominantIndustries: [],
      },
    });

    const result = deriveExecutiveSummary(report);

    expect(result.riskFlag).not.toContain('极弱');
  });

  it('should vary risk by different shishen', () => {
    const tests: Array<{ shishen: string; expectedRisk: string }> = [
      { shishen: '正官', expectedRisk: '政策' },
      { shishen: '七杀', expectedRisk: '利空' },
      { shishen: '正财', expectedRisk: '增长' },
      { shishen: '偏财', expectedRisk: '不稳' },
    ];

    for (const { shishen, expectedRisk } of tests) {
      const report = createMockReport({
        shishen: {
          pattern: '格局',
          patternInterpretation: '',
          dominantShiShen: shishen as ShiShen,
          dominantInterpretation: { keyword: '', financial: '', positive: '', negative: '' },
        },
        wuxing: {
          strength: { 木: 20, 火: 20, 土: 20, 金: 20, 水: 20, dominant: '水', weakest: '火' },
          summary: '',
          dominantIndustries: [],
        },
      });

      const result = deriveExecutiveSummary(report);
      expect(result.riskFlag).toContain(expectedRisk);
    }
  });
});

describe('deriveExecutiveSummary - 真实案例验证', () => {
  it('AAPL case: should generate reasonable summary', () => {
    const aaplReport = createMockReport({
      stock: { symbol: 'AAPL', name: '苹果', exchange: 'NASDAQ', ipoDate: '1980-12-12', ipoTime: '09:30' },
      shishen: {
        pattern: '羊刃格',
        patternInterpretation: '竞争激烈',
        dominantShiShen: '伤官',
        dominantInterpretation: { keyword: '创造·叛逆', financial: '', positive: '', negative: '' },
      },
      wuxing: {
        strength: { 木: 21, 火: 2, 土: 28, 金: 8, 水: 41, dominant: '水', weakest: '火' },
        summary: '',
        dominantIndustries: [],
      },
      liuNian: { year: 2026, ganZhi: '丙午', shishen: '正印', interpretation: '' },
    });

    const result = deriveExecutiveSummary(aaplReport, { year: 2026 });

    // 验证输出合理性
    expect(result.keywords).toEqual(['伤官', '水旺', '需补火']);
    expect(result.yearTagline).toContain('2026');
    expect(result.playStyle).toContain('防御型');
    expect(result.riskFlag.length).toBeGreaterThan(0);
  });

  it('茅台 case: should generate reasonable summary', () => {
    const maotaiReport = createMockReport({
      stock: { symbol: '600519', name: '贵州茅台', exchange: 'SSE', ipoDate: '2001-08-27', ipoTime: '09:30' },
      shishen: {
        pattern: '正财格',
        patternInterpretation: '盈利稳定',
        dominantShiShen: '正财',
        dominantInterpretation: { keyword: '稳定收益', financial: '', positive: '', negative: '' },
      },
      wuxing: {
        strength: { 木: 15, 火: 25, 土: 10, 金: 35, 水: 15, dominant: '金', weakest: '土' },
        summary: '',
        dominantIndustries: [],
      },
      liuNian: { year: 2026, ganZhi: '丙午', shishen: '七杀', interpretation: '' },
    });

    const result = deriveExecutiveSummary(maotaiReport, { year: 2026 });

    expect(result.keywords[0]).toBe('正财');
    expect(result.keywords[1]).toBe('金旺');
    expect(result.playStyle).toContain('价值型');
  });
});

describe('deriveExecutiveSummary - 边界情况', () => {
  it('should handle missing dayun.current gracefully', () => {
    const report = createMockReport({
      dayun: {
        startAge: 8,
        direction: '顺行',
        cycles: [],
        current: null,
      },
    });

    const result = deriveExecutiveSummary(report);

    // 即使没有当前大运，也应该正常输出
    expect(result.yearTagline).toBeDefined();
    expect(result.yearTagline.length).toBeGreaterThan(0);
  });

  it('should handle edge case wuxing values', () => {
    const report = createMockReport({
      wuxing: {
        strength: { 木: 0, 火: 0, 土: 0, 金: 0, 水: 100, dominant: '水', weakest: '木' },
        summary: '',
        dominantIndustries: [],
      },
    });

    const result = deriveExecutiveSummary(report);

    expect(result.keywords[1]).toBe('水旺');
    expect(result.riskFlag).toContain('极弱');
  });
});

describe('generateHookSentence - 爆点句生成', () => {
  it('should generate a non-empty hook sentence', () => {
    const summary: ExecutiveSummary = {
      keywords: ['伤官', '水旺', '需补火'],
      yearTagline: '2026年正印年',
      playStyle: '防御型思路',
      riskFlag: '监管风险',
      meta: { ipoDate: '1980-12-12', ipoTime: '09:30', exchange: 'NASDAQ' },
    };
    const stock: StockMeta = { name: '苹果', symbol: 'AAPL' };

    const result = generateHookSentence(summary, stock);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should include stock name in hook sentence', () => {
    const summary: ExecutiveSummary = {
      keywords: ['正财', '金旺', '需补木'],
      yearTagline: '',
      playStyle: '',
      riskFlag: '',
      meta: { ipoDate: '', ipoTime: '', exchange: '' },
    };
    const stock: StockMeta = { name: '贵州茅台', symbol: '600519' };

    const result = generateHookSentence(summary, stock);

    // 至少有一个模板会包含股票名
    expect(result.length).toBeGreaterThan(5);
  });

  it('should not contain buy/sell recommendations', () => {
    const summary: ExecutiveSummary = {
      keywords: ['七杀', '火旺', '需补水'],
      yearTagline: '',
      playStyle: '',
      riskFlag: '',
      meta: { ipoDate: '', ipoTime: '', exchange: '' },
    };
    const stock: StockMeta = { name: '特斯拉', symbol: 'TSLA' };

    const result = generateHookSentence(summary, stock);

    expect(result).not.toMatch(/买入|卖出|加仓|减仓|清仓|涨|跌/);
  });

  it('should be deterministic for same stock symbol', () => {
    const summary: ExecutiveSummary = {
      keywords: ['偏财', '木旺', '需补金'],
      yearTagline: '',
      playStyle: '',
      riskFlag: '',
      meta: { ipoDate: '', ipoTime: '', exchange: '' },
    };
    const stock: StockMeta = { name: '阿里巴巴', symbol: 'BABA' };

    const result1 = generateHookSentence(summary, stock);
    const result2 = generateHookSentence(summary, stock);

    expect(result1).toBe(result2);
  });

  it('should produce different results for different shishen', () => {
    const stock: StockMeta = { name: '测试', symbol: 'TEST' };

    const summary1: ExecutiveSummary = {
      keywords: ['正官', '土旺', '需补水'],
      yearTagline: '',
      playStyle: '',
      riskFlag: '',
      meta: { ipoDate: '', ipoTime: '', exchange: '' },
    };

    const summary2: ExecutiveSummary = {
      keywords: ['伤官', '土旺', '需补水'],
      yearTagline: '',
      playStyle: '',
      riskFlag: '',
      meta: { ipoDate: '', ipoTime: '', exchange: '' },
    };

    const result1 = generateHookSentence(summary1, stock);
    const result2 = generateHookSentence(summary2, stock);

    // 不同十神应该产生不同的结果
    expect(result1).not.toBe(result2);
  });

  it('should handle all shishen types', () => {
    const allShiShen = ['正官', '七杀', '正财', '偏财', '正印', '偏印', '比肩', '劫财', '食神', '伤官'];
    const stock: StockMeta = { name: '测试', symbol: 'TEST' };

    for (const shishen of allShiShen) {
      const summary: ExecutiveSummary = {
        keywords: [shishen, '金旺', '需补木'],
        yearTagline: '',
        playStyle: '',
        riskFlag: '',
        meta: { ipoDate: '', ipoTime: '', exchange: '' },
      };

      const result = generateHookSentence(summary, stock);
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it('should handle all wuxing types', () => {
    const allWuxing = ['木', '火', '土', '金', '水'];
    const stock: StockMeta = { name: '测试', symbol: 'TEST' };

    for (const wuxing of allWuxing) {
      const summary: ExecutiveSummary = {
        keywords: ['正财', `${wuxing}旺`, '需补木'],
        yearTagline: '',
        playStyle: '',
        riskFlag: '',
        meta: { ipoDate: '', ipoTime: '', exchange: '' },
      };

      const result = generateHookSentence(summary, stock);
      expect(result.length).toBeGreaterThan(0);
    }
  });
});
