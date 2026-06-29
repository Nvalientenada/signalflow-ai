export default function DashboardSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-slate-950/85 px-6 py-8 backdrop-blur-xl lg:block">
      <div className="mb-10">
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 text-xl font-bold text-cyan-100 shadow-lg shadow-cyan-500/10">
          <span className="signal-pulse absolute h-14 w-14 rounded-2xl border border-cyan-400/20" />
          <span className="relative">S</span>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white">
          SignalFlow AI
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Incident intelligence for messy real-world signals.
        </p>
      </div>

      <nav className="space-y-2">
        <a
          href="#overview"
          className="group flex items-center justify-between rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-100 shadow-lg shadow-cyan-500/5"
        >
          <span className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/40" />
            Overview
          </span>
          <span className="text-cyan-300 transition group-hover:translate-x-1">
            →
          </span>
        </a>

        <a
          href="#reports"
          className="group flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/40 hover:bg-white/5 hover:text-white"
        >
          <span className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-blue-300/70" />
            Submit Report
          </span>
          <span className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
            →
          </span>
        </a>

        <a
          href="#incidents"
          className="group flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-purple-400/40 hover:bg-white/5 hover:text-white"
        >
          <span className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-purple-300/70" />
            Generated Incidents
          </span>
          <span className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
            →
          </span>
        </a>

        <a
          href="#signals"
          className="group flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-green-400/40 hover:bg-white/5 hover:text-white"
        >
          <span className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-green-300/70" />
            Raw Signals
          </span>
          <span className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
            →
          </span>
        </a>
      </nav>

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Signal Health
        </p>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>Ingestion</span>
              <span className="text-cyan-200">Live</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div className="h-2 w-4/5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/30" />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>Incident Logic</span>
              <span className="text-purple-200">Active</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div className="h-2 w-3/4 rounded-full bg-purple-300 shadow-lg shadow-purple-300/30" />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>AI Layer</span>
              <span className="text-slate-400">Next</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div className="h-2 w-1/3 rounded-full bg-slate-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5">
        <div className="scan-line relative -mx-5 mb-4 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          System Mode
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Rule-based intelligence active. AI reasoning layer coming next.
        </p>
      </div>
    </aside>
  );
}