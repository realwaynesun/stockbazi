/**
 * 市相 - Curated IPO Data
 * 精选股票IPO数据
 *
 * Data Sources:
 * - US Stocks: Wikipedia (CC BY-SA), SEC EDGAR filings (public domain)
 * - A-shares: 上海证券交易所官网, 深圳证券交易所官网
 * - HK Stocks: 香港交易所官网
 * - Japan Stocks: 日本取引所グループ (JPX)
 *
 * All IPO dates are factual public information about when securities began trading.
 */

import type { IpoEntry } from './types';
import { US_IPO_DATA } from './us';
import { CN_IPO_DATA } from './cn';
import { HK_IPO_DATA } from './hk';
import { JP_IPO_DATA } from './jp';

export type { IpoEntry } from './types';

/**
 * IPO数据表 - 使用交易所前缀作为键以避免冲突
 * Key format: EXCHANGE:SYMBOL (e.g., NASDAQ:AAPL, SSE:600519, HKEX:0700)
 */
export const IPO_DATA: Record<string, IpoEntry> = {
  ...US_IPO_DATA,
  ...CN_IPO_DATA,
  ...HK_IPO_DATA,
  ...JP_IPO_DATA,
};

/**
 * 获取所有支持的股票代码列表
 */
export function getSupportedSymbols(): string[] {
  return Object.keys(IPO_DATA).map(key => {
    const [, symbol] = key.split(':');
    return symbol;
  });
}

/**
 * 获取按交易所分组的股票数量
 */
export function getStockCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const key of Object.keys(IPO_DATA)) {
    const [exchange] = key.split(':');
    counts[exchange] = (counts[exchange] || 0) + 1;
  }
  return counts;
}
