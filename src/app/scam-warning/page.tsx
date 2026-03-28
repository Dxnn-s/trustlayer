"use client";

import { useState } from "react";
import Link from "next/link";

export default function ScamWarningPage() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <header className="bg-gradient-to-r from-emerald-900 to-emerald-800 shadow-sm fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16">
        <div className="text-emerald-50 font-headline font-bold flex items-center gap-2">
          <span className="material-symbols-outlined">shield</span>
          <span>TrustLayer</span>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-emerald-200/70 cursor-pointer">search</span>
          <span className="material-symbols-outlined text-emerald-200/70 cursor-pointer">notifications</span>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6">
        <div className="max-w-md mx-auto space-y-8">
          <section className="space-y-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-headline font-extrabold tracking-tight text-primary">
                Security Overview
              </h1>
              <p className="text-on-surface-variant">Protection active for your Circle</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-5 rounded-xl flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-outline">Verified Contacts</p>
                  <p className="font-headline font-bold">12 Active</p>
                </div>
              </div>
              <div className="bg-surface-container-low p-5 rounded-xl flex flex-col gap-3">
                <span className="material-symbols-outlined text-tertiary">gpp_maybe</span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-outline">Threats Blocked</p>
                  <p className="font-headline font-bold">48 Total</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {!dismissed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-md" />
          <div className="relative w-full max-w-sm bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden p-8 flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-tertiary-fixed flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-tertiary text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  warning
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="font-headline font-bold text-on-surface text-xl">
                  Suspicious activity detected
                </h2>
                <p className="text-on-surface-variant">
                  Real-time analysis suggests this interaction may be a
                  high-risk scam.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-widest text-outline text-sm">
                  Risk Level
                </span>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-tertiary-container" />
                  <div className="w-3 h-3 rounded-full bg-tertiary-container" />
                  <div className="w-3 h-3 rounded-full bg-outline-variant" />
                </div>
              </div>
              <div className="space-y-3 pt-2 border-t border-outline-variant/10">
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-tertiary-container" />
                  <p className="text-on-surface font-medium">Urgency language detected</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-tertiary-container" />
                  <p className="text-on-surface font-medium">PIN requested multiple times</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full bg-gradient-to-br from-tertiary to-tertiary-container text-on-tertiary py-4 rounded-xl font-headline font-bold shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-xl">call</span>
                Call trusted contact
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="w-full bg-transparent border-2 border-outline-variant text-outline py-3.5 rounded-xl font-headline font-bold active:scale-95 transition-transform"
              >
                Dismiss
              </button>
            </div>

            <p className="text-center text-[10px] text-outline uppercase tracking-widest font-bold">
              Encrypted Protection by TrustLayer
            </p>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 bg-white shadow-sm border-t border-zinc-100">
        <Link href="/" className="flex flex-col items-center justify-center bg-emerald-100/50 text-emerald-900 rounded-xl px-4 py-1.5">
          <span className="material-symbols-outlined">verified_user</span>
          <span className="font-headline text-[11px] font-medium tracking-wide uppercase">Verify</span>
        </Link>
        <Link href="/circle" className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5">
          <span className="material-symbols-outlined">group</span>
          <span className="font-headline text-[11px] font-medium tracking-wide uppercase">Circle</span>
        </Link>
        <Link href="#" className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5">
          <span className="material-symbols-outlined">history</span>
          <span className="font-headline text-[11px] font-medium tracking-wide uppercase">History</span>
        </Link>
        <Link href="#" className="flex flex-col items-center justify-center text-zinc-500 px-4 py-1.5">
          <span className="material-symbols-outlined">person</span>
          <span className="font-headline text-[11px] font-medium tracking-wide uppercase">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
