/**
 * ShiXiang - Shi Shen (Ten Gods) Tests
 * 十神计算单元测试
 */

import { describe, it, expect } from 'vitest';
import {
  calculateShiShen,
  calculatePillarShiShen,
  calculateBaziShiShen,
  getShiShenAbbr,
  getShiShenCategory,
} from '@/lib/bazi/shishen';
import { calculateBazi } from '@/lib/bazi/calculator';
import type { TianGan, Pillar, IpoTimeInput } from '@/lib/bazi/types';

describe('calculateShiShen - 单天干十神计算', () => {
  describe('Day Master: 甲 (Wood-Yang)', () => {
    const dayGan: TianGan = '甲';

    it('should return 比肩 for same element, same yinyang', () => {
      // 甲 vs 甲: both 木-yang
      expect(calculateShiShen(dayGan, '甲')).toBe('比肩');
    });

    it('should return 劫财 for same element, different yinyang', () => {
      // 甲 vs 乙: both 木, but 甲=yang, 乙=yin
      expect(calculateShiShen(dayGan, '乙')).toBe('劫财');
    });

    it('should return 食神 for day master generates target, same yinyang', () => {
      // 甲(木-yang) 生 丙(火-yang)
      expect(calculateShiShen(dayGan, '丙')).toBe('食神');
    });

    it('should return 伤官 for day master generates target, different yinyang', () => {
      // 甲(木-yang) 生 丁(火-yin)
      expect(calculateShiShen(dayGan, '丁')).toBe('伤官');
    });

    it('should return 偏财 for day master conquers target, same yinyang', () => {
      // 甲(木-yang) 克 戊(土-yang)
      expect(calculateShiShen(dayGan, '戊')).toBe('偏财');
    });

    it('should return 正财 for day master conquers target, different yinyang', () => {
      // 甲(木-yang) 克 己(土-yin)
      expect(calculateShiShen(dayGan, '己')).toBe('正财');
    });

    it('should return 七杀 for target conquers day master, same yinyang', () => {
      // 庚(金-yang) 克 甲(木-yang)
      expect(calculateShiShen(dayGan, '庚')).toBe('七杀');
    });

    it('should return 正官 for target conquers day master, different yinyang', () => {
      // 辛(金-yin) 克 甲(木-yang)
      expect(calculateShiShen(dayGan, '辛')).toBe('正官');
    });

    it('should return 偏印 for target generates day master, same yinyang', () => {
      // 壬(水-yang) 生 甲(木-yang)
      expect(calculateShiShen(dayGan, '壬')).toBe('偏印');
    });

    it('should return 正印 for target generates day master, different yinyang', () => {
      // 癸(水-yin) 生 甲(木-yang)
      expect(calculateShiShen(dayGan, '癸')).toBe('正印');
    });
  });

  describe('Day Master: 庚 (Metal-Yang)', () => {
    const dayGan: TianGan = '庚';

    it('should return 比肩 for same element, same yinyang', () => {
      // 庚 vs 庚: both 金-yang
      expect(calculateShiShen(dayGan, '庚')).toBe('比肩');
    });

    it('should return 劫财 for same element, different yinyang', () => {
      // 庚 vs 辛: both 金, but 庚=yang, 辛=yin
      expect(calculateShiShen(dayGan, '辛')).toBe('劫财');
    });

    it('should return 食神 for day master generates target, same yinyang', () => {
      // 庚(金-yang) 生 壬(水-yang)
      expect(calculateShiShen(dayGan, '壬')).toBe('食神');
    });

    it('should return 伤官 for day master generates target, different yinyang', () => {
      // 庚(金-yang) 生 癸(水-yin)
      expect(calculateShiShen(dayGan, '癸')).toBe('伤官');
    });

    it('should return 偏财 for day master conquers target, same yinyang', () => {
      // 庚(金-yang) 克 甲(木-yang)
      expect(calculateShiShen(dayGan, '甲')).toBe('偏财');
    });

    it('should return 正财 for day master conquers target, different yinyang', () => {
      // 庚(金-yang) 克 乙(木-yin)
      expect(calculateShiShen(dayGan, '乙')).toBe('正财');
    });

    it('should return 七杀 for target conquers day master, same yinyang', () => {
      // 丙(火-yang) 克 庚(金-yang)
      expect(calculateShiShen(dayGan, '丙')).toBe('七杀');
    });

    it('should return 正官 for target conquers day master, different yinyang', () => {
      // 丁(火-yin) 克 庚(金-yang)
      expect(calculateShiShen(dayGan, '丁')).toBe('正官');
    });

    it('should return 偏印 for target generates day master, same yinyang', () => {
      // 戊(土-yang) 生 庚(金-yang)
      expect(calculateShiShen(dayGan, '戊')).toBe('偏印');
    });

    it('should return 正印 for target generates day master, different yinyang', () => {
      // 己(土-yin) 生 庚(金-yang)
      expect(calculateShiShen(dayGan, '己')).toBe('正印');
    });
  });
});

