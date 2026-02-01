'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, SCHOOL_LOCATION, pods } from '@/data/mock-data';

mapboxgl.accessToken = MAPBOX_TOKEN;

// More detailed shuttle routes following roads (more waypoints for realistic paths)
const SHUTTLE_ROUTES = [
  {
    id: 'shuttle-1',
    name: 'Shuttle 1',
    podId: 'pod-b',
    // Pod B to School - follows Al Safa Road
    path: [
      [55.2380, 25.1740],
      [55.2382, 25.1743],
      [55.2385, 25.1748],
      [55.2388, 25.1752],
      [55.2390, 25.1758],
      [55.2392, 25.1762],
      [55.2395, 25.1766],
      [55.2398, 25.1769],
      [55.2402, 25.1772],
      [55.2405, 25.1774],
      [55.2407, 25.1776],
    ],
  },
  {
    id: 'shuttle-2',
    name: 'Shuttle 2',
    podId: 'pod-a',
    // Pod A to School - follows Al Wasl Road
    path: [
      [55.2325, 25.1820],
      [55.2330, 25.1815],
      [55.2338, 25.1808],
      [55.2345, 25.1802],
      [55.2355, 25.1795],
      [55.2365, 25.1790],
      [55.2375, 25.1785],
      [55.2385, 25.1780],
      [55.2395, 25.1778],
      [55.2402, 25.1777],
      [55.2407, 25.1776],
    ],
  },
  {
    id: 'shuttle-3',
    name: 'Shuttle 3',
    podId: 'pod-c',
    // Pod C to School - follows Jumeirah Beach Road
    path: [
      [55.2450, 25.1695],
      [55.2448, 25.1702],
      [55.2445, 25.1712],
      [55.2440, 25.1722],
      [55.2435, 25.1732],
      [55.2428, 25.1742],
      [55.2422, 25.1752],
      [55.2415, 25.1760],
      [55.2412, 25.1768],
      [55.2410, 25.1772],
      [55.2407, 25.1776],
    ],
  },
  {
    id: 'shuttle-4',
    name: 'Shuttle 4',
    podId: 'pod-d',
    // Pod D to School - follows Emirates Hills Road
    path: [
      [55.2280, 25.1855],
      [55.2290, 25.1850],
      [55.2302, 25.1842],
      [55.2315, 25.1832],
      [55.2330, 25.1822],
      [55.2348, 25.1810],
      [55.2365, 25.1798],
      [55.2380, 25.1788],
      [55.2392, 25.1782],
      [55.2400, 25.1778],
      [55.2407, 25.1776],
    ],
  },
  {
    id: 'shuttle-5',
    name: 'Shuttle 5',
    podId: 'pod-e',
    // Pod E to School - follows Sheikh Zayed access road
    path: [
      [55.2220, 25.1790],
      [55.2235, 25.1788],
      [55.2255, 25.1786],
      [55.2280, 25.1784],
      [55.2305, 25.1782],
      [55.2330, 25.1780],
      [55.2355, 25.1778],
      [55.2375, 25.1777],
      [55.2390, 25.1776],
      [55.2400, 25.1776],
      [55.2407, 25.1776],
    ],
  },
];

interface ShuttleState {
  id: string;
  name: string;
  position: [number, number];
  progress: number;
  studentsOnBoard: number;
  status: 'to_school' | 'to_pod' | 'at_pod' | 'at_school';
  bearing: number;
}

interface LiveMap3DProps {
  className?: string;
  onShuttleUpdate?: (shuttles: ShuttleState[]) => void;
}

