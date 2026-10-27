'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  type?: 'customer' | 'provider' | 'fuel_station';
  popupHtml?: string;
}

export interface LiveMapProps {
  customerCoords: { lat: number; lng: number };
  providerCoords?: { lat: number; lng: number };
  nearbyPumps?: Array<{ name: string; lat: number; lng: number; brand: string; distanceKm: number }>;
  height?: string;
  zoom?: number;
  showRoute?: boolean;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  customerCoords,
  providerCoords,
  nearbyPumps = [],
  height = '360px',
  zoom = 13,
  showRoute = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const centerLat = providerCoords
      ? (customerCoords.lat + providerCoords.lat) / 2
      : customerCoords.lat;
    const centerLng = providerCoords
      ? (customerCoords.lng + providerCoords.lng) / 2
      : customerCoords.lng;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: zoom,
      scrollWheelZoom: false
    });

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Custom Customer Icon
    const customerIcon = L.divIcon({
      className: 'custom-customer-marker',
      html: `
        <div style="
          background-color: #DC2626;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid #FFFFFF;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 13px;
        ">
          📍
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    // Add Customer Marker
    const customerMarker = L.marker([customerCoords.lat, customerCoords.lng], {
      icon: customerIcon
    }).addTo(map);
    customerMarker.bindPopup('<b>Customer Location</b><br/>Emergency Assistance Point');

    // Add Provider Marker & Route if providerCoords given
    if (providerCoords) {
      const providerIcon = L.divIcon({
        className: 'custom-provider-marker',
        html: `
          <div style="
            background-color: #2563EB;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid #FFFFFF;
            box-shadow: 0 4px 8px -1px rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
          ">
            🚗
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const providerMarker = L.marker([providerCoords.lat, providerCoords.lng], {
        icon: providerIcon
      }).addTo(map);
      providerMarker.bindPopup('<b>Assigned Technician</b><br/>En Route');

      if (showRoute) {
        // Draw polyline between provider and customer
        const latlngs: L.LatLngExpression[] = [
          [providerCoords.lat, providerCoords.lng],
          [customerCoords.lat, customerCoords.lng]
        ];
        const routeLine = L.polyline(latlngs, {
          color: '#2563EB',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 8'
        }).addTo(map);

        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
      }
    }

    // Add nearby pumps markers if provided
    nearbyPumps.forEach(pump => {
      const pumpIcon = L.divIcon({
        className: 'pump-marker',
        html: `
          <div style="
            background-color: #059669;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid #FFFFFF;
            box-shadow: 0 2px 4px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
          ">
            ⛽
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([pump.lat, pump.lng], { icon: pumpIcon })
        .addTo(map)
        .bindPopup(`<b>${pump.name}</b><br/>${pump.brand} (${pump.distanceKm} km away)<br/><span style="color:#059669;font-weight:600">PESO Authorized Retail Station</span>`);
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [customerCoords, providerCoords, nearbyPumps, zoom, showRoute]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
    </div>
  );
};
