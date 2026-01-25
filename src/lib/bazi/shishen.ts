/**
 * 市相 - Shi Shen (Ten Gods) Calculator
 * 十神计算模块
 *
 * 十神关系是基于日主（日干）与其他天干的五行生克关系，
 * 结合阴阳属性来确定的。
 */

import type { TianGan, WuXing, YinYang, ShiShen, Bazi, Pillar } from './types';
import {
  TIAN_GAN_WUXING,
  TIAN_GAN_YINYANG,
  WUXING_SHENG,
  WUXING_KE,
  ZANG_GAN_WEIGHTS,
} from './constants';

/**
 * 十神关系映射
 *
 * 根据五行关系和阴阳异同确定十神：
 * - 同我者（比劫）：同阳为比肩，阴阳异为劫财
 * - 我生者（食伤）：同阳为食神，阴阳异为伤官
 * - 我克者（财星）：同阳为偏财，阴阳异为正财
 * - 克我者（官杀）：同阳为七杀，阴阳异为正官
 * - 生我者（印星）：同阳为偏印，阴阳异为正印
 */

/**
 * 判断两个天干是否同阴阳
 */
function isSameYinYang(gan1: TianGan, gan2: TianGan): boolean {
  return TIAN_GAN_YINYANG[gan1] === TIAN_GAN_YINYANG[gan2];
}

/**
 * 计算两个五行之间的关系
 */
function getWuXingRelation(
  dayMaster: WuXing,
  target: WuXing
): 'same' | 'sheng' | 'ke' | 'beisheng' | 'beike' {
  if (dayMaster === target) {
    return 'same'; // 同我
  }
  if (WUXING_SHENG[dayMaster] === target) {
    return 'sheng'; // 我生
  }
  if (WUXING_KE[dayMaster] === target) {
    return 'ke'; // 我克
  }
  if (WUXING_SHENG[target] === dayMaster) {
    return 'beisheng'; // 生我
  }
  if (WUXING_KE[target] === dayMaster) {
    return 'beike'; // 克我
  }
  // 不应该到达这里
  return 'same';
}

/**
 * 计算某个天干相对于日主的十神
 *
 * @param dayGan 日主（日干）
 * @param targetGan 目标天干
 * @returns 十神
 */
export function calculateShiShen(dayGan: TianGan, targetGan: TianGan): ShiShen {
  const dayWuxing = TIAN_GAN_WUXING[dayGan];
  const targetWuxing = TIAN_GAN_WUXING[targetGan];
  const sameYinYang = isSameYinYang(dayGan, targetGan);

  const relation = getWuXingRelation(dayWuxing, targetWuxing);

  switch (relation) {
    case 'same': // 同我者：比肩、劫财
      return sameYinYang ? '比肩' : '劫财';

    case 'sheng': // 我生者：食神、伤官
      return sameYinYang ? '食神' : '伤官';

    case 'ke': // 我克者：偏财、正财
      return sameYinYang ? '偏财' : '正财';

    case 'beisheng': // 生我者：偏印、正印
      return sameYinYang ? '偏印' : '正印';

    case 'beike': // 克我者：七杀、正官
      return sameYinYang ? '七杀' : '正官';
  }
}

/**
 * 单柱十神信息
 */
export interface PillarShiShen {
  gan: ShiShen;           // 天干十神
  zhiZangGan: Array<{     // 地支藏干十神
    gan: TianGan;
    shishen: ShiShen;
    weight: number;
  }>;
  zhiMainShiShen: ShiShen; // 地支主气十神
}

/**
 * 计算单柱的十神信息
 */
export function calculatePillarShiShen(
  dayGan: TianGan,
  pillar: Pillar
): PillarShiShen {
  // 天干十神
  const ganShiShen = calculateShiShen(dayGan, pillar.gan);

  // 地支藏干十神
  const zangGan = ZANG_GAN_WEIGHTS[pillar.zhi];
  const zhiZangGan = Object.entries(zangGan).map(([gan, weight]) => ({
    gan: gan as TianGan,
    shishen: calculateShiShen(dayGan, gan as TianGan),
    weight: weight as number,
  }));

  // 地支主气十神（权重最高的藏干）
  const mainZangGan = zhiZangGan.reduce((a, b) => (a.weight > b.weight ? a : b));
  const zhiMainShiShen = mainZangGan.shishen;

  return {
    gan: ganShiShen,
    zhiZangGan,
    zhiMainShiShen,
  };
}

/**
 * 完整八字的十神分析结果
 */
export interface BaziShiShenResult {
  yearPillar: PillarShiShen;
  monthPillar: PillarShiShen;
  dayPillar: PillarShiShen;  // 日干为"日主"，日支有十神
  hourPillar: PillarShiShen;
  // 统计
  shishenCount: Record<ShiShen, number>;
  dominantShiShen: ShiShen;
  // 格局分析
  pattern: string;
}

