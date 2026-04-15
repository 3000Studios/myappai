'use client';

/**
 * Google Maps Component
 * Interactive map showing business location in Atlanta, Georgia
 */

import { useCallback, useEffect, useRef } from 'react';

interface GoogleMapProps {
  apiKey: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

export default function GoogleMap({
  apiKey,
  center = { lat: 33.749, lng: -84.388 }, // Atlanta, Georgia
  zoom = 12,
  mapType = 'satellite',
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || typeof google === 'undefined') return;

    const mapOptions: google.maps.MapOptions = {
      center,
      zoom,
      mapTypeId: mapType,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }],
        },
      ],
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT,
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain'],
      },
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
    };

    const map = new google.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; color: #000;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #000;">3000 Studios</h3>
          <p style="margin: 0; color: #666;">Atlanta, Georgia</p>
          <p style="margin: 4px 0 0 0; color: #666;">Serving clients worldwide</p>
        </div>
      `,
    });

    const marker = new google.maps.Marker({
      position: center,
      map,
      title: '3000 Studios - Atlanta, Georgia',
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#FFD700',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
      },
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  }, [center, zoom, mapType]);

  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      console.warn('Google Maps API key not configured');
      return;
    }

    const loadGoogleMaps = () => {
      if (typeof google !== 'undefined') {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      script.onerror = () => console.error('Failed to load Google Maps');
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [apiKey, initializeMap]);

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,215,0,0.1)_0%,_transparent_50%)]"></div>
        <div className="text-center relative z-10 p-8">
          <div className="text-gold text-6xl mb-4">🗺️</div>
          <p className="text-gray-400 font-semibold text-lg mb-2">Google Maps API Key Required</p>
          <p className="text-gray-600 text-sm">
            Please add your NEXT_PUBLIC_MAPS_API key to .env.local
          </p>
          <p className="text-gray-700 text-xs mt-4">Location: Atlanta, Georgia</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />;
}

