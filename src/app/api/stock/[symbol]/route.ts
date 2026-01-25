/**
 * 市相 - Stock Analysis API
 * 股票八字分析 API 路由
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchStockInfo, inferExchange, normalizeSymbol, validateSymbol } from '@/lib/stock/fetcher';
import { calculateBazi } from '@/lib/bazi/calculator';
import { calculateDaYun } from '@/lib/bazi/dayun';
import { calculateWuXingStrength } from '@/lib/bazi/wuxing';
import { generateAnalysisReport } from '@/lib/interpret/generator';
import type { IpoTimeInput } from '@/lib/bazi/types';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol: rawSymbol } = await context.params;

    // 验证并标准化股票代码
    const symbol = normalizeSymbol(rawSymbol);
    if (!validateSymbol(symbol)) {
      return NextResponse.json(
        { error: '无效的股票代码格式' },
        { status: 400 }
      );
    }

    // 推断交易所
    const exchange = inferExchange(symbol);
    if (!exchange) {
      return NextResponse.json(
        { error: '无法识别交易所' },
        { status: 400 }
      );
    }

    // 获取股票信息
    const fetchResult = await fetchStockInfo(symbol, exchange);
    if (!fetchResult.success || !fetchResult.data) {
      return NextResponse.json(
        { error: fetchResult.error || '无法获取股票信息' },
        { status: 404 }
      );
    }

    const stockInfo = fetchResult.data;

    // 检查是否有 IPO 日期
    if (!stockInfo.ipoDate) {
      return NextResponse.json({
        success: false,
        error: '暂无上市日期数据',
        data: {
          symbol: stockInfo.symbol,
          name: stockInfo.name,
          exchange: stockInfo.exchange,
          price: stockInfo.price,
          change: stockInfo.change,
          changePct: stockInfo.changePct,
          noIpoData: true,
        },
      }, { status: 200 });
    }

    // 构建八字计算输入
    const ipoInput: IpoTimeInput = {
      date: formatDateString(stockInfo.ipoDate),
      time: stockInfo.ipoTime,
      timezone: stockInfo.timezone,
    };

    // 计算八字
    const baziResult = calculateBazi(ipoInput);

    // 计算大运
    const ipoYear = stockInfo.ipoDate.getFullYear();
    const daYunResult = calculateDaYun(baziResult, ipoYear);

    // 计算五行强度
    const wuxingStrength = calculateWuXingStrength(baziResult.bazi);

    // 生成分析报告
    const report = generateAnalysisReport(
      stockInfo,
      baziResult,
      wuxingStrength,
      daYunResult
    );

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Stock analysis error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '分析过程中发生错误',
      },
      { status: 500 }
    );
  }
}

/**
 * 格式化日期为字符串
 */
function formatDateString(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
