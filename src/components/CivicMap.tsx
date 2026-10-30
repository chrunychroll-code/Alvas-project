import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CivicReport, HotspotCluster, ReportCategory, PriorityBand } from '../types';
import { MapPin, AlertTriangle, Layers, Navigation, Info, ExternalLink } from 'lucide-react';

interface CivicMapProps {
  reports: CivicReport[];
  selectedReportId?: string;
  onSelectReport?: (report: CivicReport) => void;
  onPickLocation?: (lat: number, lng: number) => void;
  mode?: 'view' | 'picker';
  pickerCoordinates?: { lat: number; lng: number };
  showHotspots?: boolean;
  hotspots?: HotspotCluster[];
  height?: string;
}

// Category Marker Colors
const CATEGORY_COLORS: Record<ReportCategory, { bg: string; border: string; text: string }> = {
  'Electrical hazards': { bg: '#e11d48', border: '#9f1239', text: '#ffffff' },
  'Roads and potholes': { bg: '#ea580c', border: '#9a3412', text: '#ffffff' },
  'Waterlogging and drainage': { bg: '#0284c7', border: '#0369a1', text: '#ffffff' },
  'Water supply and leakage': { bg: '#06b6d4', border: '#0891b2', text: '#ffffff' },
  'Waste management': { bg: '#10b981', border: '#047857', text: '#ffffff' },
  'Streetlights': { bg: '#f59e0b', border: '#d97706', text: '#000000' },
  'Public infrastructure': { bg: '#8b5cf6', border: '#6d28d9', text: '#ffffff' },
  'Sanitation': { bg: '#14b8a6', border: '#0f766e', text: '#ffffff' },
  'Traffic and road safety': { bg: '#6366f1', border: '#4338ca', text: '#ffffff' },
  'Other': { bg: '#64748b', border: '#334155', text: '#ffffff' },
};

