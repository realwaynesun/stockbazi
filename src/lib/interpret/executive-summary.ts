/**
 * 市相 - Executive Summary
 * 一屏结论卡数据结构与推导函数
 */

import type { AnalysisReport } from './generator';

/**
 * 一屏结论卡数据结构
 */
export interface ExecutiveSummary {
  /** 3 个关键词标签 (例: ["偏财", "金旺", "需补木"]) */
  keywords: [string, string, string];

  /** 当年一句话结论 (<=20字，来自流年/大运提炼) */
  yearTagline: string;

  /** 更适合的玩法/风格 (趋势/波段/防守/情绪票等，不出现买卖建议) */
  playStyle: string;

  /** 最大雷点 1 条 (短句) */
  riskFlag: string;

  /** IPO 元数据 (供展示) */
  meta: {
    ipoDate: string;
    ipoTime: string;
    exchange: string;
  };
}

/**
 * 推导选项
 */
export interface DeriveOptions {
  /** 目标年份 (默认当前年) */
  year?: number;
  /** 语言 (目前仅支持 zh-CN) */
  locale?: 'zh-CN';
}

/**
 * 从完整报告推导一屏结论
 *
 * @param report - 完整分析报告
 * @param options - 推导选项
 * @returns ExecutiveSummary
 */
export function deriveExecutiveSummary(
  report: AnalysisReport,
  options: DeriveOptions = {}
): ExecutiveSummary {
  const { year = new Date().getFullYear() } = options;

  return {
    keywords: deriveKeywords(report),
    yearTagline: deriveYearTagline(report, year),
    playStyle: derivePlayStyle(report),
    riskFlag: deriveRiskFlag(report),
    meta: {
      ipoDate: report.stock.ipoDate,
      ipoTime: report.stock.ipoTime,
      exchange: report.stock.exchange,
    },
  };
}

/**
 * 推导 3 个关键词
 * 规则: 主导十神 + 五行强弱特征 + 格局/用神
 */
function deriveKeywords(report: AnalysisReport): [string, string, string] {
  const { shishen, wuxing } = report;

  // 关键词1: 主导十神
  const keyword1 = shishen.dominantShiShen;

  // 关键词2: 五行强弱 (X旺 或 X弱)
  const keyword2 = `${wuxing.strength.dominant}旺`;

  // 关键词3: 需补五行
  const keyword3 = `需补${wuxing.strength.weakest}`;

  return [keyword1, keyword2, keyword3];
}

/**
 * 推导当年一句话结论
 * 规则: 从流年十神解读中提取核心观点
 */
function deriveYearTagline(report: AnalysisReport, year: number): string {
  const { liuNian, dayun } = report;

  // 流年十神关键词映射
  const liuNianKeywords: Record<string, string> = {
    '正官': '稳扎稳打、合规为先',
    '七杀': '竞争加剧、危中有机',
    '正财': '盈利向好、稳健增长',
    '偏财': '意外收益、波动加大',
    '正印': '品牌价值凸显、护城河加深',
    '偏印': '创新求变、风险与机遇并存',
    '比肩': '同行共振、关注行业景气',
    '劫财': '竞争消耗、利润承压',
    '食神': '产品为王、增长可期',
    '伤官': '破局求新、谨防监管',
  };

  const liuNianTrait = liuNianKeywords[liuNian.shishen] || '综合研判';

  // 结合大运状态
  if (dayun.current) {
    return `${year}年${liuNian.shishen}年，${liuNianTrait}`;
  }

  return `${year}流年${liuNian.ganZhi}，${liuNianTrait}`;
}

/**
 * 推导投资风格/玩法
 * 规则: 基于五行+十神映射，不出现买卖建议
 */
