/**
 * 市相 - Bazi Constants
 * 八字计算常量定义
 */

import type { TianGan, DiZhi, WuXing, YinYang } from './types';

// 十天干
export const TIAN_GAN: TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 十二地支
export const DI_ZHI: DiZhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干对应五行
export const TIAN_GAN_WUXING: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 地支对应主气五行
export const DI_ZHI_WUXING: Record<DiZhi, WuXing> = {
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '辰': '土', '戌': '土', '丑': '土', '未': '土',
  '申': '金', '酉': '金',
  '亥': '水', '子': '水',
};

// 天干阴阳
export const TIAN_GAN_YINYANG: Record<TianGan, YinYang> = {
  '甲': 'yang', '乙': 'yin',
  '丙': 'yang', '丁': 'yin',
  '戊': 'yang', '己': 'yin',
  '庚': 'yang', '辛': 'yin',
  '壬': 'yang', '癸': 'yin',
};

// 地支藏干权重表 (已修复：午 和 亥)
export const ZANG_GAN_WEIGHTS: Record<DiZhi, Record<TianGan, number>> = {
  '子': { '癸': 1.0 } as Record<TianGan, number>,
  '丑': { '己': 0.6, '癸': 0.3, '辛': 0.1 } as Record<TianGan, number>,
  '寅': { '甲': 0.6, '丙': 0.3, '戊': 0.1 } as Record<TianGan, number>,
  '卯': { '乙': 1.0 } as Record<TianGan, number>,
  '辰': { '戊': 0.6, '乙': 0.3, '癸': 0.1 } as Record<TianGan, number>,
  '巳': { '丙': 0.6, '庚': 0.3, '戊': 0.1 } as Record<TianGan, number>,
  '午': { '丁': 0.7, '己': 0.3 } as Record<TianGan, number>,  // 已修复
  '未': { '己': 0.6, '丁': 0.3, '乙': 0.1 } as Record<TianGan, number>,
  '申': { '庚': 0.6, '壬': 0.3, '戊': 0.1 } as Record<TianGan, number>,
  '酉': { '辛': 1.0 } as Record<TianGan, number>,
  '戌': { '戊': 0.6, '辛': 0.3, '丁': 0.1 } as Record<TianGan, number>,
  '亥': { '壬': 0.7, '甲': 0.3 } as Record<TianGan, number>,  // 已修复
};

// 月令旺衰系数表
export const MONTH_STRENGTH: Record<DiZhi, Record<WuXing, number>> = {
  '寅': { '木': 2.0, '火': 1.5, '土': 1.0, '金': 0.7, '水': 0.5 },
  '卯': { '木': 2.0, '火': 1.5, '土': 1.0, '金': 0.5, '水': 0.7 },
  '辰': { '木': 1.2, '火': 1.0, '土': 1.5, '金': 0.8, '水': 1.0 },
  '巳': { '木': 0.7, '火': 2.0, '土': 1.5, '金': 1.0, '水': 0.5 },
  '午': { '木': 0.5, '火': 2.0, '土': 1.5, '金': 1.0, '水': 0.7 },
  '未': { '木': 0.8, '火': 1.2, '土': 1.5, '金': 1.0, '水': 0.8 },
  '申': { '木': 0.5, '火': 0.7, '土': 1.0, '金': 2.0, '水': 1.5 },
  '酉': { '木': 0.7, '火': 0.5, '土': 1.0, '金': 2.0, '水': 1.5 },
  '戌': { '木': 0.8, '火': 1.0, '土': 1.5, '金': 1.2, '水': 0.8 },
  '亥': { '木': 1.5, '火': 0.5, '土': 1.0, '金': 0.7, '水': 2.0 },
  '子': { '木': 1.5, '火': 0.7, '土': 1.0, '金': 0.5, '水': 2.0 },
  '丑': { '木': 0.8, '火': 0.8, '土': 1.5, '金': 1.0, '水': 1.2 },
};

// 五行相生关系 (A 生 B)
export const WUXING_SHENG: Record<WuXing, WuXing> = {
  '木': '火',  // 木生火
  '火': '土',  // 火生土
  '土': '金',  // 土生金
  '金': '水',  // 金生水
  '水': '木',  // 水生木
};

// 五行相克关系 (A 克 B)
export const WUXING_KE: Record<WuXing, WuXing> = {
  '木': '土',  // 木克土
  '土': '水',  // 土克水
  '水': '火',  // 水克火
  '火': '金',  // 火克金
  '金': '木',  // 金克木
};

// 交易所默认开盘时间
export const DEFAULT_OPEN_TIMES: Record<string, { time: string; timezone: string }> = {
  'NYSE': { time: '09:30', timezone: 'America/New_York' },
  'NASDAQ': { time: '09:30', timezone: 'America/New_York' },
  'SSE': { time: '09:30', timezone: 'Asia/Shanghai' },
  'SZSE': { time: '09:30', timezone: 'Asia/Shanghai' },
  'HKEX': { time: '09:30', timezone: 'Asia/Hong_Kong' },
  'TSE': { time: '09:00', timezone: 'Asia/Tokyo' },
};

// 时辰对照表 (北京时间)
export const HOUR_TO_DIZHI: Record<number, DiZhi> = {
  23: '子', 0: '子',   // 23:00-01:00
  1: '丑', 2: '丑',    // 01:00-03:00
  3: '寅', 4: '寅',    // 03:00-05:00
  5: '卯', 6: '卯',    // 05:00-07:00
  7: '辰', 8: '辰',    // 07:00-09:00
  9: '巳', 10: '巳',   // 09:00-11:00
  11: '午', 12: '午',  // 11:00-13:00
  13: '未', 14: '未',  // 13:00-15:00
  15: '申', 16: '申',  // 15:00-17:00
  17: '酉', 18: '酉',  // 17:00-19:00
  19: '戌', 20: '戌',  // 19:00-21:00
  21: '亥', 22: '亥',  // 21:00-23:00
};