export const CivicMap: React.FC<CivicMapProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  onPickLocation,
  mode = 'view',
  pickerCoordinates,
  showHotspots = true,
  hotspots = [],
  height = '500px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const hotspotLayerRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isGoogleMapsConfigured = Boolean(googleApiKey && googleApiKey.trim().length > 10);

  const [activeEngine, setActiveEngine] = useState<'leaflet' | 'google'>(
    isGoogleMapsConfigured ? 'google' : 'leaflet'
  );
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: Metropolitan Civic Zone (Bangalore/Demo Center)
      const defaultCenter: [number, number] = [12.9716, 77.5946];
      const initialZoom = 13;

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: initialZoom,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Clean, high-performance OpenStreetMap / CartoDB Voyager tiles
      // OpenStreetMap tiles — no CARTO API key required
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Create layers
      markersLayerRef.current = L.layerGroup().addTo(map);
      hotspotLayerRef.current = L.layerGroup().addTo(map);

      // Handle map click for picker mode
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (mode === 'picker' && onPickLocation) {
          onPickLocation(e.latlng.lat, e.latlng.lng);
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when reports or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (mode === 'picker') {
      // Picker mode marker
      if (pickerMarkerRef.current) {
        map.removeLayer(pickerMarkerRef.current);
        pickerMarkerRef.current = null;
      }

      if (pickerCoordinates) {
        const pickerIcon = L.divIcon({
          className: 'custom-picker-pin',
          html: `
            <div style="position: relative; width: 36px; height: 36px;">
              <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(13, 148, 136, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: relative; width: 36px; height: 36px; border-radius: 50%; background: #0d9488; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: white;"></div>
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([pickerCoordinates.lat, pickerCoordinates.lng], {
          icon: pickerIcon,
          draggable: true
        }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          if (onPickLocation) onPickLocation(pos.lat, pos.lng);
        });

        pickerMarkerRef.current = marker;
      }
      return;
    }

    // View mode: Render reports
    reports.forEach(report => {
      const colors = CATEGORY_COLORS[report.category] || CATEGORY_COLORS['Other'];
      const isCritical = report.priorityBand === 'Critical';
      const isSelected = report.id === selectedReportId;

      const markerHtml = `
        <div style="position: relative; width: ${isSelected ? '38px' : '28px'}; height: ${isSelected ? '38px' : '28px'}; cursor: pointer;">
          ${isCritical ? `
            <div style="position: absolute; inset: -6px; border-radius: 50%; background: rgba(225, 29, 72, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          ` : ''}
          <div style="
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: ${colors.bg};
            border: ${isSelected ? '3px solid #0f172a' : '2px solid #ffffff'};
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${colors.text};
            font-size: ${isSelected ? '14px' : '11px'};
            font-weight: 700;
          ">
            ${isCritical ? '!' : report.priorityScore >= 60 ? '▲' : '●'}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'civic-marker-div',
        html: markerHtml,
        iconSize: isSelected ? [38, 38] : [28, 28],
        iconAnchor: isSelected ? [19, 19] : [14, 14],
      });

      const marker = L.marker([report.latitude, report.longitude], { icon: customIcon });

      marker.on('click', () => {
        setSelectedReport(report);
        if (onSelectReport) onSelectReport(report);
      });

      markersLayer.addLayer(marker);
    });

    // Center on selected report if available
    if (selectedReportId) {
      const active = reports.find(r => r.id === selectedReportId);
      if (active) {
        setSelectedReport(active);
        map.panTo([active.latitude, active.longitude], { animate: true, duration: 0.8 });
      }
    }
  }, [reports, selectedReportId, mode, pickerCoordinates]);

  // Update Hotspot Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    const hotspotLayer = hotspotLayerRef.current;
    if (!map || !hotspotLayer) return;

    hotspotLayer.clearLayers();

    if (showHotspots && hotspots.length > 0) {
      hotspots.forEach(hotspot => {
        const isCritical = hotspot.criticalCount > 0;
        const color = isCritical ? '#e11d48' : '#0284c7';

        const circle = L.circle([hotspot.centerLat, hotspot.centerLng], {
          radius: hotspot.radiusMeters,
          color: color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '6 8'
        });

        circle.bindTooltip(`
          <div style="font-family: inherit; font-size: 12px; padding: 2px;">
            <strong>${hotspot.name}</strong><br/>
            ${hotspot.reportCount} reports (${hotspot.distinctIncidents} distinct incidents)<br/>
            ${isCritical ? '<span style="color: #e11d48; font-weight: bold;">⚠ Critical Priority Cluster</span>' : ''}
          </div>
        `, { sticky: true });

        hotspotLayer.addLayer(circle);
      });
    }
  }, [showHotspots, hotspots]);

  // Recenter Map
  const handleRecenter = () => {
    if (mapInstanceRef.current && reports.length > 0) {
      const bounds = L.latLngBounds(reports.map(r => [r.latitude, r.longitude]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  // Request Current Location
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
          if (mode === 'picker' && onPickLocation) {
            onPickLocation(latitude, longitude);
          }
        }
      },
      err => {
        alert('Could not access your location. Please check browser permissions.');
      }
    );
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-slate-900">
      {/* Map Header Toolbar */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-teal-600" />
          <span>{reports.length} Reports</span>
          {hotspots.length > 0 && showHotspots && (
            <span className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
              {hotspots.length} Hotspots
            </span>
          )}
        </div>

        {/* Engine Status Banner */}
        <div className={`px-2.5 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md border flex items-center gap-1.5 ${isGoogleMapsConfigured
            ? 'bg-emerald-50/95 text-emerald-800 border-emerald-200'
            : 'bg-amber-50/95 text-amber-900 border-amber-200'
          }`}>
          <div className={`w-2 h-2 rounded-full ${isGoogleMapsConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>
            {isGoogleMapsConfigured
              ? 'Google Maps API Active'
              : 'Interactive OpenStreetMap Engine'}
          </span>
        </div>
      </div>

      {/* Control Actions */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5">
        <button
          onClick={handleRecenter}
          title="Fit all markers"
          className="p-2 bg-white/95 hover:bg-slate-100 text-slate-700 rounded-lg shadow-sm border border-slate-200 transition-colors"
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          onClick={handleLocateMe}
          title="Detect my current location"
          className="p-2 bg-white/95 hover:bg-slate-100 text-slate-700 rounded-lg shadow-sm border border-slate-200 transition-colors"
        >
          <Navigation className="w-4 h-4 text-teal-600" />
        </button>
      </div>

      {/* Main Map Canvas */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-0" />

      {/* Map Legend Overlay */}
      {mode === 'view' && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-md p-2 rounded-lg border border-slate-200 shadow-sm text-[11px] text-slate-600 max-w-xs hidden sm:block">
          <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
            <Info className="w-3 h-3 text-teal-600" /> Map Priority Legend
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Critical Hazard (!)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>High Priority (▲)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Medium Priority (●)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Resolved / Normal</span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Report Card Popup */}
      {selectedReport && mode === 'view' && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-xl border border-slate-200 p-4 max-w-sm w-full animate-fade-in">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${selectedReport.priorityBand === 'Critical'
                  ? 'bg-rose-100 text-rose-800'
                  : selectedReport.priorityBand === 'High'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                {selectedReport.priorityBand} • {selectedReport.priorityScore}
              </span>
              <span className="ml-2 text-xs text-slate-500 font-medium">
                {selectedReport.category}
              </span>
            </div>
            <button
              onClick={() => setSelectedReport(null)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1">
            {selectedReport.title}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 mb-2">
            {selectedReport.description}
          </p>

          <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{selectedReport.address}</span>
          </div>

          {selectedReport.analysis && (
            <div className="bg-teal-50/70 border border-teal-100 rounded-lg p-2 mb-3">
              <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider mb-0.5">
                AI Proposed Solution
              </div>
              <p className="text-xs text-teal-900 line-clamp-2">
                {selectedReport.analysis.proposedSolution}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedReport.status === 'Resolved'
                ? 'bg-emerald-100 text-emerald-800'
                : selectedReport.status === 'In Progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-700'
              }`}>
              {selectedReport.status}
            </span>

            {onSelectReport && (
              <button
                onClick={() => onSelectReport(selectedReport)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <span>View Full Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