function derivePlayStyle(report: AnalysisReport): string {
  const { wuxing, shishen } = report;

  // 五行 -> 基础风格
  const wuxingStyle: Record<string, string> = {
    '木': '成长型思路',
    '火': '趋势型思路',
    '土': '周期型思路',
    '金': '价值型思路',
    '水': '防御型思路',
  };

  // 十神 -> 风格修正
  const shishenModifier: Record<string, string> = {
    '正官': '，适合长线持有',
    '七杀': '，需设好止损',
    '正财': '，关注分红与现金流',
    '偏财': '，注意波段节奏',
    '正印': '，看重护城河',
    '偏印': '，敢于尝试新逻辑',
    '比肩': '，跟随行业趋势',
    '劫财': '，控制仓位',
    '食神': '，关注产品与增长',
    '伤官': '，高风险高回报',
  };

  const baseStyle = wuxingStyle[wuxing.strength.dominant] || '综合型思路';
  const modifier = shishenModifier[shishen.dominantShiShen] || '';

  return baseStyle + modifier;
}

/**
 * 推导最大雷点
 * 规则: 从十神负面特征中提取最核心的风险
 */
function deriveRiskFlag(report: AnalysisReport): string {
  const { shishen, wuxing } = report;

  // 十神 -> 核心风险
  const shishenRisks: Record<string, string> = {
    '正官': '政策或监管风险',
    '七杀': '突发利空或做空压力',
    '正财': '增长乏力或现金流紧张',
    '偏财': '收益不稳定、纸面富贵',
    '正印': '技术落后或品牌老化',
    '偏印': '创新失败或烧钱无底',
    '比肩': '行业内卷或股东减持',
    '劫财': '恶性竞争或利润被摊薄',
    '食神': '产品滞销或增速放缓',
    '伤官': '监管冲突或激进扩张翻车',
  };

  const baseRisk = shishenRisks[shishen.dominantShiShen] || '需综合评估风险';

  // 如果最弱五行占比过低，补充提示
  const weakestValue = wuxing.strength[wuxing.strength.weakest];
  if (weakestValue <= 5) {
    return `${baseRisk}；${wuxing.strength.weakest}行极弱需留意`;
  }

  return baseRisk;
}

/**
 * 股票元信息（用于生成爆点句）
 */
export interface StockMeta {
  name: string;
  symbol: string;
}

/**
 * 生成爆点句（Hook Sentence）
 * 一句话总结股票的命格/气质/最大特点
 * 偏梗但不低俗、不荐股
 *
 * @param summary - 一屏结论数据
 * @param stock - 股票元信息
 * @returns 爆点句
 */
export function generateHookSentence(
  summary: ExecutiveSummary,
  stock: StockMeta
): string {
  const { keywords } = summary;
  const dominantShiShen = keywords[0];
  const dominantWuxing = keywords[1].replace('旺', '');

  // 十神 -> 性格标签
  const shishenPersona: Record<string, string> = {
    '正官': '乖乖牌优等生',
    '七杀': '狠人杀手',
    '正财': '稳稳的幸福',
    '偏财': '横财命',
    '正印': '技术流大佬',
    '偏印': '不走寻常路的怪才',
    '比肩': '行业老炮',
    '劫财': '卷王本王',
    '食神': '产品经理型选手',
    '伤官': '叛逆天才',
  };

  // 五行 -> 气质标签
  const wuxingVibe: Record<string, string> = {
    '木': '生机勃勃',
    '火': '热力四射',
    '土': '稳如泰山',
    '金': '真金白银',
    '水': '深不可测',
  };

  // 组合模板（随机选择增加多样性）
  const templates = [
    () => `${stock.name}：${shishenPersona[dominantShiShen] || '神秘选手'}，${wuxingVibe[dominantWuxing] || '气场独特'}`,
    () => `${dominantWuxing}气加持的${shishenPersona[dominantShiShen] || '狠角色'}`,
    () => `一眼${dominantShiShen}命，${stock.name}的基因里写着${wuxingVibe[dominantWuxing] || '与众不同'}`,
    () => `${stock.name}天生${shishenPersona[dominantShiShen] || '不简单'}，${dominantWuxing}行当道`,
  ];

  // 基于股票代码的稳定选择（同一股票总是返回相同模板）
  const hash = stock.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const templateIndex = hash % templates.length;

  return templates[templateIndex]();
}
