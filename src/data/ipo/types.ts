import type { Exchange } from '@/lib/stock/types';

export interface IpoEntry {
  name: string;
  ipoDate: string;  // YYYY-MM-DD format
  exchange: Exchange;
}
