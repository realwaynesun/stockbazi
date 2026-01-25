/**
 * Type declarations for lunar-javascript library
 * https://github.com/6tail/lunar-javascript
 */

declare module 'lunar-javascript' {
  /**
   * 阳历（公历）
   */
  export class Solar {
    /**
     * 从年月日创建
     */
    static fromYmd(year: number, month: number, day: number): Solar;

    /**
     * 从年月日时分秒创建
     */
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
    ): Solar;

    /**
     * 获取年份
     */
    getYear(): number;

    /**
     * 获取月份
     */
    getMonth(): number;

    /**
     * 获取日期
     */
    getDay(): number;

    /**
     * 获取小时
     */
    getHour(): number;

    /**
     * 获取分钟
     */
    getMinute(): number;

    /**
     * 获取秒
     */
    getSecond(): number;

    /**
     * 获取儒略日
     */
    getJulianDay(): number;

    /**
     * 获取农历对象
     */
    getLunar(): Lunar;
  }

  /**
   * 农历（阴历）
   */
  export class Lunar {
    /**
     * 获取农历年
     */
    getYear(): number;

    /**
     * 获取农历月（负数表示闰月）
     */
    getMonth(): number;

    /**
     * 获取农历日
     */
    getDay(): number;

    /**
     * 获取年的干支
     */
    getYearInGanZhi(): string;

    /**
     * 获取月的干支
     */
    getMonthInGanZhi(): string;

    /**
     * 获取日的干支
     */
    getDayInGanZhi(): string;

    /**
     * 获取时的干支
     */
    getTimeInGanZhi(): string;

    /**
     * 获取八字
     */
    getEightChar(): EightChar;

    /**
     * 获取当前节气（如果有）
     */
    getJieQi(): string | null;

    /**
     * 获取上一个节气
     */
    getPrevJieQi(): JieQi;

    /**
     * 获取下一个节气
     */
    getNextJieQi(): JieQi;

    /**
     * 获取上一个节（用于大运计算）
     */
    getPrevJie(): JieQi;

    /**
     * 获取下一个节（用于大运计算）
     */
    getNextJie(): JieQi;
  }

  /**
   * 八字
   */
  export class EightChar {
    /**
     * 获取年柱
     */
    getYear(): string;

    /**
     * 获取月柱
     */
    getMonth(): string;

    /**
     * 获取日柱
     */
    getDay(): string;

    /**
     * 获取时柱
     */
    getTime(): string;

    /**
     * 获取大运
     */
    getDaYun(gender: number): DaYun[];
  }

  /**
   * 节气
   */
  export class JieQi {
    /**
     * 获取节气名称
     */
    getName(): string;

    /**
     * 获取阳历日期
     */
    getSolar(): Solar;
  }

  /**
   * 大运
   */
  export class DaYun {
    /**
     * 获取起运岁数
     */
    getStartAge(): number;

    /**
     * 获取干支
     */
    getGanZhi(): string;
  }
}
