# StockBazi 产品需求文档 (PRD)

> 版本: 1.0.0
> 创建日期: 2025-01-25
> 状态: Draft

---

## 1. 项目概述

### 1.1 项目名称
**StockBazi** (股票八字)

### 1.2 核心理念
将股票的 IPO 日期时间视为其"生辰八字"，通过中国传统命理学框架（四柱八字、五行、十神）生成一套独特的市场分析视角。

### 1.3 目标用户
- 对命理学感兴趣的股票投资者
- 喜欢从非传统角度分析市场的交易者
- 金融占星/玄学爱好者

### 1.4 产品愿景
打造一个将传统命理智慧与现代金融分析结合的创新工具，提供独特的股票分析视角。

---

## 2. 产品形态与技术架构

### 2.1 产品形态
| 阶段 | 形态 | 目标 |
|------|------|------|
| Phase 1 | Web 应用 | MVP 验证核心逻辑 |
| Phase 2 | 移动端 App | iOS/Android 覆盖 |

### 2.2 技术栈（推荐）

```
┌─────────────────────────────────────────────────────┐
│                    前端 (Web)                        │
│     Next.js 14+ (App Router) + TypeScript           │
│     TailwindCSS + shadcn/ui                         │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                 后端 (API Routes)                    │
│     Next.js Server Actions / Route Handlers         │
│     lunar-javascript (八字核心计算)                  │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                     数据层                           │
│     SQLite (本地缓存) / PostgreSQL (生产)           │
│     Prisma ORM                                       │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   外部数据源                         │
│     Yahoo Finance API (yfinance 数据)               │
│     Alpha Vantage / Polygon.io (备选)               │
└─────────────────────────────────────────────────────┘
```

### 2.3 技术栈选型理由

| 选择 | 理由 |
|------|------|
| Next.js | 全栈能力、SSR/SSG、Vercel 一键部署 |
| TypeScript | 类型安全、前后端代码复用 |
| lunar-javascript | 成熟的农历/八字计算库，纯 JS 实现 |
| Prisma | 类型安全 ORM，支持多种数据库 |
| React Native (Phase 2) | 复用 React 组件逻辑 |

---

## 3. 功能需求

### 3.1 Phase 1 - 核心功能 (MVP)

#### 3.1.1 股票 IPO 数据获取

| 字段 | 说明 | 必需 |
|------|------|------|
| `symbol` | 股票代码 (如 AAPL, 600519.SS) | ✅ |
| `name` | 股票名称 | ✅ |
| `ipo_date` | IPO 日期 | ✅ |
| `ipo_time` | IPO 时间 | ⚠️ 默认开盘时间 |
| `exchange` | 交易所 | ✅ |
| `timezone` | 时区 | ✅ |

**IPO 时间默认规则**：
| 交易所 | 默认时间 | 时区 |
|--------|----------|------|
| NYSE/NASDAQ | 09:30 | America/New_York |
| SSE/SZSE | 09:30 | Asia/Shanghai |
| HKEX | 09:30 | Asia/Hong_Kong |
| TSE | 09:00 | Asia/Tokyo |

#### 3.1.2 八字排盘计算（核心）

**输入**：
- 公历日期时间 (IPO DateTime)
- 时区

**输出**：
```typescript
interface BaziResult {
  // 四柱
  yearPillar: { gan: string; zhi: string }   // 年柱
  monthPillar: { gan: string; zhi: string }  // 月柱
  dayPillar: { gan: string; zhi: string }    // 日柱
  hourPillar: { gan: string; zhi: string }   // 时柱

  // 农历信息
  lunarDate: {
    year: number
    month: number
    day: number
    isLeapMonth: boolean
  }

  // 阴阳属性（用于大运推算）
  yinYang: 'yang' | 'yin'  // 年干决定

  // 节气信息
  solarTerm: string | null  // 当日节气
  prevSolarTerm: { name: string; date: Date }  // 上一个节气
  nextSolarTerm: { name: string; date: Date }  // 下一个节气
}
```

