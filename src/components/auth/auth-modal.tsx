"use client";

import { useAuth } from "@/hooks/use-auth";
import { Coffee, X } from "lucide-react";
import Image from "next/image";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { signInWithGoogle, signInAnonymously } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Coffee className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold italic tracking-tight">Join CoffeePassword</h2>
          <p className="text-muted-foreground">Save your favorite spots and verify Wi-Fi for the community.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={async () => {
              await signInWithGoogle();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-3 bg-white text-black border border-zinc-200 py-3 rounded-xl font-bold hover:bg-zinc-50 transition-colors shadow-sm"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <button
            onClick={async () => {
              await signInAnonymously();
              onClose();
            }}
            className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold hover:bg-accent/80 transition-colors"
          >
            Browse Anonymously
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground px-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
