/**
 * Shared types and constants for share card templates
 */

import type { AnalysisReport } from '@/lib/interpret/generator';
import type { ExecutiveSummary } from '@/lib/interpret/executive-summary';

export interface TemplateProps {
  report: AnalysisReport;
  summary: ExecutiveSummary;
  hookSentence: string;
  dominantWuxing?: string;
}

export const WUXING_COLORS: Record<string, string> = {
  木: '#22c55e',
  火: '#ef4444',
  土: '#eab308',
  金: '#f8fafc',
  水: '#3b82f6',
};

export const WUXING_GLOW: Record<string, string> = {
  木: '0 0 20px rgba(34, 197, 94, 0.3)',
  火: '0 0 20px rgba(239, 68, 68, 0.3)',
  土: '0 0 20px rgba(234, 179, 8, 0.3)',
  金: '0 0 20px rgba(248, 250, 252, 0.3)',
  水: '0 0 20px rgba(59, 130, 246, 0.3)',
};