describe('calculatePillarShiShen - 单柱十神计算', () => {
  it('should calculate pillar shishen correctly for AAPL year pillar', () => {
    // AAPL: 庚申 戊子 己未 乙亥
    // Day Gan: 己 (土-yin)
    // Year Pillar: 庚申
    const dayGan: TianGan = '己';
    const yearPillar: Pillar = {
      gan: '庚',
      zhi: '申',
      ganWuxing: '金',
      zhiWuxing: '金',
    };

    const result = calculatePillarShiShen(dayGan, yearPillar);

    // 己(土-yin) vs 庚(金-yang): 己生庚, different yinyang → 伤官
    expect(result.gan).toBe('伤官');

    // 申的藏干: 庚(0.6), 壬(0.3), 戊(0.1)
    expect(result.zhiZangGan).toHaveLength(3);
    expect(result.zhiZangGan[0].gan).toBe('庚');
    expect(result.zhiZangGan[0].shishen).toBe('伤官');
    expect(result.zhiZangGan[0].weight).toBe(0.6);

    // 主气应该是权重最高的藏干
    expect(result.zhiMainShiShen).toBe('伤官');
  });

  it('should calculate pillar shishen correctly for TSLA month pillar', () => {
    // TSLA: 庚寅 壬午 庚戌 丁亥
    // Day Gan: 庚 (金-yang)
    // Month Pillar: 壬午
    const dayGan: TianGan = '庚';
    const monthPillar: Pillar = {
      gan: '壬',
      zhi: '午',
      ganWuxing: '水',
      zhiWuxing: '火',
    };

    const result = calculatePillarShiShen(dayGan, monthPillar);

    // 庚(金-yang) vs 壬(水-yang): 庚生壬, same yinyang → 食神
    expect(result.gan).toBe('食神');

    // 午的藏干: 丁(0.7), 己(0.3)
    expect(result.zhiZangGan).toHaveLength(2);
    expect(result.zhiZangGan.some(z => z.gan === '丁' && z.weight === 0.7)).toBe(true);
    expect(result.zhiZangGan.some(z => z.gan === '己' && z.weight === 0.3)).toBe(true);

    // 主气: 丁(火-yin) vs 庚(金-yang): 丁克庚, different yinyang → 正官
    expect(result.zhiMainShiShen).toBe('正官');
  });
});

