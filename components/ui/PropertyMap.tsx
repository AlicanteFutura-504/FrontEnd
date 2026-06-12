"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface PropertyMapProps {
  city?: string;
}

// Map of some Spanish cities to coordinates for demonstration purposes
const cityCoordinates: Record<string, [number, number]> = {
  "Alicante": [38.3452, -0.4810],
  "Madrid": [40.4168, -3.7038],
  "Barcelona": [41.3851, 2.1734],
  "Valencia": [39.4699, -0.3774],
  "Sevilla": [37.3891, -5.9845],
  "Zaragoza": [41.6488, -0.8891],
  "Málaga": [36.7213, -4.4216],
  "Murcia": [37.9922, -1.1307],
  "Palma": [39.5696, 2.6502],
  "Bilbao": [43.2630, -2.9350],
};

export default function PropertyMap({ city }: PropertyMapProps) {
  // Default to center of Spain if city not found
  const defaultCenter: [number, number] = [40.4637, -3.7492];
  const center = city && cityCoordinates[city] ? cityCoordinates[city] : defaultCenter;

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "16px", overflow: "hidden", zIndex: 1 }}>
      <MapContainer 
        center={center} 
        zoom={14} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle 
          center={center} 
          pathOptions={{ fillColor: '#FF385C', color: '#FF385C' }} 
          radius={500} 
        />
      </MapContainer>
    </div>
  );
}
