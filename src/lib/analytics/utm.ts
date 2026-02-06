/**
 * 市相 - UTM Parameter Handler
 * Parse, persist, and retrieve UTM parameters
 */

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

const UTM_STORAGE_KEY = 'shixiang_utm';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

/**
 * Parse UTM parameters from URL
 */
export function parseUtmParams(url?: string): UtmParams {
  const searchParams = url
    ? new URL(url).searchParams
    : typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const params: UtmParams = {};

  if (searchParams.get('utm_source')) params.source = searchParams.get('utm_source')!;
  if (searchParams.get('utm_medium')) params.medium = searchParams.get('utm_medium')!;
  if (searchParams.get('utm_campaign')) params.campaign = searchParams.get('utm_campaign')!;
  if (searchParams.get('utm_content')) params.content = searchParams.get('utm_content')!;
  if (searchParams.get('utm_term')) params.term = searchParams.get('utm_term')!;

  return params;
}

/**
 * Persist UTM params to sessionStorage (first-touch attribution)
 */
export function persistUtmParams(params?: UtmParams): void {
  try {
    const existing = getPersistedUtm();
    // First-touch: only persist if no existing UTM
    if (existing.source) return;

    const toStore = params || parseUtmParams();
    if (toStore.source) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(toStore));
    }
  } catch {
    // sessionStorage not available
  }
}

/**
 * Get persisted UTM params
 */
export function getPersistedUtm(): UtmParams {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

/**
 * Build URL with UTM parameters
 */
export function buildUtmUrl(baseUrl: string, params: UtmParams): string {
  const url = new URL(baseUrl);
  if (params.source) url.searchParams.set('utm_source', params.source);
  if (params.medium) url.searchParams.set('utm_medium', params.medium);
  if (params.campaign) url.searchParams.set('utm_campaign', params.campaign);
  if (params.content) url.searchParams.set('utm_content', params.content);
  if (params.term) url.searchParams.set('utm_term', params.term);
  return url.toString();
}

/**
 * Strip UTM parameters from URL (for clean display)
 */
export function stripUtmParams(url: string): string {
  const parsed = new URL(url);
  for (const key of UTM_KEYS) {
    parsed.searchParams.delete(key);
  }
  return parsed.toString();
}