**验证用例**（所有时间统一转换为北京时间 Asia/Shanghai 计算，基于 lunar-javascript 库）：
| 案例 | 输入 | 时区 | 北京时间 | 期望输出 | 说明 |
|------|------|------|----------|----------|------|
| 立春前 | 2024-02-04 11:00 | Asia/Shanghai | 11:00 | 癸卯 乙丑 戊戌 戊午 | 立春约16:26，11:00仍为癸卯年 |
| 立春后 | 2024-02-04 17:00 | Asia/Shanghai | 17:00 | 甲辰 丙寅 戊戌 辛酉 | 立春后变为甲辰年 |
| AAPL | 1980-12-12 09:30 | America/New_York | 22:30 | 庚申 戊子 己未 乙亥 | 亥时 (21:00-23:00) |
| TSLA | 2010-06-29 09:30 | America/New_York | 21:30 | 庚寅 壬午 庚戌 丁亥 | 夏令时EDT，亥时 |
| 茅台 | 2001-08-27 09:30 | Asia/Shanghai | 09:30 | 辛巳 丙申 壬戌 乙巳 | 巳时 (09:00-11:00) |

#### 3.1.3 大运推算

**规则**：
1. **起运计算**：
   - 从出生日到上/下一个节气的天数
   - 3天 = 1岁，1天 = 4个月

2. **顺逆判断**：
   - 阳年（年干为甲丙戊庚壬）→ 顺排
   - 阴年（年干为乙丁己辛癸）→ 逆排

3. **输出**：
```typescript
interface DaYun {
  index: number           // 大运序号 (1-10)
  startAge: number        // 起运年龄
  startYear: number       // 起运公历年份
  gan: string            // 天干
  zhi: string            // 地支
  wuxing: string[]       // 五行属性
  duration: 10           // 每步大运10年
}
```

#### 3.1.4 五行强度计算

**地支藏干权重表**：
```typescript
const ZANGGAN_WEIGHTS: Record<string, Record<string, number>> = {
  '子': { '癸': 1.0 },
  '丑': { '己': 0.6, '癸': 0.3, '辛': 0.1 },
  '寅': { '甲': 0.6, '丙': 0.3, '戊': 0.1 },
  '卯': { '乙': 1.0 },
  '辰': { '戊': 0.6, '乙': 0.3, '癸': 0.1 },
  '巳': { '丙': 0.6, '庚': 0.3, '戊': 0.1 },
  '午': { '丁': 0.7, '己': 0.3 },
  '未': { '己': 0.6, '丁': 0.3, '乙': 0.1 },
  '申': { '庚': 0.6, '壬': 0.3, '戊': 0.1 },
  '酉': { '辛': 1.0 },
  '戌': { '戊': 0.6, '辛': 0.3, '丁': 0.1 },
  '亥': { '壬': 0.7, '甲': 0.3 }
}
```

**月令旺衰系数**：
```typescript
const MONTH_STRENGTH: Record<string, Record<WuXing, number>> = {
  '寅': { '木': 2.0, '火': 1.5, '土': 1.0, '金': 0.7, '水': 0.5 },
  '卯': { '木': 2.0, '火': 1.5, '土': 1.0, '金': 0.5, '水': 0.7 },
  // ... 完整12地支
}
```

**输出**：
```typescript
interface WuXingStrength {
  木: number  // 0-100 归一化分数
  火: number
  土: number
  金: number
  水: number
  dominant: WuXing    // 最强五行
  weakest: WuXing     // 最弱五行
}
```

#### 3.1.5 十神解析 & 金融映射

**十神计算**：基于日干与其他天干的关系

