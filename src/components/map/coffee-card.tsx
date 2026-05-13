"use client";

import { CoffeeShop } from "@/types";
import { Coffee, MapPin, Star, Wifi, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CoffeeCard({ shop }: { shop: CoffeeShop }) {
  return (
    <div className="bg-card border border-border/50 rounded-3xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-300">
            <Coffee className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl text-xs font-black tracking-wide">
            <Star className="h-3.5 w-3.5 fill-current" />
            {shop.rating}
          </div>
        </div>
        
        <h3 className="font-bold text-xl mb-1 truncate tracking-tight">{shop.name}</h3>
        <p className="text-sm text-muted-foreground mb-5 flex items-center gap-1.5 truncate">
          <MapPin className="h-3.5 w-3.5" />
          {shop.address}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-green-500" />
            <span className="text-xs font-bold uppercase tracking-wider">{shop.wifiAvailability}</span>
          </div>
          <Link 
            href={`/shop/${shop.id}`}
            className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View Wi-Fi
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
