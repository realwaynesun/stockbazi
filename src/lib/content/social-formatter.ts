/**
 * 市相 - Social Content Formatter
 * Format analysis results for different social channels
 */

export type SocialChannel = 'weibo' | 'xiaohongshu' | 'douyin' | 'wechat' | 'twitter';

export interface SocialPost {
  text: string;
  hashtags: string[];
  url?: string;
}

interface FormatInput {
  stockName: string;
  stockSymbol: string;
  baziString: string;
  hookSentence: string;
  keywords: [string, string, string];
  yearTagline: string;
  dominantWuxing: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shixiang.app';

/**
 * Format content for a specific social channel
 */
export function formatForChannel(input: FormatInput, channel: SocialChannel): SocialPost {
  const formatters: Record<SocialChannel, () => SocialPost> = {
    weibo: () => formatWeibo(input),
    xiaohongshu: () => formatXiaohongshu(input),
    douyin: () => formatDouyin(input),
    wechat: () => formatWechat(input),
    twitter: () => formatTwitter(input),
  };

  return formatters[channel]();
}

function formatWeibo(input: FormatInput): SocialPost {
  const text = [
    `【${input.stockName} 八字分析】`,
    ``,
    input.hookSentence,
    ``,
    `八字：${input.baziString}`,
    `关键词：${input.keywords.join(' | ')}`,
    `${input.yearTagline}`,
    ``,
    `🔮 仅供娱乐，不构成投资建议`,
    ``,
    `🔗 ${SITE_URL}/stock/${input.stockSymbol}`,
  ].join('\n');

  return {
    text,
    hashtags: ['市相', '股票八字', '炒股玄学', '金融命理'],
    url: `${SITE_URL}/stock/${input.stockSymbol}`,
  };
}

function formatXiaohongshu(input: FormatInput): SocialPost {
  const text = [
    input.hookSentence,
    ``,
    `${input.stockName} | ${input.stockSymbol}`,
    ``,
    `📊 八字：${input.baziString}`,
    `🏷️ ${input.keywords.join(' · ')}`,
    `📅 ${input.yearTagline}`,
    ``,
    `你觉得准不准？评论区聊聊～`,
    ``,
    `#市相 #股票八字 #炒股玄学 #${input.stockName} #${input.dominantWuxing}行旺`,
  ].join('\n');

  return {
    text,
    hashtags: ['市相', '股票八字', '炒股玄学', input.stockName, `${input.dominantWuxing}行旺`],
  };
}

function formatDouyin(input: FormatInput): SocialPost {
  const text = [
    `${input.hookSentence}`,
    ``,
    `#${input.stockName} 八字分析`,
    `八字：${input.baziString}`,
    ``,
    `${input.keywords.join(' | ')}`,
    ``,
    `仅供娱乐 不构成投资建议`,
    `#市相 #股票命理 #炒股玄学`,
  ].join('\n');

  return {
    text,
    hashtags: ['市相', '股票命理', '炒股玄学', input.stockName],
  };
}

function formatWechat(input: FormatInput): SocialPost {
  const text = [
    input.hookSentence,
    ``,
    `${input.stockName}（${input.stockSymbol}）`,
    `八字：${input.baziString}`,
    `${input.keywords.join(' | ')}`,
    ``,
    `${input.yearTagline}`,
    ``,
    `📱 详细报告：${SITE_URL}/stock/${input.stockSymbol}`,
    ``,
    `🔮 仅供娱乐，不构成投资建议`,
  ].join('\n');

  return {
    text,
    hashtags: [],
    url: `${SITE_URL}/stock/${input.stockSymbol}`,
  };
}

function formatTwitter(input: FormatInput): SocialPost {
  // Twitter has 280 char limit, keep it short
  const text = [
    `${input.hookSentence}`,
    ``,
    `${input.stockName} (${input.stockSymbol})`,
    `Bazi: ${input.baziString}`,
    `${input.keywords.join(' | ')}`,
    ``,
    `${SITE_URL}/stock/${input.stockSymbol}`,
  ].join('\n');

  return {
    text,
    hashtags: ['ShiXiang', 'StockBazi'],
    url: `${SITE_URL}/stock/${input.stockSymbol}`,
  };
}

/**
 * Format all channels at once
 */
export function formatAllChannels(input: FormatInput): Record<SocialChannel, SocialPost> {
  return {
    weibo: formatForChannel(input, 'weibo'),
    xiaohongshu: formatForChannel(input, 'xiaohongshu'),
    douyin: formatForChannel(input, 'douyin'),
    wechat: formatForChannel(input, 'wechat'),
    twitter: formatForChannel(input, 'twitter'),
  };
}
