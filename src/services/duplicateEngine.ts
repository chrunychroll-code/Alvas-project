import { CivicReport, DuplicateMatchResult } from '../types';
import { normalizeText } from './aiEngine';

/**
 * Calculates Great-Circle distance between two coordinates in meters
 * using the Haversine formula
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Tokenizes text and returns unique word set excluding common stop words
 */
function getWordTokens(text: string): Set<string> {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'from', 'is', 'are', 'was', 'were', 'it', 'this', 'that', 'near', 'opposite', 'road',
    'street', 'main', 'cross', 'lane', 'there', 'has', 'have', 'been', 'about'
  ]);

  const words = normalizeText(text)
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  return new Set(words);
}

/**
 * Computes Sørensen–Dice token similarity between two texts (0 - 100)
 * Highly effective for short sentence matching in civic complaint triage.
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  const tokens1 = getWordTokens(text1);
  const tokens2 = getWordTokens(text2);

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let intersectionCount = 0;
  tokens1.forEach(t => {
    if (tokens2.has(t)) intersectionCount++;
  });

  // Sørensen–Dice coefficient: 2 * |A ∩ B| / (|A| + |B|)
  const dice = (2 * intersectionCount) / (tokens1.size + tokens2.size);
  return Math.round(dice * 100);
}

/**
 * Evaluates whether two reports represent a probable duplicate incident
 */
export function evaluateDuplicateMatch(
  primary: CivicReport,
  candidate: CivicReport
): DuplicateMatchResult {
  if (primary.id === candidate.id) {
    return {
      primaryReport: primary,
      candidateReport: candidate,
      textSimilarity: 100,
      geoDistanceMeters: 0,
      combinedConfidence: 0,
      reason: 'Identical report record.',
      isConfirmedDuplicate: false
    };
  }

  // Calculate geographic distance
  const geoDistanceMeters = calculateHaversineDistanceMeters(
    primary.latitude,
    primary.longitude,
    candidate.latitude,
    candidate.longitude
  );

  // Compute text similarity
  const primaryFull = `${primary.title} ${primary.description}`;
  const candidateFull = `${candidate.title} ${candidate.description}`;
  const textSimilarity = calculateTextSimilarity(primaryFull, candidateFull);

  // Distance confidence factor
  let geoScore = 0;
  if (geoDistanceMeters <= 25) geoScore = 100;
  else if (geoDistanceMeters <= 100) geoScore = 85;
  else if (geoDistanceMeters <= 250) geoScore = 60;
  else if (geoDistanceMeters <= 500) geoScore = 30;
  else geoScore = 0;

  // Category matching
  const sameCategory = primary.category === candidate.category;
  const categoryWeight = sameCategory ? 1.0 : 0.4;

  // Weighted combination: Geo proximity (50%), Text overlap (35%), Category match (15%)
  const combined = ((geoScore * 0.50) + (textSimilarity * 0.35) + (sameCategory ? 15 : 0)) * categoryWeight;
  const combinedConfidence = Math.min(100, Math.round(combined));

  let reason = '';
  if (combinedConfidence >= 80) {
    reason = `High Confidence Duplicate (${combinedConfidence}%): Located within ${geoDistanceMeters}m of existing report in category "${primary.category}" with ${textSimilarity}% keyword overlap.`;
  } else if (combinedConfidence >= 50) {
    reason = `Potential Proximity Match (${combinedConfidence}%): Located within ${geoDistanceMeters}m with moderate keyword overlap (${textSimilarity}%). Requires municipal review.`;
  } else {
    reason = `Low Similarity (${combinedConfidence}%): Geographic distance is ${geoDistanceMeters}m with ${textSimilarity}% text similarity.`;
  }

  const isConfirmed = primary.duplicateOf === candidate.id || candidate.duplicateOf === primary.id;

  return {
    primaryReport: primary,
    candidateReport: candidate,
    textSimilarity,
    geoDistanceMeters,
    combinedConfidence,
    reason,
    isConfirmedDuplicate: isConfirmed
  };
}

/**
 * Searches a collection of existing reports for potential duplicates of a target report
 */
export function findPotentialDuplicates(
  targetReport: CivicReport,
  existingReports: CivicReport[],
  threshold: number = 50
): DuplicateMatchResult[] {
  const matches: DuplicateMatchResult[] = [];

  for (const report of existingReports) {
    if (report.id === targetReport.id) continue;
    const match = evaluateDuplicateMatch(targetReport, report);
    if (match.combinedConfidence >= threshold) {
      matches.push(match);
    }
  }

  // Sort by highest confidence first
  return matches.sort((a, b) => b.combinedConfidence - a.combinedConfidence);
}
