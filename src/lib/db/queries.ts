/**
 * 市相 - Database Queries
 * 数据库查询模块
 */

import { PrismaClient, Prisma } from '@prisma/client';
import type { Stock, BaziResult as DbBaziResult } from '@prisma/client';
import type { StockInfo, Exchange } from '../stock/types';
import type { BaziResult, WuXingStrength, DaYunResult } from '../bazi/types';

// Prisma 客户端单例
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ============= Stock CRUD =============

/**
 * 创建或更新股票信息
 * 注意：ipoDate 为 null 时不会保存到数据库
 */
export async function upsertStock(stockInfo: StockInfo): Promise<Stock | null> {
  // 如果没有 IPO 日期，不保存到数据库
  if (!stockInfo.ipoDate) {
    return null;
  }

  return prisma.stock.upsert({
    where: {
      symbol_exchange: {
        symbol: stockInfo.symbol,
        exchange: stockInfo.exchange,
      },
    },
    update: {
      name: stockInfo.name,
      ipoDate: stockInfo.ipoDate,
      ipoTime: stockInfo.ipoTime,
      timezone: stockInfo.timezone,
      updatedAt: new Date(),
    },
    create: {
      symbol: stockInfo.symbol,
      name: stockInfo.name,
      exchange: stockInfo.exchange,
      ipoDate: stockInfo.ipoDate,
      ipoTime: stockInfo.ipoTime,
      timezone: stockInfo.timezone,
    },
  });
}

/**
 * 根据代码和交易所获取股票
 */
export async function getStockBySymbol(
  symbol: string,
  exchange: Exchange
): Promise<Stock | null> {
  return prisma.stock.findUnique({
    where: {
      symbol_exchange: {
        symbol,
        exchange,
      },
    },
  });
}

/**
 * 根据 ID 获取股票
 */
export async function getStockById(id: string): Promise<Stock | null> {
  return prisma.stock.findUnique({
    where: { id },
  });
}

/**
 * 搜索股票（按名称或代码）
 */
