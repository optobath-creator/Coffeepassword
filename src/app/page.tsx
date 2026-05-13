import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import { Coffee, MapPin, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-accent/20">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              No more hunting for the <span className="text-primary">Wi-Fi sign.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              The community-driven map to instantly find verified coffee shop Wi-Fi passwords. Open laptop, connect instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/explorer"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Find Wi-Fi Near Me
              </Link>
              <button className="bg-secondary text-secondary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-secondary/80 transition-colors">
                How it Works
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Instant Access</h3>
                <p className="text-muted-foreground">
                  Get the current, verified password before you even order your latte. No awkward questions.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Community Verified</h3>
                <p className="text-muted-foreground">
                  Passwords are upvoted and confirmed by thousands of remote workers and students.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Coffee className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Work-Friendly Filters</h3>
                <p className="text-muted-foreground">
                  Filter by speed, outlet availability, noise levels, and seating options.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2026 CoffeePassword. Built for digital nomads.</p>
        </div>
      </footer>
    </div>
  );
}
