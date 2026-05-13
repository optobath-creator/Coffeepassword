"use client";

import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { LogOut, User as UserIcon, Award, Heart, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 hover:bg-accent rounded-full transition-colors"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || "User"}
            width={32}
            height={32}
            className="rounded-full border border-primary/20"
          />
        ) : (
          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
            <UserIcon className="h-4 w-4 text-primary" />
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-64 bg-background border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 bg-accent/30 border-b">
              <p className="font-bold truncate">{user.displayName || "Anonymous Explorer"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email || "No email provided"}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {user.reputation || 0} Rep
                </span>
                {user.isAnonymous && (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    Anonymous
                  </span>
                )}
              </div>
            </div>

            <div className="p-2">
              <Link
                href="/favorites"
                className="flex items-center gap-3 p-2 text-sm hover:bg-accent rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-4 w-4" />
                Your Favorites
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center gap-3 p-2 text-sm hover:bg-accent rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Award className="h-4 w-4" />
                Contributor Stats
              </Link>
              <button
                className="w-full flex items-center gap-3 p-2 text-sm hover:bg-accent rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>

            <div className="p-2 border-t bg-muted/20">
              <button
                onClick={async () => {
                  await logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
