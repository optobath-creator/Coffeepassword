import { Navbar } from "@/components/layout/navbar";
import { Heart, Coffee } from "lucide-react";
import Link from "next/link";

export default function Favorites() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Your Favorites</h1>
            <p className="text-muted-foreground">Saved coffee shops for easy Wi-Fi access.</p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="bg-card border rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:shadow-md transition-shadow">
            <div className="h-24 w-24 bg-accent/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-accent/40 transition-colors">
              <Coffee className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">The Roasted Bean</h3>
              <p className="text-sm text-muted-foreground mb-4">123 Coffee Lane, Tech City</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  verified
                </span>
                <span className="bg-accent px-3 py-1 rounded-full text-xs font-medium">
                  Fast Wi-Fi
                </span>
              </div>
            </div>
            <Link
              href="/shop/1"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              View Wi-Fi
            </Link>
          </div>

          <div className="border-2 border-dashed rounded-3xl p-12 text-center text-muted-foreground">
            <p>Save your favorite shops to see them here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
