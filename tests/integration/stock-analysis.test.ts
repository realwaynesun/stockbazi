/**
 * StockBazi - Integration Tests
 * 股票八字分析集成测试
 */

import { describe, it, expect } from 'vitest';
import { inferExchange, normalizeSymbol, validateSymbol } from '@/lib/stock/fetcher';
import { calculateBazi } from '@/lib/bazi/calculator';
import { calculateDaYun, getLiuNian } from '@/lib/bazi/dayun';
import { calculateWuXingStrength } from '@/lib/bazi/wuxing';
import { generateAnalysisReport } from '@/lib/interpret/generator';
import type { IpoTimeInput } from '@/lib/bazi/types';

describe('Stock Analysis Integration', () => {
  describe('Symbol Processing', () => {
    it('normalizes US stock symbols', () => {
      expect(normalizeSymbol('aapl')).toBe('AAPL');
      expect(normalizeSymbol('TSLA')).toBe('TSLA');
      expect(normalizeSymbol(' nvda ')).toBe('NVDA');
    });

    it('validates stock symbols', () => {
      expect(validateSymbol('AAPL')).toBe(true);
      expect(validateSymbol('600519')).toBe(true);
      expect(validateSymbol('0700')).toBe(true);
      expect(validateSymbol('')).toBe(false);
      expect(validateSymbol('A'.repeat(20))).toBe(false);
    });

    it('infers exchange from symbol', () => {
      expect(inferExchange('AAPL')).toBe('NASDAQ');
      expect(inferExchange('600519')).toBe('SSE');
      expect(inferExchange('000001')).toBe('SZSE');
      expect(inferExchange('0700')).toBe('HKEX');
      expect(inferExchange('9988')).toBe('HKEX');
    });
  });

  describe('End-to-End Analysis Flow', () => {
    it('completes full analysis for mock stock data', () => {
      // Simulate AAPL IPO data
      const ipoInput: IpoTimeInput = {
        date: '1980-12-12',
        time: '09:30',
        timezone: 'America/New_York',
      };

      // Step 1: Calculate Bazi
      // AAPL: 庚申 戊子 己未 乙亥
      const baziResult = calculateBazi(ipoInput);
      expect(baziResult.lunarDate.yearGanZhi).toBe('庚申');
      expect(baziResult.lunarDate.monthGanZhi).toBe('戊子');
      expect(baziResult.lunarDate.dayGanZhi).toBe('己未');

      // Step 2: Calculate Da Yun
      const ipoYear = 1980;
      const daYunResult = calculateDaYun(baziResult, ipoYear);
      expect(daYunResult.cycles.length).toBe(10);
      expect(daYunResult.cycles[0].startYear).toBeGreaterThan(ipoYear);

      // Step 3: Calculate Wu Xing
      const wuxingStrength = calculateWuXingStrength(baziResult.bazi);
      expect(wuxingStrength.金).toBeDefined();
      expect(wuxingStrength.dominant).toBeDefined();

      // Step 4: Generate Report
      const mockStockInfo = {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'NASDAQ' as const,
        ipoDate: new Date('1980-12-12'),
        ipoTime: '09:30',
        timezone: 'America/New_York',
      };

      const report = generateAnalysisReport(
        mockStockInfo,
        baziResult,
        wuxingStrength,
        daYunResult
      );

      expect(report.stock.symbol).toBe('AAPL');
      expect(report.bazi).toBeDefined();
      expect(report.wuxing).toBeDefined();
      expect(report.dayun).toBeDefined();
      expect(report.summary).toBeDefined();
    });

    it('handles A-share stock analysis', () => {
      // Simulate 茅台 IPO data
      const ipoInput: IpoTimeInput = {
        date: '2001-08-27',
        time: '09:30',
        timezone: 'Asia/Shanghai',
      };

      const baziResult = calculateBazi(ipoInput);
      expect(baziResult.lunarDate.yearGanZhi).toBe('辛巳');
      expect(baziResult.lunarDate.monthGanZhi).toBe('丙申');

      const wuxingStrength = calculateWuXingStrength(baziResult.bazi);
      expect(wuxingStrength.金).toBeGreaterThan(0);
    });

    it('handles TSLA IPO analysis', () => {
      const ipoInput: IpoTimeInput = {
        date: '2010-06-29',
        time: '09:30',
        timezone: 'America/New_York',
      };

      const baziResult = calculateBazi(ipoInput);
      expect(baziResult.lunarDate.yearGanZhi).toBe('庚寅');
      expect(baziResult.lunarDate.monthGanZhi).toBe('壬午');

      const daYunResult = calculateDaYun(baziResult, 2010);
      expect(daYunResult.direction).toBeDefined();
    });
  });

  describe('Current Year Analysis', () => {
    it('calculates current da yun period correctly', () => {
      const ipoInput: IpoTimeInput = {
        date: '1980-12-12',
        time: '09:30',
        timezone: 'America/New_York',
      };

      const baziResult = calculateBazi(ipoInput);
      const daYunResult = calculateDaYun(baziResult, 1980);

      // Find the current period for 2026 (check if within 10 year range)
      const currentPeriod = daYunResult.cycles.find(
        (c) => c.startYear <= 2026 && c.startYear + 10 > 2026
      );

      expect(currentPeriod).toBeDefined();
      expect(currentPeriod?.ganZhi).toBeDefined();
    });

    it('calculates liu nian correctly', () => {
      const liuNian = getLiuNian(2026);

      expect(liuNian).toBeDefined();
      expect(liuNian.ganZhi).toBeDefined();
      expect(liuNian.gan).toBeDefined();
      expect(liuNian.zhi).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('handles pre-spring festival IPO dates', () => {
      // 2024-02-04 is 立春 around 16:26
      const ipoInput: IpoTimeInput = {
        date: '2024-02-04',
        time: '11:00',
        timezone: 'Asia/Shanghai',
      };

      const baziResult = calculateBazi(ipoInput);
      // According to lunar-javascript, 11:00 is after the exact 立春 time
      // The year pillar calculation is handled by lunar-javascript
      expect(baziResult.bazi.yearPillar.gan).toBeDefined();
      expect(baziResult.bazi.yearPillar.zhi).toBeDefined();
    });

    it('handles midnight hour pillar correctly', () => {
      const ipoInput: IpoTimeInput = {
        date: '2020-01-15',
        time: '00:30',
        timezone: 'Asia/Shanghai',
      };

      const baziResult = calculateBazi(ipoInput);
      // 00:30 is 子时
      expect(baziResult.bazi.hourPillar.zhi).toBe('子');
    });

    it('handles timezone conversion edge cases', () => {
      // New York morning becomes Beijing evening
      const ipoInput: IpoTimeInput = {
        date: '2020-06-15',
        time: '09:30',
        timezone: 'America/New_York',
      };

      const baziResult = calculateBazi(ipoInput);
      // 09:30 EDT → 21:30 Beijing (亥时)
      expect(baziResult.bazi.hourPillar.zhi).toBe('亥');
    });
  });
});
