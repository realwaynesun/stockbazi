'use client';

/**
 * 市相 - IPO 时间选择器
 * 允许用户选择不同的 IPO 时辰，触发报告重算
 */

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface IpoTimeSelectorProps {
  /** 当前选中的时间 */
  currentTime: string;
  /** 默认时间（交易所开盘时间） */
  defaultTime: string;
  /** 额外的 CSS 类名 */
  className?: string;
}

// 预设时间选项
const TIME_PRESETS = [
  { value: '09:30', label: '09:30', desc: '开盘' },
  { value: '11:30', label: '11:30', desc: '午前' },
  { value: '13:00', label: '13:00', desc: '午后' },
  { value: '15:00', label: '15:00', desc: '收盘' },
];

export function IpoTimeSelector({
  currentTime,
  defaultTime,
  className,
}: IpoTimeSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const isCustomTime = !TIME_PRESETS.some((p) => p.value === currentTime);
  const isDefault = currentTime === defaultTime;

  // 更新 URL 参数
  const handleTimeChange = (time: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (time === defaultTime) {
      params.delete('time');
    } else {
      params.set('time', time);
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      {/* 当前时间显示 + 下拉触发 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all',
          'border hover:bg-slate-800',
          isDefault
            ? 'border-slate-700 text-slate-400'
            : 'border-amber-500/50 text-amber-400 bg-amber-500/10'
        )}
      >
        <span className="font-mono">{currentTime}</span>
        {!isDefault && <span className="text-xs">(自定义)</span>}
        <svg
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* 菜单内容 */}
          <div className="absolute top-full left-0 mt-2 z-20 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
            {/* 说明文字 */}
            <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700">
              <p className="text-xs text-slate-400">
                选择不同时辰会影响时柱计算，
                <br />
                从而改变部分分析结果
              </p>
            </div>

            {/* 预设选项 */}
            <div className="p-2">
              {TIME_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleTimeChange(preset.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                    currentTime === preset.value
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-slate-300 hover:bg-slate-700'
                  )}
                >
                  <span className="font-mono">{preset.label}</span>
                  <span className="text-xs text-slate-500">{preset.desc}</span>
                </button>
              ))}
            </div>

            {/* 恢复默认 */}
            {!isDefault && (
              <div className="px-2 pb-2">
                <button
                  onClick={() => handleTimeChange(defaultTime)}
                  className="w-full px-3 py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  恢复默认时间 ({defaultTime})
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Info tooltip */}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 group">
        <span className="text-slate-600 hover:text-slate-400 cursor-help text-sm">ⓘ</span>
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 whitespace-normal">
          默认使用交易所开盘时间。
          实际 IPO 时间通常无法精确获取，
          时辰变化会影响时柱。
        </div>
      </div>
    </div>
  );
}

export default IpoTimeSelector;
