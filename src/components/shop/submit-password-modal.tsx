"use client";

import { useState } from "react";
import { Wifi, X, Loader2, Send } from "lucide-react";
import { coffeeService } from "@/services/coffee-service";
import { useAuth } from "@/hooks/use-auth";

interface SubmitPasswordModalProps {
  shopId: string;
  shopName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitPasswordModal({ 
  shopId, 
  shopName, 
  isOpen, 
  onClose,
  onSuccess 
}: SubmitPasswordModalProps) {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [ssid, setSsid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await coffeeService.submitPassword(shopId, password, user.uid, ssid);
      setPassword("");
      setSsid("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wifi className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold italic tracking-tight">Share Wi-Fi</h2>
          <p className="text-muted-foreground">Submit the password for <span className="text-foreground font-semibold">{shopName}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Network Name (SSID) - Optional
            </label>
            <input
              type="text"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder="e.g. BlueBottle_Guest"
              className="w-full px-4 py-3 bg-accent/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="The secret phrase..."
              required
              className="w-full px-4 py-3 bg-accent/50 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-medium ml-1">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5" />
                Submit Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
