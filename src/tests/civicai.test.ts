import { describe, it, expect } from 'vitest';
import { 
  suggestCategory, 
  calculatePriorityScore, 
  generateSolutionPlan, 
  analyzeCivicReport 
} from '../services/aiEngine';
import { 
  calculateHaversineDistanceMeters, 
  calculateTextSimilarity, 
  evaluateDuplicateMatch 
} from '../services/duplicateEngine';
import { detectGeographicHotspots } from '../services/hotspotEngine';
import { generateTrackingToken, hashTrackingToken, sanitizeReportForCitizen } from '../utils/security';
import { CivicReport } from '../types';

describe('CivicAI Intelligence Pipeline Tests', () => {

  // 1. NLP & Category Detection
  describe('Category Suggestion Engine', () => {
    it('correctly detects potholes and roads', () => {
      const cat = suggestCategory('Huge pothole', 'Damaged tar on main road damaging rims');
      expect(cat).toBe('Roads and potholes');
    });

    it('correctly detects waterlogging & drainage', () => {
      const cat = suggestCategory('Underpass flooded', 'Knee-deep stagnant stormwater blocking traffic');
      expect(cat).toBe('Waterlogging and drainage');
    });

    it('correctly detects electrical hazards', () => {
      const cat = suggestCategory('Dangerous wire', 'Sparking live electric cable hanging over sidewalk');
      expect(cat).toBe('Electrical hazards');
    });

    it('correctly detects waste management', () => {
      const cat = suggestCategory('Overflowing bins', 'Rotting garbage spilled across market lane');
      expect(cat).toBe('Waste management');
    });
  });

  // 2. Explainable Priority Scoring & Safety Override
  describe('Priority Scoring & Safety Override', () => {
    it('calculates deterministic weighted priority score for standard road issue', () => {
      const result = calculatePriorityScore('Roads and potholes', 'Pothole', 'Pothole on residential street');
      expect(result.score).toBeGreaterThanOrEqual(35);
      expect(result.score).toBeLessThanOrEqual(80);
      expect(result.explanation).toContain('Safety Risk');
    });

    it('triggers AUTOMATIC SAFETY OVERRIDE for exposed sparking electrical wire', () => {
      const result = calculatePriorityScore(
        'Electrical hazards',
        'Live wire sparking',
        'High voltage live wire snapped and sparking on footpath near school'
      );
      expect(result.band).toBe('Critical');
      expect(result.score).toBeGreaterThanOrEqual(88);
      expect(result.isSafetyOverride).toBe(true);
      expect(result.explanation).toContain('AUTOMATIC SAFETY OVERRIDE TRIGGERED');
    });
  });

  // 3. Problem-to-Solution Engine
  describe('Problem-to-Solution Engine', () => {
    it('generates specific engineering workflow for potholes', () => {
      const plan = generateSolutionPlan('Roads and potholes', 'Large crater', 'Crater in lane', 'Critical');
      expect(plan.suggestedDepartmentCode).toBe('ROADS');
      expect(plan.proposedSolution).toContain('asphalt');
      expect(plan.recommendedActions.length).toBeGreaterThanOrEqual(4);
      expect(plan.targetResponseHours).toBeLessThanOrEqual(48);
    });

    it('generates emergency containment steps for electrical hazards', () => {
      const plan = generateSolutionPlan('Electrical hazards', 'Sparking cable', 'Cable down', 'Critical');
      expect(plan.suggestedDepartmentCode).toBe('ELEC');
      expect(plan.proposedSolution).toContain('isolation');
      expect(plan.targetResponseHours).toBeLessThanOrEqual(4);
    });

    it('generates dewatering pump workflow for waterlogging', () => {
      const plan = generateSolutionPlan('Waterlogging and drainage', 'Underpass flooded', 'Stalled cars', 'Critical');
      expect(plan.suggestedDepartmentCode).toBe('WATER');
      expect(plan.proposedSolution).toContain('dewatering');
    });
  });

  // 4. Duplicate Detection (Haversine & Text Overlap)
  describe('Duplicate Detection Engine', () => {
    it('calculates accurate Haversine distance in meters', () => {
      // 100 meters approximately
      const dist = calculateHaversineDistanceMeters(12.9716, 77.5946, 12.9725, 77.5946);
      expect(dist).toBeGreaterThan(50);
      expect(dist).toBeLessThan(150);
    });

    it('computes word token similarity', () => {
      const sim = calculateTextSimilarity(
        'Large deep pothole on MG Road near metro pillar 142 damaging cars',
        'Crater pothole near metro pillar 142 on MG Road vehicles rim broke'
      );
      expect(sim).toBeGreaterThanOrEqual(40);
    });

    it('evaluates duplicate match confidence for nearby identical incidents', () => {
      const reportA: CivicReport = {
        id: 'rep-01',
        trackingTokenHash: 'hash1',
        title: 'Deep pothole on MG Road pillar 142',
        description: 'Large crater in central lane opposite pillar 142 damaging vehicles',
        category: 'Roads and potholes',
        latitude: 12.9745,
        longitude: 77.6083,
        address: 'MG Road Pillar 142',
        status: 'Submitted',
        priorityScore: 84,
        priorityBand: 'Critical',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const reportB: CivicReport = {
        id: 'rep-02',
        trackingTokenHash: 'hash2',
        title: 'Huge pothole near pillar 142 on MG Road',
        description: 'Vehicles swerving around crater opposite pillar 142',
        category: 'Roads and potholes',
        latitude: 12.97452,
        longitude: 77.60833,
        address: 'Near MG Road Pillar 142',
        status: 'Submitted',
        priorityScore: 82,
        priorityBand: 'Critical',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const match = evaluateDuplicateMatch(reportA, reportB);
      expect(match.geoDistanceMeters).toBeLessThan(10);
      expect(match.combinedConfidence).toBeGreaterThanOrEqual(80);
      expect(match.reason).toContain('High Confidence Duplicate');
    });
  });

  // 5. Geographic Hotspot Clustering
  describe('Geographic Hotspot Detection', () => {
    it('clusters multiple incidents in close spatial proximity into a hotspot', () => {
      const clusterReports: CivicReport[] = [
        {
          id: 'w1',
          trackingTokenHash: 'h1',
          title: 'Flooding at Underpass A',
          description: 'Waterlogging at underpass',
          category: 'Waterlogging and drainage',
          latitude: 12.9782,
          longitude: 77.6408,
          address: '100ft Road Underpass',
          status: 'Assigned',
          priorityScore: 80,
          priorityBand: 'Critical',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'w2',
          trackingTokenHash: 'h2',
          title: 'Drain overflow at Emerald',
          description: 'Stormwater backflow into basement',
          category: 'Waterlogging and drainage',
          latitude: 12.9791,
          longitude: 77.6415,
          address: 'Emerald Apartments',
          status: 'Verified',
          priorityScore: 75,
          priorityBand: 'High',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      const hotspots = detectGeographicHotspots(clusterReports, 300, 2);
      expect(hotspots.length).toBe(1);
      expect(hotspots[0].reportCount).toBe(2);
      expect(hotspots[0].suggestedDepartment).toBe('WATER');
      expect(hotspots[0].recommendedAction).toContain('dewatering');
    });
  });

  // 6. Security, Tracking Tokens & Public Sanitization
  describe('Security & Public Privacy Sanitization', () => {
    it('generates compliant, high-entropy CIVIC-XXXX-XXXX token', () => {
      const token = generateTrackingToken();
      expect(token).toMatch(/^CIVIC-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    });

    it('hashes tracking token reliably using SHA-256', async () => {
      const hash = await hashTrackingToken('CIVIC-ELEC-4491');
      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(10);
    });

    it('strictly strips confidential reporter contact and internal notes from citizen view', () => {
      const reportWithPrivateData: CivicReport = {
        id: 'rep-secret',
        trackingTokenHash: 'hash-sec',
        title: 'Broken pipe',
        description: 'Water leak',
        category: 'Water supply and leakage',
        latitude: 12.97,
        longitude: 77.59,
        address: 'Main St',
        status: 'In Progress',
        priorityScore: 70,
        priorityBand: 'High',
        reporterName: 'John Doe',
        reporterContact: 'john.doe@secret-email.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
          {
            id: 'h1',
            reportId: 'rep-secret',
            previousStatus: 'Submitted',
            newStatus: 'In Progress',
            actorId: 'STAFF',
            actorName: 'Engineer Dave',
            publicComment: 'Crew on site.',
            internalNote: 'CONFIDENTIAL: Suspected contractor sabotage on pipe.',
            createdAt: new Date().toISOString()
          }
        ]
      };

      const sanitized = sanitizeReportForCitizen(reportWithPrivateData);
      expect(sanitized.reporterContact).toBeUndefined();
      expect(sanitized.history![0].internalNote).toBeUndefined();
      expect(sanitized.history![0].publicComment).toBe('Crew on site.');
    });
  });

});
