"use client";

import { WifiPassword } from "@/types";
import { Wifi, ShieldCheck, ThumbsUp, ThumbsDown, CheckCircle2, Flag } from "lucide-react";
import { coffeeService } from "@/services/coffee-service";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ReportModal } from "@/components/shop/report-modal";

export function PasswordCard({ 
  password, 
  isTop,
  onVoteSuccess 
}: { 
  password: WifiPassword; 
  isTop?: boolean;
  onVoteSuccess: () => void;
}) {
  const { user } = useAuth();
  const [voting, setVoting] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleVote = async (type: "up" | "down" | "confirm" | "fail") => {
    if (voting) return;
    setVoting(true);
    try {
      await coffeeService.voteOnPassword(password.id, user?.uid || "anonymous", type);
      onVoteSuccess();
    } catch (err) {
      console.error("Voting error:", err);
    } finally {
      setVoting(false);
    }
  };

  const lastConfirmedDate = password.lastConfirmed instanceof Date 
    ? password.lastConfirmed 
    : password.lastConfirmed.toDate();

  return (
    <div className={cn(
      "bg-card border-2 rounded-3xl p-6 shadow-sm relative overflow-hidden transition-all",
      isTop ? "border-primary/20" : "border-border"
    )}>
      {isTop && (
        <div className="absolute top-0 right-0 bg-primary/10 px-4 py-2 rounded-bl-2xl text-primary font-bold text-[10px] uppercase tracking-widest">
          Top Verified
        </div>
      )}
      {!isTop && user && (
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-accent hover:text-red-500 rounded-full transition-colors"
          title="Report this password"
        >
          <Flag className="h-4 w-4" />
        </button>
      )}
      
      <div className="flex items-center gap-4 mb-6">
        <div className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
          isTop ? "bg-primary/10" : "bg-accent"
        )}>
          <Wifi className={cn("h-6 w-6", isTop ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div>
          <h3 className="text-lg font-bold">Wi-Fi Password</h3>
          <p className="text-xs text-muted-foreground">SSID: {password.ssid || "Unknown"}</p>
        </div>
      </div>

      <div className="bg-accent/50 rounded-2xl p-6 text-center mb-6 relative group">
        <code className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-primary break-all">
          {password.password}
        </code>
        <button 
          onClick={() => navigator.clipboard.writeText(password.password)}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-background/80 flex items-center justify-center rounded-2xl transition-opacity font-bold text-sm"
        >
          Click to Copy
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Confidence</span>
            <span className={cn(
              "text-sm font-bold flex items-center gap-1",
              password.confidenceScore > 20 ? "text-green-500" : 
              password.confidenceScore > 0 ? "text-amber-500" : "text-red-500"
            )}>
              {password.confidenceScore > 20 ? "High" : password.confidenceScore > 0 ? "Medium" : "Low"} 
              <ShieldCheck className="h-3 w-3" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Verified</span>
            <span className="text-sm font-medium">{lastConfirmedDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            disabled={voting || !user}
            onClick={() => handleVote("confirm")}
            className="flex items-center gap-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Works ({password.confirmations})
          </button>
          <div className="flex items-center gap-1 bg-accent rounded-xl px-1">
            <button 
              disabled={voting || !user}
              onClick={() => handleVote("up")}
              className="p-2 hover:text-primary transition-colors disabled:opacity-50"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold min-w-[20px] text-center">
              {password.upvotes - password.downvotes}
            </span>
            <button 
              disabled={voting || !user}
              onClick={() => handleVote("down")}
              className="p-2 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <ReportModal
        targetId={password.id}
        targetType="password"
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
