/**
 * ShiXiang - Stock Fetcher Tests
 * 股票数据获取模块纯函数测试
 *
 * 注意：只测试纯函数，不进行网络请求
 */

import { describe, it, expect } from 'vitest';
import {
  normalizeSymbol,
  inferExchange,
  validateSymbol,
} from '@/lib/stock/fetcher';

describe('normalizeSymbol - 股票代码标准化', () => {
  it('should convert to uppercase', () => {
    expect(normalizeSymbol('aapl')).toBe('AAPL');
    expect(normalizeSymbol('tsla')).toBe('TSLA');
    expect(normalizeSymbol('googl')).toBe('GOOGL');
  });

  it('should remove exchange suffix .SS', () => {
    expect(normalizeSymbol('600519.SS')).toBe('600519');
    expect(normalizeSymbol('600519.ss')).toBe('600519');
  });

  it('should remove exchange suffix .SZ', () => {
    expect(normalizeSymbol('000858.SZ')).toBe('000858');
    expect(normalizeSymbol('000858.sz')).toBe('000858');
  });

  it('should remove exchange suffix .HK', () => {
    expect(normalizeSymbol('0700.HK')).toBe('0700');
    expect(normalizeSymbol('0700.hk')).toBe('0700');
  });

  it('should remove exchange suffix .T', () => {
    expect(normalizeSymbol('7203.T')).toBe('7203');
    expect(normalizeSymbol('7203.t')).toBe('7203');
  });

  it('should normalize class shares BRK.B to BRK-B', () => {
    expect(normalizeSymbol('BRK.B')).toBe('BRK-B');
    expect(normalizeSymbol('brk.b')).toBe('BRK-B');
  });

  it('should pad HK stock codes to 4 digits', () => {
    expect(normalizeSymbol('700')).toBe('0700');
    expect(normalizeSymbol('1')).toBe('0001');
    expect(normalizeSymbol('16')).toBe('0016');
    expect(normalizeSymbol('941')).toBe('0941');
  });

  it('should NOT pad A-share 6-digit codes', () => {
    expect(normalizeSymbol('600519')).toBe('600519');
    expect(normalizeSymbol('000858')).toBe('000858');
    expect(normalizeSymbol('300750')).toBe('300750');
  });

  it('should handle combined operations', () => {
    expect(normalizeSymbol('700.hk')).toBe('0700');
    expect(normalizeSymbol('600519.ss')).toBe('600519');
  });

  it('should trim whitespace', () => {
    expect(normalizeSymbol('  AAPL  ')).toBe('AAPL');
    expect(normalizeSymbol('  600519  ')).toBe('600519');
  });
});

describe('inferExchange - 交易所推断', () => {
  describe('A-shares (SSE)', () => {
    it('should infer SSE for 6xxxxx format', () => {
      expect(inferExchange('600519')).toBe('SSE');
      expect(inferExchange('601318')).toBe('SSE');
      expect(inferExchange('688001')).toBe('SSE'); // 科创板
    });
  });

  describe('A-shares (SZSE)', () => {
    it('should infer SZSE for 0xxxxx format', () => {
      expect(inferExchange('000858')).toBe('SZSE');
      expect(inferExchange('000001')).toBe('SZSE');
    });

    it('should infer SZSE for 3xxxxx format (ChiNext)', () => {
      expect(inferExchange('300750')).toBe('SZSE');
      expect(inferExchange('300015')).toBe('SZSE');
    });

    it('should infer SZSE for 2xxxxx format (SME Board)', () => {
      expect(inferExchange('002594')).toBe('SZSE');
    });
  });

  describe('HK stocks', () => {
    it('should infer HKEX for 4-digit codes', () => {
      expect(inferExchange('0700')).toBe('HKEX');
      expect(inferExchange('0001')).toBe('HKEX');
      expect(inferExchange('9988')).toBe('HKEX');
    });

    it('should infer HKEX for 5-digit codes', () => {
      expect(inferExchange('09988')).toBe('HKEX');
    });
  });

  describe('US stocks', () => {
    it('should infer NASDAQ for letter symbols not in NYSE list', () => {
      expect(inferExchange('AAPL')).toBe('NASDAQ');
      expect(inferExchange('MSFT')).toBe('NASDAQ');
      expect(inferExchange('GOOGL')).toBe('NASDAQ');
      expect(inferExchange('TSLA')).toBe('NASDAQ');
      expect(inferExchange('NVDA')).toBe('NASDAQ');
    });

    it('should infer NYSE for symbols in NYSE_SYMBOLS list', () => {
      expect(inferExchange('JPM')).toBe('NYSE');
      expect(inferExchange('BRK-A')).toBe('NYSE');
      expect(inferExchange('BRK-B')).toBe('NYSE');
      expect(inferExchange('V')).toBe('NYSE');
      expect(inferExchange('JNJ')).toBe('NYSE');
      expect(inferExchange('WMT')).toBe('NYSE');
    });

    it('should handle US stock with hyphen', () => {
      expect(inferExchange('BRK-B')).toBe('NYSE');
    });
  });

  describe('Invalid/Unknown formats', () => {
    it('should return null for invalid formats', () => {
      expect(inferExchange('INVALID@SYMBOL')).toBe(null);
      expect(inferExchange('12')).toBe(null); // too short for HK, wrong format for A-share
      expect(inferExchange('123')).toBe(null); // 3 digits - ambiguous
    });
  });
});

