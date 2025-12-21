"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Activity } from "@/lib/types";
import { useEffect, useState } from "react";

// Fix for default Leaflet marker icons in Next.js
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapComponentProps {
  activities: Activity[];
}

export default function MapComponent({
  activities,
  destination,
}: MapComponentProps & { destination?: string }) {
  const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]); // Default Paris
  const [map, setMap] = useState<L.Map | null>(null);

  // Effect to handle destination changes
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (destination) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              destination
            )}`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setCenter([lat, lon]);
            if (map) {
              map.setView([lat, lon], 12);
            }
          }
        } catch (error) {
          console.error("Error fetching coordinates:", error);
        }
      }
    };

    fetchCoordinates();
  }, [destination, map]);

  // Effect to handle activities changes (keep existing logic but respect destination if no activities)
  useEffect(() => {
    if (activities.length > 0 && activities[0].location) {
      setCenter([activities[0].location.lat, activities[0].location.lng]);
      if (map) {
        map.setView(
          [activities[0].location.lat, activities[0].location.lng],
          12
        );
      }
    }
  }, [activities, map]);

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-700">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {activities.map(
          (act) =>
            act.location && (
              <Marker
                key={act.id}
                position={[act.location.lat, act.location.lng]}
                icon={icon}
              >
                <Popup>
                  <strong>{act.name}</strong>
                  <br />
                  {act.type}
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
}
