import Link from "next/link";

interface Props {
  searchParams: { name?: string; region?: string; kebele?: string; id?: string; score?: string; warning?: string };
}

export default function VerifiedPage({ searchParams }: Props) {
  const name = searchParams.name ?? "Kebede Alemu";
  const region = searchParams.region ?? "Oromia";
  const kebele = searchParams.kebele ?? "Jimma 02";
  const id = searchParams.id ?? "ET-092-3341";
  const score = parseFloat(searchParams.score ?? "4.75");
  const warning = searchParams.warning;

  const regionLabel = [region, kebele].filter(Boolean).join(" • ");
  const fullDots = Math.floor(score);
  const partialFill = score - fullDots > 0 ? 0.75 : 0;

  return (
    <div className="bg-primary-container text-white min-h-screen flex flex-col items-center overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 flex items-center px-4 h-16 bg-emerald-600">
        <Link
          href="/"
          className="transition-transform duration-200 active:scale-95 flex items-center justify-center w-10 h-10 rounded-full hover:bg-emerald-700/50"
        >
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </Link>
        <h1 className="ml-4 font-headline font-bold text-lg text-white">Verification</h1>
      </header>

      <main className="flex-grow w-full max-w-[375px] pt-24 pb-32 px-6 flex flex-col items-center justify-center text-center">
        {warning && (
          <div className="w-full mb-4 bg-yellow-500/20 border border-yellow-300/30 rounded-xl px-4 py-3 text-yellow-100 text-sm font-medium">
            {warning}
          </div>
        )}

        <div className="mb-10">
          <span
            className="material-symbols-outlined text-[120px] leading-none"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
          >
            check_circle
          </span>
        </div>

        <div className="space-y-2 mb-10">
          <h2 className="text-4xl font-headline font-extrabold tracking-tight">{name}</h2>
          <p className="text-lg font-body font-medium text-emerald-100 opacity-90">{regionLabel}</p>
        </div>

        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined text-3xl"
                style={{
                  fontVariationSettings: `'FILL' ${i < fullDots ? 1 : i === fullDots && partialFill ? partialFill : 0}`,
                }}
              >
                circle
              </span>
            ))}
          </div>
          <p className="font-headline font-bold text-sm tracking-widest uppercase opacity-80">
            Verified Score {score} / 5
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 mb-16">
          <button className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary-container transition-all duration-200 active:scale-90 shadow-lg">
            <span
              className="material-symbols-outlined text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              volume_up
            </span>
          </button>
          <p className="font-headline font-bold text-white text-lg">Tap to hear verification</p>
        </div>

        <div className="w-full bg-emerald-700/30 rounded-full p-4 flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/50 flex-shrink-0 bg-emerald-700/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-3xl">person</span>
          </div>
          <div className="text-left">
            <p className="font-label text-xs font-bold uppercase tracking-wider text-emerald-100">
              ID NUMBER
            </p>
            <p className="font-headline font-bold text-lg">{id}</p>
          </div>
        </div>

        <Link
          href="/"
          className="w-full py-5 border-2 border-white rounded-xl font-headline font-bold text-white text-lg text-center transition-colors hover:bg-white/10 active:scale-95 block"
        >
          Check another person
        </Link>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-white">
        <Link href="/" className="flex flex-col items-center justify-center text-gray-500 p-2 hover:bg-gray-100 transition-all active:scale-90">
          <span className="material-symbols-outlined">home</span>
          <span className="font-headline text-[10px] font-medium mt-1">Home</span>
        </Link>
        <Link href="#" className="flex flex-col items-center justify-center text-gray-500 p-2 hover:bg-gray-100 transition-all active:scale-90">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-headline text-[10px] font-medium mt-1">Payments</span>
        </Link>
        <Link href="#" className="flex flex-col items-center justify-center text-gray-500 p-2 hover:bg-gray-100 transition-all active:scale-90">
          <span className="material-symbols-outlined">history</span>
          <span className="font-headline text-[10px] font-medium mt-1">History</span>
        </Link>
        <Link href="#" className="flex flex-col items-center justify-center bg-emerald-100 text-emerald-800 rounded-xl p-2 transition-all active:scale-90">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="font-headline text-[10px] font-medium mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
