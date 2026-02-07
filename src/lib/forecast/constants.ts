/**
 * 市相 - Forecast Constants
 * 五日运势预测常量 - ShiShen scoring + branch interactions
 */

import type { ShiShen, DiZhi } from '@/lib/bazi/types';

/** ShiShen -> directional signal */
export const SHISHEN_SIGNAL: Record<ShiShen, 'up' | 'down' | 'neutral'> = {
  '正财': 'up',      // stable income
  '偏财': 'up',      // windfall gains
  '食神': 'up',      // productivity
  '正印': 'neutral', // protection, conservative
  '正官': 'neutral', // regulation, discipline
  '比肩': 'neutral', // peers, status quo
  '偏印': 'neutral', // unconventional
  '劫财': 'down',    // competition drain
  '七杀': 'down',    // external pressure
  '伤官': 'down',    // disruption
};

/** ShiShen -> intensity (signal strength) */
export const SHISHEN_INTENSITY: Record<ShiShen, 1 | 2 | 3> = {
  '正财': 2, '偏财': 3,
  '食神': 2, '正印': 1,
  '正官': 1, '比肩': 1,
  '偏印': 2, '劫财': 2,
  '七杀': 3, '伤官': 2,
};

/** ShiShen -> one-line reason template */
export const SHISHEN_REASONS: Record<ShiShen, string> = {
  '正财': '正财当值，主营利好',
  '偏财': '偏财透出，意外之喜',
  '食神': '食神生财，产品力强',
  '正印': '正印护体，贵人相助',
  '正官': '正官当值，以静制动',
  '比肩': '比肩并立，随行就市',
  '偏印': '偏印主事，变数犹存',
  '劫财': '劫财临门，谨防消耗',
  '七杀': '七杀临门，宜守不攻',
  '伤官': '伤官见官，波动加剧',
};

/** 六冲 (Six Clashes) - diametrically opposed branches */
export const DI_ZHI_CHONG: Record<DiZhi, DiZhi> = {
  '子': '午', '丑': '未', '寅': '申', '卯': '酉',
  '辰': '戌', '巳': '亥', '午': '子', '未': '丑',
  '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳',
};

/** 六合 (Six Combinations) - harmonious branch pairs */
export const DI_ZHI_HE: Record<DiZhi, DiZhi> = {
  '子': '丑', '丑': '子', '寅': '亥', '卯': '戌',
  '辰': '酉', '巳': '申', '午': '未', '未': '午',
  '申': '巳', '酉': '辰', '戌': '卯', '亥': '寅',
};

export const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