describe('validateSymbol - 股票代码格式验证', () => {
  it('should accept valid letter symbols', () => {
    expect(validateSymbol('AAPL')).toBe(true);
    expect(validateSymbol('MSFT')).toBe(true);
    expect(validateSymbol('GOOGL')).toBe(true);
  });

  it('should accept valid numeric symbols', () => {
    expect(validateSymbol('600519')).toBe(true);
    expect(validateSymbol('000858')).toBe(true);
    expect(validateSymbol('0700')).toBe(true);
  });

  it('should accept symbols with hyphens', () => {
    expect(validateSymbol('BRK-B')).toBe(true);
    expect(validateSymbol('BRK-A')).toBe(true);
  });

  it('should accept symbols with dots', () => {
    expect(validateSymbol('BRK.B')).toBe(true);
    expect(validateSymbol('600519.SS')).toBe(true);
  });

  it('should accept mixed alphanumeric', () => {
    expect(validateSymbol('9988')).toBe(true);
    expect(validateSymbol('TSE7203')).toBe(true);
  });

  it('should reject empty or null', () => {
    expect(validateSymbol('')).toBe(false);
  });

  it('should reject symbols that are too long', () => {
    expect(validateSymbol('VERYLONGSYMBOL1234')).toBe(false);
  });

  it('should reject symbols with special characters', () => {
    expect(validateSymbol('AAPL@')).toBe(false);
    expect(validateSymbol('MSFT#')).toBe(false);
    expect(validateSymbol('GOOGL!')).toBe(false);
    expect(validateSymbol('TSLA$')).toBe(false);
    expect(validateSymbol('NVDA%')).toBe(false);
  });

  it('should reject symbols with spaces', () => {
    expect(validateSymbol('AAPL ')).toBe(false);
    expect(validateSymbol(' AAPL')).toBe(false);
    expect(validateSymbol('AA PL')).toBe(false);
  });

  it('should accept lowercase (normalizeSymbol handles conversion)', () => {
    expect(validateSymbol('aapl')).toBe(true);
    expect(validateSymbol('tsla')).toBe(true);
  });
});

describe('normalizeSymbol + inferExchange - 组合测试', () => {
  it('should normalize and infer correctly for A-shares with suffix', () => {
    const normalized = normalizeSymbol('600519.SS');
    expect(normalized).toBe('600519');
    expect(inferExchange(normalized)).toBe('SSE');
  });

  it('should normalize and infer correctly for HK stocks with suffix', () => {
    const normalized = normalizeSymbol('700.HK');
    expect(normalized).toBe('0700');
    expect(inferExchange(normalized)).toBe('HKEX');
  });

  it('should normalize and infer correctly for US class shares', () => {
    const normalized = normalizeSymbol('BRK.B');
    expect(normalized).toBe('BRK-B');
    expect(inferExchange(normalized)).toBe('NYSE');
  });

  it('should handle lowercase input correctly', () => {
    const normalized = normalizeSymbol('aapl');
    expect(normalized).toBe('AAPL');
    expect(inferExchange(normalized)).toBe('NASDAQ');
  });
});
