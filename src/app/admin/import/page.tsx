"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/config";
import { doc, writeBatch, serverTimestamp } from "firebase/firestore";
import detroitData from "../../../../data/detroit-cafes.json";
import { Navbar } from "@/components/layout/navbar";
import { Loader2, Database, CheckCircle } from "lucide-react";

export default function AdminImport() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const startImport = async () => {
    setLoading(true);
    const elements = detroitData.elements;
    const total = elements.length;
    let count = 0;

    // Firestore batches are limited to 500
    let batch = writeBatch(db);

    for (const el of elements) {
      const tags = el.tags as any;
      if (!tags?.name) continue;

      const shopId = `osm-${el.id}`;
      const shopRef = doc(db, "coffeeShops", shopId);
      
      const lat = el.lat || (el as any).center?.lat;
      const lon = el.lon || (el as any).center?.lon;

      if (!lat || !lon) continue;

      batch.set(shopRef, {
        name: tags.name,
        address: tags["addr:full"] || `${tags["addr:housenumber"] || ""} ${tags["addr:street"] || ""}`.trim() || "Address not listed",
        coordinates: { latitude: lat, longitude: lon },
        rating: 4.0,
        wifiAvailability: "Available",
        features: ["Detroit Local"],
        status: "Open",
        website: tags.website || "",
        lastUpdated: serverTimestamp()
      });

      count++;
      
      if (count % 400 === 0 || count === total) {
        await batch.commit();
        batch = writeBatch(db);
        setProgress(Math.round((count / total) * 100));
      }
    }
    setDone(true);
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-card border rounded-3xl p-12 max-w-md w-full text-center shadow-xl">
          <Database className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Data Importer</h1>
          <p className="text-muted-foreground mb-8">
            This will upload {detroitData.elements.length} coffee shops to your Firestore database.
          </p>

          {loading ? (
            <div className="space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <p className="font-bold">Importing... {progress}%</p>
            </div>
          ) : done ? (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="font-bold text-green-500">Import Complete!</p>
              <p className="text-sm">Check your Map Explorer now.</p>
            </div>
          ) : (
            <button
              onClick={startImport}
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity"
            >
              Start Detroit Import
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
