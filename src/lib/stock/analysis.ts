/**
 * 市相 - Shared Stock Analysis
 * 提取的股票分析函数，供 stock page 和 guide page 共用
 */

import { fetchStockInfo, inferExchange, normalizeSymbol, validateSymbol } from '@/lib/stock/fetcher';
import { calculateBazi } from '@/lib/bazi/calculator';
import { calculateDaYun } from '@/lib/bazi/dayun';
import { calculateWuXingStrength } from '@/lib/bazi/wuxing';
import { generateAnalysisReport, type AnalysisReport } from '@/lib/interpret/generator';
import { calculateForecast, type ForecastResult } from '@/lib/forecast';
import { formatDateString } from '@/lib/utils';
import type { IpoTimeInput } from '@/lib/bazi/types';

/**
 * 股票分析结果
 */
export interface StockAnalysisResult {
  report: AnalysisReport | null;
  forecast: ForecastResult | null;
  stockInfo: Awaited<ReturnType<typeof fetchStockInfo>>['data'] | null;
  noIpoData: boolean;
  usedTime: string;
  defaultTime: string;
}

/**
 * 验证时间格式 (HH:MM)
 */
export function isValidTime(time?: string): boolean {
  if (!time) return false;
  return /^([01]?\d|2[0-3]):([0-5]\d)$/.test(time);
}

/**
 * 获取股票分析数据
 * @param rawSymbol - 股票代码
 * @param customTime - 自定义 IPO 时间（可选，格式 HH:MM）
 */
export async function getStockAnalysis(
  rawSymbol: string,
  customTime?: string
): Promise<StockAnalysisResult> {
  const emptyResult: StockAnalysisResult = {
    report: null,
    forecast: null,
    stockInfo: null,
    noIpoData: false,
    usedTime: '09:30',
    defaultTime: '09:30',
  };

  try {
    const symbol = normalizeSymbol(rawSymbol);
    if (!validateSymbol(symbol)) {
      return emptyResult;
    }

    const exchange = inferExchange(symbol);
    if (!exchange) {
      return emptyResult;
    }

    const fetchResult = await fetchStockInfo(symbol, exchange);
    if (!fetchResult.success || !fetchResult.data) {
      return emptyResult;
    }

    const stockInfo = fetchResult.data;
    const defaultTime = stockInfo.ipoTime;

    if (!stockInfo.ipoDate) {
      return {
        report: null,
        forecast: null,
        stockInfo,
        noIpoData: true,
        usedTime: defaultTime,
        defaultTime,
      };
    }

    const usedTime = isValidTime(customTime) ? customTime! : defaultTime;

    const ipoInput: IpoTimeInput = {
      date: formatDateString(stockInfo.ipoDate),
      time: usedTime,
      timezone: stockInfo.timezone,
    };

    const baziResult = calculateBazi(ipoInput);
    const ipoYear = stockInfo.ipoDate.getFullYear();
    const daYunResult = calculateDaYun(baziResult, ipoYear);
    const wuxingStrength = calculateWuXingStrength(baziResult.bazi);

    const updatedStockInfo = { ...stockInfo, ipoTime: usedTime };

    const report = generateAnalysisReport(
      updatedStockInfo,
      baziResult,
      wuxingStrength,
      daYunResult
    );

    const forecast = calculateForecast(
      baziResult.bazi.dayPillar.gan,
      baziResult.bazi
    );

    return {
      report,
      forecast,
      stockInfo: updatedStockInfo,
      noIpoData: false,
      usedTime,
      defaultTime,
    };
  } catch (error) {
    console.error('Error analyzing stock:', error);
    return emptyResult;
  }
}
