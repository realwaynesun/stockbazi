/**
 * StockBazi - Stock Page Loading Skeleton
 * 股票分析页面加载骨架屏
 */

export default function StockLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header Skeleton */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 skeleton rounded-full" />
              <div className="w-24 h-6 skeleton hidden sm:block" />
            </div>
            <div className="flex-1 max-w-lg">
              <div className="h-10 skeleton rounded-lg" />
            </div>
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        {/* Stock Info Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-32 h-10 skeleton" />
            <div className="w-20 h-6 skeleton" />
          </div>
          <div className="w-64 h-5 skeleton mb-2" />
          <div className="w-48 h-4 skeleton" />
        </div>

        {/* Bazi Chart Skeleton */}
        <section className="mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl animate-fade-in">
          <div className="w-32 h-6 skeleton mb-6" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-full h-32 skeleton rounded-lg mb-2" />
                <div className="w-12 h-4 skeleton mx-auto" />
              </div>
            ))}
          </div>
        </section>

        {/* Wuxing Radar Skeleton */}
        <section className="mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl animate-fade-in">
          <div className="w-32 h-6 skeleton mb-6" />
          <div className="h-64 skeleton rounded-lg" />
        </section>

        {/* Da Yun Timeline Skeleton */}
        <section className="mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl animate-fade-in">
          <div className="w-32 h-6 skeleton mb-6" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 w-24">
                <div className="h-20 skeleton rounded-lg mb-2" />
                <div className="w-16 h-3 skeleton mx-auto" />
              </div>
            ))}
          </div>
        </section>

        {/* Interpretation Skeleton */}
        <section className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl animate-fade-in">
          <div className="w-40 h-6 skeleton mb-6" />
          <div className="space-y-3">
            <div className="w-full h-4 skeleton" />
            <div className="w-5/6 h-4 skeleton" />
            <div className="w-4/6 h-4 skeleton" />
            <div className="w-full h-4 skeleton mt-4" />
            <div className="w-3/4 h-4 skeleton" />
          </div>
        </section>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 right-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 border border-slate-700 rounded-full backdrop-blur-sm">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-300">加载中...</span>
        </div>
      </div>
    </main>
  );
}
