/**
 * 市相 (ShiXiang) - Stock Data Fetcher
 * 股票数据获取模块 - 使用 EC2 API + 静态数据回退
 */

import type {
  Exchange,
  ExchangeConfig,
  StockInfo,
  StockFetchResult,
  StaticStockData,
  StaticStockFile,
} from './types';

import { IPO_DATA } from '@/data/ipo/index';

// EC2 ShiXiang API endpoint
const SHIXIANG_API_BASE = process.env.NEXT_PUBLIC_SHIXIANG_API_URL || 'http://35.75.155.252';

// EC2 API response types
interface ShiXiangApiResponse {
  status: 'ok' | 'partial' | 'error';
  data?: {
    code: string;
    market: string;
    name: string;
    ipo_date: string | null;
    ipo_date_source?: string;
    ipo_next_check?: string;
    price?: {
      current: number;
      prev_close: number;
      change: number;
      change_pct: number;
      updated_at: string;
      stale: boolean;
    };
  };
  warning?: string;
  error?: {
    code: string;
    message: string;
  };
  cache?: {
    meta_status: string;
    price_status: string;
  };
}

// 交易所配置
export const EXCHANGE_CONFIG: Record<Exchange, ExchangeConfig> = {
  NYSE: {
    name: 'New York Stock Exchange',
    suffix: '',
    defaultOpenTime: '09:30',
    timezone: 'America/New_York',
    currency: 'USD',
  },
  NASDAQ: {
    name: 'NASDAQ',
    suffix: '',
    defaultOpenTime: '09:30',
    timezone: 'America/New_York',
    currency: 'USD',
  },
  SSE: {
    name: '上海证券交易所',
    suffix: '.SS',
    defaultOpenTime: '09:30',
    timezone: 'Asia/Shanghai',
    currency: 'CNY',
  },
  SZSE: {
    name: '深圳证券交易所',
    suffix: '.SZ',
    defaultOpenTime: '09:30',
    timezone: 'Asia/Shanghai',
    currency: 'CNY',
  },
  HKEX: {
    name: '香港交易所',
    suffix: '.HK',
    defaultOpenTime: '09:30',
    timezone: 'Asia/Hong_Kong',
    currency: 'HKD',
  },
  TSE: {
    name: '東京証券取引所',
    suffix: '.T',
    defaultOpenTime: '09:00',
    timezone: 'Asia/Tokyo',
    currency: 'JPY',
  },
};

// NYSE/AMEX 股票列表（用于区分非 NASDAQ 美股）
const NYSE_SYMBOLS = new Set([
  'BRK-A', 'BRK-B', 'JPM', 'V', 'JNJ', 'UNH', 'PG', 'XOM', 'HD', 'CVX',
  'MA', 'BAC', 'ABBV', 'KO', 'PFE', 'MRK', 'WMT', 'PEP', 'TMO', 'COST',
  'DIS', 'ABT', 'MCD', 'DHR', 'NKE', 'VZ', 'NEE', 'PM', 'RTX', 'LOW',
  'UNP', 'T', 'BA', 'IBM', 'HON', 'GS', 'CAT', 'AXP', 'MMM', 'COP',
  'C', 'WFC', 'BMY', 'MS', 'LMT', 'CRM', 'ORCL', 'GE', 'F', 'GM',
]);

// 静态数据缓存
let stockIndexCache: Record<string, StaticStockData> | null = null;
let cacheLoadPromise: Promise<void> | null = null;

/**
 * 从 EC2 ShiXiang API 获取股票数据
 * 目前仅支持 CN 市场
 */
