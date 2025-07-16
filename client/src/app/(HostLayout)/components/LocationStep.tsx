"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EnvironmentOutlined } from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Input, Typography } from "antd";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import CategoryServices from "@/services/category/category.services";

const { Title } = Typography;

if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
    ._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "/images/location.png",
  });
}

function MapEventHandler({
  onMoveEnd,
}: {
  onMoveEnd: (center: [number, number]) => void;
}) {
  useMapEvents({
    moveend(e: L.LeafletEvent) {
      const center = (e.target as L.Map).getCenter();
      onMoveEnd([center.lat, center.lng]);
    },
    click(e: L.LeafletMouseEvent) {
      (e.target as L.Map).setView(e.latlng);
    },
  });
  return null;
}

export default function LocationStep() {
  const { listingId, featureType } = useListingContext();
  const { setOnNextSubmit } = useListingStepContext();

  const mapRef = useRef<LeafletMap | null>(null);

  const [fallbackCenter, setFallbackCenter] = useState<[number, number] | null>(
    null
  );
  const [center, setCenter] = useState<[number, number]>([23.8103, 90.4125]);
  const [location, setLocation] = useState("");

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setLocation(data.display_name || "");
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const geocodeLocation = async (query: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      if (data?.length > 0) {
        const { lat, lon } = data[0];
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setCenter(newCenter);
        if (mapRef.current) {
          mapRef.current.setView(newCenter, 15);
        }
      }
    } catch (err) {
      console.error("Error geocoding address:", err);
    }
  };

  const handleMapMoveEnd = (newCenter: [number, number]) => {
    setCenter(newCenter);
    fetchAddress(newCenter[0], newCenter[1]);
  };

  const handleReset = () => {
    if (fallbackCenter) {
      setCenter(fallbackCenter);
      if (mapRef.current) {
        mapRef.current.setView(fallbackCenter, 13);
      }
      fetchAddress(fallbackCenter[0], fallbackCenter[1]);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!listingId || !featureType) return;
    await CategoryServices.updateListingLocation(
      featureType,
      listingId,
      location
    );
  }, [featureType, listingId, location]);

  useEffect(() => {
    setOnNextSubmit(handleSubmit);
  }, [handleSubmit, setOnNextSubmit]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setFallbackCenter(coords);
        setCenter(coords);
        fetchAddress(coords[0], coords[1]);
        if (mapRef.current) {
          mapRef.current.setView(coords, 13);
        }
      },
      (err) => {
        console.warn(
          "Geolocation denied or unavailable. Using default center.",
          err
        );
        const defaultCoords: [number, number] = [23.8103, 90.4125];
        setFallbackCenter(defaultCoords);
        setCenter(defaultCoords);
        fetchAddress(defaultCoords[0], defaultCoords[1]);
      }
    );
  }, []);

  const handleSearchEnter = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      await geocodeLocation(location);
    }
  };

  return (
    <div className="h-full w-full mx-auto rounded-xl overflow-hidden shadow-lg">
      <div className="p-4">
        <Title level={4} className="mb-2 tracking-wider">
          Where&apos;s your place located?
        </Title>
        <h4 className="text-gray-400 tracking-wide">
          Your address is only shared with guests after they&apos;ve made a
          reservation.
        </h4>
      </div>

      <div className="relative h-[450px] mt-4 rounded-xl overflow-hidden">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom
          className="absolute inset-0 z-0"
          whenReady={() => {
            if (!mapRef.current) return;
            const initCenter = mapRef.current.getCenter();
            handleMapMoveEnd([initCenter.lat, initCenter.lng]);
          }}
          ref={(instance) => {
            if (instance) mapRef.current = instance;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          <Marker key={`${center[0]}-${center[1]}`} position={center} />
          <MapEventHandler onMoveEnd={handleMapMoveEnd} />
        </MapContainer>

        <div className="absolute z-[1000] top-4 left-4 right-4 max-w-md mx-auto flex gap-2">
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleSearchEnter}
            size="large"
            placeholder="Enter your address"
            className="shadow-lg flex-1"
            prefix={<EnvironmentOutlined className="text-gray-500" />}
          />
          <button
            onClick={handleReset}
            className="bg-white px-3 py-2 rounded-md shadow hover:bg-gray-100 border border-gray-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
