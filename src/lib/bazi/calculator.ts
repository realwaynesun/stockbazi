/**
 * 市相 - Bazi Calculator
 * 八字计算核心模块 - 使用 lunar-javascript 库
 */

import { Solar, Lunar } from 'lunar-javascript';
import { DateTime } from 'luxon';
import type {
  TianGan,
  DiZhi,
  WuXing,
  YinYang,
  Pillar,
  Bazi,
  BaziResult,
  IpoTimeInput,
  BeijingTimeComponents,
  LunarDate,
  SolarTermInfo,
} from './types';
import {
  TIAN_GAN_WUXING,
  DI_ZHI_WUXING,
  TIAN_GAN_YINYANG,
} from './constants';

/**
 * 将任意时区的时间转换为北京时间组件
 * @param input IPO 时间输入
 * @returns 北京时间组件
 */
export function toBeijingTime(input: IpoTimeInput): BeijingTimeComponents {
  // 创建源时区的 DateTime
  const dt = DateTime.fromFormat(
    `${input.date} ${input.time}`,
    'yyyy-MM-dd HH:mm',
    { zone: input.timezone }
  );

  if (!dt.isValid) {
    throw new Error(`Invalid date/time: ${input.date} ${input.time} (${input.timezone})`);
  }

  // 转换为北京时间
  const beijing = dt.setZone('Asia/Shanghai');

  return {
    year: beijing.year,
    month: beijing.month,
    day: beijing.day,
    hour: beijing.hour,
    minute: beijing.minute,
  };
}

/**
 * 创建单柱
 */
function createPillar(ganZhi: string): Pillar {
  const gan = ganZhi[0] as TianGan;
  const zhi = ganZhi[1] as DiZhi;

  return {
    gan,
    zhi,
    ganWuxing: TIAN_GAN_WUXING[gan],
    zhiWuxing: DI_ZHI_WUXING[zhi],
  };
}

/**
 * 根据年干判断阴阳
 * 甲丙戊庚壬 = 阳
 * 乙丁己辛癸 = 阴
 */
function getYinYang(yearGan: TianGan): YinYang {
  return TIAN_GAN_YINYANG[yearGan];
}

/**
 * 计算八字
 * @param input IPO 时间输入
 * @returns 八字计算结果
 */
export function calculateBazi(input: IpoTimeInput): BaziResult {
  // 1. 转换为北京时间
  const bjTime = toBeijingTime(input);

  // 2. 使用 lunar-javascript 计算
  const solar = Solar.fromYmdHms(
    bjTime.year,
    bjTime.month,
    bjTime.day,
    bjTime.hour,
    bjTime.minute,
    0
  );

  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  // 3. 获取四柱
  const yearGanZhi = eightChar.getYear();
  const monthGanZhi = eightChar.getMonth();
  const dayGanZhi = eightChar.getDay();
  const hourGanZhi = eightChar.getTime();

  // 4. 创建四柱对象
  const bazi: Bazi = {
    yearPillar: createPillar(yearGanZhi),
    monthPillar: createPillar(monthGanZhi),
    dayPillar: createPillar(dayGanZhi),
    hourPillar: createPillar(hourGanZhi),
  };

  // 5. 农历信息
  const lunarDate: LunarDate = {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeapMonth: lunar.getMonth() < 0, // 负数表示闰月
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
  };

  // 6. 节气信息
  const prevJieQi = lunar.getPrevJieQi();
  const nextJieQi = lunar.getNextJieQi();
  const currentJieQi = lunar.getJieQi();

  const solarTerm: SolarTermInfo = {
    current: currentJieQi || null,
    prev: {
      name: prevJieQi.getName(),
      date: new Date(
        prevJieQi.getSolar().getYear(),
        prevJieQi.getSolar().getMonth() - 1,
        prevJieQi.getSolar().getDay()
      ),
    },
    next: {
      name: nextJieQi.getName(),
      date: new Date(
        nextJieQi.getSolar().getYear(),
        nextJieQi.getSolar().getMonth() - 1,
        nextJieQi.getSolar().getDay()
      ),
    },
  };

  // 7. 构建结果
  const inputDate = new Date(
    bjTime.year,
    bjTime.month - 1,
    bjTime.day,
    bjTime.hour,
    bjTime.minute
  );

  const baziString = `${yearGanZhi} ${monthGanZhi} ${dayGanZhi} ${hourGanZhi}`;

  return {
    inputDate,
    beijingTime: inputDate,
    bazi,
    lunarDate,
    yinYang: getYinYang(bazi.yearPillar.gan),
    solarTerm,
    baziString,
  };
}

/**
 * 简化版：直接输入北京时间计算八字
 * 用于测试验证
 */
export function calculateBaziFromBeijingTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number = 0
): BaziResult {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const yearGanZhi = eightChar.getYear();
  const monthGanZhi = eightChar.getMonth();
  const dayGanZhi = eightChar.getDay();
  const hourGanZhi = eightChar.getTime();

  const bazi: Bazi = {
    yearPillar: createPillar(yearGanZhi),
    monthPillar: createPillar(monthGanZhi),
    dayPillar: createPillar(dayGanZhi),
    hourPillar: createPillar(hourGanZhi),
  };

  const lunarDate: LunarDate = {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeapMonth: lunar.getMonth() < 0,
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
  };

  const prevJieQi = lunar.getPrevJieQi();
  const nextJieQi = lunar.getNextJieQi();
  const currentJieQi = lunar.getJieQi();

  const solarTerm: SolarTermInfo = {
    current: currentJieQi || null,
    prev: {
      name: prevJieQi.getName(),
      date: new Date(
        prevJieQi.getSolar().getYear(),
        prevJieQi.getSolar().getMonth() - 1,
        prevJieQi.getSolar().getDay()
      ),
    },
    next: {
      name: nextJieQi.getName(),
      date: new Date(
        nextJieQi.getSolar().getYear(),
        nextJieQi.getSolar().getMonth() - 1,
        nextJieQi.getSolar().getDay()
      ),
    },
  };

  const inputDate = new Date(year, month - 1, day, hour, minute);
  const baziString = `${yearGanZhi} ${monthGanZhi} ${dayGanZhi} ${hourGanZhi}`;

  return {
    inputDate,
    beijingTime: inputDate,
    bazi,
    lunarDate,
    yinYang: getYinYang(bazi.yearPillar.gan),
    solarTerm,
    baziString,
  };
}

/**
 * 获取八字字符串
 */
export function getBaziString(result: BaziResult): string {
  return result.baziString;
}
