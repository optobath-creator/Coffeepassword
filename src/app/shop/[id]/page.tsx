"use client";

import { Navbar } from "@/components/layout/navbar";
import { Coffee, MapPin, Globe, Clock, ArrowLeft, Navigation, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { CoffeeShop, WifiPassword } from "@/types";
import { coffeeService } from "@/services/coffee-service";
import { PasswordCard } from "@/components/shop/password-card";
import { SubmitPasswordModal } from "@/components/shop/submit-password-modal";
import { useAuth } from "@/hooks/use-auth";

export default function ShopDetail({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [shop, setShop] = useState<CoffeeShop | null>(null);
  const [passwords, setPasswords] = useState<WifiPassword[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [shopData, passwordData] = await Promise.all([
        coffeeService.getShopById(params.id),
        coffeeService.getPasswordsForShop(params.id)
      ]);
      setShop(shopData);
      setPasswords(passwordData);
    } catch (err) {
      console.error("Error fetching shop details:", err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (isMounted) {
        await fetchData();
      }
    };
    load();
    return () => { isMounted = false; };
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Café not found</h1>
          <Link href="/explorer" className="text-primary font-bold">Return to Explorer</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/explorer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Explorer
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Coffee className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Coffee Shop</span>
              </div>
              <h1 className="text-5xl font-black italic tracking-tight leading-none">{shop.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-1.5 bg-accent/50 px-3 py-1.5 rounded-lg font-medium">
                  <MapPin className="h-4 w-4" />
                  {shop.address}
                </div>
                <div className="flex items-center gap-1.5 bg-accent/50 px-3 py-1.5 rounded-lg font-medium">
                  <Clock className={shop.status === "Open" ? "h-4 w-4 text-green-500" : "h-4 w-4 text-red-500"} />
                  {shop.status}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
                <h2 className="text-2xl font-bold italic tracking-tight">Community Wi-Fi</h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  disabled={!user}
                  className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Password
                </button>
              </div>

              {passwords.length > 0 ? (
                <div className="space-y-6">
                  {passwords.map((pw, idx) => (
                    <PasswordCard 
                      key={pw.id} 
                      password={pw} 
                      isTop={idx === 0}
                      onVoteSuccess={fetchData}
                    />
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-3xl p-12 text-center text-muted-foreground">
                  <p className="mb-4">No passwords submitted yet. Be the first to help the community!</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    disabled={!user}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Share Wi-Fi Password
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-accent/10 rounded-3xl p-6 space-y-6">
              <button className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <Navigation className="h-5 w-5" />
                Get Directions
              </button>
              {shop.website && (
                <a 
                  href={shop.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-background border py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent transition-colors"
                >
                  <Globe className="h-5 w-5" />
                  Visit Website
                </a>
              )}
              
              <hr />

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Café Features</h4>
                <div className="grid grid-cols-2 gap-3">
                  {shop.features.map(feature => (
                    <div key={feature} className="bg-background rounded-lg p-2 text-xs font-medium border text-center">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SubmitPasswordModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shopId={shop.id}
        shopName={shop.name}
        onSuccess={fetchData}
      />
    </div>
  );
}
