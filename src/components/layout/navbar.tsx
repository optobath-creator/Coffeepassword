"use client";

import Link from "next/link";
import { Coffee, Map, Heart, Info, Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserDropdown } from "@/components/auth/user-dropdown";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();

  const navItems = [
    { label: "Explorer", href: "/explorer", icon: Map },
    { label: "Favorites", href: "/favorites", icon: Heart },
    { label: "About", href: "/about", icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Coffee className="h-6 w-6 text-primary" />
            <span>CoffeePassword</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            
            {!loading && (
              user ? (
                <UserDropdown />
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {!loading && user && <UserDropdown />}
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium flex items-center gap-2 p-3 hover:bg-accent rounded-xl transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          {!user && (
            <button 
              onClick={() => {
                setIsOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="bg-primary text-primary-foreground px-4 py-3 rounded-xl text-sm font-bold mt-2"
            >
              Sign In
            </button>
          )}
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
}
