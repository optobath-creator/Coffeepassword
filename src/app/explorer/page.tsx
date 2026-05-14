"use client";

import { Navbar } from "@/components/layout/navbar";
import { CoffeeMap } from "@/components/map/coffee-map";
import { CoffeeCard } from "@/components/map/coffee-card";
import { CoffeeShop } from "@/types";
import { coffeeService } from "@/services/coffee-service";
import { MapPin, Search, Filter, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Explorer() {
  const [shops, setShops] = useState<CoffeeShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const data = await coffeeService.getShops();
        setShops(data);
      } catch (err) {
        console.error("Error fetching shops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-full md:w-[400px] border-r flex flex-col bg-background/80 backdrop-blur-xl z-10 shadow-2xl absolute md:relative h-[50vh] md:h-full bottom-0 md:bottom-auto rounded-t-3xl md:rounded-none transition-transform duration-300">
          <div className="p-4 border-b border-border/50">
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4 md:hidden" />
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search coffee shops..."
                className="w-full pl-10 pr-4 py-3.5 bg-accent/60 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none font-medium placeholder:font-normal"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 px-4 bg-accent/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-accent/80 transition-colors uppercase tracking-wider">
                <Filter className="h-3.5 w-3.5" />
                Filters
              </button>
              <button className="flex-1 py-2.5 px-4 bg-primary/10 text-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors uppercase tracking-wider shadow-sm">
                <MapPin className="h-3.5 w-3.5" />
                Near Me
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Brewing your map...</p>
              </div>
            ) : (
              shops.map((shop) => (
                <div key={shop.id} onClick={() => setSelectedShop(shop)}>
                  <CoffeeCard shop={shop} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 bg-accent/10 relative">
          <CoffeeMap 
            shops={shops} 
            onMarkerClick={(shop) => setSelectedShop(shop)}
            center={selectedShop ? [selectedShop.coordinates.longitude, selectedShop.coordinates.latitude] : undefined}
          />

          {/* Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="p-3 bg-background border rounded-2xl shadow-lg hover:bg-accent transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
