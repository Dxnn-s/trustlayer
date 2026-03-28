"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const [activeTab, setActiveTab] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleVerify() {
    setLoading(true);
    try {
      const body =
        activeTab === "phone"
          ? { phone: "+251" + phone }
          : { agentCode: email };

      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.badge === "green" || data.badge === "yellow") {
        const q = new URLSearchParams({
          name: data.agent.name,
          region: data.agent.region,
          kebele: data.agent.kebele ?? "",
          id: data.agent.id,
          score: String(data.agent.trust_score),
          ...(data.warning ? { warning: data.warning } : {}),
        });
        router.push("/verified?" + q.toString());
      } else {
        router.push("/not-verified");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <header className="w-full top-0 sticky bg-[#f8f9ff] flex items-center justify-between px-6 py-4 z-40">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-[#006c49] text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            shield
          </span>
          <span className="font-headline font-bold text-xl text-[#006c49] tracking-tight">
            TrustLayer
          </span>
        </div>
        <button className="text-[#121c2a] hover:bg-[#eff4ff] p-2 rounded-full transition-colors">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
      </header>

      <main className="flex-grow flex flex-col px-6 pt-8 pb-32">
        <div className="mb-10">
          <h1 className="font-headline text-3xl font-bold leading-tight mb-2">
            Verify Identity
          </h1>
          <p className="font-body text-on-surface-variant leading-relaxed">
            Secure verification for the Ethiopian digital economy. Input the
            phone number to check registration status.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-8 border-none">
          <div className="flex border-b border-outline-variant mb-6">
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 py-3 text-sm font-bold font-headline border-b-2 transition-colors ${
                activeTab === "phone"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary"
              }`}
            >
              Phone Number
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-3 text-sm font-bold font-headline border-b-2 transition-colors ${
                activeTab === "email"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary"
              }`}
            >
              Email Address
            </button>
          </div>

          <div className="space-y-6">
            {activeTab === "phone" && (
              <div>
                <label className="font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant block mb-3">
                  Phone Number
                </label>
                <div className="flex items-center bg-surface-container-high rounded-xl px-4 py-4 ring-2 ring-transparent focus-within:ring-primary transition-all">
                  <div className="flex items-center gap-2 border-r border-outline-variant pr-4 mr-4">
                    <img
                      alt="Ethiopia Flag"
                      className="w-6 h-4 rounded-sm object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9jcTp3AQpecZAdL5BiFVbkIdDJEdTq7WfaTLKr3F7aZnQf3r2KjrnpQ5EAUyIixJdyXSUEh1rO32ZZBh1W2YoqO-cd4M_Edy_KNfprALqpogGwbX_Tc5UwI0AQxgUo-GYEaJTTdOgJjS5-3Jms6yOu4VdGPNzuzhzBXGhKeI5lXgWaSGyrVB4l554Q3vkXAXJFfMfiEyXrcgS4PgfpD5nvq8gfQQtVxKQT5o6scDzmCVqRP94SNmL_-2-tkenTIFBAIx34Rg0xbA"
                    />
                    <span className="font-headline font-bold text-lg text-on-surface">
                      +251
                    </span>
                  </div>
                  <input
                    className="bg-transparent border-none focus:ring-0 w-full font-headline font-bold text-xl p-0 placeholder:text-outline-variant"
                    maxLength={9}
                    placeholder="912 345 678"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <p className="text-xs text-on-surface-variant font-medium mt-3">
                  Use the 9-digit mobile number registered with Ethio Telecom or
                  Safaricom.
                </p>
              </div>
            )}

            {activeTab === "email" && (
              <div>
                <label className="font-label font-bold text-xs uppercase tracking-widest text-on-surface-variant block mb-3">
                  Email Address
                </label>
                <div className="flex items-center bg-surface-container-high rounded-xl px-4 py-4 ring-2 ring-transparent focus-within:ring-primary transition-all">
                  <span className="material-symbols-outlined text-on-surface-variant mr-3">
                    mail
                  </span>
                  <input
                    className="bg-transparent border-none focus:ring-0 w-full font-headline font-bold text-lg p-0 placeholder:text-outline-variant"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className="text-xs text-on-surface-variant font-medium mt-3">
                  Enter the email address linked to your digital identity
                  profile.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="bg-primary-container text-on-primary-container h-14 w-full rounded-xl flex items-center justify-center gap-2 font-headline font-bold text-lg active:scale-95 transition-transform hover:opacity-90 disabled:opacity-60"
          >
            <span className="material-symbols-outlined">verified</span>
            {loading ? "Checking..." : "Check Identity"}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-5 rounded-xl flex flex-col gap-3">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
            <h3 className="font-headline font-bold text-sm">Bank Grade</h3>
            <p className="text-xs text-on-surface-variant">
              Encrypted end-to-end data processing.
            </p>
          </div>
          <div className="bg-surface-container-low p-5 rounded-xl flex flex-col gap-3">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              speed
            </span>
            <h3 className="font-headline font-bold text-sm">Instant</h3>
            <p className="text-xs text-on-surface-variant">
              Real-time sync with national registries.
            </p>
          </div>
        </div>

        <div className="mt-auto pt-10 pb-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-headline font-bold text-sm">Offline mode</span>
            <span className="text-xs text-on-surface-variant">
              Verify using SMS protocols
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container" />
          </label>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white">
        <Link
          href="/"
          className="flex flex-col items-center justify-center bg-[#10b981] text-white rounded-xl px-4 py-1 transition-transform scale-95 active:scale-90"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified_user
          </span>
          <span className="font-headline text-[12px] font-medium">Verify</span>
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center justify-center text-[#1f2937] px-4 py-1 hover:opacity-80 transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined">history</span>
          <span className="font-headline text-[12px] font-medium">History</span>
        </Link>
        <Link
          href="/scam-warning"
          className="flex flex-col items-center justify-center text-[#1f2937] px-4 py-1 hover:opacity-80 transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined">security</span>
          <span className="font-headline text-[12px] font-medium">Safety</span>
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center justify-center text-[#1f2937] px-4 py-1 hover:opacity-80 transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-headline text-[12px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
