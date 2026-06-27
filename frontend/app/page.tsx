export default function Home() {
  return (
    <main className ="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5x1 flex-col items-center justify-center px-6 text-center">
        <p className = "mb-4 rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300">
        SignalFlow AI 
        </p>

        <h1 className = "mb-6 text-4x1 font-bold tracking-tight sm:text-6x1">
          AI Incident Intelligence Dashboard 
        </h1>
        
        <p className= "mb-10 max-w-2x1 text-lg text-slate-300">
          SignalFlow AI helps detect, summarize, and explain real-world disruptions usign weather alerts,
          campus reports, outage data, transportation updates, and AI reasoning. 
        </p>

        <div className = "grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          <div className = "rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className = "mb-2 font-semibold">Live Signals</h2>
          <p className = "text-sm text-slate-400">
            Collects alerts, reports, and operational events
          </p>
          </div>
          
          <div className = "rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className = "mb-2 font-semibold">AI Reasoning</h2>
          <p className = "text-sm text-slate-400">
            Groups related events and explains what is happening 
          </p>
          </div>

          <div className = "rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className = "mb-2 font-semibold">Action Support</h2>
          <p className = "text-sm text-slate-400">
            Gives what to do based on gravity and evidence
          </p>
          </div>
        </div>
      </section>
    </main>
  )
}