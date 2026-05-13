import { Navbar } from "@/components/layout/navbar";
import { Coffee, ShieldCheck, Users, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl text-center">
        <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Coffee className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight italic">Waze for Café Wi-Fi.</h1>
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
          CoffeePassword is a community-driven platform built for remote workers, students, and digital nomads who need reliable internet access without the friction.
        </p>

        <div className="grid gap-12 text-left mt-20">
          <div className="flex gap-6">
            <div className="shrink-0 h-12 w-12 bg-accent rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">The Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe that finding a place to work should be frictionless. No more hunting for tiny placards or bothering busy baristas. Just open your laptop and get to work.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="shrink-0 h-12 w-12 bg-accent rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Community First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our data is crowdsourced and verified by users like you. When you confirm a password works, you&apos;re helping someone else save time and stress.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="shrink-0 h-12 w-12 bg-accent rounded-xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you&apos;re in a local roastery or a major chain, our goal is to have every work-friendly café mapped with its current Wi-Fi credentials.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