export async function searchStocks(
  query: string,
  limit: number = 10
): Promise<Stock[]> {
  return prisma.stock.findMany({
    where: {
      OR: [
        { symbol: { contains: query.toUpperCase() } },
        { name: { contains: query } },
      ],
    },
    take: limit,
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

/**
 * 获取最近查询的股票
 */
export async function getRecentStocks(limit: number = 10): Promise<Stock[]> {
  return prisma.stock.findMany({
    take: limit,
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

/**
 * 删除股票（级联删除 BaziResult）
 */
export async function deleteStock(id: string): Promise<void> {
  await prisma.stock.delete({
    where: { id },
  });
}

// ============= BaziResult CRUD =============

/**
 * 保存八字计算结果
 */
export async function saveBaziResult(
  stockId: string,
  baziResult: BaziResult,
  wuxingStrength: WuXingStrength,
  daYunResult: DaYunResult
): Promise<DbBaziResult> {
  return prisma.baziResult.upsert({
    where: { stockId },
    update: {
      yearGan: baziResult.bazi.yearPillar.gan,
      yearZhi: baziResult.bazi.yearPillar.zhi,
      monthGan: baziResult.bazi.monthPillar.gan,
      monthZhi: baziResult.bazi.monthPillar.zhi,
      dayGan: baziResult.bazi.dayPillar.gan,
      dayZhi: baziResult.bazi.dayPillar.zhi,
      hourGan: baziResult.bazi.hourPillar.gan,
      hourZhi: baziResult.bazi.hourPillar.zhi,
      yinYang: baziResult.yinYang,
      wuxingJson: JSON.stringify(wuxingStrength),
      dayunJson: JSON.stringify(daYunResult),
      computedAt: new Date(),
    },
    create: {
      stockId,
      yearGan: baziResult.bazi.yearPillar.gan,
      yearZhi: baziResult.bazi.yearPillar.zhi,
      monthGan: baziResult.bazi.monthPillar.gan,
      monthZhi: baziResult.bazi.monthPillar.zhi,
      dayGan: baziResult.bazi.dayPillar.gan,
      dayZhi: baziResult.bazi.dayPillar.zhi,
      hourGan: baziResult.bazi.hourPillar.gan,
      hourZhi: baziResult.bazi.hourPillar.zhi,
      yinYang: baziResult.yinYang,
      wuxingJson: JSON.stringify(wuxingStrength),
      dayunJson: JSON.stringify(daYunResult),
    },
  });
}

/**
 * 获取股票的八字结果
 */
export async function getBaziResultByStockId(
  stockId: string
): Promise<DbBaziResult | null> {
  return prisma.baziResult.findUnique({
    where: { stockId },
  });
}

/**
 * 获取股票及其八字结果
 */
export async function getStockWithBazi(
  symbol: string,
  exchange: Exchange
): Promise<(Stock & { baziResult: DbBaziResult | null }) | null> {
  return prisma.stock.findUnique({
    where: {
      symbol_exchange: {
        symbol,
        exchange,
      },
    },
    include: {
      baziResult: true,
    },
  });
}

/**
 * 检查是否有缓存的八字结果
 */
export async function hasCachedBaziResult(
  symbol: string,
  exchange: Exchange
): Promise<boolean> {
  const stock = await prisma.stock.findUnique({
    where: {
      symbol_exchange: {
        symbol,
        exchange,
      },
    },
    include: {
      baziResult: {
        select: { id: true },
      },
    },
  });

  return stock?.baziResult !== null;
}

// ============= 解析 JSON 字段 =============

/**
 * 解析数据库中的五行强度 JSON
 */
export function parseWuxingJson(json: string): WuXingStrength {
  return JSON.parse(json) as WuXingStrength;
}

/**
 * 解析数据库中的大运 JSON
 */
export function parseDayunJson(json: string): DaYunResult {
  return JSON.parse(json) as DaYunResult;
}

// ============= 统计查询 =============

/**
 * 获取股票总数
 */
export async function getStockCount(): Promise<number> {
  return prisma.stock.count();
}

/**
 * 按交易所统计股票数量
 */
export async function getStockCountByExchange(): Promise<
  Array<{ exchange: string; _count: number }>
> {
  const result = await prisma.stock.groupBy({
    by: ['exchange'],
    _count: true,
  });

  return result.map(r => ({
    exchange: r.exchange,
    _count: r._count,
  }));
}

// ============= 事务操作 =============

/**
 * 在事务中创建股票并保存八字结果
 * 注意：ipoDate 为 null 时会抛出错误
 */
export async function createStockWithBazi(
  stockInfo: StockInfo,
  baziResult: BaziResult,
  wuxingStrength: WuXingStrength,
  daYunResult: DaYunResult
): Promise<Stock & { baziResult: DbBaziResult }> {
  // 如果没有 IPO 日期，无法保存八字结果
  if (!stockInfo.ipoDate) {
    throw new Error('Cannot save stock without IPO date');
  }

  // 保存到变量以便 TypeScript 类型收窄
  const ipoDate = stockInfo.ipoDate;

  return prisma.$transaction(async (tx) => {
    // 创建或更新股票
    const stock = await tx.stock.upsert({
      where: {
        symbol_exchange: {
          symbol: stockInfo.symbol,
          exchange: stockInfo.exchange,
        },
      },
      update: {
        name: stockInfo.name,
        ipoDate: ipoDate,
        ipoTime: stockInfo.ipoTime,
        timezone: stockInfo.timezone,
        updatedAt: new Date(),
      },
      create: {
        symbol: stockInfo.symbol,
        name: stockInfo.name,
        exchange: stockInfo.exchange,
        ipoDate: ipoDate,
        ipoTime: stockInfo.ipoTime,
        timezone: stockInfo.timezone,
      },
    });

    // 保存八字结果
    const savedBazi = await tx.baziResult.upsert({
      where: { stockId: stock.id },
      update: {
        yearGan: baziResult.bazi.yearPillar.gan,
        yearZhi: baziResult.bazi.yearPillar.zhi,
        monthGan: baziResult.bazi.monthPillar.gan,
        monthZhi: baziResult.bazi.monthPillar.zhi,
        dayGan: baziResult.bazi.dayPillar.gan,
        dayZhi: baziResult.bazi.dayPillar.zhi,
        hourGan: baziResult.bazi.hourPillar.gan,
        hourZhi: baziResult.bazi.hourPillar.zhi,
        yinYang: baziResult.yinYang,
        wuxingJson: JSON.stringify(wuxingStrength),
        dayunJson: JSON.stringify(daYunResult),
        computedAt: new Date(),
      },
      create: {
        stockId: stock.id,
        yearGan: baziResult.bazi.yearPillar.gan,
        yearZhi: baziResult.bazi.yearPillar.zhi,
        monthGan: baziResult.bazi.monthPillar.gan,
        monthZhi: baziResult.bazi.monthPillar.zhi,
        dayGan: baziResult.bazi.dayPillar.gan,
        dayZhi: baziResult.bazi.dayPillar.zhi,
        hourGan: baziResult.bazi.hourPillar.gan,
        hourZhi: baziResult.bazi.hourPillar.zhi,
        yinYang: baziResult.yinYang,
        wuxingJson: JSON.stringify(wuxingStrength),
        dayunJson: JSON.stringify(daYunResult),
      },
    });

    return { ...stock, baziResult: savedBazi };
  });
}