**金融映射词典**：
```typescript
const FINANCIAL_INTERPRETATION: Record<ShiShen, FinancialMapping> = {
  '正官': {
    keyword: '监管·规范',
    financial: '监管政策、行业标准、管理层纪律、合规压力',
    positive: '政策扶持、行业龙头地位、规范化运营',
    negative: '监管处罚、政策收紧、合规成本上升'
  },
  '七杀': {
    keyword: '竞争·压力',
    financial: '激烈竞争、做空压力、突发利空、市场冲击',
    positive: '危机中逆袭、并购扩张、市场洗牌受益',
    negative: '被做空、恶性竞争、黑天鹅事件'
  },
  '正财': {
    keyword: '稳定收益',
    financial: '主营盈利、现金流、资产价值、分红',
    positive: '业绩稳定增长、现金牛业务、高分红',
    negative: '盈利下滑、现金流紧张、资产减值'
  },
  '偏财': {
    keyword: '意外之财',
    financial: '投资收益、资产处置、非主营收入',
    positive: '投资大赚、资产升值、意外利好',
    negative: '投资亏损、资产泡沫、收入不稳'
  },
  '正印': {
    keyword: '品牌·技术',
    financial: '品牌价值、专利技术、政策扶持、母公司支持',
    positive: '技术突破、品牌溢价、政策红利',
    negative: '技术落后、品牌老化、扶持政策退出'
  },
  '偏印': {
    keyword: '创新·变革',
    financial: '颠覆创新、另类业务、非常规收入',
    positive: '创新成功、新业务爆发、弯道超车',
    negative: '创新失败、业务分散、盈利模式不清'
  },
  '比肩': {
    keyword: '同行·合作',
    financial: '同行竞合、股东结构、市场份额',
    positive: '行业景气、同行抬轿、股东增持',
    negative: '同质化竞争、股东减持、市场饱和'
  },
  '劫财': {
    keyword: '争夺·消耗',
    financial: '市场份额争夺、价格战、资源消耗',
    positive: '市场扩张、并购整合',
    negative: '恶性竞争、利润被摊薄、内耗严重'
  },
  '食神': {
    keyword: '产品·输出',
    financial: '产品力、营收增长、市场拓展',
    positive: '爆款产品、营收高增、市场扩张',
    negative: '产品滞销、增速放缓、市场饱和'
  },
  '伤官': {
    keyword: '创造·叛逆',
    financial: '颠覆创新、挑战权威、高风险高回报',
    positive: '颠覆式创新成功、打破行业格局',
    negative: '挑战监管失败、激进扩张翻车'
  }
}
```

#### 3.1.6 分析报告生成

**报告结构**：
```markdown
# [股票代码] 八字分析报告

## 基本信息
- 股票: AAPL (苹果公司)
- IPO 时间: 1980-12-12 09:30 (EST)
- 交易所: NASDAQ

## 八字排盘
年柱: 庚申 (金金)
月柱: 戊子 (土水)
日柱: 辛酉 (金金) ← 日主
时柱: 癸巳 (水火)

## 五行分析
[可视化图表]
金: ████████████ 45%
水: ██████ 22%
土: ████ 15%
火: ███ 12%
木: █ 6%

特征: 金旺水相，食伤生财格局

## 当前运势
大运: 丁火正财 (2020-2030)
流年: 甲辰 (2024)

## 分析解读
[自动生成的金融语言解读]
```

### 3.2 Phase 2 - 扩展功能

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 用户系统 | 注册登录、收藏股票 | P1 |
| 对比分析 | 多只股票八字对比 | P1 |
| 合盘分析 | 股票与投资者八字合盘 | P2 |
| 流年预测 | 年度/季度运势预测 | P2 |
| 历史验证 | 回测分析大运与股价关系 | P3 |
| API 服务 | 开放 API 供第三方调用 | P3 |

---

## 4. 非功能需求

### 4.1 性能要求
| 指标 | 目标值 |
|------|--------|
| 八字计算响应时间 | < 100ms |
| 完整报告生成时间 | < 2s |
| 页面首屏加载 | < 3s (LCP) |
| 并发用户支持 | 100+ (MVP) |

### 4.2 数据准确性
- 八字计算必须通过已知案例验证
- 大运排盘误差 < 1年
- 五行强度计算有据可查

### 4.3 可扩展性
- 支持多国股市（美股、A股、港股、日股）
- 支持多语言（中文、英文）
- 支持多种数据源切换

---

## 5. 数据库设计

### 5.1 核心表结构

```sql
-- 股票基本信息
CREATE TABLE stocks (
  id            TEXT PRIMARY KEY,
  symbol        TEXT NOT NULL,
  name          TEXT NOT NULL,
  exchange      TEXT NOT NULL,
  ipo_date      DATE NOT NULL,
  ipo_time      TIME DEFAULT '09:30',
  timezone      TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(symbol, exchange)  -- Composite key for multi-market support
);

-- 八字计算结果缓存
CREATE TABLE bazi_results (
  id            TEXT PRIMARY KEY,
  stock_id      TEXT NOT NULL REFERENCES stocks(id),
  year_gan      TEXT NOT NULL,
  year_zhi      TEXT NOT NULL,
  month_gan     TEXT NOT NULL,
  month_zhi     TEXT NOT NULL,
  day_gan       TEXT NOT NULL,
  day_zhi       TEXT NOT NULL,
  hour_gan      TEXT NOT NULL,
  hour_zhi      TEXT NOT NULL,
  yin_yang      TEXT NOT NULL,
  wuxing_json   JSON NOT NULL,
  dayun_json    JSON NOT NULL,
  computed_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(stock_id)
);

-- 用户收藏 (Phase 2)
CREATE TABLE user_favorites (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL,
  stock_id      TEXT NOT NULL REFERENCES stocks(id),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, stock_id)
);
```

