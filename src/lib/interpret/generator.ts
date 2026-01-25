/**
 * StockBazi - Report Generator
 * 分析报告生成器
 */

import type {
  BaziResult,
  WuXingStrength,
  DaYunResult,
  DaYun,
  WuXing,
  TianGan,
  DiZhi,
  ShiShen,
} from '../bazi/types';
import type { StockInfo } from '../stock/types';
import {
  calculateBaziShiShen,
  calculateShiShen,
  type BaziShiShenResult,
} from '../bazi/shishen';
import { getCurrentDaYun, getLiuNian } from '../bazi/dayun';
import { generateWuXingSummary } from '../bazi/wuxing';
import {
  getShiShenInterpretation,
  getWuXingIndustry,
  getPatternInterpretation,
  getDayunInterpretation,
  DAYUN_TEMPLATES,
} from './dictionary';

/**
 * 完整分析报告结构
 */
export interface AnalysisReport {
  // 基本信息
  stock: {
    symbol: string;
    name: string;
    exchange: string;
    ipoDate: string;
    ipoTime: string;
  };

  // 八字信息
  bazi: {
    string: string;           // "甲辰 丙寅 戊戌 辛酉"
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;        // 日主
    hourPillar: string;
    yinYang: string;
  };

  // 五行分析
  wuxing: {
    strength: WuXingStrength;
    summary: string;
    dominantIndustries: string[];
  };

  // 十神分析
  shishen: {
    pattern: string;          // 格局
    patternInterpretation: string;
    dominantShiShen: ShiShen;
    dominantInterpretation: {
      keyword: string;
      financial: string;
      positive: string;
      negative: string;
    };
  };

  // 大运分析
  dayun: {
    startAge: number;
    direction: string;
    cycles: Array<{
      index: number;
      startYear: number;
      ganZhi: string;
      wuxing: string[];
    }>;
    current: {
      ganZhi: string;
      startYear: number;
      shishen: ShiShen;
      interpretation: string;
    } | null;
  };

  // 流年分析
  liuNian: {
    year: number;
    ganZhi: string;
    shishen: ShiShen;
    interpretation: string;
  };

  // 综合建议
  summary: {
    investmentStyle: string;
    riskLevel: string;
    keyFactors: string[];
    disclaimer: string;
  };

  // 生成时间
  generatedAt: string;
}

/**
 * 生成完整分析报告
 */
export function generateAnalysisReport(
  stockInfo: StockInfo,
  baziResult: BaziResult,
  wuxingStrength: WuXingStrength,
  daYunResult: DaYunResult,
  currentYear: number = new Date().getFullYear()
): AnalysisReport {
  // 计算十神
  const shishenResult = calculateBaziShiShen(baziResult.bazi);

  // 获取当前大运
  const currentDaYun = getCurrentDaYun(daYunResult, currentYear);

  // 获取流年
  const liuNian = getLiuNian(currentYear);

  // 计算大运十神
  const dayGan = baziResult.bazi.dayPillar.gan;
  const currentDaYunShiShen = currentDaYun
    ? calculateDaYunShiShen(dayGan, currentDaYun.gan)
    : null;

  // 计算流年十神
  const liuNianShiShen = calculateDaYunShiShen(dayGan, liuNian.gan);

  // 获取主导五行的行业
  const dominantWuxingInfo = getWuXingIndustry(wuxingStrength.dominant);

  // 获取主导十神的解读
  const dominantShiShenInfo = getShiShenInterpretation(shishenResult.dominantShiShen);

  // 格式化 IPO 日期
  const ipoDateStr = formatDate(stockInfo.ipoDate);

  return {
    stock: {
      symbol: stockInfo.symbol,
      name: stockInfo.name,
      exchange: stockInfo.exchange,
      ipoDate: ipoDateStr,
      ipoTime: stockInfo.ipoTime,
    },

    bazi: {
      string: baziResult.baziString,
      yearPillar: `${baziResult.bazi.yearPillar.gan}${baziResult.bazi.yearPillar.zhi}`,
      monthPillar: `${baziResult.bazi.monthPillar.gan}${baziResult.bazi.monthPillar.zhi}`,
      dayPillar: `${baziResult.bazi.dayPillar.gan}${baziResult.bazi.dayPillar.zhi}`,
      hourPillar: `${baziResult.bazi.hourPillar.gan}${baziResult.bazi.hourPillar.zhi}`,
      yinYang: baziResult.yinYang === 'yang' ? '阳' : '阴',
    },

    wuxing: {
      strength: wuxingStrength,
      summary: generateWuXingSummary(wuxingStrength),
      dominantIndustries: dominantWuxingInfo.industry,
    },

    shishen: {
      pattern: shishenResult.pattern,
      patternInterpretation: getPatternInterpretation(shishenResult.pattern),
      dominantShiShen: shishenResult.dominantShiShen,
      dominantInterpretation: {
        keyword: dominantShiShenInfo.keyword,
        financial: dominantShiShenInfo.financial,
        positive: dominantShiShenInfo.positive,
        negative: dominantShiShenInfo.negative,
      },
    },

    dayun: {
      startAge: daYunResult.startAge,
      direction: daYunResult.direction === 'forward' ? '顺行' : '逆行',
      cycles: daYunResult.cycles.map(c => ({
        index: c.index,
        startYear: c.startYear,
        ganZhi: c.ganZhi,
        wuxing: c.wuxing,
      })),
      current: currentDaYun && currentDaYunShiShen
        ? {
            ganZhi: currentDaYun.ganZhi,
            startYear: currentDaYun.startYear,
            shishen: currentDaYunShiShen,
            interpretation: getDayunInterpretation(currentDaYunShiShen),
          }
        : null,
    },

    liuNian: {
      year: currentYear,
      ganZhi: liuNian.ganZhi,
      shishen: liuNianShiShen,
      interpretation: generateLiuNianInterpretation(liuNianShiShen, currentYear),
    },

    summary: {
      investmentStyle: dominantWuxingInfo.investmentStyle,
      riskLevel: translateRiskLevel(dominantShiShenInfo.riskLevel),
      keyFactors: generateKeyFactors(shishenResult, wuxingStrength),
      disclaimer: '⚠️ 免责声明：本分析仅供娱乐参考，不构成任何投资建议。股票投资有风险，请理性决策。',
    },

    generatedAt: new Date().toISOString(),
  };
}

