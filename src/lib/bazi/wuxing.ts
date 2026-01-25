/**
 * 市相 - Wu Xing (Five Elements) Strength Calculator
 * 五行强度计算模块
 */

import type {
  TianGan,
  DiZhi,
  WuXing,
  Bazi,
  WuXingStrength,
} from './types';
import {
  TIAN_GAN_WUXING,
  DI_ZHI_WUXING,
  ZANG_GAN_WEIGHTS,
  MONTH_STRENGTH,
} from './constants';

/**
 * 计算单个天干的五行强度贡献
 * 每个天干贡献 1.0 分到对应五行
 */
function calculateTianGanScore(gan: TianGan): Record<WuXing, number> {
  const scores: Record<WuXing, number> = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0,
  };

  const wuxing = TIAN_GAN_WUXING[gan];
  scores[wuxing] = 1.0;

  return scores;
}

/**
 * 计算单个地支的五行强度贡献
 * 根据地支藏干权重表计算
 */
function calculateDiZhiScore(zhi: DiZhi): Record<WuXing, number> {
  const scores: Record<WuXing, number> = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0,
  };

  const zangGan = ZANG_GAN_WEIGHTS[zhi];

  // 遍历藏干及其权重
  for (const [gan, weight] of Object.entries(zangGan)) {
    const wuxing = TIAN_GAN_WUXING[gan as TianGan];
    scores[wuxing] += weight;
  }

  return scores;
}

/**
 * 合并多个五行分数
 */
function mergeScores(...scoresList: Record<WuXing, number>[]): Record<WuXing, number> {
  const merged: Record<WuXing, number> = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0,
  };

  for (const scores of scoresList) {
    for (const wuxing of Object.keys(merged) as WuXing[]) {
      merged[wuxing] += scores[wuxing];
    }
  }

  return merged;
}

/**
 * 应用月令旺衰系数
 * 月支决定当令五行的强弱
 */
function applyMonthStrength(
  scores: Record<WuXing, number>,
  monthZhi: DiZhi
): Record<WuXing, number> {
  const monthCoeffs = MONTH_STRENGTH[monthZhi];
  const result: Record<WuXing, number> = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0,
  };

  for (const wuxing of Object.keys(scores) as WuXing[]) {
    result[wuxing] = scores[wuxing] * monthCoeffs[wuxing];
  }

  return result;
}

/**
 * 归一化五行分数到 0-100 范围
 */
function normalizeScores(scores: Record<WuXing, number>): Record<WuXing, number> {
  const total = Object.values(scores).reduce((sum, val) => sum + val, 0);

  if (total === 0) {
    return { '木': 20, '火': 20, '土': 20, '金': 20, '水': 20 };
  }

  const normalized: Record<WuXing, number> = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0,
  };

  for (const wuxing of Object.keys(scores) as WuXing[]) {
    normalized[wuxing] = Math.round((scores[wuxing] / total) * 100);
  }

  // 确保总和为 100（处理四舍五入误差）
  const sumNormalized = Object.values(normalized).reduce((sum, val) => sum + val, 0);
  if (sumNormalized !== 100) {
    // 找到最大值并调整
    const maxWuxing = (Object.keys(normalized) as WuXing[]).reduce((a, b) =>
      normalized[a] > normalized[b] ? a : b
    );
    normalized[maxWuxing] += 100 - sumNormalized;
  }

  return normalized;
}

/**
 * 找出最强和最弱的五行
 */
function findDominantAndWeakest(
  scores: Record<WuXing, number>
): { dominant: WuXing; weakest: WuXing } {
  const entries = Object.entries(scores) as [WuXing, number][];

  const dominant = entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  const weakest = entries.reduce((a, b) => (a[1] < b[1] ? a : b))[0];

  return { dominant, weakest };
}

