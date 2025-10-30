"use client";

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Location } from '@/lib/types';

interface GoogleMapComponentProps {
  center: Location;
  zoom?: number;
  ambulanceLocation?: Location;
  primaryRoute?: any;
  shortcutRoute?: any;
  destination?: Location;
  onMapLoad?: (map: google.maps.Map) => void;
  className?: string;
}

export default function GoogleMapComponent({
  center,
  zoom = 13,
  ambulanceLocation,
  primaryRoute,
  shortcutRoute,
  destination,
  onMapLoad,
  className = "w-full h-full"
}: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const ambulanceMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  const primaryPolylineRef = useRef<google.maps.Polyline | null>(null);
  const shortcutPolylineRef = useRef<google.maps.Polyline | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
        });

        await loader.load();

        if (mapRef.current && !mapInstanceRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });

          mapInstanceRef.current = map;
          setMapLoaded(true);
          onMapLoad?.(map);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [center, zoom, onMapLoad]);

  // Update ambulance marker with pulse animation
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !ambulanceLocation) return;

    if (ambulanceMarkerRef.current) {
      ambulanceMarkerRef.current.setPosition(ambulanceLocation);
    } else {
      const ambulanceIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#EF4444',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3,
        scale: 12,
      };

      const marker = new google.maps.Marker({
        position: ambulanceLocation,
        map: mapInstanceRef.current,
        icon: ambulanceIcon,
        title: 'Ambulance',
        animation: google.maps.Animation.BOUNCE,
      });

      // Create pulse effect
      const pulseCircle = new google.maps.Circle({
        map: mapInstanceRef.current,
        center: ambulanceLocation,
        radius: 100,
        strokeColor: '#EF4444',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#EF4444',
        fillOpacity: 0.2,
      });

      // Animate pulse
      let growing = true;
      setInterval(() => {
        const currentRadius = pulseCircle.getRadius();
        if (growing) {
          pulseCircle.setRadius(currentRadius + 5);
          if (currentRadius > 150) growing = false;
        } else {
          pulseCircle.setRadius(currentRadius - 5);
          if (currentRadius < 100) growing = true;
        }
        pulseCircle.setCenter(ambulanceLocation);
      }, 50);

      ambulanceMarkerRef.current = marker;
    }
  }, [mapLoaded, ambulanceLocation]);

  // Update destination marker
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !destination) return;

    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setPosition(destination);
    } else {
      const marker = new google.maps.Marker({
        position: destination,
        map: mapInstanceRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#10B981',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
          scale: 10,
        },
        title: 'Destination',
      });

      destinationMarkerRef.current = marker;
    }
  }, [mapLoaded, destination]);

  // Draw primary route (blue)
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !primaryRoute) return;

    if (primaryPolylineRef.current) {
      primaryPolylineRef.current.setMap(null);
    }

    const decodedPath = google.maps.geometry.encoding.decodePath(
      primaryRoute.overview_polyline.points
    );

    const polyline = new google.maps.Polyline({
      path: decodedPath,
      geodesic: true,
      strokeColor: '#3B82F6',
      strokeOpacity: 0.8,
      strokeWeight: 6,
      map: mapInstanceRef.current,
    });

    primaryPolylineRef.current = polyline;

    // Auto-zoom to fit route
    const bounds = new google.maps.LatLngBounds();
    decodedPath.forEach((point) => bounds.extend(point));
    mapInstanceRef.current.fitBounds(bounds);
  }, [mapLoaded, primaryRoute]);

  // Draw shortcut route (orange)
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !shortcutRoute) return;

    if (shortcutPolylineRef.current) {
      shortcutPolylineRef.current.setMap(null);
    }

    const decodedPath = google.maps.geometry.encoding.decodePath(
      shortcutRoute.overview_polyline.points
    );

    const polyline = new google.maps.Polyline({
      path: decodedPath,
      geodesic: true,
      strokeColor: '#F97316',
      strokeOpacity: 0.7,
      strokeWeight: 5,
      map: mapInstanceRef.current,
    });

    shortcutPolylineRef.current = polyline;
  }, [mapLoaded, shortcutRoute]);

  return <div ref={mapRef} className={className} />;
}
