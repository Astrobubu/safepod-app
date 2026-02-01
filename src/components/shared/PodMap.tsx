'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, SCHOOL_LOCATION, pods, shuttles } from '@/data/mock-data';
import { Pod, Shuttle } from '@/lib/types';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface PodMapProps {
  highlightPod?: string;
  showAllPods?: boolean;
  showShuttles?: boolean;
  showSchool?: boolean;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function PodMap({
  highlightPod,
  showAllPods = true,
  showShuttles = false,
  showSchool = true,
  center,
  zoom = 14,
  className = 'w-full h-[400px]',
}: PodMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    const defaultCenter = center || (highlightPod
      ? pods.find(p => p.id === highlightPod)?.location
      : [55.235, 25.178]) as [number, number];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: defaultCenter,
      zoom: zoom,
      pitch: 30,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [center, highlightPod, zoom]);

  // Add markers when map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(m => m.remove());

    // Add pod markers
    if (showAllPods) {
      pods.forEach((pod) => {
        const isHighlighted = highlightPod === pod.id;
        const el = createPodMarker(pod, isHighlighted);

        new mapboxgl.Marker({ element: el })
          .setLngLat(pod.location)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${pod.name}</h3>
                <p class="text-sm text-gray-600">${pod.address}</p>
                <p class="text-sm mt-1">
                  <span class="font-medium">${pod.currentCount}/${pod.capacity}</span> students
                </p>
              </div>
            `)
          )
          .addTo(map.current!);
      });
    } else if (highlightPod) {
      const pod = pods.find(p => p.id === highlightPod);
      if (pod) {
        const el = createPodMarker(pod, true);
        new mapboxgl.Marker({ element: el })
          .setLngLat(pod.location)
          .addTo(map.current!);
      }
    }

    // Add school marker
    if (showSchool) {
      const schoolEl = document.createElement('div');
      schoolEl.className = 'flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white shadow-lg';
      schoolEl.innerHTML = `
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      `;

      new mapboxgl.Marker({ element: schoolEl })
        .setLngLat(SCHOOL_LOCATION)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">GEMS Jumeirah Primary School</h3>
              <p class="text-sm text-gray-600">Al Safa 1, Dubai</p>
            </div>
          `)
        )
        .addTo(map.current!);
    }

    // Add shuttle markers
    if (showShuttles) {
      shuttles.forEach((shuttle) => {
        const el = createShuttleMarker(shuttle);
        new mapboxgl.Marker({ element: el })
          .setLngLat(shuttle.currentLocation)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-semibold">${shuttle.name}</h3>
                <p class="text-sm text-gray-600">${shuttle.status.replace(/_/g, ' ')}</p>
                <p class="text-sm mt-1">
                  <span class="font-medium">${shuttle.currentStudents.length}/${shuttle.capacity}</span> students
                </p>
                ${shuttle.eta ? `<p class="text-sm">ETA: ${shuttle.eta} min</p>` : ''}
              </div>
            `)
          )
          .addTo(map.current!);
      });
    }
  }, [mapLoaded, showAllPods, showShuttles, showSchool, highlightPod]);

  return <div ref={mapContainer} className={className} />;
}

function createPodMarker(pod: Pod, isHighlighted: boolean): HTMLDivElement {
  const el = document.createElement('div');

  const statusColor = pod.status === 'full'
    ? 'bg-red-500'
    : pod.status === 'busy'
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  el.className = `flex items-center justify-center rounded-full text-white shadow-lg transition-transform ${statusColor} ${
    isHighlighted ? 'w-12 h-12 ring-4 ring-emerald-200 scale-110' : 'w-10 h-10'
  }`;

  el.innerHTML = `
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  `;

  return el;
}

function createShuttleMarker(shuttle: Shuttle): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white shadow-lg';
  el.innerHTML = `
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  `;
  return el;
}
