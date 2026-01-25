/**
 * StockBazi - Bazi Type Definitions
 * 八字计算相关类型定义
 */

// 天干 (Heavenly Stems)
export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

// 地支 (Earthly Branches)
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

// 五行 (Five Elements)
export type WuXing = '木' | '火' | '土' | '金' | '水';

// 阴阳 (Yin/Yang)
export type YinYang = 'yang' | 'yin';

// 十神 (Ten Gods)
export type ShiShen =
  | '比肩' | '劫财'   // 同我者
  | '食神' | '伤官'   // 我生者
  | '偏财' | '正财'   // 我克者
  | '七杀' | '正官'   // 克我者
  | '偏印' | '正印';  // 生我者

// 单柱 (Single Pillar)
export interface Pillar {
  gan: TianGan;      // 天干
  zhi: DiZhi;        // 地支
  ganWuxing: WuXing; // 天干五行
  zhiWuxing: WuXing; // 地支主气五行
}

// 四柱八字 (Four Pillars / Bazi)
export interface Bazi {
  yearPillar: Pillar;   // 年柱
  monthPillar: Pillar;  // 月柱
  dayPillar: Pillar;    // 日柱 (日主)
  hourPillar: Pillar;   // 时柱
}

// 农历日期信息
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
  yearGanZhi: string;   // 年干支 (如 "甲辰")
  monthGanZhi: string;  // 月干支
  dayGanZhi: string;    // 日干支
}

// 节气信息
export interface SolarTermInfo {
  current: string | null;        // 当日节气 (如果有)
  prev: { name: string; date: Date };  // 上一个节气
  next: { name: string; date: Date };  // 下一个节气
}

// 完整的八字计算结果
export interface BaziResult {
  // 基本信息
  inputDate: Date;        // 输入的公历日期时间
  beijingTime: Date;      // 转换后的北京时间

  // 四柱
  bazi: Bazi;

  // 农历信息
  lunarDate: LunarDate;

  // 阴阳属性 (年干决定，用于大运顺逆)
  yinYang: YinYang;

  // 节气信息
  solarTerm: SolarTermInfo;

  // 简化表示
  baziString: string;     // 如 "甲辰 丙寅 戊戌 戊午"
}

// 大运 (Major Luck Cycle)
export interface DaYun {
  index: number;          // 大运序号 (1-10)
  startAge: number;       // 起运年龄
  startYear: number;      // 起运公历年份
  gan: TianGan;          // 天干
  zhi: DiZhi;            // 地支
  wuxing: WuXing[];      // 五行属性 (天干+地支)
  ganZhi: string;        // 干支组合 (如 "丁卯")
}

// 大运计算结果
export interface DaYunResult {
  startAge: number;       // 起运岁数 (四舍五入)
  direction: 'forward' | 'backward';  // 顺排/逆排
  cycles: DaYun[];        // 大运列表 (10步)
}

// 五行强度
export interface WuXingStrength {
  木: number;  // 0-100
  火: number;
  土: number;
  金: number;
  水: number;
  dominant: WuXing;   // 最强五行
  weakest: WuXing;    // 最弱五行
}

// IPO 时间输入
export interface IpoTimeInput {
  date: string;       // "1980-12-12"
  time: string;       // "09:30"
  timezone: string;   // "America/New_York"
}

// 北京时间组件 (用于 lunar-javascript)
export interface BeijingTimeComponents {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}
