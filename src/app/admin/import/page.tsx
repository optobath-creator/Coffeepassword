"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/config";
import { doc, writeBatch, serverTimestamp } from "firebase/firestore";
import detroitData from "../../../../data/detroit-cafes.json";
import { Navbar } from "@/components/layout/navbar";
import { Loader2, Database, CheckCircle, AlertTriangle, Activity } from "lucide-react";

export default function AdminImport() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [diagnosticLoading, setDiagnosticResultLoading] = useState(false);

  const runDiagnostic = async () => {
    setDiagnosticResultLoading(true);
    setDiagnosticResult(null);
    try {
      // Check if Identity Toolkit API is reachable
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      const resp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
        method: 'POST',
        body: JSON.stringify({ returnSecureToken: true })
      });
      const data = await resp.json();
      
      if (data.error?.message === "CONFIGURATION_NOT_FOUND") {
        setDiagnosticResult("❌ Identity Toolkit API is DISABLED or API Key is wrong. Go to Google Cloud Console and enable 'Identity Toolkit API'.");
      } else if (data.error?.message === "OPERATION_NOT_ALLOWED") {
        setDiagnosticResult("✅ Connectivity OK! But Google Login specifically is disabled. Enable it in Firebase Auth > Sign-in method.");
      } else {
        setDiagnosticResult(`ℹ️ Result: ${data.error?.message || "Connected Successfully"}`);
      }
    } catch (err) {
      setDiagnosticResult("❌ Failed to reach Firebase servers. Check your internet or API Key.");
    } finally {
      setDiagnosticResultLoading(false);
    }
  };

  const startImport = async () => {
    setLoading(true);
    const elements = detroitData.elements;
    const total = elements.length;
    let count = 0;

    // Firestore batches are limited to 500
    let batch = writeBatch(db);

    for (const el of elements) {
      const tags = el.tags as Record<string, string | undefined>;
      if (!tags?.name) continue;

      const shopId = `osm-${el.id}`;
      const shopRef = doc(db, "coffeeShops", shopId);
      
      // Use cast for OSM element structure
      const osmEl = el as { lat?: number; lon?: number; center?: { lat: number; lon: number } };
      const lat = osmEl.lat || osmEl.center?.lat;
      const lon = osmEl.lon || osmEl.center?.lon;

      if (!lat || !lon) continue;

      batch.set(shopRef, {
        name: tags.name,
        address: (tags["addr:full"] as string) || `${tags["addr:housenumber"] || ""} ${tags["addr:street"] || ""}`.trim() || "Address not listed",
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

          <div className="space-y-4">
            {diagnosticResult && (
              <div className="bg-accent/50 p-4 rounded-xl text-xs font-bold text-left space-y-2 border border-primary/20">
                <p className="flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  Diagnostic Report:
                </p>
                <p className="text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
                  {diagnosticResult}
                </p>
              </div>
            )}

            <button
              onClick={runDiagnostic}
              disabled={diagnosticLoading || loading}
              className="w-full bg-accent text-accent-foreground py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-accent/80 transition-all disabled:opacity-50 border border-border/50 uppercase tracking-widest"
            >
              {diagnosticLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Activity className="h-3 w-3" />}
              Test Connection
            </button>

            <hr className="my-6 border-border/50" />

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
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg"
              >
                <Database className="h-5 w-5" />
                Start Detroit Import
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
