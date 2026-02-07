/**
 * 市相 (ShiXiang) - Homepage
 * 首页 - 股票八字分析入口
 */

import { SearchBar } from '@/components/stock/SearchBar';

// 热门股票示例
const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: '苹果', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: '特斯拉', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: '英伟达', exchange: 'NASDAQ' },
  { symbol: '600519', name: '贵州茅台', exchange: 'SSE' },
  { symbol: '0700', name: '腾讯控股', exchange: 'HKEX' },
  { symbol: 'MSFT', name: '微软', exchange: 'NASDAQ' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          {/* 八卦图标 */}
          <div className="inline-block mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center">
              <span className="text-4xl">☯</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 mb-4">
            市相
          </h1>
          <h2 className="text-xl md:text-2xl text-slate-300 mb-2">
            股票八字分析
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            以股票 IPO 日期时间为"生辰"，运用中国传统四柱八字、五行、十神理论，
            为您提供独特的市场分析视角。
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-16">
          <SearchBar autoFocus />
          <p className="text-center text-slate-500 text-sm mt-3">
            支持美股、A股、港股代码，如 AAPL, 600519, 0700.HK
          </p>
        </div>

        {/* Popular Stocks */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-slate-400 text-sm mb-4">
            热门股票
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {POPULAR_STOCKS.map((stock) => (
              <a
                key={stock.symbol}
                href={`/stock/${stock.symbol}`}
                className="block p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-lg transition-all text-center group"
              >
                <div className="text-lg font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                  {stock.symbol}
                </div>
                <div className="text-xs text-slate-500">
                  {stock.name}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mt-20 grid md:grid-cols-3 gap-6">
          <a
            href="/guide/bazi"
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏛️</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-200 group-hover:text-emerald-400 mb-2 transition-colors">
              四柱八字
            </h4>
            <p className="text-slate-400 text-sm">
              将 IPO 日期时间转换为年月日时四柱，揭示企业命理特征。
            </p>
            <span className="text-xs text-slate-600 group-hover:text-slate-400 mt-3 inline-block transition-colors">
              以 AAPL 为例 →
            </span>
          </a>

          <a
            href="/guide/wuxing"
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-amber-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔥</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-200 group-hover:text-amber-400 mb-2 transition-colors">
              五行分析
            </h4>
            <p className="text-slate-400 text-sm">
              金木水火土五行强弱分析，洞察企业行业属性与发展潜力。
            </p>
            <span className="text-xs text-slate-600 group-hover:text-slate-400 mt-3 inline-block transition-colors">
              以贵州茅台为例 →
            </span>
          </a>

          <a
            href="/guide/dayun"
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-purple-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-200 group-hover:text-purple-400 mb-2 transition-colors">
              大运流年
            </h4>
            <p className="text-slate-400 text-sm">
              推算 100 年大运周期，结合当前运势提供金融解读。
            </p>
            <span className="text-xs text-slate-600 group-hover:text-slate-400 mt-3 inline-block transition-colors">
              以 TSLA 为例 →
            </span>
          </a>
        </div>

        {/* Disclaimer */}
        <div className="mt-20 text-center">
          <p className="text-amber-500/80 text-sm">
            ⚠️ 本工具仅供娱乐参考，不构成任何投资建议。股票投资有风险，请理性决策。
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>市相 © 2025 - 新中式金融玄学</p>
        </div>
      </footer>
    </main>
  );
}
