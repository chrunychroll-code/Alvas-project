import { CivicReport, HotspotCluster, ActionBrief, PriorityBand, ReportCategory } from '../types';
import { calculateHaversineDistanceMeters } from './duplicateEngine';

/**
 * Clusters reports based on spatial proximity (radius clustering)
 */
export function detectGeographicHotspots(
  reports: CivicReport[],
  clusterRadiusMeters: number = 400,
  minReportsPerCluster: number = 2
): HotspotCluster[] {
  // Exclude closed or rejected reports from active hotspot clusters
  const activeReports = reports.filter(r => r.status !== 'Closed' && r.status !== 'Rejected');
  const visited = new Set<string>();
  const clusters: HotspotCluster[] = [];

  for (let i = 0; i < activeReports.length; i++) {
    const root = activeReports[i];
    if (visited.has(root.id)) continue;

    // Find all neighbors within radius
    const clusterReports: CivicReport[] = [root];
    visited.add(root.id);

    for (let j = 0; j < activeReports.length; j++) {
      if (i === j) continue;
      const other = activeReports[j];
      if (visited.has(other.id)) continue;

      const dist = calculateHaversineDistanceMeters(
        root.latitude,
        root.longitude,
        other.latitude,
        other.longitude
      );

      if (dist <= clusterRadiusMeters) {
        clusterReports.push(other);
        visited.add(other.id);
      }
    }

    if (clusterReports.length >= minReportsPerCluster) {
      // Calculate geographic centroid
      const totalLat = clusterReports.reduce((sum, r) => sum + r.latitude, 0);
      const totalLng = clusterReports.reduce((sum, r) => sum + r.longitude, 0);
      const centerLat = Number((totalLat / clusterReports.length).toFixed(6));
      const centerLng = Number((totalLng / clusterReports.length).toFixed(6));

      // Calculate distinct incidents (confirmed duplicates linked together are counted as 1 distinct incident)
      const primaryIncidentIds = new Set<string>();
      clusterReports.forEach(r => {
        if (r.duplicateOf) {
          primaryIncidentIds.add(r.duplicateOf);
        } else {
          primaryIncidentIds.add(r.id);
        }
      });
      const distinctIncidents = primaryIncidentIds.size;

      // Category breakdown
      const categoryCounts: Record<string, number> = {};
      clusterReports.forEach(r => {
        categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
      });

      const categories = Object.entries(categoryCounts).map(([cat, count]) => ({
        category: cat as ReportCategory,
        count
      })).sort((a, b) => b.count - a.count);

      const dominantCategory = categories[0].category;

      // Priority counts
      const criticalCount = clusterReports.filter(r => r.priorityBand === 'Critical').length;
      const highCount = clusterReports.filter(r => r.priorityBand === 'High').length;

      // Recommended cluster action
      let recommendedAction = '';
      let suggestedDept = 'INFRA';

      if (dominantCategory === 'Waterlogging and drainage') {
        recommendedAction = 'Dispatch mobile dewatering pumps and deploy heavy sewer jetting units to inspect connecting stormwater conduit for chronic blockage or collapse.';
        suggestedDept = 'WATER';
      } else if (dominantCategory === 'Roads and potholes') {
        recommendedAction = 'Execute coordinated corridor resurfacing and asphalt mastic patching with temporary road diversion during low-traffic night hours.';
        suggestedDept = 'ROADS';
      } else if (dominantCategory === 'Waste management') {
        recommendedAction = 'Deploy specialized compactor trucks, perform bio-sanitization, and increase ward dumpster clearing frequency.';
        suggestedDept = 'WASTE';
      } else if (dominantCategory === 'Streetlights') {
        recommendedAction = 'Inspect feeder pillar distribution line and replace burnt underground circuit wires along the darkened corridor.';
        suggestedDept = 'ELEC';
      } else {
        recommendedAction = 'Conduct multi-departmental field inspection to remediate shared civic infrastructure deficiencies.';
        suggestedDept = 'INFRA';
      }

      const clusterId = `cluster-${centerLat}-${centerLng}`;
      const commonArea = clusterReports[0].address.split(',')[0] || 'Central Civic Zone';

      clusters.push({
        id: clusterId,
        name: `${dominantCategory} Cluster near ${commonArea}`,
        areaDescription: `${commonArea} (Radius ~${clusterRadiusMeters}m)`,
        centerLat,
        centerLng,
        radiusMeters: clusterRadiusMeters,
        reportCount: clusterReports.length,
        distinctIncidents,
        criticalCount,
        highCount,
        categories,
        reports: clusterReports,
        recommendedAction,
        suggestedDepartment: suggestedDept,
        confidence: Math.min(98, 70 + clusterReports.length * 5)
      });
    }
  }

  // Sort by highest report count & criticality first
  return clusters.sort((a, b) => (b.criticalCount * 2 + b.reportCount) - (a.criticalCount * 2 + a.reportCount));
}

/**
 * Generates an operational Action Brief from a hotspot cluster
 */
export function generateActionBriefFromCluster(cluster: HotspotCluster): ActionBrief {
  let priority: PriorityBand = 'Medium';
  if (cluster.criticalCount > 0 || cluster.reportCount >= 4) {
    priority = 'Critical';
  } else if (cluster.highCount > 0 || cluster.reportCount >= 2) {
    priority = 'High';
  }

  const primaryCategory = cluster.categories[0]?.category || 'Civic infrastructure';

  return {
    id: `brief-${cluster.id}`,
    title: `Action Brief: Concentrated ${primaryCategory} in ${cluster.areaDescription}`,
    area: cluster.areaDescription,
    description: `${cluster.reportCount} citizen reports (${cluster.distinctIncidents} distinct incidents) concentrated within a ${cluster.radiusMeters}m radius.`,
    observedPattern: `Recurrent complaints regarding ${primaryCategory.toLowerCase()} affecting local transit, safety, and hygiene in the vicinity of ${cluster.areaDescription}.`,
    publicImpact: cluster.criticalCount > 0
      ? 'Severe public safety hazard and localized disruption requiring emergency departmental intervention.'
      : 'Elevated disruption to pedestrians, vehicular traffic, and community accessibility.',
    suggestedAction: cluster.recommendedAction,
    priority,
    reportIds: cluster.reports.map(r => r.id),
    geographicCenter: {
      latitude: cluster.centerLat,
      longitude: cluster.centerLng,
      radiusMeters: cluster.radiusMeters
    },
    confidenceScore: cluster.confidence,
    limitations: 'Hotspot correlation is based on spatial-temporal reporting density. On-site engineering inspection is strictly required to verify whether a shared physical infrastructure cause exists.',
    createdAt: new Date().toISOString()
  };
}