/**
 * 计算完整八字的十神
 */
export function calculateBaziShiShen(bazi: Bazi): BaziShiShenResult {
  const dayGan = bazi.dayPillar.gan;

  // 计算各柱十神
  const yearPillar = calculatePillarShiShen(dayGan, bazi.yearPillar);
  const monthPillar = calculatePillarShiShen(dayGan, bazi.monthPillar);

  // 日柱特殊处理：日干是日主（本人），日支有十神
  const dayPillarResult: PillarShiShen = {
    gan: '比肩', // 日主与自己比较，为"比肩"
    zhiZangGan: Object.entries(ZANG_GAN_WEIGHTS[bazi.dayPillar.zhi]).map(([gan, weight]) => ({
      gan: gan as TianGan,
      shishen: calculateShiShen(dayGan, gan as TianGan),
      weight: weight as number,
    })),
    zhiMainShiShen: calculateShiShen(
      dayGan,
      Object.entries(ZANG_GAN_WEIGHTS[bazi.dayPillar.zhi])
        .reduce((a, b) => (a[1] as number > (b[1] as number) ? a : b))[0] as TianGan
    ),
  };

  const hourPillar = calculatePillarShiShen(dayGan, bazi.hourPillar);

  // 统计十神数量（考虑藏干权重）
  const shishenCount: Record<ShiShen, number> = {
    '比肩': 0, '劫财': 0,
    '食神': 0, '伤官': 0,
    '偏财': 0, '正财': 0,
    '七杀': 0, '正官': 0,
    '偏印': 0, '正印': 0,
  };

  // 年柱
  shishenCount[yearPillar.gan] += 1;
  yearPillar.zhiZangGan.forEach(z => {
    shishenCount[z.shishen] += z.weight;
  });

  // 月柱（权重更高，乘以 1.5）
  shishenCount[monthPillar.gan] += 1.5;
  monthPillar.zhiZangGan.forEach(z => {
    shishenCount[z.shishen] += z.weight * 1.5;
  });

  // 日柱（只计算地支）
  dayPillarResult.zhiZangGan.forEach(z => {
    shishenCount[z.shishen] += z.weight;
  });

  // 时柱
  shishenCount[hourPillar.gan] += 1;
  hourPillar.zhiZangGan.forEach(z => {
    shishenCount[z.shishen] += z.weight;
  });

  // 找出主导十神
  const dominantShiShen = (Object.entries(shishenCount) as [ShiShen, number][])
    .reduce((a, b) => (a[1] > b[1] ? a : b))[0];

  // 简单格局判断
  const pattern = determinePattern(monthPillar, shishenCount);

  return {
    yearPillar,
    monthPillar,
    dayPillar: dayPillarResult,
    hourPillar,
    shishenCount,
    dominantShiShen,
    pattern,
  };
}

/**
 * 简单格局判断（基于月柱透干）
 */
function determinePattern(
  monthPillar: PillarShiShen,
  shishenCount: Record<ShiShen, number>
): string {
  const monthGanShiShen = monthPillar.gan;
  const monthZhiMainShiShen = monthPillar.zhiMainShiShen;

  // 根据月干和月支主气确定格局
  const patterns: Record<ShiShen, string> = {
    '正官': '正官格',
    '七杀': '七杀格',
    '正财': '正财格',
    '偏财': '偏财格',
    '正印': '正印格',
    '偏印': '偏印格',
    '食神': '食神格',
    '伤官': '伤官格',
    '比肩': '建禄格',
    '劫财': '羊刃格',
  };

  // 优先使用月干透出的十神
  if (shishenCount[monthGanShiShen] >= 1.5) {
    return patterns[monthGanShiShen];
  }

  // 否则使用月支主气
  return patterns[monthZhiMainShiShen];
}

/**
 * 获取十神的简称
 */
export function getShiShenAbbr(shishen: ShiShen): string {
  const abbr: Record<ShiShen, string> = {
    '比肩': '比', '劫财': '劫',
    '食神': '食', '伤官': '伤',
    '偏财': '偏', '正财': '正',
    '七杀': '杀', '正官': '官',
    '偏印': '枭', '正印': '印',
  };
  return abbr[shishen];
}

/**
 * 获取十神的类别
 */
export function getShiShenCategory(shishen: ShiShen): string {
  const categories: Record<ShiShen, string> = {
    '比肩': '比劫', '劫财': '比劫',
    '食神': '食伤', '伤官': '食伤',
    '偏财': '财星', '正财': '财星',
    '七杀': '官杀', '正官': '官杀',
    '偏印': '印星', '正印': '印星',
  };
  return categories[shishen];
}