describe('calculateBaziShiShen - 完整八字十神计算', () => {
  it('should calculate full bazi shishen for AAPL', () => {
    const input: IpoTimeInput = {
      date: '1980-12-12',
      time: '09:30',
      timezone: 'America/New_York',
    };

    const baziResult = calculateBazi(input);
    const shishenResult = calculateBaziShiShen(baziResult.bazi);

    // Day Gan: 己
    expect(baziResult.bazi.dayPillar.gan).toBe('己');

    // Day pillar gan should always be 比肩 (self)
    expect(shishenResult.dayPillar.gan).toBe('比肩');

    // Should have all four pillars
    expect(shishenResult.yearPillar).toBeDefined();
    expect(shishenResult.monthPillar).toBeDefined();
    expect(shishenResult.dayPillar).toBeDefined();
    expect(shishenResult.hourPillar).toBeDefined();

    // Should have shishen counts
    expect(shishenResult.shishenCount).toBeDefined();
    expect(Object.keys(shishenResult.shishenCount)).toHaveLength(10);

    // Should have dominant shishen
    expect(shishenResult.dominantShiShen).toBeDefined();

    // Should have pattern
    expect(shishenResult.pattern).toBeDefined();
    expect(typeof shishenResult.pattern).toBe('string');
  });

  it('should calculate full bazi shishen for TSLA', () => {
    const input: IpoTimeInput = {
      date: '2010-06-29',
      time: '09:30',
      timezone: 'America/New_York',
    };

    const baziResult = calculateBazi(input);
    const shishenResult = calculateBaziShiShen(baziResult.bazi);

    // Day Gan: 庚
    expect(baziResult.bazi.dayPillar.gan).toBe('庚');

    // Day pillar gan should always be 比肩 (self)
    expect(shishenResult.dayPillar.gan).toBe('比肩');

    // Year pillar gan: 庚 vs day gan: 庚 → 比肩
    expect(shishenResult.yearPillar.gan).toBe('比肩');

    // Should have all four pillars
    expect(shishenResult.yearPillar).toBeDefined();
    expect(shishenResult.monthPillar).toBeDefined();
    expect(shishenResult.dayPillar).toBeDefined();
    expect(shishenResult.hourPillar).toBeDefined();

    // Should have dominant shishen
    expect(shishenResult.dominantShiShen).toBeDefined();

    // Should have pattern
    expect(shishenResult.pattern).toBeDefined();
  });

  it('should calculate full bazi shishen for 茅台', () => {
    const input: IpoTimeInput = {
      date: '2001-08-27',
      time: '09:30',
      timezone: 'Asia/Shanghai',
    };

    const baziResult = calculateBazi(input);
    const shishenResult = calculateBaziShiShen(baziResult.bazi);

    // Day Gan: 壬
    expect(baziResult.bazi.dayPillar.gan).toBe('壬');

    // Day pillar gan should always be 比肩 (self)
    expect(shishenResult.dayPillar.gan).toBe('比肩');

    // Should have all components
    expect(shishenResult.shishenCount).toBeDefined();
    expect(shishenResult.dominantShiShen).toBeDefined();
    expect(shishenResult.pattern).toBeDefined();
  });
});

describe('getShiShenAbbr - 十神简称', () => {
  it('should return correct abbreviations for all 10 shishen', () => {
    expect(getShiShenAbbr('比肩')).toBe('比');
    expect(getShiShenAbbr('劫财')).toBe('劫');
    expect(getShiShenAbbr('食神')).toBe('食');
    expect(getShiShenAbbr('伤官')).toBe('伤');
    expect(getShiShenAbbr('偏财')).toBe('偏');
    expect(getShiShenAbbr('正财')).toBe('正');
    expect(getShiShenAbbr('七杀')).toBe('杀');
    expect(getShiShenAbbr('正官')).toBe('官');
    expect(getShiShenAbbr('偏印')).toBe('枭');
    expect(getShiShenAbbr('正印')).toBe('印');
  });
});

describe('getShiShenCategory - 十神类别', () => {
  it('should return correct categories for all 10 shishen', () => {
    // 比劫类
    expect(getShiShenCategory('比肩')).toBe('比劫');
    expect(getShiShenCategory('劫财')).toBe('比劫');

    // 食伤类
    expect(getShiShenCategory('食神')).toBe('食伤');
    expect(getShiShenCategory('伤官')).toBe('食伤');

    // 财星类
    expect(getShiShenCategory('偏财')).toBe('财星');
    expect(getShiShenCategory('正财')).toBe('财星');

    // 官杀类
    expect(getShiShenCategory('七杀')).toBe('官杀');
    expect(getShiShenCategory('正官')).toBe('官杀');

    // 印星类
    expect(getShiShenCategory('偏印')).toBe('印星');
    expect(getShiShenCategory('正印')).toBe('印星');
  });
});
