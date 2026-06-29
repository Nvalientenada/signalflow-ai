export default function DashboardSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-slate-950/80 px-6 py-8 backdrop-blur-xl lg:block">
      <div className="mb-10">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 text-xl font-bold text-cyan-200 shadow-lg shadow-cyan-500/10">
          S
        </div>

        <h2 className="text-xl font-bold tracking-tight text-white">
          SignalFlow AI
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Incident intelligence for messy real-world signals.
        </p>
      </div>

      <nav className="space-y-2">
        <a
          href="#overview"
          className="flex items-center justify-between rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-100"
        >
          <span>Overview</span>
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
        </a>

        <a
          href="#reports"
          className="block rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/40 hover:bg-white/5 hover:text-white"
        >
          Submit Report
        </a>

        <a
          href="#incidents"
          className="block rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/40 hover:bg-white/5 hover:text-white"
        >
          Generated Incidents
        </a>

        <a
          href="#signals"
          className="block rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/40 hover:bg-white/5 hover:text-white"
        >
          Raw Signals
        </a>
      </nav>

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          System Mode
        </p>

        <p className="text-sm leading-6 text-slate-300">
          Rule-based intelligence active. AI reasoning layer coming later.
        </p>
      </div>
    </aside>
  );
}