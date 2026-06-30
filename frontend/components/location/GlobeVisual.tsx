export default function GlobeVisual() {
  return (
    <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-cyan-500/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40" />

      <div className="absolute left-8 top-8 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
        Global Signal Layer
      </div>

      <div className="absolute bottom-8 right-8 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-purple-200">
        Live Area Selection
      </div>

      <div className="relative h-72 w-72 rounded-full border border-cyan-300/30 bg-cyan-400/5 shadow-2xl shadow-cyan-400/20 sm:h-80 sm:w-80">
        <div className="absolute inset-4 rounded-full border border-cyan-300/20" />
        <div className="absolute inset-10 rounded-full border border-cyan-300/10" />

        <div className="globe-rotate absolute inset-0 rounded-full border border-cyan-300/20">
          <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-300/20" />
          <div className="absolute left-1/4 top-0 h-full w-px bg-cyan-300/10" />
          <div className="absolute left-3/4 top-0 h-full w-px bg-cyan-300/10" />

          <div className="absolute left-0 top-1/2 h-px w-full bg-cyan-300/20" />
          <div className="absolute left-4 top-1/4 h-px w-[90%] bg-cyan-300/10" />
          <div className="absolute bottom-1/4 left-4 h-px w-[90%] bg-cyan-300/10" />
        </div>

        <div className="absolute left-[58%] top-[34%] h-3 w-3 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/70" />
        <div className="signal-pulse absolute left-[58%] top-[34%] h-3 w-3 rounded-full border border-cyan-200" />

        <div className="absolute left-[31%] top-[55%] h-2.5 w-2.5 rounded-full bg-purple-300 shadow-lg shadow-purple-300/70" />
        <div className="signal-pulse absolute left-[31%] top-[55%] h-2.5 w-2.5 rounded-full border border-purple-200" />

        <div className="absolute left-[70%] top-[63%] h-2 w-2 rounded-full bg-amber-300 shadow-lg shadow-amber-300/70" />

        <div className="absolute -left-12 top-20 w-40 rounded-2xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Signals
          </p>
          <p className="mt-1 text-2xl font-black text-white">24</p>
        </div>

        <div className="absolute -right-12 bottom-20 w-44 rounded-2xl border border-white/10 bg-slate-950/80 p-3 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Coverage
          </p>
          <p className="mt-1 text-sm font-semibold text-cyan-100">
            Weather · Transit · Reports
          </p>
        </div>
      </div>
    </div>
  );
}