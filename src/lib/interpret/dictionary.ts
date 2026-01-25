/**
 * StockBazi - Financial Interpretation Dictionary
 * 金融解读词典 - 十神与股市的映射关系
 */

import type { ShiShen, WuXing } from '../bazi/types';

/**
 * 十神金融映射
 */
export interface ShiShenFinancialMapping {
  keyword: string;           // 核心关键词
  financial: string;         // 金融含义
  positive: string;          // 正面解读
  negative: string;          // 负面解读
  industryFit: string[];     // 适合的行业
  riskLevel: 'low' | 'medium' | 'high'; // 风险等级
}

/**
 * 十神金融词典
 */
export const SHISHEN_FINANCIAL_DICTIONARY: Record<ShiShen, ShiShenFinancialMapping> = {
  '正官': {
    keyword: '监管·规范',
    financial: '监管政策、行业标准、管理层纪律、合规压力、机构持仓',
    positive: '政策扶持、行业龙头地位、规范化运营、机构认可、长期稳健',
    negative: '监管处罚、政策收紧、合规成本上升、官方调查、业务受限',
    industryFit: ['金融', '公共事业', '医药', '教育'],
    riskLevel: 'low',
  },
  '七杀': {
    keyword: '竞争·压力',
    financial: '激烈竞争、做空压力、突发利空、市场冲击、外部威胁',
    positive: '危机中逆袭、并购扩张、市场洗牌受益、竞争对手出局',
    negative: '被做空、恶性竞争、黑天鹅事件、突发利空、股价暴跌',
    industryFit: ['军工', '安防', '互联网', '竞技游戏'],
    riskLevel: 'high',
  },
  '正财': {
    keyword: '稳定收益',
    financial: '主营盈利、经营性现金流、资产价值、分红派息、稳定收入',
    positive: '业绩稳定增长、现金牛业务、高分红、资产增值、盈利能力强',
    negative: '盈利下滑、现金流紧张、资产减值、分红减少、增长乏力',
    industryFit: ['消费品', '公共事业', '银行', '保险'],
    riskLevel: 'low',
  },
  '偏财': {
    keyword: '意外之财',
    financial: '投资收益、资产处置、非主营收入、政府补贴、一次性收益',
    positive: '投资大赚、资产升值、意外利好、风口红利、资本运作成功',
    negative: '投资亏损、资产泡沫、收入不稳、补贴退坡、纸面富贵',
    industryFit: ['投资', '房地产', '创投', '多元化集团'],
    riskLevel: 'medium',
  },
  '正印': {
    keyword: '品牌·技术',
    financial: '品牌价值、专利技术、政策扶持、母公司支持、资质牌照',
    positive: '技术突破、品牌溢价、政策红利、集团赋能、护城河深厚',
    negative: '技术落后、品牌老化、扶持政策退出、母公司拖累、牌照风险',
    industryFit: ['科技', '医药', '消费品', '知名品牌'],
    riskLevel: 'low',
  },
  '偏印': {
    keyword: '创新·变革',
    financial: '颠覆创新、另类业务、非常规收入、模式创新、跨界经营',
    positive: '创新成功、新业务爆发、弯道超车、第二曲线、模式领先',
    negative: '创新失败、业务分散、盈利模式不清、烧钱无底、市场不认可',
    industryFit: ['新兴科技', '创新药', '新能源', '互联网'],
    riskLevel: 'high',
  },
  '比肩': {
    keyword: '同行·合作',
    financial: '同行竞合、股东结构、市场份额、行业景气、股东增持',
    positive: '行业景气、同行抬轿、股东增持、市占率提升、产业联盟',
    negative: '同质化竞争、股东减持、市场饱和、行业内卷、价格战',
    industryFit: ['制造业', '零售', '同行业龙头'],
    riskLevel: 'medium',
  },
  '劫财': {
    keyword: '争夺·消耗',
    financial: '市场份额争夺、价格战、资源消耗、内部竞争、股东冲突',
    positive: '市场扩张、并购整合、行业整合者、低价策略奏效',
    negative: '恶性竞争、利润被摊薄、内耗严重、股东内讧、烧钱大战',
    industryFit: ['电商', '出行', '外卖', '竞争激烈行业'],
    riskLevel: 'high',
  },
  '食神': {
    keyword: '产品·输出',
    financial: '产品力、营收增长、市场拓展、产能扩张、创意变现',
    positive: '爆款产品、营收高增、市场扩张、产能释放、用户增长',
    negative: '产品滞销、增速放缓、市场饱和、产能过剩、用户流失',
    industryFit: ['消费品', '游戏', '内容创作', '食品饮料'],
    riskLevel: 'low',
  },
  '伤官': {
    keyword: '创造·叛逆',
    financial: '颠覆创新、挑战权威、高风险高回报、不走寻常路、破坏式创新',
    positive: '颠覆式创新成功、打破行业格局、开创新品类、挑战巨头成功',
    negative: '挑战监管失败、激进扩张翻车、创新不被市场接受、负面舆论缠身',
    industryFit: ['新兴行业', '挑战者品牌', '颠覆性技术'],
    riskLevel: 'high',
  },
};

