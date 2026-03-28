import Link from "next/link";

export default function NotVerifiedPage() {
  return (
    <div
      className="font-body text-white min-h-screen flex flex-col"
      style={{ backgroundColor: "#a0211f" }}
    >
      <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-emerald-900 to-emerald-800 shadow-sm flex items-center justify-between px-6 h-16">
        <div className="text-emerald-50 font-headline tracking-tight font-bold text-xl flex items-center gap-2">
          <span className="material-symbols-outlined">shield</span>
          TrustLayer
        </div>
        <button className="text-emerald-200/70 hover:bg-emerald-800/50 transition-colors p-2 rounded-xl active:scale-95">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-24 pb-32 max-w-lg mx-auto w-full">
        <div className="relative mb-12 flex flex-col items-center">
          <div
            className="absolute -z-10 w-64 h-64 opacity-30 rounded-full blur-3xl -top-12 -left-12"
            style={{ backgroundColor: "#7e020b" }}
          />
          <div
            className="w-40 h-40 rounded-xl flex items-center justify-center border border-white/10"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
          >
            <span
              className="material-symbols-outlined text-[120px] text-white"
              style={{ fontVariationSettings: "'wght' 200" }}
            >
              close
            </span>
          </div>
          <div className="mt-10 text-center">
            <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-white mb-3">
              WARNING: Not verified
            </h1>
            <p className="text-white/70 font-medium text-lg leading-relaxed max-w-xs mx-auto">
              This person is not in the verified agent registry
            </p>
          </div>
        </div>

        <div className="w-full space-y-4">
          <button
            className="w-full rounded-xl p-5 flex items-center justify-between border border-white/5 active:scale-95 transition-all"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white">volume_up</span>
              </div>
              <span className="font-semibold tracking-wide">Tap to hear warning</span>
            </div>
            <span className="material-symbols-outlined text-white/50">play_arrow</span>
          </button>

          <div className="w-full grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-white/5" style={{ backgroundColor: "#7e020b" }}>
              <span className="material-symbols-outlined text-white/60 mb-2">info</span>
              <p className="text-[11px] uppercase tracking-widest text-white/60 mb-1">Status</p>
              <p className="font-bold text-white">Unregistered</p>
            </div>
            <div className="p-5 rounded-xl border border-white/5" style={{ backgroundColor: "#7e020b" }}>
              <span className="material-symbols-outlined text-white/60 mb-2">gpp_maybe</span>
              <p className="text-[11px] uppercase tracking-widest text-white/60 mb-1">Risk Level</p>
              <p className="font-bold text-white">Critical</p>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <button className="w-full bg-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all" style={{ color: "#a0211f" }}>
              <span className="material-symbols-outlined">phone_in_talk</span>
              Call trusted contact
            </button>
            <Link
              href="/"
              className="w-full bg-transparent text-white border-2 border-white/20 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">search</span>
              Check another person
            </Link>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-8 left-0 w-full px-6 pointer-events-none">
        <div className="max-w-lg mx-auto flex justify-center">
          <div
            className="px-4 py-2 rounded-full border border-white/10"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
          >
            <p className="text-[10px] text-white/60 tracking-widest uppercase font-bold">
              Secure Session Active
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