---

## 6. 开发计划

### 6.1 里程碑

```
Phase 1: MVP (Web)
├── M1: 项目初始化 & 八字核心算法 (Week 1-2)
│   ├── 项目脚手架 (Next.js + TypeScript)
│   ├── 集成 lunar-javascript
│   ├── 实现八字排盘 + 验证测试
│   └── 实现大运计算
│
├── M2: 数据层 & 五行分析 (Week 3-4)
│   ├── 数据库设计 (Prisma + SQLite)
│   ├── IPO 数据获取模块
│   ├── 五行强度计算
│   └── 十神映射词典
│
├── M3: Web UI & 报告生成 (Week 5-6)
│   ├── 首页搜索界面
│   ├── 股票分析报告页面
│   ├── 五行可视化图表
│   └── 响应式设计
│
└── M4: 优化 & 上线 (Week 7-8)
    ├── 性能优化
    ├── SEO 优化
    ├── 部署 (Vercel)
    └── 上线 MVP

Phase 2: 移动端 (待定)
└── React Native 开发
```

---

## 7. 风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| IPO 精确时间难获取 | 八字时柱不准 | 默认开盘时间，支持手动覆盖 |
| lunar-javascript 计算误差 | 核心功能不可靠 | 多库交叉验证，单元测试覆盖 |
| 金融-玄学映射缺乏依据 | 解读不可信 | 声明娱乐属性，持续迭代词典 |
| 用户对"玄学"接受度 | 产品推广困难 | 强调"另类视角"而非"预测工具" |

---

## 8. 术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 八字 | Bazi / Four Pillars | 年月日时四柱，每柱一天干一地支 |
| 天干 | Heavenly Stems | 甲乙丙丁戊己庚辛壬癸 (10个) |
| 地支 | Earthly Branches | 子丑寅卯辰巳午未申酉戌亥 (12个) |
| 五行 | Wu Xing / Five Elements | 金木水火土 |
| 十神 | Ten Gods | 正官、七杀、正财、偏财、正印、偏印、比肩、劫财、食神、伤官 |
| 大运 | Major Luck Cycles | 每10年一步的运势周期 |
| 流年 | Annual Luck | 每年的运势 |
| 日主 | Day Master | 日柱天干，代表命主本身 |

---

## 9. 附录

### A. 参考资源
- [lunar-javascript](https://github.com/6tail/lunar-javascript) - 八字计算核心库
- [yfinance](https://github.com/ranaroussi/yfinance) - 股票数据 (Python, 可用于数据验证)
- [Yahoo Finance API](https://query1.finance.yahoo.com/) - 股票数据源

### B. 验证用例（基于 lunar-javascript 库计算）

**注意**：所有美股 IPO 时间需转换为北京时间计算八字。

| 案例 | IPO 日期 | 本地时间 | 时区 | 北京时间 | 期望八字 |
|------|----------|----------|------|----------|----------|
| 立春前 | 2024-02-04 | 11:00 | Asia/Shanghai | 11:00 | 癸卯 乙丑 戊戌 戊午 |
| 立春后 | 2024-02-04 | 17:00 | Asia/Shanghai | 17:00 | 甲辰 丙寅 戊戌 辛酉 |
| AAPL | 1980-12-12 | 09:30 | America/New_York | 22:30 | 庚申 戊子 己未 乙亥 |
| TSLA | 2010-06-29 | 09:30 | America/New_York | 21:30 | 庚寅 壬午 庚戌 丁亥 |
| 茅台 | 2001-08-27 | 09:30 | Asia/Shanghai | 09:30 | 辛巳 丙申 壬戌 乙巳 |

---

*文档结束*
