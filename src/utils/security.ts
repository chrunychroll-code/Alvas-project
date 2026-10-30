import { CivicReport, StatusHistoryItem } from '../types';

/**
 * Generates a high-entropy, human-readable civic tracking token
 * Example: CIVIC-9F4B-8E2A
 */
export function generateTrackingToken(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // base32 without easily confused chars (0, 1, I, O)
  let part1 = '';
  let part2 = '';
  
  const array = new Uint8Array(8);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    for (let i = 0; i < 4; i++) part1 += chars[array[i] % chars.length];
    for (let i = 4; i < 8; i++) part2 += chars[array[i] % chars.length];
  } else {
    for (let i = 0; i < 4; i++) part1 += chars[Math.floor(Math.random() * chars.length)];
    for (let i = 0; i < 4; i++) part2 += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return `CIVIC-${part1}-${part2}`;
}

/**
 * Computes a standard SHA-256 hex hash of a tracking token
 */
export async function hashTrackingToken(token: string): Promise<string> {
  const normalized = token.trim().toUpperCase();
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simple deterministic hash if crypto.subtle is unavailable (e.g. some test runners)
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

/**
 * Strips confidential fields (reporterContact, reporterName, internalNote)
 * before delivering report information to public guests or tracking views.
 */
export function sanitizeReportForCitizen(report: CivicReport): CivicReport {
  const sanitized: CivicReport = {
    ...report,
    reporterContact: undefined, // Never expose contact info to guests
    reporterName: report.reporterName ? `${report.reporterName.charAt(0)}***` : undefined,
  };

  if (sanitized.history) {
    sanitized.history = sanitized.history
      .map((item: StatusHistoryItem) => ({
        ...item,
        internalNote: undefined, // Strictly strip municipal internal staff notes
      }))
      .filter((item: StatusHistoryItem) => !!item.publicComment || item.newStatus === 'Submitted');
  }

  return sanitized;
}
