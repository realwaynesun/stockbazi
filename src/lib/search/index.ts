/**
 * 市相 - Stock Search Index
 * Fuzzy autocomplete search over IPO_DATA
 */

import { IPO_DATA } from '@/data/ipo/index';
import type { Exchange } from '@/lib/stock/types';

export interface SearchItem {
  symbol: string;
  name: string;
  exchange: Exchange;
  path: string;
}

interface ScoredItem extends SearchItem {
  score: number;
}

// Build flat search index at module level
const SEARCH_INDEX: SearchItem[] = Object.entries(IPO_DATA).map(
  ([key, entry]) => {
    const [, symbol] = key.split(':');
    return {
      symbol,
      name: entry.name,
      exchange: entry.exchange,
      path: `/stock/${symbol}`,
    };
  }
);

export function searchStocks(query: string, limit = 8): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: ScoredItem[] = [];

  for (const item of SEARCH_INDEX) {
    const symLower = item.symbol.toLowerCase();
    const nameLower = item.name.toLowerCase();

    let score = 0;
    if (symLower === q) {
      score = 100;
    } else if (symLower.startsWith(q)) {
      score = 80;
    } else if (nameLower.startsWith(q)) {
      score = 60;
    } else if (symLower.includes(q) || nameLower.includes(q)) {
      score = 40;
    }

    if (score > 0) {
      scored.push({ ...item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.name.length - b.name.length);

  return scored.slice(0, limit).map(({ score: _, ...item }) => item);
}
