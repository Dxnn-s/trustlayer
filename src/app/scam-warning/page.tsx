"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type RiskLevel = "safe" | "caution" | "block";
type Language = "en" | "am" | "om";

interface Flag {
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
}

interface AnalysisResult {
  riskScore: number;
  level: RiskLevel;
  summary?: string;
  flags: Flag[];
  method?: "ai" | "keyword";
}

const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; icon: string; bg: string; text: string; ringColor: string }
> = {
  safe: {
    label: "Safe",
    icon: "verified",
    bg: "bg-secondary-container",
    text: "text-primary",
    ringColor: "ring-primary",
  },
  caution: {
    label: "Caution",
    icon: "warning",
    bg: "bg-[#fef3c7]",
    text: "text-[#92400e]",
    ringColor: "ring-[#d97706]",
  },
  block: {
    label: "Block",
    icon: "dangerous",
    bg: "bg-error-container",
    text: "text-error",
    ringColor: "ring-error",
  },
};

const SEVERITY_COLORS: Record<Flag["severity"], string> = {
  low: "text-[#92400e]",
  medium: "text-[#c2410c]",
  high: "text-error",
};

export default function ScamWarningPage() {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoDebounce, setAutoDebounce] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Auto-analyze after user stops typing (800 ms debounce)
  useEffect(() => {
    if (!message.trim()) {
      setResult(null);
      return;
    }
    if (autoDebounce) clearTimeout(autoDebounce);
    const t = setTimeout(() => analyze(), 800);
    setAutoDebounce(t);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, language]);

  async function analyze() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/check-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message, language }),
      });
      if (!res.ok) return;
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  }

  const cfg = result ? RISK_CONFIG[result.level] : null;

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <header className="bg-gradient-to-r from-emerald-900 to-emerald-800 shadow-sm fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16">
        <div className="text-emerald-50 font-headline font-bold flex items-center gap-2">
          <span className="material-symbols-outlined">shield</span>
          <span>TrustLayer</span>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-emerald-200/70">
            search
          </span>
          <span className="material-symbols-outlined text-emerald-200/70">
            notifications
          </span>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6">
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-headline font-extrabold tracking-tight text-primary">
              Scam Message Checker
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Paste a suspicious SMS or chat message to get an AI-powered fraud
              assessment.
            </p>
          </div>

          {/* Language selector */}
          <div className="flex gap-2">
            {(
              [
                { value: "en", label: "English" },
                { value: "am", label: "አማርኛ" },
                { value: "om", label: "Oromoo" },
              ] as { value: Language; label: string }[]
            ).map((l) => (
              <button
                key={l.value}
                onClick={() => setLanguage(l.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-headline font-bold transition-colors ${
                  language === l.value
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Message input */}
          <div
            className={`rounded-xl ring-2 transition-all overflow-hidden ${
              cfg ? cfg.ringColor : "ring-outline-variant focus-within:ring-primary"
            }`}
          >
            <textarea
              rows={5}
              placeholder="Paste or type a suspicious message here…"
              className="w-full bg-surface-container-high px-4 py-4 font-body text-sm focus:outline-none resize-none placeholder:text-outline-variant"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center gap-2 text-on-surface-variant text-sm animate-pulse">
              <span className="material-symbols-outlined text-base">
                psychology
              </span>
              Analyzing with AI…
            </div>
          )}

          {/* Result card */}
          {result && !loading && cfg && (
            <div className={`rounded-xl p-5 flex flex-col gap-4 ${cfg.bg}`}>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 font-headline font-bold ${cfg.text}`}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {cfg.icon}
                  </span>
                  <span className="text-lg">{cfg.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {result.method === "ai" && (
                    <span className="text-[10px] uppercase tracking-widest font-bold bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant">
                      AI
                    </span>
                  )}
                  <span className="text-xs text-on-surface-variant font-medium">
                    Risk {result.riskScore}/3
                  </span>
                </div>
              </div>

              {result.summary && (
                <p className="text-sm text-on-surface leading-relaxed">
                  {result.summary}
                </p>
              )}

              {result.flags.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                  <p className="text-xs uppercase tracking-widest font-bold text-outline">
                    Detected patterns
                  </p>
                  {result.flags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        className={`material-symbols-outlined text-sm mt-0.5 ${SEVERITY_COLORS[flag.severity]}`}
                      >
                        flag
                      </span>
                      <div>
                        <span className="text-xs font-bold text-outline mr-2">
                          {flag.type}
                        </span>
                        <span className="text-sm text-on-surface">
                          {flag.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.level === "block" && (
                <button className="w-full bg-gradient-to-br from-tertiary to-tertiary-container text-on-tertiary py-3 rounded-xl font-headline font-bold active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-base">call</span>
                  Call a trusted contact
                </button>
              )}
            </div>
          )}

          {/* Empty state stats */}
          {!result && !loading && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-5 rounded-xl flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary">
                  verified_user
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-outline">
                    Patterns Tracked
                  </p>
                  <p className="font-headline font-bold">8 Types</p>
                </div>
              </div>
              <div className="bg-surface-container-low p-5 rounded-xl flex flex-col gap-3">
                <span className="material-symbols-outlined text-tertiary">
                  psychology
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-outline">
                    Powered By
                  </p>
                  <p className="font-headline font-bold">Claude AI</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 bg-white shadow-sm border-t border-zinc-100">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5"
        >
          <span className="material-symbols-outlined">verified_user</span>
          <span className="font-headline text-[11px] font-medium tracking-wide uppercase">
            Verify
          </span>
        </Link>
        <Link
          href="/circle"
          className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5"
        >
          <span className="material-symbols-outlined">group</span>
          <span className="font-headline text-[11px] font-medium tracking-wide uppercase">
            Circle
          </span>
        </Link>
        <Link
          href="/scam-warning"
          className="flex flex-col items-center justify-center bg-emerald-100/50 text-emerald-900 rounded-xl px-4 py-1.5"
        >
          <span className="material-symbols-outlined">security</span>
          <span className="font-headline text-[11px] font-medium tracking-wide uppercase">
            Safety
          </span>
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-headline text-[11px] font-medium tracking-wide uppercase">
            Profile
          </span>
        </Link>
      </nav>
    </div>
  );
}