async function fetchFromShiXiangApi(symbol: string, market: 'CN' | 'US' | 'HK'): Promise<StockFetchResult> {
  const url = `${SHIXIANG_API_BASE}/api/stock/${market}/${symbol}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 }, // Next.js cache for 60 seconds
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: `Stock not found: ${symbol}` };
      }
      return { success: false, error: `API error: ${response.status}` };
    }

    const apiResponse: ShiXiangApiResponse = await response.json();

    if (apiResponse.status === 'error' || !apiResponse.data) {
      return {
        success: false,
        error: apiResponse.error?.message || 'Unknown error from API',
      };
    }

    const data = apiResponse.data;

    // Map market to exchange
    let exchange: Exchange = 'SSE';
    if (market === 'CN') {
      exchange = /^6/.test(data.code) ? 'SSE' : 'SZSE';
    } else if (market === 'US') {
      exchange = NYSE_SYMBOLS.has(data.code) ? 'NYSE' : 'NASDAQ';
    } else if (market === 'HK') {
      exchange = 'HKEX';
    }

    const config = EXCHANGE_CONFIG[exchange];

    const stockInfo: StockInfo = {
      symbol: data.code,
      name: data.name,
      exchange,
      ipoDate: data.ipo_date ? new Date(data.ipo_date) : null,
      ipoTime: config.defaultOpenTime,
      timezone: config.timezone,
      currency: config.currency,
      price: data.price?.current,
      prevClose: data.price?.prev_close,
      change: data.price?.change,
      changePct: data.price?.change_pct,
    };

    return { success: true, data: stockInfo };
  } catch (error) {
    // Network error or timeout - fall through to local data
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * 加载静态股票数据索引
 */
async function loadStockIndex(): Promise<Record<string, StaticStockData>> {
  if (stockIndexCache) {
    return stockIndexCache;
  }

  if (cacheLoadPromise) {
    await cacheLoadPromise;
    return stockIndexCache!;
  }

  cacheLoadPromise = (async () => {
    try {
      const response = await fetch('/data/stocks-index.json');
      if (!response.ok) {
        throw new Error(`Failed to load stock index: ${response.status}`);
      }
      const data: StaticStockFile = await response.json();
      stockIndexCache = data.index || {};
    } catch (error) {
      console.error('Failed to load stock index:', error);
      stockIndexCache = {};
    }
  })();

  await cacheLoadPromise;
  return stockIndexCache!;
}

/**
 * 标准化股票代码
 * - 转大写
 * - 移除交易所后缀 (.SS, .SZ, .HK, .T)
 * - 规范化 class shares (BRK.B → BRK-B)
 * - 港股零填充 (700 → 0700)
 */
export function normalizeSymbol(input: string): string {
  let symbol = input.toUpperCase().trim();

  // 移除交易所后缀: 600519.SS → 600519
  symbol = symbol.replace(/\.(SS|SZ|HK|T)$/i, '');

  // 规范化 class shares: BRK.B → BRK-B
  symbol = symbol.replace(/\.([A-Z])$/, '-$1');

  // 港股零填充: 700 → 0700 (针对 4 位或更少的纯数字，且不是 A 股格式)
  if (/^\d{1,4}$/.test(symbol) && !isAShareSymbol(symbol)) {
    symbol = symbol.padStart(4, '0');
  }

  return symbol;
}

/**
 * 检查是否为 A 股代码格式（6 位数字）
 */
function isAShareSymbol(symbol: string): boolean {
  return /^\d{6}$/.test(symbol);
}

/**
 * 根据股票代码推断交易所
 */
export function inferExchange(symbol: string): Exchange | null {
  // A股：6 开头为上海，0/3 开头为深圳
  if (/^6\d{5}$/.test(symbol)) return 'SSE';
  if (/^[03]\d{5}$/.test(symbol)) return 'SZSE';

  // 北交所：bj 开头或 8/4 开头的 6 位数字
  if (/^bj\d+$/i.test(symbol)) return 'SSE'; // 归类到上交所
  if (/^[84]\d{5}$/.test(symbol)) return 'SZSE'; // 归类到深交所

  // 港股：4-5 位数字（不以 6/0/3 开头的 6 位除外）
  if (/^\d{4,5}$/.test(symbol)) return 'HKEX';

  // 美股：字母符号
  if (/^[A-Z-]+$/.test(symbol)) {
    if (NYSE_SYMBOLS.has(symbol)) return 'NYSE';
    return 'NASDAQ';
  }

  return null;
}

/**
 * 将符号转换为静态数据索引格式
 */
function toStaticKey(symbol: string): string {
  const normalized = normalizeSymbol(symbol);

  // A 股格式
  if (/^6\d{5}$/.test(normalized) || /^[03]\d{5}$/.test(normalized)) {
    return `CN:${normalized}`;
  }

  // 北交所格式
  if (/^bj\d+$/i.test(normalized)) {
    return `CN:${normalized.toLowerCase()}`;
  }
  if (/^[84]\d{5}$/.test(normalized)) {
    return `CN:${normalized}`;
  }

  // 港股格式
  if (/^\d{4,5}$/.test(normalized)) {
    return `HK:${normalized.padStart(5, '0')}`;
  }

  // 美股格式
  return `US:${normalized}`;
}

/**
 * 解析用户输入，返回标准化的 key 和交易所
 */
function resolveSymbol(input: string): { key: string; symbol: string; exchange: Exchange } | null {
  const symbol = normalizeSymbol(input);
  const exchange = inferExchange(symbol);

  if (!exchange) return null;

  const key = `${exchange}:${symbol}`;
  return { key, symbol, exchange };
}

/**
 * 从 IPO 数据文件获取股票信息（用于获取 IPO 日期）
 */
function lookupIPOData(key: string, symbol: string, exchange: Exchange): StockFetchResult | null {
  const entry = IPO_DATA[key];

  if (!entry) {
    return null;
  }

  const config = EXCHANGE_CONFIG[exchange];

  const stockInfo: StockInfo = {
    symbol,
    name: entry.name,
    exchange,
    ipoDate: new Date(entry.ipoDate),
    ipoTime: config.defaultOpenTime,
    timezone: config.timezone,
    currency: config.currency,
  };

  return {
    success: true,
    data: stockInfo,
  };
}

/**
 * 从静态数据获取股票信息
 */
async function lookupStaticData(input: string): Promise<StockFetchResult> {
  const index = await loadStockIndex();
  const staticKey = toStaticKey(input);
  const entry = index[staticKey];

  if (!entry) {
    return {
      success: false,
      error: `Stock not found: ${input}`,
    };
  }

  // 根据静态 key 推断交易所
  let exchange: Exchange = 'NASDAQ';
  if (staticKey.startsWith('CN:')) {
    const code = staticKey.slice(3);
    if (/^6/.test(code)) exchange = 'SSE';
    else exchange = 'SZSE';
  } else if (staticKey.startsWith('HK:')) {
    exchange = 'HKEX';
  } else if (staticKey.startsWith('US:')) {
    exchange = NYSE_SYMBOLS.has(entry.code) ? 'NYSE' : 'NASDAQ';
  }

  const config = EXCHANGE_CONFIG[exchange];

  const stockInfo: StockInfo = {
    symbol: entry.code,
    name: entry.name,
    exchange,
    ipoDate: new Date(), // 静态数据没有 IPO 日期，使用当前日期
    ipoTime: config.defaultOpenTime,
    timezone: config.timezone,
    currency: config.currency,
    price: entry.price,
    prevClose: entry.prev_close,
    change: entry.change,
    changePct: entry.change_pct,
  };

  return {
    success: true,
    data: stockInfo,
  };
}

/**
 * 获取股票信息
 * 优先使用 EC2 ShiXiang API（CN 市场），其次使用静态数据/IPO 数据
 */
export async function fetchStockInfo(
  symbol: string,
  _exchange?: Exchange,
): Promise<StockFetchResult> {
  const normalizedSymbol = normalizeSymbol(symbol);
  const inferredExchange = inferExchange(normalizedSymbol);

  // 判断市场类型
  let market: 'CN' | 'US' | 'HK' | null = null;
  if (inferredExchange === 'SSE' || inferredExchange === 'SZSE') {
    market = 'CN';
  } else if (inferredExchange === 'NYSE' || inferredExchange === 'NASDAQ') {
    market = 'US';
  } else if (inferredExchange === 'HKEX') {
    market = 'HK';
  }

  // 所有支持的市场优先使用 EC2 API
  if (market) {
    const apiResult = await fetchFromShiXiangApi(normalizedSymbol, market);
    if (apiResult.success) {
      return apiResult;
    }
    // API 失败时，继续尝试本地数据作为回退
  }

  // 从静态数据获取（包含价格信息）
  const staticResult = await lookupStaticData(symbol);
  if (staticResult.success) {
    // 尝试补充 IPO 数据
    const resolved = resolveSymbol(symbol);
    if (resolved) {
      const ipoResult = lookupIPOData(resolved.key, resolved.symbol, resolved.exchange);
      if (ipoResult?.success && ipoResult.data && staticResult.data) {
        staticResult.data.ipoDate = ipoResult.data.ipoDate;
      }
    }
    return staticResult;
  }

  // 回退到 IPO 数据
  const resolved = resolveSymbol(symbol);
  if (!resolved) {
    return {
      success: false,
      error: `Invalid symbol format: ${symbol}`,
    };
  }

  const ipoResult = lookupIPOData(resolved.key, resolved.symbol, resolved.exchange);
  if (ipoResult) {
    return ipoResult;
  }

  return {
    success: false,
    error: `Stock not found: ${symbol}`,
  };
}

/**
 * 批量获取股票信息
 */
export async function fetchMultipleStocks(
  symbols: string[],
): Promise<Map<string, StockFetchResult>> {
  // 先加载索引
  await loadStockIndex();

  const results = new Map<string, StockFetchResult>();

  for (const symbol of symbols) {
    const result = await fetchStockInfo(symbol);
    results.set(symbol, result);
  }

  return results;
}

/**
 * 搜索股票
 */
export async function searchStocks(query: string, limit = 20): Promise<StaticStockData[]> {
  const index = await loadStockIndex();
  const q = query.toLowerCase();

  const results: StaticStockData[] = [];

  for (const [, stock] of Object.entries(index)) {
    if (
      stock.code.toLowerCase().includes(q) ||
      stock.name.toLowerCase().includes(q) ||
      stock.symbol.toLowerCase().includes(q)
    ) {
      results.push(stock);
      if (results.length >= limit) break;
    }
  }

  return results;
}

/**
 * 验证股票代码格式
 */
export function validateSymbol(symbol: string): boolean {
  if (!symbol || symbol.length < 1 || symbol.length > 10) {
    return false;
  }

  // 只允许字母、数字、点号和连字符
  return /^[A-Za-z0-9.-]+$/.test(symbol);
}

/**
 * 获取所有支持的股票代码列表
 */
export function getSupportedSymbols(): string[] {
  return Object.keys(IPO_DATA);
}

/**
 * 检查股票是否在支持列表中
 */
export async function isSymbolSupported(symbol: string): Promise<boolean> {
  const index = await loadStockIndex();
  const staticKey = toStaticKey(symbol);
  if (staticKey in index) return true;

  const resolved = resolveSymbol(symbol);
  if (!resolved) return false;
  return resolved.key in IPO_DATA;
}

/**
 * 获取数据更新时间
 */
export async function getDataUpdatedAt(): Promise<string | null> {
  try {
    const response = await fetch('/data/stocks-index.json');
    if (!response.ok) return null;
    const data: StaticStockFile = await response.json();
    return data.metadata?.updated_at || null;
  } catch {
    return null;
  }
}