/**
 * 计算八字的五行强度
 *
 * 计算步骤：
 * 1. 计算四柱八个天干地支的基础分数
 * 2. 应用月令旺衰系数
 * 3. 归一化到 0-100 范围
 * 4. 识别最强和最弱五行
 *
 * @param bazi 八字四柱
 * @returns 五行强度分析结果
 */
export function calculateWuXingStrength(bazi: Bazi): WuXingStrength {
  // 1. 计算所有天干的贡献
  const tianGanScores = mergeScores(
    calculateTianGanScore(bazi.yearPillar.gan),
    calculateTianGanScore(bazi.monthPillar.gan),
    calculateTianGanScore(bazi.dayPillar.gan),
    calculateTianGanScore(bazi.hourPillar.gan)
  );

  // 2. 计算所有地支的贡献
  const diZhiScores = mergeScores(
    calculateDiZhiScore(bazi.yearPillar.zhi),
    calculateDiZhiScore(bazi.monthPillar.zhi),
    calculateDiZhiScore(bazi.dayPillar.zhi),
    calculateDiZhiScore(bazi.hourPillar.zhi)
  );

  // 3. 合并天干地支分数
  const baseScores = mergeScores(tianGanScores, diZhiScores);

  // 4. 应用月令旺衰系数
  const monthZhi = bazi.monthPillar.zhi;
  const adjustedScores = applyMonthStrength(baseScores, monthZhi);

  // 5. 归一化到 0-100
  const normalizedScores = normalizeScores(adjustedScores);

  // 6. 找出最强和最弱
  const { dominant, weakest } = findDominantAndWeakest(normalizedScores);

  return {
    ...normalizedScores,
    dominant,
    weakest,
  };
}

/**
 * 获取五行相生关系的描述
 *
 * @param wuxing 五行
 * @returns 相生的五行
 */
export function getShengRelation(wuxing: WuXing): WuXing {
  const shengMap: Record<WuXing, WuXing> = {
    '木': '火',  // 木生火
    '火': '土',  // 火生土
    '土': '金',  // 土生金
    '金': '水',  // 金生水
    '水': '木',  // 水生木
  };
  return shengMap[wuxing];
}

/**
 * 获取五行相克关系的描述
 *
 * @param wuxing 五行
 * @returns 被克的五行
 */
export function getKeRelation(wuxing: WuXing): WuXing {
  const keMap: Record<WuXing, WuXing> = {
    '木': '土',  // 木克土
    '土': '水',  // 土克水
    '水': '火',  // 水克火
    '火': '金',  // 火克金
    '金': '木',  // 金克木
  };
  return keMap[wuxing];
}

/**
 * 获取五行的中文属性描述
 */
export function getWuXingAttributes(wuxing: WuXing): {
  color: string;
  season: string;
  direction: string;
  trait: string;
} {
  const attributes: Record<WuXing, { color: string; season: string; direction: string; trait: string }> = {
    '木': { color: '青/绿', season: '春', direction: '东', trait: '生发、成长' },
    '火': { color: '红', season: '夏', direction: '南', trait: '炎热、向上' },
    '土': { color: '黄', season: '长夏/四季', direction: '中', trait: '承载、转化' },
    '金': { color: '白', season: '秋', direction: '西', trait: '收敛、肃杀' },
    '水': { color: '黑', season: '冬', direction: '北', trait: '寒冷、向下' },
  };
  return attributes[wuxing];
}

/**
 * 生成五行分析摘要
 */
export function generateWuXingSummary(strength: WuXingStrength): string {
  const { dominant, weakest } = strength;
  const dominantAttrs = getWuXingAttributes(dominant);
  const weakestAttrs = getWuXingAttributes(weakest);

  const summary = [
    `命局五行以【${dominant}】为主导 (${strength[dominant]}%)，`,
    `${dominantAttrs.trait}之气旺盛；`,
    `【${weakest}】最弱 (${strength[weakest]}%)，`,
    `${weakestAttrs.trait}之力不足。`,
  ].join('');

  return summary;
}
