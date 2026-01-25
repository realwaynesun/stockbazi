/**
 * 市相 - Stock Data Types
 * 股票数据类型定义
 */

// 支持的交易所
export type Exchange = 'NYSE' | 'NASDAQ' | 'SSE' | 'SZSE' | 'HKEX' | 'TSE';

// 交易所配置
export interface ExchangeConfig {
  name: string;           // 交易所名称
  suffix: string;         // Yahoo Finance 股票代码后缀
  defaultOpenTime: string; // 默认开盘时间
  timezone: string;       // 时区
  currency: string;       // 货币
}

// 股票基本信息
export interface StockInfo {
  symbol: string;         // 股票代码（不含后缀）
  name: string;           // 股票名称
  exchange: Exchange;     // 交易所
  ipoDate: Date | null;   // IPO 日期（null 表示暂无数据）
  ipoTime: string;        // IPO 时间 (HH:mm)
  timezone: string;       // 时区
  currency?: string;      // 货币
  sector?: string;        // 行业
  industry?: string;      // 细分行业
  price?: number;         // 当前价格
  prevClose?: number;     // 昨收价
  change?: number;        // 涨跌额
  changePct?: number;     // 涨跌幅 (%)
}

// 静态股票数据（来自 JSON 文件）
export interface StaticStockData {
  symbol: string;         // 格式：CN:600519, US:AAPL
  code: string;           // 原始代码：600519, AAPL
  name: string;           // 股票名称
  price: number;          // 当前价格
  prev_close: number;     // 昨收价
  change: number;         // 涨跌额
  change_pct: number;     // 涨跌幅 (%)
}

// 静态数据文件格式
export interface StaticStockFile {
  metadata: {
    updated_at: string;
    counts?: {
      CN: number;
      HK: number;
      US: number;
      total: number;
    };
    count?: number;
  };
  stocks?: StaticStockData[];
  index?: Record<string, StaticStockData>;
}

// Yahoo Finance 原始响应数据
export interface YahooQuoteResult {
  symbol: string;
  shortName?: string;
  longName?: string;
  exchange?: string;
  quoteType?: string;
  firstTradeDateEpochUtc?: number;
  currency?: string;
  sector?: string;
  industry?: string;
}

// Yahoo Finance API 响应
export interface YahooFinanceResponse {
  quoteSummary?: {
    result?: Array<{
      summaryProfile?: {
        sector?: string;
        industry?: string;
      };
      price?: {
        shortName?: string;
        longName?: string;
        exchangeName?: string;
        currency?: string;
      };
      quoteType?: {
        firstTradeDateEpochUtc?: number;
      };
    }>;
    error?: unknown;
  };
}

// 股票搜索结果
export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;           // 'EQUITY', 'ETF', etc.
}

// 股票获取结果
export interface StockFetchResult {
  success: boolean;
  data?: StockInfo;
  error?: string;
}

// 缓存条目
export interface StockCacheEntry {
  stock: StockInfo;
  fetchedAt: Date;
  expiresAt: Date;
}

// 获取选项
export interface StockFetchOptions {
  useCache?: boolean;     // 是否使用缓存
  forceRefresh?: boolean; // 强制刷新
  timeout?: number;       // 超时时间 (ms)
}