export function LiveMap3D({ className = 'w-full h-full', onShuttleUpdate }: LiveMap3DProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const shuttleMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const animationRef = useRef<number>(0);
  const shuttleStateRef = useRef<ShuttleState[]>([]);
  const onShuttleUpdateRef = useRef(onShuttleUpdate);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Keep callback ref updated
  useEffect(() => {
    onShuttleUpdateRef.current = onShuttleUpdate;
  }, [onShuttleUpdate]);

  // Initialize shuttle states with staggered positions and varied statuses
  useEffect(() => {
    const statuses: Array<'to_school' | 'to_pod' | 'at_pod' | 'at_school'> = [
      'to_school',  // Shuttle 1 - going to school
      'to_pod',     // Shuttle 2 - returning to pod
      'at_pod',     // Shuttle 3 - loading students
      'to_school',  // Shuttle 4 - going to school
      'to_school',  // Shuttle 5 - going to school
    ];

    shuttleStateRef.current = SHUTTLE_ROUTES.map((route, idx) => ({
      id: route.id,
      name: route.name,
      position: route.path[0] as [number, number],
      progress: [0.3, 0.6, 0, 0.15, 0.75][idx], // Different starting points
      studentsOnBoard: statuses[idx] === 'to_school' ? Math.floor(Math.random() * 10) + 15 : 0,
      status: statuses[idx],
      bearing: 0,
    }));
  }, []);

  // Initialize map
  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [55.238, 25.176],
      zoom: 14.5,
      pitch: 45,
      bearing: -17.6,
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
          'fill-extrusion-opacity': 0.7,
        },
      }, labelLayerId);

      // Add route lines
      SHUTTLE_ROUTES.forEach((route, idx) => {
        map.current!.addSource(`route-${idx}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.path,
            },
          },
        });

        map.current!.addLayer({
          id: `route-${idx}`,
          type: 'line',
          source: `route-${idx}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.4,
          },
        });
      });

      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add static markers (pods and school) after map loads
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add pod markers
    pods.forEach((pod) => {
      const el = document.createElement('div');
      el.className = 'pod-marker';
      el.innerHTML = `
        <div style="
          width: 36px;
          height: 36px;
          background: ${pod.status === 'full' ? '#ef4444' : pod.status === 'busy' ? '#f59e0b' : '#10b981'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          border: 3px solid white;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
          </svg>
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(pod.location)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px;">
            <strong>${pod.name}</strong><br/>
            <span style="color: #666;">${pod.currentCount}/${pod.capacity} students</span>
          </div>
        `))
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Add school marker
    const schoolEl = document.createElement('div');
    schoolEl.innerHTML = `
      <div style="
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(239,68,68,0.4);
        border: 3px solid white;
      ">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"/>
        </svg>
      </div>
    `;

    const schoolMarker = new mapboxgl.Marker({ element: schoolEl })
      .setLngLat(SCHOOL_LOCATION)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <strong>GEMS Jumeirah Primary School</strong><br/>
          <span style="color: #666;">Al Safa 1, Dubai</span>
        </div>
      `))
      .addTo(map.current!);

    markersRef.current.push(schoolMarker);

    // Create shuttle markers
    shuttleMarkersRef.current.forEach(m => m.remove());
    shuttleMarkersRef.current = [];

    SHUTTLE_ROUTES.forEach((route, idx) => {
      const el = document.createElement('div');
      el.className = `shuttle-marker-${idx}`;
      el.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(59,130,246,0.4);
          border: 2px solid white;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
          </svg>
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(route.path[0] as [number, number])
        .addTo(map.current!);

      shuttleMarkersRef.current.push(marker);
    });
  }, [mapLoaded]);

  // Animation loop for shuttles
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Update shuttle positions
      shuttleStateRef.current = shuttleStateRef.current.map((shuttle, idx) => {
        const route = SHUTTLE_ROUTES[idx];
        if (!route || !route.path || route.path.length < 2) {
          return shuttle;
        }

        let newProgress = shuttle.progress;
        let newStatus = shuttle.status;
        let studentsOnBoard = shuttle.studentsOnBoard;

        // Only move if shuttle is traveling
        if (shuttle.status === 'to_school' || shuttle.status === 'to_pod') {
          newProgress = shuttle.progress + delta * 0.04; // Speed
        }

        // Handle reaching destination
        if (newProgress >= 1) {
          newProgress = 0;
          if (shuttle.status === 'to_school') {
            newStatus = 'at_school';
            studentsOnBoard = 0;
            // After delay, go back to pod
            setTimeout(() => {
              if (shuttleStateRef.current[idx]) {
                shuttleStateRef.current[idx].status = 'to_pod';
                shuttleStateRef.current[idx].progress = 0;
              }
            }, 3000);
          } else if (shuttle.status === 'to_pod') {
            newStatus = 'at_pod';
            // After delay, load students and go to school
            setTimeout(() => {
              if (shuttleStateRef.current[idx]) {
                shuttleStateRef.current[idx].status = 'to_school';
                shuttleStateRef.current[idx].studentsOnBoard = Math.floor(Math.random() * 10) + 15;
                shuttleStateRef.current[idx].progress = 0;
              }
            }, 4000);
          }
        }

        // Get path (reverse if going to pod)
        const path = shuttle.status === 'to_pod' ? [...route.path].reverse() : route.path;

        // Safety check for path
        if (!path || path.length < 2) {
          return shuttle;
        }

        // Interpolate position along path
        const totalSegments = path.length - 1;
        const progressAlongPath = Math.min(Math.max(newProgress, 0), 0.999);
        const segmentIndex = Math.floor(progressAlongPath * totalSegments);
        const segmentProgress = (progressAlongPath * totalSegments) % 1;

        const start = path[segmentIndex];
        const end = path[Math.min(segmentIndex + 1, path.length - 1)];

        // Safety check for path points
        if (!start || !end || start.length < 2 || end.length < 2) {
          return shuttle;
        }

        const position: [number, number] = [
          start[0] + (end[0] - start[0]) * segmentProgress,
          start[1] + (end[1] - start[1]) * segmentProgress,
        ];

        // Calculate bearing
        const bearing = Math.atan2(end[0] - start[0], end[1] - start[1]) * (180 / Math.PI);

        // Update marker position
        const marker = shuttleMarkersRef.current[idx];
        if (marker && (shuttle.status === 'to_school' || shuttle.status === 'to_pod')) {
          marker.setLngLat(position);
        }

        return {
          ...shuttle,
          position,
          progress: newProgress,
          status: newStatus,
          studentsOnBoard,
          bearing,
        };
      });

      // Notify parent component (using ref to avoid re-render loop)
      if (onShuttleUpdateRef.current) {
        onShuttleUpdateRef.current(shuttleStateRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mapLoaded]);

  return <div ref={mapContainer} className={className} />;
}

export { SHUTTLE_ROUTES };
export type { ShuttleState as ShuttlePosition };
