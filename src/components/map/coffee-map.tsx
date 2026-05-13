"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { CoffeeShop } from "@/types";
import { useTheme } from "next-themes";

interface MapProps {
  shops: CoffeeShop[];
  onMarkerClick: (shop: CoffeeShop) => void;
  center?: [number, number];
}

export function CoffeeMap({ shops, onMarkerClick, center }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const initialCenter: [number, number] = center || [-74.006, 40.7128]; // Default NYC

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      // OpenFreeMap style URL
      style: theme === "dark" 
        ? "https://tiles.openfreemap.org/styles/dark" 
        : "https://tiles.openfreemap.org/styles/bright",
      center: initialCenter,
      zoom: 12,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "bottom-right"
    );

    // Get user location on load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          map.current?.flyTo({ center: [longitude, latitude], zoom: 14 });
        },
        (error) => console.error("Geolocation error:", error)
      );
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [theme]); // Only re-run if theme changes significantly (style swap)

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers (basic approach for prototype)
    const markers = document.querySelectorAll(".marker-container");
    markers.forEach(m => m.remove());

    // Update markers
    shops.forEach((shop) => {
      const el = document.createElement("div");
      el.className = "marker-container";
      el.innerHTML = `
        <div class="h-10 w-10 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>
        </div>
      `;

      el.addEventListener("click", () => onMarkerClick(shop));

      new maplibregl.Marker({ element: el })
        .setLngLat([shop.coordinates.longitude, shop.coordinates.latitude])
        .addTo(map.current!);
    });
  }, [shops, onMarkerClick]);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(
        theme === "dark" 
          ? "https://tiles.openfreemap.org/styles/dark" 
          : "https://tiles.openfreemap.org/styles/bright"
      );
    }
  }, [theme]);

  // Handle center changes from parent
  useEffect(() => {
    if (map.current && center) {
      map.current.flyTo({ center, zoom: 15 });
    }
  }, [center]);

  return <div ref={mapContainer} className="h-full w-full" />;
}
