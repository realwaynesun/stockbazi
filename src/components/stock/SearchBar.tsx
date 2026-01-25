'use client';

/**
 * 市相 - Stock Search Bar Component
 * 股票搜索栏组件
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  /** 默认值 */
  defaultValue?: string;
  /** 占位符 */
  placeholder?: string;
  /** 是否自动聚焦 */
  autoFocus?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
}

export function SearchBar({
  defaultValue = '',
  placeholder = '输入股票代码，如 AAPL, TSLA, 600519',
  autoFocus = false,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    const symbol = value.trim().toUpperCase();
    if (!symbol) return;

    setIsLoading(true);
    // 导航到股票分析页面
    router.push(`/stock/${encodeURIComponent(symbol)}`);
  }, [value, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <div className={cn('flex gap-2', className)}>
      <div className="relative flex-1">
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="h-12 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20"
        />
        {/* 搜索图标 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>
      <Button
        onClick={handleSearch}
        disabled={!value.trim() || isLoading}
        className="h-12 px-6 bg-amber-600 hover:bg-amber-500 text-white font-medium"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            分析中
          </span>
        ) : (
          '分析八字'
        )}
      </Button>
    </div>
  );
}

export default SearchBar;
