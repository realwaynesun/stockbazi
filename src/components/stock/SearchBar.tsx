'use client';

/**
 * 市相 - Stock Search Bar with Autocomplete
 * 股票搜索栏 + 模糊自动补全
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { searchStocks, type SearchItem } from '@/lib/search/index';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-bold text-amber-400">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

export function SearchBar({
  defaultValue = '',
  placeholder = '输入股票代码或名称，如 AAPL, Tesla, 茅台',
  autoFocus = false,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const navigateTo = useCallback(
    (symbol: string) => {
      setIsLoading(true);
      setIsOpen(false);
      router.push(`/stock/${encodeURIComponent(symbol)}`);
    },
    [router]
  );

  const handleSearch = useCallback(() => {
    const symbol = value.trim().toUpperCase();
    if (!symbol) return;
    navigateTo(symbol);
  }, [value, navigateTo]);

  // Debounced search on input change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = value.trim();
    if (!q) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const hits = searchStocks(q);
      setResults(hits);
      setIsOpen(hits.length > 0);
      setActiveIndex(-1);
    }, 150);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0) {
      document
        .getElementById(`search-result-${activeIndex}`)
        ?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) {
        if (e.key === 'Enter') handleSearch();
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < results.length) {
            navigateTo(results[activeIndex].symbol);
          } else {
            handleSearch();
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setActiveIndex(-1);
          break;
      }
    },
    [isOpen, results, activeIndex, handleSearch, navigateTo]
  );

  const query = value.trim();

  return (
    <div className={cn('flex gap-2', className)} ref={containerRef}>
      <div className="relative flex-1">
        <Input
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-activedescendant={
            activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
          }
          aria-label="Search stocks by symbol or name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          className="h-12 bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20"
        />
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

        {/* Autocomplete dropdown */}
        {isOpen && results.length > 0 && (
          <ul
            id="search-results"
            role="listbox"
            aria-label="Stock search results"
            className="absolute z-50 left-0 right-0 top-full mt-1 max-h-80 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-xl"
          >
            {results.map((item, idx) => (
              <li
                id={`search-result-${idx}`}
                key={`${item.exchange}:${item.symbol}`}
                role="option"
                aria-selected={idx === activeIndex}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 cursor-pointer min-h-[44px]',
                  idx === activeIndex
                    ? 'bg-slate-700/80'
                    : 'hover:bg-slate-800/80'
                )}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  navigateTo(item.symbol);
                }}
              >
                <span className="shrink-0 w-16 text-sm font-mono font-semibold text-amber-400">
                  {highlightMatch(item.symbol, query)}
                </span>
                <span className="flex-1 text-sm text-slate-300 truncate">
                  {highlightMatch(item.name, query)}
                </span>
                <span className="shrink-0 text-xs text-slate-500">
                  {item.exchange}
                </span>
              </li>
            ))}
          </ul>
        )}
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
