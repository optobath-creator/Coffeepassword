"use client";

import { useState } from "react";
import { Flag, X, Loader2, Send } from "lucide-react";
import { moderationService } from "@/services/moderation-service";
import { useAuth } from "@/hooks/use-auth";

interface ReportModalProps {
  targetId: string;
  targetType: "password" | "shop";
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({ targetId, targetType, isOpen, onClose }: ReportModalProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!reason.trim()) {
      setError("Please provide a reason.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await moderationService.reportContent(user.uid, targetId, targetType, reason);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setReason("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Report error:", err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Flag className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold italic tracking-tight">Report Content</h2>
          <p className="text-muted-foreground">Help keep the community safe and accurate.</p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Report Submitted</h3>
            <p className="text-muted-foreground text-sm">Thank you for helping us maintain quality.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Reason for Reporting
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Inappropriate language, fake password, spam..."
                required
                rows={4}
                className="w-full px-4 py-3 bg-accent/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all border-none resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-medium ml-1">{error}</p>}

            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="w-full bg-red-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Flag className="h-5 w-5" />
                  Submit Report
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