/**
 * 计算大运/流年的十神
 */
function calculateDaYunShiShen(dayGan: TianGan, targetGan: TianGan): ShiShen {
  return calculateShiShen(dayGan, targetGan);
}

/**
 * 格式化日期
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 翻译风险等级
 */
function translateRiskLevel(level: 'low' | 'medium' | 'high'): string {
  const translations: Record<string, string> = {
    low: '低风险',
    medium: '中等风险',
    high: '高风险',
  };
  return translations[level] || '中等风险';
}

/**
 * 生成流年解读
 */
function generateLiuNianInterpretation(shishen: ShiShen, year: number): string {
  const baseInterpretation = DAYUN_TEMPLATES[shishen];
  return `${year}年流年${shishen}，${baseInterpretation}`;
}

/**
 * 生成关键因素列表
 */
function generateKeyFactors(
  shishenResult: BaziShiShenResult,
  wuxingStrength: WuXingStrength
): string[] {
  const factors: string[] = [];

  // 格局相关
  factors.push(`格局：${shishenResult.pattern}`);

  // 主导五行
  factors.push(`主导五行：${wuxingStrength.dominant}（${wuxingStrength[wuxingStrength.dominant]}%）`);

  // 最弱五行
  factors.push(`需补：${wuxingStrength.weakest}（${wuxingStrength[wuxingStrength.weakest]}%）`);

  // 主导十神
  const shishenInfo = getShiShenInterpretation(shishenResult.dominantShiShen);
  factors.push(`核心特质：${shishenInfo.keyword}`);

  return factors;
}

/**
 * 生成简短摘要
 */
export function generateShortSummary(
  stockInfo: StockInfo,
  baziResult: BaziResult,
  wuxingStrength: WuXingStrength
): string {
  const shishenResult = calculateBaziShiShen(baziResult.bazi);
  const shishenInfo = getShiShenInterpretation(shishenResult.dominantShiShen);

  return [
    `【${stockInfo.name}】${stockInfo.symbol}`,
    `八字：${baziResult.baziString}`,
    `格局：${shishenResult.pattern}`,
    `五行：${wuxingStrength.dominant}旺（${wuxingStrength[wuxingStrength.dominant]}%）`,
    `特质：${shishenInfo.keyword}`,
    `风险：${translateRiskLevel(shishenInfo.riskLevel)}`,
  ].join('\n');
}

/**
 * 生成投资建议（仅供娱乐）
 */
export function generateInvestmentAdvice(
  shishenResult: BaziShiShenResult,
  wuxingStrength: WuXingStrength,
  currentDaYun: DaYun | null
): string[] {
  const advice: string[] = [];

  const patternInterpretation = getPatternInterpretation(shishenResult.pattern);
  advice.push(`📊 格局分析：${patternInterpretation}`);

  const wuxingSummary = generateWuXingSummary(wuxingStrength);
  advice.push(`🔥 五行特征：${wuxingSummary}`);

  if (currentDaYun) {
    const shishen = calculateDaYunShiShen(
      'dayGan' as unknown as TianGan, // Placeholder
      currentDaYun.gan
    );
    const dayunInterpretation = getDayunInterpretation(shishen);
    advice.push(`🌟 当前大运（${currentDaYun.ganZhi}）：${dayunInterpretation}`);
  }

  advice.push('');
  advice.push('⚠️ 以上分析仅供娱乐参考，不构成投资建议。');

  return advice;
}