/**
 * 五行金融映射
 */
export interface WuXingFinancialMapping {
  industry: string[];        // 代表行业
  trait: string;             // 特征
  marketPhase: string;       // 对应市场阶段
  investmentStyle: string;   // 投资风格
}

/**
 * 五行行业映射
 */
export const WUXING_FINANCIAL_DICTIONARY: Record<WuXing, WuXingFinancialMapping> = {
  '木': {
    industry: ['林业', '造纸', '家具', '服装纺织', '农业', '出版', '教育'],
    trait: '成长性强，需要时间培育',
    marketPhase: '复苏期、牛市初期',
    investmentStyle: '成长型投资',
  },
  '火': {
    industry: ['能源', '电力', '光伏', '电子', '互联网', '传媒', '文化娱乐'],
    trait: '爆发力强，波动大',
    marketPhase: '牛市中期、热点板块',
    investmentStyle: '趋势投资',
  },
  '土': {
    industry: ['房地产', '建筑', '建材', '农业', '矿业', '基础设施'],
    trait: '稳定厚重，周期性强',
    marketPhase: '经济扩张期',
    investmentStyle: '周期型投资',
  },
  '金': {
    industry: ['银行', '保险', '证券', '汽车', '机械', '钢铁', '有色金属'],
    trait: '价值坚实，现金流好',
    marketPhase: '熊市末期、价值回归',
    investmentStyle: '价值型投资',
  },
  '水': {
    industry: ['航运', '物流', '水务', '饮料', '医药', '生物科技', '旅游'],
    trait: '灵活变通，顺势而为',
    marketPhase: '调整期、防御阶段',
    investmentStyle: '防御型投资',
  },
};

/**
 * 格局金融解读
 */
export const PATTERN_INTERPRETATIONS: Record<string, string> = {
  '正官格': '公司治理规范，适合长期投资。受监管政策影响大，宜关注政策面。',
  '七杀格': '竞争激烈，股价波动大。适合短线博弈，需设好止损。',
  '正财格': '盈利稳定，现金流健康。适合价值投资，关注股息率。',
  '偏财格': '收益来源多元但不稳定。需关注非经常性损益。',
  '正印格': '品牌和技术是核心竞争力。护城河深厚，长期看好。',
  '偏印格': '创新能力强但风险高。适合风险偏好较高的投资者。',
  '食神格': '产品力强，营收增长可期。关注爆款产品和市场份额。',
  '伤官格': '颠覆性强，高风险高回报。适合冒险型投资者。',
  '建禄格': '行业龙头，市场份额领先。受行业周期影响大。',
  '羊刃格': '竞争激烈，攻击性强。股价波动大，谨慎参与。',
};

/**
 * 大运运势描述模板
 */
export const DAYUN_TEMPLATES: Record<ShiShen, string> = {
  '正官': '此运正官当值，公司治理和合规成为重点。适合稳健发展，避免激进扩张。监管态度将影响股价走势。',
  '七杀': '此运七杀临身，竞争压力加大。可能面临行业洗牌或突发事件，但危中有机，能者胜出。',
  '正财': '此运正财旺盛，盈利能力增强。主营业务稳定增长，现金流充裕，是价值投资的好时机。',
  '偏财': '此运偏财透出，意外收益可期。可能有投资收益、资产处置等一次性利好，但需警惕不可持续性。',
  '正印': '此运正印护身，品牌和技术价值凸显。政策可能利好，母公司支持加强，护城河加深。',
  '偏印': '此运偏印当令，创新和变革成为主题。新业务可能爆发，但传统业务可能受冲击。',
  '比肩': '此运比肩并立，同行关系影响命运。行业景气度是关键，股东动向值得关注。',
  '劫财': '此运劫财透出，市场竞争加剧。可能有价格战或市场份额争夺，利润承压。',
  '食神': '此运食神生财，产品力是核心。营收增长可期，市场拓展顺利，创意变现能力强。',
  '伤官': '此运伤官主事，创新与风险并存。可能有颠覆性发展，但也可能与监管产生冲突。',
};

/**
 * 获取十神的金融解读
 */
export function getShiShenInterpretation(shishen: ShiShen): ShiShenFinancialMapping {
  return SHISHEN_FINANCIAL_DICTIONARY[shishen];
}

/**
 * 获取五行的行业映射
 */
export function getWuXingIndustry(wuxing: WuXing): WuXingFinancialMapping {
  return WUXING_FINANCIAL_DICTIONARY[wuxing];
}

/**
 * 获取格局解读
 */
export function getPatternInterpretation(pattern: string): string {
  return PATTERN_INTERPRETATIONS[pattern] || '格局复杂，需综合分析。';
}

/**
 * 获取大运运势描述
 */
export function getDayunInterpretation(shishen: ShiShen): string {
  return DAYUN_TEMPLATES[shishen];
}
