/**
 * StockBazi - Da Yun (Major Luck Cycles) Calculator
 * 大运计算模块 - 使用 lunar-javascript 库
 */

import { Solar, Lunar } from 'lunar-javascript';
import type {
  TianGan,
  DiZhi,
  WuXing,
  DaYun,
  DaYunResult,
  BaziResult,
} from './types';
import {
  TIAN_GAN,
  DI_ZHI,
  TIAN_GAN_WUXING,
  DI_ZHI_WUXING,
  TIAN_GAN_YINYANG,
} from './constants';

/**
 * 判断大运是否顺排
 * 阳年阳顺阴逆，阴年阴顺阳逆
 * 简化规则：阳干（甲丙戊庚壬）= 顺排，阴干（乙丁己辛癸）= 逆排
 *
 * 注意：传统命理中男女有别，但股票无性别，这里统一按阳干顺排、阴干逆排
 */
function isForwardDirection(yearGan: TianGan): boolean {
  return TIAN_GAN_YINYANG[yearGan] === 'yang';
}

/**
 * 获取下一个天干
 */
function getNextTianGan(gan: TianGan, direction: 'forward' | 'backward'): TianGan {
  const index = TIAN_GAN.indexOf(gan);
  if (direction === 'forward') {
    return TIAN_GAN[(index + 1) % 10];
  } else {
    return TIAN_GAN[(index - 1 + 10) % 10];
  }
}

/**
 * 获取下一个地支
 */
function getNextDiZhi(zhi: DiZhi, direction: 'forward' | 'backward'): DiZhi {
  const index = DI_ZHI.indexOf(zhi);
  if (direction === 'forward') {
    return DI_ZHI[(index + 1) % 12];
  } else {
    return DI_ZHI[(index - 1 + 12) % 12];
  }
}

/**
 * 计算起运岁数
 *
 * 规则：
 * - 从出生日到最近的节气（顺排找下一个节气，逆排找上一个节气）
 * - 3天 = 1岁，1天 ≈ 4个月
 * - 使用四舍五入取整
 *
 * @param beijingTime 北京时间
 * @param direction 顺排或逆排
 * @returns 起运岁数
 */
function calculateStartAge(
  beijingTime: { year: number; month: number; day: number; hour: number; minute: number },
  direction: 'forward' | 'backward'
): number {
  const solar = Solar.fromYmdHms(
    beijingTime.year,
    beijingTime.month,
    beijingTime.day,
    beijingTime.hour,
    beijingTime.minute,
    0
  );

  const lunar = solar.getLunar();

  // 获取精确到时辰的节气时间
  let targetJieQi;
  if (direction === 'forward') {
    // 顺排：找下一个节气
    targetJieQi = lunar.getNextJie();
  } else {
    // 逆排：找上一个节气
    targetJieQi = lunar.getPrevJie();
  }

  // 计算相差天数
  const birthSolar = solar;
  const jieQiSolar = targetJieQi.getSolar();

  // 使用 Julian day 计算精确天数差
  const birthJd = birthSolar.getJulianDay();
  const jieQiJd = jieQiSolar.getJulianDay();

  const daysDiff = Math.abs(jieQiJd - birthJd);

  // 3天 = 1岁，四舍五入
  const startAge = Math.round(daysDiff / 3);

  return startAge;
}

/**
 * 计算大运
 *
 * @param baziResult 八字计算结果
 * @param ipoYear IPO 的公历年份
 * @returns 大运计算结果
 */
export function calculateDaYun(
  baziResult: BaziResult,
  ipoYear: number
): DaYunResult {
  const yearGan = baziResult.bazi.yearPillar.gan;
  const monthGan = baziResult.bazi.monthPillar.gan;
  const monthZhi = baziResult.bazi.monthPillar.zhi;

  // 判断顺逆
  const isForward = isForwardDirection(yearGan);
  const direction = isForward ? 'forward' : 'backward';

  // 从北京时间计算起运岁数
  const beijingTime = {
    year: baziResult.beijingTime.getFullYear(),
    month: baziResult.beijingTime.getMonth() + 1,
    day: baziResult.beijingTime.getDate(),
    hour: baziResult.beijingTime.getHours(),
    minute: baziResult.beijingTime.getMinutes(),
  };

  const startAge = calculateStartAge(beijingTime, direction);

  // 生成 10 步大运
  const cycles: DaYun[] = [];
  let currentGan = monthGan;
  let currentZhi = monthZhi;

  for (let i = 0; i < 10; i++) {
    // 第一步大运从月柱的下一个干支开始
    currentGan = getNextTianGan(currentGan, direction);
    currentZhi = getNextDiZhi(currentZhi, direction);

    const cycleStartAge = startAge + i * 10;
    const cycleStartYear = ipoYear + cycleStartAge;

    cycles.push({
      index: i + 1,
      startAge: cycleStartAge,
      startYear: cycleStartYear,
      gan: currentGan,
      zhi: currentZhi,
      wuxing: [TIAN_GAN_WUXING[currentGan], DI_ZHI_WUXING[currentZhi]],
      ganZhi: `${currentGan}${currentZhi}`,
    });
  }

  return {
    startAge,
    direction,
    cycles,
  };
}

/**
 * 获取当前大运
 *
 * @param daYunResult 大运计算结果
 * @param currentYear 当前公历年份
 * @returns 当前大运（如果在大运周期内）
 */
export function getCurrentDaYun(
  daYunResult: DaYunResult,
  currentYear: number
): DaYun | null {
  for (let i = daYunResult.cycles.length - 1; i >= 0; i--) {
    const cycle = daYunResult.cycles[i];
    if (currentYear >= cycle.startYear) {
      return cycle;
    }
  }
  return null;
}

/**
 * 计算流年干支
 *
 * 注意：流年以立春为界，需使用立春后的日期来获取正确的年干支
 *
 * @param year 公历年份
 * @returns 流年的干支
 */
export function getLiuNian(year: number): { gan: TianGan; zhi: DiZhi; ganZhi: string } {
  // 使用 3 月 1 日确保在立春之后
  const solar = Solar.fromYmd(year, 3, 1);
  const lunar = solar.getLunar();
  const yearGanZhi = lunar.getYearInGanZhi();

  const gan = yearGanZhi[0] as TianGan;
  const zhi = yearGanZhi[1] as DiZhi;

  return {
    gan,
    zhi,
    ganZhi: yearGanZhi,
  };
}

/**
 * 判断当前流年是否过了立春
 * 立春后才开始新的流年
 *
 * @param year 公历年份
 * @param month 公历月份
 * @param day 公历日期
 * @returns 是否过了立春
 */
export function isPastLiChun(year: number, month: number, day: number): boolean {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const prevJieQi = lunar.getPrevJieQi();

  // 如果上一个节气是立春，说明已经过了立春
  // 或者月份已经是2月4日之后
  if (month > 2) return true;
  if (month < 2) return false;

  // 2月份需要检查具体日期
  // 立春一般在2月3-5日
  return prevJieQi.getName() === '立春';
}
