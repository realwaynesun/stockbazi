/**
 * StockBazi - Stock Not Found Page
 * 股票未找到页面
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StockNotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-6">📊</div>
        <h1 className="text-2xl font-bold text-slate-200 mb-2">
          该股票暂未收录
        </h1>
        <p className="text-slate-400 mb-4 max-w-md">
          该股票尚未添加到我们的数据库中。
        </p>
        <div className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
          <p className="mb-2">目前支持的股票：</p>
          <ul className="text-left list-disc list-inside space-y-1">
            <li>美股：纳斯达克和纽约证交所热门股票</li>
            <li>A股：上海、深圳交易所主要股票</li>
            <li>港股：香港交易所主要股票</li>
          </ul>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
