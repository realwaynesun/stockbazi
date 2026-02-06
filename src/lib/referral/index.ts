/**
 * 市相 - Referral System
 * Lightweight client-side referral tracking
 */

const REFERRAL_STORAGE_KEY = 'shixiang_referral';
const REFERRAL_PARAM = 'ref';

export interface ReferralInfo {
  code: string;
  referredAt: string;
}

/**
 * Generate a referral code based on stock being viewed
 */
export function generateReferralCode(symbol: string): string {
  const timestamp = Date.now().toString(36).slice(-4);
  return `${symbol.toLowerCase()}-${timestamp}`;
}

/**
 * Build a shareable referral URL
 */
export function buildReferralUrl(path: string, refCode: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shixiang.app';
  const url = new URL(path, siteUrl);
  url.searchParams.set(REFERRAL_PARAM, refCode);
  return url.toString();
}

/**
 * Parse referral code from URL
 */
export function parseReferralCode(url?: string): string | null {
  const searchParams = url
    ? new URL(url).searchParams
    : typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  return searchParams.get(REFERRAL_PARAM);
}

/**
 * Persist referral info (first-touch only)
 */
export function persistReferral(code: string): void {
  try {
    const existing = getPersistedReferral();
    if (existing) return;

    const info: ReferralInfo = {
      code,
      referredAt: new Date().toISOString(),
    };
    localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(info));
  } catch {
    // localStorage not available
  }
}

/**
 * Get persisted referral
 */
export function getPersistedReferral(): ReferralInfo | null {
  try {
    const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
