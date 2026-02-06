/**
 * 市相 - Unified Analytics Tracker
 * Privacy-friendly event tracking
 */

export type EventType =
  | 'page_view'
  | 'stock_search'
  | 'stock_view'
  | 'card_export'
  | 'card_share'
  | 'compare_view'
  | 'referral_click';

export interface TrackEvent {
  type: EventType;
  properties?: Record<string, string | number | boolean>;
}

interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
}

const config: AnalyticsConfig = {
  enabled: typeof window !== 'undefined',
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Track an analytics event
 */
export function track(event: TrackEvent): void {
  if (!config.enabled) return;

  if (config.debug) {
    console.debug('[Analytics]', event.type, event.properties);
  }

  // Send to Baidu Analytics if available
  const hmt = (window as unknown as Record<string, unknown>).hmt as Array<unknown[]> | undefined;
  if (hmt) {
    hmt.push(['_trackEvent', 'shixiang', event.type, JSON.stringify(event.properties || {})]);
  }

  // Store locally for basic metrics
  storeEvent(event);
}

/**
 * Track a page view
 */
export function trackPageView(path: string): void {
  track({
    type: 'page_view',
    properties: { path },
  });
}

/**
 * Track stock search
 */
export function trackStockSearch(query: string): void {
  track({
    type: 'stock_search',
    properties: { query },
  });
}

/**
 * Track stock view
 */
export function trackStockView(symbol: string, exchange: string): void {
  track({
    type: 'stock_view',
    properties: { symbol, exchange },
  });
}

/**
 * Track card export
 */
export function trackCardExport(symbol: string, template: string): void {
  track({
    type: 'card_export',
    properties: { symbol, template },
  });
}

/**
 * Track card share
 */
export function trackCardShare(symbol: string, method: string): void {
  track({
    type: 'card_share',
    properties: { symbol, method },
  });
}

/**
 * Track compare view
 */
export function trackCompareView(symbol1: string, symbol2: string): void {
  track({
    type: 'compare_view',
    properties: { symbol1, symbol2 },
  });
}

/**
 * Track referral click
 */
export function trackReferralClick(source: string): void {
  track({
    type: 'referral_click',
    properties: { source },
  });
}

// Local storage key
const STORAGE_KEY = 'shixiang_events';
const MAX_STORED_EVENTS = 100;

/**
 * Store event locally (ring buffer)
 */
function storeEvent(event: TrackEvent): void {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as TrackEvent[];
    stored.push({ ...event, properties: { ...event.properties, ts: Date.now() } });
    if (stored.length > MAX_STORED_EVENTS) {
      stored.splice(0, stored.length - MAX_STORED_EVENTS);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // localStorage not available
  }
}

/**
 * Get stored events (for debugging)
 */
export function getStoredEvents(): TrackEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
