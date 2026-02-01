'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, SCHOOL_LOCATION, getPodById } from '@/data/mock-data';

mapboxgl.accessToken = MAPBOX_TOKEN;

// Route from Pod B to School following roads
const POD_B_TO_SCHOOL_ROUTE: [number, number][] = [
  [55.2380, 25.1740],  // Pod B
  [55.2382, 25.1743],
  [55.2385, 25.1748],
  [55.2388, 25.1752],
  [55.2390, 25.1758],
  [55.2392, 25.1762],
  [55.2395, 25.1766],
  [55.2398, 25.1769],
  [55.2402, 25.1772],
  [55.2405, 25.1774],
  [55.2407, 25.1776],  // School
];

interface ParentTrackingMapProps {
  podId: string;
  shuttleProgress: number; // 0 to 1
  className?: string;
}

export function ParentTrackingMap({ podId, shuttleProgress, className = 'w-full h-[300px]' }: ParentTrackingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const podMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const schoolMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const shuttleMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const pod = getPodById(podId);
  const route = POD_B_TO_SCHOOL_ROUTE;

  // Calculate shuttle position along route
  const getShuttlePosition = (): [number, number] => {
    if (route.length < 2) return SCHOOL_LOCATION;

    const totalSegments = route.length - 1;
    const progressAlongPath = Math.min(Math.max(shuttleProgress, 0), 0.999);
    const segmentIndex = Math.floor(progressAlongPath * totalSegments);
    const segmentProgress = (progressAlongPath * totalSegments) % 1;

    const start = route[segmentIndex];
    const end = route[Math.min(segmentIndex + 1, route.length - 1)];

    if (!start || !end) return route[0];

    return [
      start[0] + (end[0] - start[0]) * segmentProgress,
      start[1] + (end[1] - start[1]) * segmentProgress,
    ];
  };

  // Initialize map
  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current || !pod) return;

    const center: [number, number] = [
      (route[0][0] + route[route.length - 1][0]) / 2,
      (route[0][1] + route[route.length - 1][1]) / 2,
    ];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center,
      zoom: 14.5,
      pitch: 30,
      bearing: 0,
      antialias: true,
    });

    map.current.on('load', () => {
      // Add 3D buildings
      const layers = map.current!.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      map.current!.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 14,
        paint: {
          'fill-extrusion-color': '#e2e8f0',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.6,
        },
      }, labelLayerId);

      // Add completed route (green - from pod to shuttle)
      map.current!.addSource('completed-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        },
      });

      map.current!.addLayer({
        id: 'completed-route',
        type: 'line',
        source: 'completed-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#10b981',
          'line-width': 5,
          'line-opacity': 0.8,
        },
      });

      // Add remaining route (gray dashed - from shuttle to school)
      map.current!.addSource('remaining-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route,
          },
        },
      });

      map.current!.addLayer({
        id: 'remaining-route',
        type: 'line',
        source: 'remaining-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#94a3b8',
          'line-width': 5,
          'line-opacity': 0.5,
          'line-dasharray': [2, 2],
        },
      });

      // Add pod marker
      const podEl = document.createElement('div');
      podEl.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 12px rgba(16,185,129,0.4);
          border: 3px solid white;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
          </svg>
        </div>
      `;

      podMarkerRef.current = new mapboxgl.Marker({ element: podEl })
        .setLngLat(route[0])
        .addTo(map.current!);

      // Add school marker
      const schoolEl = document.createElement('div');
      schoolEl.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 12px rgba(239,68,68,0.4);
          border: 3px solid white;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"/>
          </svg>
        </div>
      `;

      schoolMarkerRef.current = new mapboxgl.Marker({ element: schoolEl })
        .setLngLat(route[route.length - 1])
        .addTo(map.current!);

      // Add shuttle marker
      const shuttleEl = document.createElement('div');
      shuttleEl.innerHTML = `
        <div style="
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(59,130,246,0.5);
          border: 3px solid white;
          animation: pulse 2s infinite;
        ">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
          </svg>
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        </style>
      `;

      shuttleMarkerRef.current = new mapboxgl.Marker({ element: shuttleEl })
        .setLngLat(getShuttlePosition())
        .addTo(map.current!);

      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [pod]);

  // Update shuttle position and route visualization when progress changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const shuttlePos = getShuttlePosition();

    // Update shuttle marker position
    if (shuttleMarkerRef.current) {
      shuttleMarkerRef.current.setLngLat(shuttlePos);
    }

    // Update completed route (from pod to shuttle)
    const completedSource = map.current.getSource('completed-route') as mapboxgl.GeoJSONSource;
    if (completedSource) {
      // Find the segment where shuttle is
      const totalSegments = route.length - 1;
      const segmentIndex = Math.floor(shuttleProgress * totalSegments);
      const completedCoords = route.slice(0, segmentIndex + 1);
      completedCoords.push(shuttlePos);

      completedSource.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: completedCoords,
        },
      });
    }

    // Update remaining route (from shuttle to school)
    const remainingSource = map.current.getSource('remaining-route') as mapboxgl.GeoJSONSource;
    if (remainingSource) {
      const totalSegments = route.length - 1;
      const segmentIndex = Math.floor(shuttleProgress * totalSegments);
      const remainingCoords: [number, number][] = [shuttlePos];
      remainingCoords.push(...route.slice(segmentIndex + 1));

      remainingSource.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: remainingCoords,
        },
      });
    }
  }, [shuttleProgress, mapLoaded]);

  return <div ref={mapContainer} className={className} />;
}
